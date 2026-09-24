# KẾ HOẠCH CHUẨN BỊ TOÀN DIỆN CHO DỰ ÁN XLAND
> **Mục tiêu chiến lược:** Xây dựng nền tảng PropTech & RWA (Real World Assets) thế hệ mới dưới dạng **Mobile-First WebApp hạng sang (Ultra-Luxury)** nhằm **chinh phục nhà đầu tư (Investor Pitch Deck)** trong Giai đoạn 1, và sẵn sàng đấu nối Backend/Smart Contract trong Giai đoạn 2.
>
> **Phương pháp cốt lõi:** Quản trị và phát triển bằng **AI Agents kết hợp "Bộ Não Trung Tâm" (Living Brain - Single Source of Truth)** nhằm đảm bảo tính đồng thuận, đồng bộ và nhất quán 100% tại mọi thời điểm trên dòng thời gian.

---

## BẢNG TỔNG HỢP MỨC ĐỘ ƯU TIÊN (PRIORITY MATRIX)

| Mức độ ưu tiên | Hạng mục chuẩn bị | Trọng tâm chính |
| :--- | :--- | :--- |
| **ƯU TIÊN 1 (P0 - Sống còn)** | **Hệ Thống "Bộ Não Trung Tâm" (.brain/)** | Khóa dòng thời gian, quy chuẩn thiết kế, schema thực thể, luật ứng xử agent |
| **ƯU TIÊN 2 (P1 - Rất cao)** | **Kiến Trúc Kỹ Thuật & UI Toolkit Hạng Sang** | Mobile-First Shell, Tailwind, Vaul Drawer, Magic UI, Lucide Icons |
| **ƯU TIÊN 3 (P1 - Rất cao)** | **Tầng Dữ Liệu Giả Lập & Logic Nghiệp Vụ** | TypeScript Mock Entities, mô hình toán học tài chính, tính ROI |
| **ƯU TIÊN 4 (P2 - Quan trọng)** | **Tài Nguyên Thị Giác & Visual Assets 8K** | Ảnh kiến trúc siêu sang, video flycam, chứng thực sổ đỏ số mô phỏng |
| **ƯU TIÊN 5 (P2 - Quan trọng)** | **Hệ Sinh Thái MCP & Subagent Kiểm Thử** | Figma MCP, SQLite/Supabase MCP, Browser Test & Video Recorder |
| **ƯU TIÊN 6 (P3 - Thực thi)** | **Checklist 4 Màn Hình Trải Nghiệm MVP** | Home Feed, Live Auction, RWA Tokenization, Investor Portfolio |

---

## CHI TIẾT CÁC HẠNG MỤC CHUẨN BỊ (THEO THỨ TỰ ƯU TIÊN)

### ƯU TIÊN 1 (P0): HỆ THỐNG "BỘ NÃO TRUNG TÂM" (`.brain/`)
> Đây là hạng mục tối quan trọng, bắt buộc phải hoàn thành trước khi viết bất kỳ dòng code nào.

#### 1. `1_TIMELINE_STATE.json` (Thùy Điều Phối Trạng Thái)
- **Nội dung:** Lưu trữ chính xác giai đoạn hiện tại (VD: `PHASE_1_INVESTOR_PITCH_MVP`), task đang làm dở, các mốc đã hoàn thành (Locked/Frozen), và các mốc tương lai bị khóa.
- **Lý do bắt buộc phải có:**
  - Triệt tiêu hoàn toàn hiện tượng **"Mất trí nhớ phiên" (Session Amnesia)** của AI Agents.
  - Ngăn chặn Agent tự ý nhảy cóc sang code Backend khi giao diện chưa được chốt duyệt.
  - Giúp bất kỳ model nào (Claude, Gemini, GPT) khi được khởi động đều biết chính xác mình đang đứng ở giây phút nào của dự án.

