# Báo cáo Baseline P00 — Đóng nền hiện tại trước khi nâng cấp giao diện

> Thời điểm ghi nhận: 03/10/2026.  
> Phiên bản mã nguồn khảo sát: Commit `0bf496cda428676db1cc70f0cd9d88bfa0c600d8` (`feat: mở rộng hành trình tương tác mốc 1B`).  
> Git Branch: `main` (clean working tree đối với mã nguồn thực thi; các sửa đổi đang có trong tài liệu của chủ dự án được bảo toàn nguyên vẹn).

---

## 1. Môi trường và Cách vận hành

| Thông số | Giá trị thực tế | Ghi chú |
| --- | --- | --- |
| Git Branch / HEAD | `main` / `0bf496cda428676db1cc70f0cd9d88bfa0c600d8` | Trùng khớp commit gốc khảo sát của chủ dự án |
| Git Working Tree Status | Modified: `AGENTS.md`, `PREPARE.md`, `docs/DESIGN.md`, `docs/STATUS.md`. Untracked: `docs/UI-UPGRADE.md`, `docs/references/`, `docs/ui-upgrade/`. | Giữ nguyên 100% các tài liệu quy hoạch do chủ dự án tạo ngày 01/10/2026 |
| Runtime Node.js | `v22.14.0` (active process) | Dev engine khai báo `24.x`; chạy mượt mà không lỗi |
| Quản lý gói | `pnpm 11.25.0` | Khóa theo `packageManager: pnpm@11.25.0`, lockfile nguyên vẹn |
| Cách chạy Production Local | `pnpm build` rồi `pnpm start --port 3200 --hostname 127.0.0.1` | Đã khởi tạo và phục vụ tại port 3200 |
| URL Production Server | `http://127.0.0.1:3200` | Cổng phục vụ cho capture và kiểm tra thủ công |
| URL E2E Test Server | `http://127.0.0.1:3100` | Được Playwright webServer tự khởi động trong bộ test |

---

## 2. Kết quả Kiểm tra Kỹ thuật Thực tế

Chạy chuỗi kiểm tra chuẩn của dự án:
`pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`

| Hạng mục kiểm tra | Lệnh | Kết quả thực tế | Chi tiết |
| --- | --- | --- | --- |
| Lint | `pnpm lint` | **ĐẠT (0 warnings, 0 errors)** | `eslint . --max-warnings=0` hoàn tất sạch sẽ |
| Typecheck | `pnpm typecheck` | **ĐẠT (0 errors)** | `next typegen && tsc --noEmit` hoàn tất sạch sẽ |
| Unit Tests | `pnpm test` | **42/42 ĐẠT (100%)** | `nft.test.ts` (12 tests), `journey.test.ts` (22 tests), `home.test.ts` (8 tests) |
| Production Build | `pnpm build` | **ĐẠT (0 errors)** | Next.js 16.3.6 Turbopack tối ưu 22 routes thành công |
| E2E Chromium Desktop | `playwright test --project=desktop-chromium` | **27/27 ĐẠT (100%)** | Toàn bộ luồng catalog, detail, saved, visit, NFT và accessibility |
| E2E Chromium Mobile | `playwright test --project=mobile-chromium` | **27/27 ĐẠT (100%)** | Viewport Pixel 7 (393×851), responsive layout, touch menu, keyboard |
| E2E WebKit Mobile | `playwright test --project=mobile-webkit` | **20/27 ĐẠT (7 lỗi)** | Tất cả luồng nghiệp vụ chức năng đều ĐẠT; 7 bài thất bại do sai lệch kích thước viewport trên môi trường giả lập Windows |
| **Tổng kết E2E** | `pnpm test:e2e` | **74/81 ĐẠT (91.4%)** | Đúng 100% với lịch sử kiểm tra ngày 30/09 trong `docs/STATUS.md` |

### Phân tích 7 lỗi WebKit Mobile (iPhone 13 emulation trên Windows)

