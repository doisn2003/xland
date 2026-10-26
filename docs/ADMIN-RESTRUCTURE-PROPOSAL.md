# XLAND ADMIN — TƯ VẤN KIẾN TRÚC TÁI CẤU TRÚC TOÀN DIỆN
## Tối ưu hóa Trải nghiệm Người dùng (UX) & Hiệu năng Tốc độ (Performance)

> **Ngày lập:** 25/10/2026  
> **Tác giả:** Antigravity (Pair Programming Assistant)  
> **Mục tiêu:** Giải quyết triệt để 2 vấn đề lớn nhất của hệ thống Admin hiện tại:
> 1. **Giao diện phân mảnh (Fragmented UX):** Chia nhỏ 15 module rời rạc, quản lý 1 lô đất phải nhảy qua 6–8 màn hình khác nhau.
> 2. **Độ trễ cao (High Latency):** Thao tác trên localhost nhưng mỗi lần đổi tab hay mở dữ liệu mất 3–4 giây do cộng dồn khoảng cách mạng (Mumbai RTT) và mô hình gọi API dạng thác nước (Waterfall).

---

## MỤC LỤC
1. [Báo cáo Thực nghiệm: Giải phẫu Nguyên nhân Gây Trễ](#1-báo-cáo-thực-nghiệm-giải-phẫu-nguyên-nhân-gây-trễ)
2. [Tư vấn Tái cấu trúc UX: Mô hình 4 Mega-Modules](#2-tư-vấn-tái-cấu-trúc-ux-mô-hình-4-mega-modules)
   - [Module 1: Quản trị Lô đất Tập trung (Property Hub — Aggregate Root)](#module-1-quản-trị-lô-đất-tập-trung-property-hub--aggregate-root)
   - [Module 2: Mạng xã hội & Video Feeds (Social & Content Hub)](#module-2-mạng-xã-hội--video-feeds-social--content-hub)
   - [Module 3: Cộng đồng & Sự kiện (Community & Events)](#module-3-cộng-đồng--sự-kiện-community--events)
   - [Module 4: Quản trị Hệ thống & Phân quyền Mở rộng (RBAC & System)](#module-4-quản-trị-hệ-thống--phân-quyền-mở-rộng-rbac--system)
3. [Kiến trúc Kỹ thuật Fullstack Đạt Hiệu năng Tối đa](#3-kiến-trúc-kỹ-thuật-fullstack-đạt-hiệu-năng-tối-đa)
   - [Frontend Architecture: Zero-Waterfall & Instant Tab Switching](#31-frontend-architecture-zero-waterfall--instant-tab-switching)
   - [Backend Architecture: In-Memory Schema, Token Cache & Aggregate Queries](#32-backend-architecture-in-memory-schema-token-cache--aggregate-queries)
   - [Database & Network Architecture: Giảm thiểu RTT](#33-database--network-architecture-giảm-thiểu-rtt)
4. [Bảng Đối chiếu So sánh (Trước vs Sau)](#4-bảng-đối-chiếu-so-sánh-trước-vs-sau)
5. [Lộ trình Triển khai Đề xuất (4 Giai đoạn)](#5-lộ-trình-triển-khai-đề-xuất-4-giai-đoạn)

---

## 1. Báo cáo Thực nghiệm: Giải phẫu Nguyên nhân Gây Trễ

### 1.1. Số liệu Đo đạc Thực tế từ Máy tính Của Bạn
Chúng tôi đã chạy kịch bản đo đạc thực nghiệm độc lập từ localhost đến cơ sở dữ liệu Supabase Mumbai (`aws-0-ap-south-1.pooler.supabase.com`):

| Chỉ số đo đạc | Giá trị trung vị (Median) | Đánh giá |
| :--- | :---: | :--- |
| **TCP Connect tới Pooler** | **117 ms** | Độ trễ 1 vòng mạng (RTT) Việt Nam ⇄ Mumbai |
| **Warm `SELECT 1` Query** | **116 ms** | Mức sàn vật lý: 1 lệnh SQL không thể nhanh hơn 116ms |
| **Handshake kết nối mới (TCP + SSL + SCRAM)** | **463 ms** | Nếu pool kết nối bị gián đoạn, tốn gần 0.5s chỉ để bắt tay |
| **Thời gian DB chạy lệnh (Execution Time)** | **0.1 ms – 10.1 ms** | **Database KHÔNG hề bị chậm hay quá tải CPU!** |
| `GET /session` (Kiểm tra quyền) | **907 ms** (~8 RTT) | Transaction kiểm tra token digest và role admin |
| `GET /schema` (Đọc 15 bảng) | **1.046 ms** (~9 RTT) | Truy vấn `information_schema.columns` từ DB |
| `GET /properties` (Lấy danh sách 25 lô) | **1.255 ms** (~11 RTT) | Đếm + List + Tra cứu nhãn liên kết tuần tự |
| `GET /properties/:id` (Xem chi tiết 1 lô) | **1.135 ms** (~10 RTT) | Đọc chi tiết 1 lô đất |
| `GET /locations` (Danh mục địa giới) | **1.019 ms** (~9 RTT) | Đọc bảng `geo_locations` |

### 1.2. Ba "Nút Thắt Cổ Chai" Gây Nên Độ Trễ 3–4 Giây
Khi bạn nhấn chuyển sang một Tab hoặc mở một Lô đất, độ trễ phát sinh từ sự kết hợp của 3 yếu tố:

```
[Khoảng cách địa lý Mumbai (116ms)] 
        × [Frontend Thác nước (3 tầng tuần tự)] 
        × [Backend Chatty Database (5-6 query lẻ/request)]
        = 3.200 ms - 4.100 ms (Chờ đợi vô lý)
```

1. **Hiệu ứng Thác nước (Waterfall) & Không có Cache ở Frontend:**
   - Trong `workspace.tsx` (`useEffect`), bất cứ khi nào URL thay đổi (`entity`, `id`, `page`, `filter`), frontend luôn thực hiện:
     `const catalog = await api<Catalog>("schema")` (chờ ~1.050ms)
     sau đó mới:
     `data.list = await api<ListData>(...)` (chờ tiếp ~1.255ms).
   - Nếu mở chi tiết lô đất, nó lại chờ tiếp `api("locations")` (chờ thêm ~1.019ms).
   - File `api.ts` thiết lập cứng `cache: "no-store"`. Schema là cấu trúc bảng cố định nhưng lần click nào cũng tải lại ~29.1 KB từ DB.

2. **Mô hình "Chatty Database" ở Backend:**
   - Mỗi request vào `xland-server` bị xé nhỏ thành một chuỗi transaction nối tiếp:
     - 1 transaction `xland_auth` kiểm tra session token (1 RTT).
     - 1 transaction `xland_admin` kiểm tra quyền admin (1 RTT).
     - Query `information_schema.columns` để đọc danh sách cột (1 RTT).
     - Query `SELECT count(*)` (1 RTT).
     - Query `SELECT items` (1 RTT).
     - Lặp qua các cột foreign key để query nhãn (1 RTT).
   - Kết quả: Dù DB xử lý chỉ mất **0.1 ms**, nhưng vì phải gửi nhận 8–11 lượt qua đường truyền Mumbai, tổng thời gian bị đội lên hơn **1.200 ms**.

3. **App Router Server Component Overhead:**
   - Mỗi lần chuyển route trong Next.js App Router (`/admin/[[...segments]]/page.tsx`), server Next.js chạy `await adminSession()`, sinh thêm 1 round-trip gọi backend `GET /session` (~907ms) trước khi trả HTML về trình duyệt.

---

## 2. Tư vấn Tái cấu trúc UX: Mô hình 4 Mega-Modules

### Vấn đề hiện tại của giao diện
Hiện tại thanh điều hướng Admin chia thành 15 mục con rời rạc:
- Muốn quản lý thông tin lô đất: vào `/admin/properties`
- Muốn đăng ảnh cho lô đất: phải nhảy sang `/admin/media`
- Muốn cập nhật sổ đỏ/quy hoạch: nhảy sang `/admin/legal`
- Muốn tải tài liệu hợp đồng: nhảy sang `/admin/documents`
- Muốn thêm tiện ích trường học/bệnh viện: nhảy sang `/admin/amenities`
- Muốn mở khung giờ dẫn khách: nhảy sang `/admin/slots`
- Muốn xem khách đặt lịch lô đất này: nhảy sang `/admin/bookings`

👉 **Đánh giá UX:** Cực kỳ ức chế cho người vận hành. Vừa mất thời gian tìm kiếm, vừa phải chịu đựng độ trễ 3–4 giây ở mỗi lần chuyển trang.

---

### Kiến trúc Đề xuất: 4 Mega-Modules Chuẩn Nghiệp vụ

```
┌────────────────────────────────────────────────────────────────────────┐
│                        XLAND ADMIN WORKSPACE                           │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│   MODULE 1      │    MODULE 2      │    MODULE 3     │    MODULE 4     │
│   QUẢN TRỊ      │   MẠNG XÃ HỘI    │   CỘNG ĐỒNG     │   HỆ THỐNG      │
│   LÔ ĐẤT        │   & VIDEO FEEDS  │   & SỰ KIỆN     │   & PHÂN QUYỀN  │
│ (Property Hub)  │  (Social Media)  │  (Community)    │ (RBAC & System) │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
```

---

### Module 1: Quản trị Lô đất Tập trung (Property Hub — Aggregate Root)
Biến Lô đất thành một **"Hồ sơ tổng thể 360 độ" (One-Stop Property Dashboard)**. Khi Admin mở một Lô đất, toàn bộ hệ sinh thái dữ liệu của lô đất đó nằm ngay trong tầm tay.

#### 1. Màn hình Danh sách (Property Catalog List):
- Bảng danh sách tối ưu: Hiển thị thumbnail đại diện, Mã lô (`code`), Tiêu đề, Vị trí (Tỉnh/Huyện), Diện tích, Giá chào, Trạng thái bán (`listed`, `paused`, `sold`), Trạng thái duyệt (`pending`, `approved`), Tư vấn viên phụ trách.
- Bộ lọc thông minh: Lọc nhanh theo Tỉnh/Thành, Khoảng giá, Trạng thái, Tư vấn viên.
- Thao tác nhanh tại dòng (Row Actions): Xem trước (Preview web user), Đổi nhanh trạng thái (Toggle Listed/Paused), Sửa toàn diện, Xóa mềm.

#### 2. Màn hình Chi tiết / Chỉnh sửa Toàn diện (Unified Property Studio):
Sử dụng **Giao diện Tab Cục bộ (Client-side Tabs)** — chuyển tab tức thì **0 ms**, không tải lại trang:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại danh sách | Lô đất: Đồi Chè Bảo Lộc (Mã: XL-BL-01)   [ Lưu hồ sơ ] │
├──────────────┬──────────────┬──────────────┬──────────────┬───────────────────┤
│ [1] CƠ BẢN   │ [2] HÌNH ẢNH │ [3] PHÁP LÝ  │ [4] TÀI LIỆU │ [5] TIỆN ÍCH      │
│  & THÔNG SỐ  │   & VIDEO    │ & QUY HOẠCH  │   NỘI BỘ     │   & KHUNG GIỜ     │
└──────────────┴──────────────┴──────────────┴──────────────┴───────────────────┘
```

- **Tab 1: Thông tin cơ bản & Quy hoạch:**
  - Tiêu đề, Mã lô, Danh mục (`residential`, `agricultural`, v.v.), Loại đất, Hướng đất.
  - Chọn địa giới hành chính (Tự động tải Tỉnh/Thành → Quận/Huyện có quan hệ ràng buộc).
  - Diện tích ($m^2$), Giá tổng (VND), Mặt tiền, Chiều sâu, Độ rộng đường tiếp cận.
  - Tọa độ chính xác (Lat/Lng) và Tọa độ hiển thị làm tròn bảo mật (`approximate_lat/lng/radius`).
  - Danh sách điểm nổi bật (`highlights`: `{title, description}`) — giao diện thêm/bớt động trực quan.
  - Phân công Tư vấn viên phụ trách (`consultant_id`).

- **Tab 2: Bộ sưu tập Hình ảnh & Video (Media Gallery Manager):**
  - **Upload kéo thả đa tệp (Multi-file Drag & Drop):** Tải cùng lúc 10 ảnh hoặc video lên thẳng Supabase Storage.
  - **Quản lý trực quan:** Xem lưới ảnh dạng thẻ (Card Grid).
  - **Tính năng tức thì:**
    - Click chọn 1 ảnh làm "Ảnh đại diện chính" (Cover Image).
    - Phân loại nhanh (`gallery`, `area`, `feed`).
    - Kéo thả sắp xếp thứ tự hiển thị (`sort_order`).
    - Nhập nhanh chú thích ảnh (`alt_text`) ngay trên thẻ ảnh.
    - Xem trước video với player tích hợp.

- **Tab 3: Pháp lý & Kiểm định (Legal & Verification):**
  - Danh sách checklist pháp lý (`property_legal_items`): Sổ đỏ/Sổ hồng, Trích lục địa chính, Giấy phép xây dựng, Quy hoạch 1/500...
  - Nút thêm nhanh hạng mục pháp lý; chọn tình trạng (`pending`, `verified`), ngày thẩm định (`checked_date`).
  - Đánh dấu cờ hiển thị ra ngoài website cho khách hàng hay chỉ lưu hành nội bộ.

- **Tab 4: Kho Tài liệu Bảo mật (Document Vault):**
  - Quản lý tài liệu kỹ thuật (`property_documents`): Hợp đồng đặt cọc mẫu, file PDF quy hoạch, sơ đồ thửa đất.
  - Phân loại cấp quyền truy cập (`access_level`):
    - `public_redacted`: Bản xem trước đã che thông tin nhạy cảm.
    - `authenticated`: Khách đã đăng nhập mới xem được.
    - `granted`: Phải được admin/tư vấn viên cấp quyền đích danh.
  - Tải file PDF trực tiếp, xem trước file PDF ngay trong modal.

- **Tab 5: Tiện ích & Vận hành (Amenities & Site Visits):**
  - *Tiện ích xung quanh (`property_nearby_amenities`):* Thêm nhanh trường học, bệnh viện, chợ, đường cao tốc kèm khoảng cách (km) và thời gian di chuyển.
  - *Khung giờ dẫn khách (`site_visit_slots`):* Quản lý các slot mở cho khách đặt lịch (thời gian bắt đầu, kết thúc, số lượng khách tối đa).
  - *Lịch hẹn thực tế (`site_visit_bookings`):* Xem trực tiếp danh sách khách hàng đã đăng ký đi xem lô đất này, trạng thái duyệt (`awaiting_deposit`, `confirmed`, `completed`), trạng thái đặt cọc.

👉 **Lợi ích vượt trội:** Người quản trị chỉ cần vào 1 nơi duy nhất là nắm trọn vẹn vòng đời của một bất động sản.

---

### Module 2: Mạng xã hội & Video Feeds (Social & Content Hub)
Tập trung toàn bộ bài đăng dạng video ngắn (Short Feeds) theo chuẩn trải nghiệm hiện đại:
- **Feed Moderation:** Danh sách video đang chờ duyệt (`pending`) và đã duyệt (`approved`).
- **Gắn kết ngữ cảnh:** Mỗi video hiển thị rõ: Gắn với lô đất nào? Ai là tác giả (`author`)? Thời lượng bao nhiêu giây?
- **Trình duyệt video nhanh:** Bấm vào video phát ngay trên drawer/modal, duyệt/từ chối chỉ bằng 1 phím bấm.
- **Thống kê tương tác:** Lượt xem (`view_count`), lượt thích, bình luận và lưu video.

---

### Module 3: Cộng đồng & Sự kiện (Community & Events)
Gom nhóm các hoạt động ngoại khóa, kết nối nhà đầu tư và câu lạc bộ:
- **Sự kiện (Events):**
  - Tạo sự kiện mở bán, hội thảo bất động sản (Thời gian, địa điểm, diễn giả, lịch trình agenda).
  - Danh sách người đăng ký tham dự (`event_registrations`) lồng ghép ngay dưới trang chi tiết của Sự kiện đó (Master-Detail view).
  - Xuất danh sách khách tham dự ra Excel/CSV.
- **Câu lạc bộ (Clubs):**
  - Quản lý các nhóm nhà đầu tư theo vùng miền, bài viết chia sẻ kinh nghiệm, hoạt động cộng đồng.

---

### Module 4: Quản trị Hệ thống & Phân quyền Mở rộng (RBAC & System)
Đáp ứng yêu cầu mở rộng quy mô khi dự án phát triển nhiều bộ phận tham gia vận hành:

#### Thiết kế Ma trận Vai trò (Role-Based Matrix):

| Vai trò (Role) | Phạm vi Quyền hạn Dự kiến |
| :--- | :--- |
| **Super Admin** | Toàn quyền cấu hình hệ thống, quản lý tài khoản, xem audit log. |
| **Kiểm duyệt viên (Moderator)** | Duyệt hồ sơ lô đất, duyệt video feeds, kiểm tra tính xác thực pháp lý. |
| **Điều phối viên (Operator)** | Quản lý khung giờ (`slots`), điều phối lịch xem thực địa (`bookings`), tiếp nhận yêu cầu hỗ trợ. |
| **Tư vấn viên (Consultant)** | Xem danh sách khách được phân công, cập nhật nhật ký tư vấn, phản hồi yêu cầu xem đất. |
| **Cộng tác viên / Người đăng (Publisher)** | Chỉ được thêm mới lô đất nháp (Draft) và video feeds của chính mình; chờ Admin duyệt. |
| **Kế toán / Đối soát** | Theo dõi trạng thái cọc (`payment_intents`), xác nhận biên lai (`payment_receipts`). |

#### Phân quyền theo Địa bàn (Regional Scope):
- Cho phép cấp quyền theo Tỉnh/Thành phố (ví dụ: *Trưởng chi nhánh Lâm Đồng* chỉ quản lý các lô đất và tư vấn viên thuộc tỉnh Lâm Đồng).
- **Nhật ký hệ thống (Audit Log):** Ghi nhận chi tiết ai đã sửa trường nào, vào lúc nào, giá trị cũ/mới để đảm bảo tính minh bạch.

---

## 3. Kiến trúc Kỹ thuật Fullstack Đạt Hiệu năng Tối đa

Để đạt tốc độ phản hồi **dưới 300ms**, cần đồng bộ tối ưu cả 3 tầng:

```
[Trình duyệt Admin] 
       ║  (1 HTTP Call gộp, Cache SWR, Chuyển Tab 0ms)
       ▼
[Next.js BFF Server]
       ║  (In-Memory Cache cho Schema & Session)
       ▼
[xland-server Backend]
       ║  (1 SQL duy nhất dùng json_agg / Single Transaction)
       ▼
[PostgreSQL Database (Singapore hoặc Local)]
```

---

### 3.1. Frontend Architecture: Zero-Waterfall & Instant Tab Switching

1. **Khử hoàn toàn Thác nước (Kill the Waterfall):**
   - Loại bỏ việc `await api("schema")` trước mỗi lần tải dữ liệu.
   - Chuyển `schema` thành **Module Cache vĩnh viễn trong phiên làm việc** (hoặc sinh tĩnh từ TypeScript DTO).
   - Khi vào trang danh sách hoặc chi tiết: Phát request lấy dữ liệu ngay lập tức tại millisecond đầu tiên.

2. **Chuyển Tab Cục bộ Tức thì (Instant Tab Switching):**
   - Màn hình Lô đất sử dụng cấu trúc `UnifiedPropertyEditor`: Toàn bộ dữ liệu của lô đất (thông tin, danh sách media, danh sách pháp lý, tiện ích) được tải trong **1 lần duy nhất** khi mở trang.
   - Việc bấm chuyển qua lại giữa các tab (Thông tin ⇄ Hình ảnh ⇄ Pháp lý ⇄ Tiện ích) chỉ thay đổi trạng thái giao diện trong RAM máy khách (React State) ➔ **Độ trễ = 0 ms**.

3. **Cơ chế Caching thông minh (SWR / TanStack Query):**
   - Tích hợp SWR (Stale-While-Revalidate): Khi bấm vào danh sách Lô đất, nếu dữ liệu đã có trong cache, hiển thị ngay lập tức (0ms). Sau đó ngầm revalidate dữ liệu mới nhất dưới nền.

4. **Tải tệp Trực tiếp (Direct Storage Upload with Presigned URLs):**
   - Không upload file qua backend trung gian.
   - Client gọi `POST /admin/api/uploads` lấy Presigned URL, sau đó đẩy tệp trực tiếp lên Supabase Storage với thanh tiến trình real-time.

---

### 3.2. Backend Architecture: In-Memory Schema, Token Cache & Aggregate Queries

1. **In-Memory Cache cho `information_schema`:**
   - Trong `AdminService.schema()`: Không query lại bảng `information_schema.columns` của PostgreSQL trên mỗi request.
   - Đọc 1 lần duy nhất khi server khởi động và lưu vào RAM (In-Memory Map).
   - 👉 **Tiết kiệm ngay lập tức ~1.050 ms cho mỗi request!**

2. **LRU Cache cho Xác thực Admin Session:**
   - Trong `AdminAuth.require()`: Cache kết quả token digest và quyền admin trong bộ nhớ RAM trong vòng 5–10 phút.
   - Request tiếp theo của cùng một Admin không cần mở transaction truy vấn DB bảng `auth_sessions` và `user_roles`.
   - 👉 **Tiết kiệm thêm ~116 ms (1 RTT) cho mỗi request!**

3. **Mẫu Truy vấn Tổng hợp (Aggregate Root Query):**
   - Thay vì frontend phải gửi 4 request riêng biệt (`GET properties/:id`, `GET media?property_id=...`, `GET legal?property_id=...`, `GET amenities?property_id=...`).
   - Backend cung cấp 1 endpoint duy nhất: `GET /api/v1/admin/properties/:id/aggregate`.
   - Backend sử dụng PostgreSQL `json_agg` để gom nhóm dữ liệu trong **duy nhất 1 câu truy vấn SQL**:

```sql
-- Minh họa ý tưởng truy vấn gộp (Single Round-Trip):
SELECT 
  p.*,
  p.xmin::text AS _version,
  COALESCE((SELECT json_agg(m.* ORDER BY m.sort_order) FROM xland.property_media m WHERE m.property_id = p.id), '[]') AS media,
  COALESCE((SELECT json_agg(l.* ORDER BY l.checked_date) FROM xland.property_legal_items l WHERE l.property_id = p.id), '[]') AS legal_items,
  COALESCE((SELECT json_agg(a.*) FROM xland.property_nearby_amenities a WHERE a.property_id = p.id), '[]') AS amenities,
  COALESCE((SELECT json_agg(s.*) FROM xland.site_visit_slots s WHERE s.property_id = p.id), '[]') AS slots
FROM xland.properties p
WHERE p.id = $1;
```
👉 **Kết quả:** Thay vì mất 4 request × 1.200ms = 4.8 giây, toàn bộ hồ sơ lô đất được kéo về trong **chưa đầy 250ms**!

---

### 3.3. Database & Network Architecture: Giảm thiểu RTT

1. **Chuyển đổi Vùng Đặt Cơ sở Dữ liệu (Database Region Migration):**
   - **Hiện tại:** Mumbai (`ap-south-1`) ➔ RTT ping: **~117 ms**.
   - **Khuyến nghị:** Di chuyển Project Supabase sang **Singapore (`ap-southeast-1`)** ➔ RTT ping từ Hà Nội chỉ còn **~30 – 35 ms** (giảm 75% độ trễ vật lý).
   - Đây là giải pháp "một vốn bốn lời" mang lại hiệu quả tức thì cho toàn bộ hệ thống (cả Web, Mobile App và Admin).

---

## 4. Bảng Đối chiếu So sánh (Trước vs Sau)

| Tiêu chí | Kiến trúc Hiện tại | Kiến trúc Đề xuất Mới |
| :--- | :--- | :--- |
| **Số lượng Menu điều hướng** | 15 mục con xé lẻ, khó nhớ | **4 Mega-Modules** chuẩn nghiệp vụ |
| **Quy trình thêm ảnh / pháp lý** | Nhảy qua 3 URL khác nhau, mất 15–20 cú click | **Thao tác ngay trong Tab** của Lô đất đó |
| **Upload nhiều ảnh** | Tải từng ảnh một, chọn lại lô đất từ đầu | **Kéo thả hàng loạt (Batch drag-and-drop)** |
| **Cách nạp Schema** | Query `information_schema` qua mạng mỗi lần bấm tab | **In-memory cache trong RAM server (0ms)** |
| **Đường đi API khi đổi Tab** | 3–4 request nối đuôi (Waterfall: Session → Schema → List) | **1 request duy nhất** (hoặc 0ms nếu đã vào Cache SWR) |
| **Thời gian load khi đổi Tab** | **3.2 – 4.1 giây** (màn hình đơ, xoay vòng) | **< 200 – 400 ms** (nhanh gấp 10 lần) |
| **Thời gian chuyển Tab nội bộ Lô đất** | **3.5 giây** (mỗi tab là 1 route mới) | **0 ms** (Client-side tabs trong RAM) |
| **Khả năng mở rộng vai trò** | Chỉ có 1 role `admin` duy nhất | **Ma trận phân quyền (RBAC)** theo Role & Địa bàn |

---

## 5. Lộ trình Triển khai Đề xuất (4 Giai đoạn)

Nhằm đảm bảo an toàn, không làm gián đoạn mã nguồn hiện có của mobile và website demo, lộ trình đề xuất gồm 4 giai đoạn độc lập:

### Giai đoạn 1: Tối ưu hóa Hiệu năng Cấp tốc (Quick Wins — 1 đến 2 ngày)
*Mục tiêu: Đưa tốc độ load các tab hiện tại từ 3.5s xuống dưới 600ms mà chưa cần đập đi xây lại giao diện.*
- [ ] Bật In-Memory Cache cho `AdminService.schema()` trong `xland-server`.
- [ ] Bật LRU Cache ngắn hạn (5 phút) cho `AdminAuth.require()` token lookup.
- [ ] Ở frontend `workspace.tsx`: Cache lại biến `catalog` vào React State/Storage, không fetch lại schema khi đổi tab.
- [ ] Chạy song song `Promise.all([fetchSchema, fetchList])` thay vì gọi tuần tự `await`.

### Giai đoạn 2: Hợp nhất Aggregate Root Lô đất (Property Hub — 3 đến 5 ngày)
*Mục tiêu: Xây dựng màn hình quản lý Lô đất toàn diện (Unified Property Studio).*
- [ ] Viết API backend mới `GET /api/v1/admin/properties/:id/aggregate` (lấy trọn gói info, media, legal, amenities, slots).
- [ ] Xây dựng giao diện Tab cục bộ trên Next.js cho Lô đất (Tab Cơ bản, Tab Gallery, Tab Pháp lý, Tab Tiện ích & Lịch).
- [ ] Tích hợp trình upload kéo thả nhiều ảnh/video trực tiếp vào Supabase Storage.
- [ ] Chuyển các mục menu `Ảnh & media`, `Hồ sơ pháp lý`, `Tài liệu`, `Tiện ích` thành sub-views bên trong Lô đất.

### Giai đoạn 3: Tái cơ cấu Mạng xã hội & Cộng đồng (2 đến 3 ngày)
- [ ] Gom nhóm Video Feeds, Author và Moderation thành Module Mạng xã hội.
- [ ] Gom nhóm Sự kiện (Events) và Đăng ký tham gia (Registrations) thành Master-Detail View trực quan trong Module Cộng đồng.

### Giai đoạn 4: Mở rộng Hạ tầng & Phân quyền Nâng cao (RBAC — 3 đến 5 ngày)
- [ ] Di chuyển database Supabase sang Region Singapore (`ap-southeast-1`).
- [ ] Thiết kế bảng phân quyền vai trò mở rộng (`roles`, `permissions`, `user_regional_scopes`).
- [ ] Xây dựng giao diện phân quyền cho Moderator, Operator, Consultant, Sale.

---

> **Tài liệu tham chiếu liên quan:**
> - [docs/ADMIN.md](file:///d:/Xproject/Xland/docs/ADMIN.md) (Quy chuẩn hệ thống Admin hiện tại)
> - [docs/XLAND-SERVER-INTEGRATION-PLAN.md](file:///d:/Xproject/Xland/docs/XLAND-SERVER-INTEGRATION-PLAN.md) (Hợp đồng API & Schema backend)
> - [src/features/admin/workspace.tsx](file:///d:/Xproject/Xland/src/features/admin/workspace.tsx) (Giao diện Admin client hiện hữu)
> - [xland-server/src/admin/service.ts](file:///d:/Xproject/xland-server/xland-server/src/admin/service.ts) (Lớp xử lý nghiệp vụ Admin backend)