#### 2. `2_DESIGN_TOKENS.json` (Thùy Thị Giác & Thẩm Mỹ Bất Biến)
- **Nội dung:** Định nghĩa toàn bộ Design System dạng JSON có cấu trúc mà máy đọc được:
  - Bảng màu: Champagne Gold (`#E8C981`, `#C29E51`), Deep Navy Surface (`#040711`, `#090F1E`), Kính mờ (Glassmorphism).
  - Tỷ lệ khung nhìn: Mobile WebApp Container (393px × 852px chuẩn iPhone 16 Pro).
  - Typography: `Plus Jakarta Sans` / `Outfit` (giao diện, số liệu) + `Cinzel` (tiêu đề xa xỉ).
  - Quy định linh kiện: Bắt buộc dùng `vaul` cho Bottom Sheet; cấm 100% emoji hệ thống.
- **Lý do bắt buộc phải có:**
  - Ngăn chặn việc Agent tự chế màu sắc, tự sinh ra giao diện "nhựa" hay code kiểu template rẻ tiền.
  - Thay thế hoàn toàn file bóc tách CSS tĩnh không hiệu quả trước đây.

#### 3. `3_DOMAIN_SCHEMA.ts` (Thùy Nghiệp Vụ & Hợp Đồng Dữ Liệu)
- **Nội dung:** Khai báo kiểu dữ liệu TypeScript nghiêm ngặt (Strict Types) cho toàn bộ hệ thống: `PropertyRWA`, `AuctionSession`, `FractionalTokenTier`, `BidRecord`, `UserPortfolio`.
- **Lý do bắt buộc phải có:**
  - Đóng vai trò là "bản hợp đồng" liên kết giữa Mock Data của Giai đoạn 1 và Database/API thật của Giai đoạn 2.
  - Khi nhà đầu tư gật đầu, đội Backend chỉ cần cắm API vào đúng Schema này mà không phải đập bỏ làm lại giao diện.

#### 4. `4_ADR/` (Thùy Trí Nhớ: Hồ Sơ Quyết Định Kiến Trúc)
- **Nội dung:** Các văn bản ngắn ghi lại lý do vì sao chọn kiến trúc này mà không chọn kiến trúc khác (VD: `ADR-001-mobile-first-webapp.md`, `ADR-002-vaul-bottom-sheet-over-modal.md`).
- **Lý do bắt buộc phải có:**
  - Bảo vệ các quyết định lịch sử. Tránh trường hợp Agent ở tuần sau tự ý đổi ngược thiết kế của Agent tuần trước.

#### 5. `5_AGENT_PROTOCOL.md` (Hiến Pháp Thực Thi Của Agent)
- **Nội dung:** 3 bước bắt buộc của mỗi Agent: **Load Brain (Đọc trạng thái) -> Atomic Execution (Chỉ làm đúng 1 việc) -> Sync Brain (Ghi nhật ký và cập nhật tiến độ).**
- **Lý do bắt buộc phải có:**
  - Ràng buộc kỷ luật thực thi của AI, biến AI từ một chatbot ngẫu hứng thành một kỹ sư có nguyên tắc làm việc công nghiệp.

---

### ƯU TIÊN 2 (P1): KIẾN TRÚC KỸ THUẬT & UI TOOLKIT HẠNG SANG
> Quyết định "độ mượt", "độ sang" và trải nghiệm cầm tay trực tiếp của nhà đầu tư.

#### 1. Khung Dự Án: `Next.js 15 (App Router)` hoặc `Vite + React 19 + TypeScript`
- **Lý do:** Khởi động tức thì (Zero latency), biên dịch nhanh, hỗ trợ PWA (Progressive Web App) để cài trực tiếp icon app Xland ra màn hình chính điện thoại của nhà đầu tư.

#### 2. Thư viện Bottom Sheet iOS: `vaul` (11k+ stars)
- **Lý do:** Trên điện thoại, không ai dùng pop-up hay modal che kín màn hình có nút "X" nhỏ xíu. Toàn bộ thao tác (Đặt giá thầu, Mua suất NFT, Xem giấy tờ pháp lý) phải vuốt trượt từ dưới lên (Swipe-to-dismiss) mượt mà như Apple Pay.