Các bài test thất bại:
1. `accessibility.spec.ts:39:5 › text and controls remain inside the page at 200 percent CSS zoom`
2. `catalog.spec.ts:37:5 › all seven new listings have usable detail pages and images`
3. `journey.spec.ts:133:5 › new routes are accessible at five widths with reduced motion`
4. `nft.spec.ts:54:5 › NFT pages meet automated accessibility and responsive checks`
5. `scaffold.spec.ts:23:5 › home renders Vietnamese product copy and images without runtime errors`
6. `scaffold.spec.ts:53:5 › card opens matching detail, gallery and NFT information`
7. `scaffold.spec.ts:88:5 › responsive layout, mobile menu, keyboard and reduced motion`

**Nguyên nhân gốc (Root Cause):**
Tất cả 7 lỗi đều xuất phát từ assertion kiểm tra layout không tràn ngang:
`expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width)`
Trong đó WebKit giả lập trên Windows đọc:
- `clientWidth = 326` (hoặc `301`), nhưng `scrollWidth = 391` (hoặc `361`), gây ra giả tràn ngang và sinh ra `scrollX = 65`.
- **Kết quả chẩn đoán WebKit Probe độc lập (`scripts/probe-webkit.mjs`):**
  Khi chạy trên một file HTML tối giản không chứa bất kỳ CSS nào của dự án (`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><h1>Viewport check</h1></body></html>`), Playwright WebKit giả lập iPhone 13 vẫn trả về:
  - `requestedWidth`: 390
  - `innerWidth`: 325
  - `clientWidth`: 326
  - `scrollWidth`: 391
  - `devicePixelRatio`: 3.59375
  - `scrollX`: 65
- Đối chứng với Desktop WebKit không emulate device (`{ viewport: { width: 390, height: 844 } }`):
  - `clientWidth`: 326
  - `scrollWidth`: 326
  - `scrollX`: 0 (Không bị tràn)
- **Kết luận:** Đây là blocker môi trường do sự tương tác giữa hệ số DPI của Windows (`AppliedDPI = 115`), WebKit port trên Windows và cơ chế tính toán viewport emulation của Playwright. Dự án tuân thủ nghiêm ngặt quy tắc: **Không đổi DPI toàn máy, không dùng CSS `overflow: hidden` để che đậy sai số, không đổi iPhone project thành desktop để làm xanh test giả tạo.** Giữ nguyên blocker này cho tới khi kiểm tra trên macOS WebKit hoặc thiết bị thật ở P09.

---

## 3. Bản đồ Tuyến đường (Routes), Hành trình và Nơi gọi Anchor

| Route | Vai trò | Trạng thái hiển thị | Các CTA chính | Anchor liên quan |
| --- | --- | --- | --- | --- |
| `/` | Trang chủ Xland | Đầy đủ Hero, PropertyExplorer, Why Xland, NFT, Người đồng hành, Final CTA | - "Bắt đầu hành trình" (`#kham-pha`)<br>- "Tìm lô đất phù hợp" (dẫn sang `/lo-dat`)<br>- "Tìm hiểu phương án NFT" (`/nft`)<br>- "Xem hồ sơ hỗ trợ" (`/lo-dat/[slug]#ho-tro`)<br>- "Khám phá các lô đất" (`#kham-pha`) | - `#kham-pha`: Nằm trong `PropertyExplorer`<br>- `#cach-hoat-dong`: Section giới thiệu<br>- `#nft`: Section giới thiệu NFT<br>- `#nguoi-dong-hanh`: Section 3 chuyên viên |
| `/lo-dat` | Danh mục khám phá | Bộ lọc động theo URL (`region`, `price`, `setting`, `category`, `sort`), danh sách 10 lô đất | - Lọc, xóa lọc, đổi sắp xếp<br>- Nút Lưu (SaveButton)<br>- Link mở chi tiết lô đất (`/lo-dat/[slug]`) | Nhận query từ header/search |
| `/lo-dat/goc-pho-long-bien` | Chi tiết lô đô thị (XL-004) | Breadcrumb, Gallery kiến trúc, Thông tin hồ sơ, Người hỗ trợ, Aside tóm tắt giá, 3 lô liên quan | - "Đề nghị xem thực địa" (`/lich-hen?lo=goc-pho-long-bien`)<br>- "Lưu lô đất" (SaveButton)<br>- "Xem thông tin hỗ trợ" (`#ho-tro`) | - `#ho-tro`: Nằm tại section người hỗ trợ<br>- `#phuong-an-nft`: (nếu lô có NFT) |
| `/da-luu` | Danh sách đã lưu | Đọc từ store client `xland.demo.journey.v1` | - "Bỏ lưu", "Đề nghị xem thực địa"<br>- Empty state: Link về `/lo-dat` | Đồng bộ đa tab qua storage event |
| `/lich-hen` | Lịch hẹn xem thực địa | Form tạo yêu cầu (khi có `?lo=[slug]`) và danh sách lịch hẹn cá nhân | - Chọn ngày (01–31/10/2026), giờ (09:00 / 14:00), số khách (1–8)<br>- "Xem lại đề nghị" -> "Gửi đề nghị"<br>- "Đổi lịch", "Hủy lịch" (chờ xử lý) | Model từ chối lô tạm dừng/đã bán |
| `/nft` | Danh sách NFT | Hiển thị 3 phương án: Miền xanh ven sông (open), Thung lũng nắng ấm (sold_out), Góc đồi thông reo (paused) | - "Xem phương án NFT" (`/nft/[slug]`)<br>- "Danh mục NFT của bạn →" (`/danh-muc-nft`) | Giữ nguyên terminology NFT |
| `/nft/mien-xanh-ven-song` | Chi tiết phương án NFT (NFT-XL-001) | Thông tin tài sản, tỷ lệ phân đoạn, số lượng mở bán, panel đặt mua, điều kiện pháp lý | - Nhập số lượng NFT (1–750)<br>- "Xác nhận mua NFT mô phỏng"<br>- Link "Xem hồ sơ lô đất gốc →" | - `#dieu-kien`: Nằm tại mục điều khoản |
| `/danh-muc-nft` | Danh mục NFT sở hữu | Thống kê số lượng NFT, tổng vốn mô phỏng, lịch sử các giao dịch | - Xem danh sách lệnh thành công/hủy/lỗi<br>- Link về `/nft` khi trống | Tính toán từ sổ lệnh đã qua kiểm thực |
| `/trai-nghiem` | Cài đặt và Reset demo | Trang thiết lập và khôi phục môi trường mẫu | - Nút "Đặt lại trải nghiệm" (khôi phục favorites, lịch hẹn, sổ lệnh NFT về seed ban đầu) | Không làm mất dữ liệu ngoài namespace demo |

### Đối chiếu các Anchor nội bộ:
- `#kham-pha`: Gọi từ nút Hero và nút Final CTA tại trang chủ. Đích đến là form tìm kiếm trong `PropertyExplorer`.
- `#cach-hoat-dong`: Được gọi từ Footer link "Cách Xland hoạt động" (`/#cach-hoat-dong`). Đích đến là section Why Xland trên trang chủ.
- `#nft`: Nằm tại section NFT trang chủ. Hiện tại các link điều hướng chính dẫn trực tiếp tới trang riêng `/nft`.
- `#nguoi-dong-hanh`: Section tại trang chủ giới thiệu 3 chuyên gia tư vấn.
- `#ho-tro`: Nằm trên từng trang chi tiết lô đất (`/lo-dat/[slug]#ho-tro`). Được gọi từ card chuyên viên tại trang chủ (`/lo-dat/${property.slug}#ho-tro`) và từ liên kết text trong aside tóm tắt chi tiết.

---

## 4. Bằng chứng Ảnh Baseline và Metadata (50 Screenshots)

Toàn bộ ảnh được lưu tại thư mục: `docs/qa/ui-upgrade/P00/`.  
Tất cả ảnh được capture trên môi trường Production Server sạch (`http://127.0.0.1:3200`) qua script `scripts/capture-p00.mjs` với browser context độc lập, đã chờ font hoàn tất (`document.fonts.ready`), eager decode hình ảnh và đảm bảo hydrate dữ liệu. Metadata chi tiết từng ảnh nằm tại [metadata.json](metadata.json).

### Danh mục ảnh chính đã kiểm tra:

1. **Trang chủ đầy đủ (Home Full Page):**
   - `home-360.png` (360×900, scrollWidth=360, clientWidth=360, imageFailures=0)
   - `home-390.png` (390×900, scrollWidth=390, clientWidth=390, imageFailures=0)
   - `home-430.png` (430×900, scrollWidth=430, clientWidth=430, imageFailures=0)
   - `home-768.png` (768×900, scrollWidth=768, clientWidth=768, imageFailures=0)
   - `home-1440.png` (1440×1000, scrollWidth=1440, clientWidth=1440, imageFailures=0)