#### 3. Bộ Linh Kiện Hiệu Ứng Xa Xỉ: `Magic UI` + `Aceternity UI` + `Framer Motion`
- **Lý do:**
  - Cung cấp các hiệu ứng đẳng cấp Web3/FinTech: Viền ánh kim quét sáng (Border Beam), số tiền nhảy liên tục (Number Ticker), hiệu ứng chiều sâu (Parallax Tilt).
  - Giúp sản phẩm vượt xa khỏi mặt bằng website thông thường, tạo ấn tượng "Awwwards-level" ngay từ cái nhìn đầu tiên.

#### 4. Thư viện Vector Icons: `lucide-react` (Stroke: 1.5px)
- **Lý do:** Loại bỏ triệt để emoji hệ thống (`🏛️, 💎, 📜`) - nguyên nhân chính gây ra cảm giác "nghiệp dư/vibe-code". Tất cả icon phải là vector nét mảnh màu vàng Champagne hoặc bạch kim.

---

### ƯU TIÊN 3 (P1): TẦNG DỮ LIỆU GIẢ LẬP & LOGIC NGHIỆP VỤ BÀI BẢN
> Quyết định sự thuyết phục về mặt kinh doanh và tài chính khi thuyết trình trước nhà đầu tư.

#### 1. Bộ Dữ Liệu Giả Lập Chuẩn Chỉnh (`src/mock/`)
- **Nội dung:** Các file JSON tuân thủ đúng `DOMAIN_SCHEMA.ts`:
  - `properties.json`: 3-5 dự án bất động sản biểu tượng (Dinh thự biển Sơn Trà, Penthouse Thủ Thiêm, Tổ hợp Landmark Tây Hồ).
  - `auctions.json`: Dữ liệu phiên đấu giá sống (giá khởi điểm, lịch sử 15 bước giá thầu gần nhất, thời gian đếm ngược).
  - `fractions.json`: Suất NFT (Tổng 1,000 suất, giá 10 triệu/suất, tiến độ đã bán 78%, dòng tiền cổ tức minh bạch).
  - `portfolio.json`: Ví mẫu của nhà đầu tư (hiển thị sẵn 12 suất NFT đang sở hữu và lịch sử nhận tiền thuê).
- **Lý do:** Nhà đầu tư cần thấy **dòng tiền thật, con số thật**, không phải chữ "Lorem Ipsum" hay số liệu tượng trưng vô nghĩa.

#### 2. Mô Hình Toán Học & Thuật Toán Tài Chính Bất Động Sản
- **Nội dung:**
  - Công thức tính APY cho thuê thực tế (Rental Yield: 9% - 12%/năm).
  - Công thức dự phóng giá trị tài sản sau 3-5 năm dựa trên tỷ lệ trượt giá BĐS Việt Nam (7% - 9%/năm).
  - Cơ chế khóa cọc đấu giá (Escrow Lock) và bước giá tối thiểu (+1% đến +5%).
- **Lý do:** Giữ tính logic và uy tín. Nếu nhà đầu tư kéo thanh trượt thử nghiệm mà số liệu sinh lời bị phi lý, họ sẽ đánh giá dự án thiếu hiểu biết về tài chính BĐS.

---

### ƯU TIÊN 4 (P2): TÀI NGUYÊN THỊ GIÁC & VISUAL ASSETS 8K
> Bất động sản hạng sang được bán bằng cảm xúc thị giác.

#### 1. Thư Viện Hình Ảnh Kiến Trúc Độ Phân Giải Cao (8K / Cinema-grade)
- **Nội dung:** 
  - Ảnh phối cảnh ngoại thất hoàng hôn, ánh sáng vàng ấm phản chiếu mặt kính.
  - Ảnh nội thất Penthouse thông tầng hướng view thành phố về đêm.
  - Ảnh flycam bến du thuyền và bờ biển nhiệt đới.
- **Lý do:** Ảnh chất lượng thấp hoặc ảnh stock miễn phí rẻ tiền sẽ phá nát toàn bộ thiết kế dù code có tốt đến đâu.

#### 2. Chứng Thư Số & Sổ Đỏ Số Mô Phỏng (Visual Digital Title Deed)
- **Nội dung:** File đồ họa mô phỏng giấy chứng nhận quyền sở hữu phân đoạn RWA được số hóa, có đóng dấu kiểm toán (VD: "Audited by KPMG / In Custody with BIDV").
- **Lý do:** Giải quyết câu hỏi lớn nhất của nhà đầu tư: *"Phân đoạn bằng NFT thì pháp lý ở đâu?"* — Giao diện hiển thị trực quan giấy tờ pháp lý bảo chứng sẽ tạo niềm tin tuyệt đối.

---

### ƯU TIÊN 5 (P2): HỆ SINH THÁI CÔNG CỤ MCP & SUBAGENT KIỂM THỬ
> Tăng tốc độ triển khai và kiểm soát chất lượng tự động.

#### 1. Figma MCP Server (Nếu có bản vẽ thiết kế)
- **Lý do:** Cho phép Agent đọc trực tiếp các layout, mã màu và khoảng cách padding từ file thiết kế mà không cần mô tả thủ công qua chat.

#### 2. SQLite / Supabase Local MCP Server
- **Lý do:** Cho phép Agent kiểm tra tính toàn vẹn của dữ liệu mock và chuẩn bị sẵn cấu trúc bảng cho Giai đoạn 2.

#### 3. Browser Subagent & Screen Recorder (Có sẵn trong Antigravity)
- **Lý do:** Tự động mở viewport di động (393px × 852px), chạy kiểm thử tự động toàn bộ luồng tương tác, chụp ảnh màn hình và xuất video demo để bạn nhúng thẳng vào slide pitch deck.

---

### ƯU TIÊN 6 (P3): CHECKLIST 4 MÀN HÌNH TRẢI NGHIỆM MVP
> Sau khi chuẩn bị xong từ P0 đến P2, AI Agent sẽ tiến hành dựng lần lượt 4 màn hình:

1. **Màn hình 1 - Khám Phá (Discovery Feed):**
   - Header hiển thị số dư ví & trạng thái kết nối Web3.
   - Thanh story reels BĐS trên cùng (video ngắn flycam).
   - Danh sách thẻ BĐS cao cấp bo góc mượt, có tag trạng thái sang trọng.
2. **Màn hình 2 - Đấu Giá Trực Tuyến (Live Auction Arena):**
   - Bộ đếm ngược thời gian thực (Giờ : Phút : Giây).
   - Bảng khớp lệnh trả giá thời gian thực nhảy số liên tục.
   - Nút "Đặt giá thầu" mở Bottom Sheet vuốt chạm với phản hồi rung haptics.
3. **Màn hình 3 - Đầu Tư Phân Đoạn NFT (RWA Fractional Tokenization):**
   - Thanh trượt số lượng suất NFT (1 - 50 suất).
   - Bộ tính ROI tự động: Vốn đầu tư, Cổ tức tiền thuê nhận hàng tháng, Tổng lợi nhuận 3 năm.
   - Nút bấm xem Sổ Đỏ Số và hợp đồng thông minh đã kiểm toán.
4. **Màn hình 4 - Ví Tài Sản Của Tôi (Investor Portfolio):**
   - Tổng giá trị tài sản ròng BĐS đang nắm giữ.
   - Lịch sử dòng tiền thụ động đã nhận về ví.
   - Nút niêm yết bán lại suất NFT trên thị trường thứ cấp.

---

## BƯỚC HÀNH ĐỘNG TIẾP THEO

Theo đúng ma trận ưu tiên:
1. **Bước 1:** Khởi tạo thư mục `.brain/` và thiết lập 5 file trụ cột của **Ưu tiên 1 (P0)**.
2. **Bước 2:** Cùng bạn rà soát và đóng dấu khóa (Lock) cấu trúc của Bộ Não.
3. **Bước 3:** Tiến hành thiết lập Tech Stack và triển khai theo lộ trình.