2. **Crops ngữ cảnh Trang chủ tại 5 Viewports (25 ảnh):**
   - Hero Section: `home-{360,390,430,768,1440}-crop-hero.png`
   - Chương Xland (`#cach-hoat-dong`): `home-{360,390,430,768,1440}-crop-xland.png`
   - Chương NFT (`#nft`): `home-{360,390,430,768,1440}-crop-nft.png`
   - Section Chuyên viên (`#nguoi-dong-hanh`): `home-{360,390,430,768,1440}-crop-advisors.png`
   - Thẻ bất động sản mẫu: `home-{360,390,430,768,1440}-crop-card.png`

3. **Trang Chi tiết (Detail Pages tại 390px và 1440px):**
   - Chi tiết đô thị: `detail-urban-390.png` và `detail-urban-1440.png` (`/lo-dat/goc-pho-long-bien`)
   - Chi tiết NFT: `detail-nft-390.png` và `detail-nft-1440.png` (`/nft/mien-xanh-ven-song`)

4. **Các màn hình Chức năng 1B (Functional Pages tại 390px và 1440px):**
   - Khám phá có lọc: `functional-catalog-390.png`, `functional-catalog-1440.png`
   - Danh sách đã lưu: `functional-saved-390.png`, `functional-saved-1440.png`
   - Form hẹn thực địa: `functional-visit-form-390.png`, `functional-visit-form-1440.png`
   - Xem lại đề nghị: `functional-visit-review-390.png`, `functional-visit-review-1440.png`
   - Lịch hẹn đã gửi: `functional-visits-list-390.png`, `functional-visits-list-1440.png`
   - Danh mục NFT: `functional-nft-catalog-390.png`, `functional-nft-catalog-1440.png`
   - Sổ sở hữu NFT (Portfolio): `functional-nft-portfolio-390.png`, `functional-nft-portfolio-1440.png`
   - Cài đặt reset: `functional-reset-390.png`, `functional-reset-1440.png`

---

## 5. Rà soát Hiện trạng & Danh mục Điểm cần Cải thiện (Định vị cụ thể)

Dưới đây là các quan sát trực tiếp đối chiếu giữa mã nguồn hiện tại và định hướng nâng cấp Sunshine Group, chỉ rõ phần tử và file cần nâng cấp:

| Thành phần | Vị trí File / Element | Hiện trạng mã nguồn & Minh chứng ảnh | Điểm hạn chế cần khắc phục trong các Phase tiếp theo | Mức ưu tiên |
| --- | --- | --- | --- | --- |
| **Logo / Brand Header** | `src/components/site-header.tsx:22`<br>`src/components/site-footer.tsx:6`<br>`globals.css: .brand` | Chữ `XLAND` với chữ `LAND` bọc trong `<span>` và một chấm tròn CSS `border-radius: 9999px; background: var(--accent)` (`home-390-crop-hero.png`, `home-1440-crop-hero.png`) | Thiếu tính nhận diện độc bản; chưa có biểu tượng SVG riêng gợi nhắc thửa đất/đường chân trời; chưa có bản lockup đảo màu cho nền tối. | **Cao (P01)** |
| **Hệ Icon** | `src/components/icon.tsx`<br>`src/components/site-header.tsx:23` | Chỉ có 8 SVG inline (`arrow`, `pin`, `search`, `area`, `layers`, `check`, `close`, `menu`) vẽ thủ công với stroke mảnh (`home-1440-crop-xland.png`) | Chưa có optical bounds viewBox 24 thống nhất; nét vẽ và bo góc chưa đồng nhất; thiếu các icon đại diện cho quyền lợi, chứng nhận, phương án. | **Cao (P01)** |
| **Hệ thống Button** | `src/app/globals.css: .button, .hero-link, .header-cta` | Chỉ có 1 kiểu button xanh dương `#0077B6`, bo góc 12px, hover đổi màu nền (`detail-urban-390.png`, `home-1440-crop-hero.png`) | Thiếu các biến thể có cấu trúc: Primary (`#164B60`), Secondary viền, Inverse (nền sáng chữ Ink cho section tối); thiếu trạng thái `pressed`, `pending` giữ độ rộng, `focus-visible` tương phản cao. | **Cao (P01)** |
| **Chân dung Persona (Avatar)** | `src/app/page.tsx:35`<br>`src/components/property-card.tsx:23`<br>`src/app/lo-dat/[slug]/page.tsx:30` | Chỉ hiển thị vòng tròn 2 chữ cái đầu Initials (ví dụ "TA", "TH", "HA") trên nền pastel (`home-390-crop-advisors.png`, `home-1440-crop-advisors.png`, `detail-urban-390.png`) | Hoàn toàn chưa có hình ảnh chân dung chuyên viên; thiếu tính kết nối con người và độ ấm áp; cần bộ chân dung persona tuyển chọn có bản quyền ở P02. | **Cao (P02, P06)** |
| **Media Hero & Crop** | `src/app/page.tsx:11`<br>`globals.css: .hero-photo` | Dùng ảnh chung `hero.webp` với `object-fit: cover` trung tâm (`home-360-crop-hero.png`, `home-1440-crop-hero.png`) | Ở mobile 360–430px, tỷ lệ dọc chưa có focal point chủ động; khoảng thở cho typography tiếng Việt trên màn hình nhỏ chưa tối ưu. | **Trung bình (P02, P03)** |
| **Chương Giới thiệu Xland** | `src/app/page.tsx:22–30`<br>`section#cach-hoat-dong` | Gồm tiêu đề và 3 card nhỏ đặt ngang (`values-grid`) chứa icon tròn + chữ (`home-390-crop-xland.png`, `home-1440-crop-xland.png`) | Thiếu hình ảnh chủ đạo mang lại chiều sâu; 3 bước chưa có chỉ mục đánh số 01–03 biên tập rõ nét; thiếu liên kết hành động thực tế dẫn tới `/lo-dat`. | **Cao (P04)** |
| **Chương Bất động sản NFT** | `src/app/page.tsx:31–34`<br>`section#nft` | Chia 2 cột trắng: ảnh `garden-retreat.webp` và danh sách 3 gạch đầu dòng (`home-390-crop-nft.png`, `home-1440-crop-nft.png`) | Nền sáng chưa tạo được sự tương phản cao cấp (như đề xuất nền Ink xanh đậm); thiếu sơ đồ quy trình 3 bước; thiếu số liệu ví dụ cụ thể từ fixture. | **Cao (P05)** |
| **Chuyển động (Motion)** | Toàn trang | Chỉ có CSS transition 150ms đơn giản trên hover chuột | Chưa có chuyển động cuộn dẫn dắt thị giác; thiếu reveal ảnh và nhịp kể chuyện theo lớp (sẽ giải quyết bằng GSAP có fallback ở P07–P08). | **Giai đoạn sau (P07, P08)** |

---

## 6. Hợp đồng Nghiệp vụ 1B Bất biến (Không sửa trong quá trình nâng cấp)

Các module sau đây là **biên nghiệp vụ** đã có kiểm thử tự động, tuyệt đối không được viết lại hoặc thay đổi hợp đồng dữ liệu trong quá trình nâng cấp thẩm mỹ:
1. **PropertyExplorer & URL Query:** Quản lý đồng bộ `region`, `price`, `setting`, `category`, `sort` qua URLSearchParams; giữ nguyên schema và thứ tự ưu tiên nhóm bất động sản.
2. **SaveButton & Journey Store:** Lưu trữ dữ liệu không nhạy cảm trong namespace `xland.demo.journey.v1` với cơ chế kiểm tra phiên bản và Web Locks.
3. **Visit Request Model & Form:** Kiểm tra tính hợp lệ của ngày đặt lịch trong cửa sổ 01–31/10/2026, 2 khung giờ 09:00/14:00, 1–8 người, chống gửi trùng mã lệnh và bảo toàn trạng thái chờ sắp xếp.
4. **NFT Model & Catalog & Purchase Panel:** Chuẩn ERC-1155 simulation, đơn giá, tính toán số dư holding, remaining supply, quote phí 0%, ngăn chặn số âm/số lẻ/vượt tồn, cơ chế restoreLedger bằng cách phát lại các đơn hàng hợp lệ.
