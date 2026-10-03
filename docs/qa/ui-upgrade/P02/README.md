# Bằng chứng nghiệm thu P02 — Media và chân dung người đồng hành

Mốc thực hiện: P02 (Vòng nâng cấp UI Sunshine)  
Thời gian: 03/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Playwright (Chromium)  
Cổng test: 3200 (`http://127.0.0.1:3200`)  
Commit cơ sở: `9c195d2` (P01)

---

## 1. Danh sách Media & Tối ưu WebP (Budget BRIEF C)

| Asset ID | Tên file Web | Kích thước (px) | Dung lượng | Budget BRIEF C | Tỷ lệ / Focal point | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ADV-001` | `public/images/advisors/minh-anh.webp` | 512 × 512 | 26.4 KB | ≤ 60 KB | 1:1, center-top | Đạt |
| `ADV-001-thumb` | `public/images/advisors/minh-anh-thumb.webp` | 128 × 128 | 4.8 KB | ≤ 15 KB | 1:1, center-top | Đạt |
| `ADV-002` | `public/images/advisors/hoang-nam.webp` | 512 × 512 | 26.5 KB | ≤ 60 KB | 1:1, center-top | Đạt |
| `ADV-002-thumb` | `public/images/advisors/hoang-nam-thumb.webp` | 128 × 128 | 4.1 KB | ≤ 15 KB | 1:1, center-top | Đạt |
| `ADV-003` | `public/images/advisors/thanh-ha.webp` | 512 × 512 | 18.9 KB | ≤ 60 KB | 1:1, center-top | Đạt |
| `ADV-003-thumb` | `public/images/advisors/thanh-ha-thumb.webp` | 128 × 128 | 3.6 KB | ≤ 15 KB | 1:1, center-top | Đạt |
| `ADV-004` | `public/images/advisors/ngoc-lan.webp` | 512 × 512 | 21.6 KB | ≤ 60 KB | 1:1, center-top | Đạt |
| `ADV-004-thumb` | `public/images/advisors/ngoc-lan-thumb.webp` | 128 × 128 | 4.3 KB | ≤ 15 KB | 1:1, center-top | Đạt |
| `STORY-001` | `public/images/xland-story.webp` | 1080 × 1440 | 211.8 KB | ≤ 250 KB | 3:4, center | Đạt |

---

## 2. Ảnh chụp nghiệm thu (9 Viewports & Sections)

Toàn bộ ảnh chụp được lưu tại thư mục này với metadata đầy đủ tại [metadata.json](./metadata.json):

1. **Contact Sheet 5 Viewports (`/qa-media-proof`)**:
   - `p02-media-proof-360.png` (360×740): scrollWidth = clientWidth = 360, imageFailures = 0.
   - `p02-media-proof-390.png` (390×844): scrollWidth = clientWidth = 390, imageFailures = 0.
   - `p02-media-proof-430.png` (430×932): scrollWidth = clientWidth = 430, imageFailures = 0.
   - `p02-media-proof-768.png` (768×1024): scrollWidth = clientWidth = 768, imageFailures = 0.
   - `p02-media-proof-1440.png` (1440×900): scrollWidth = clientWidth = 1440, imageFailures = 0.
2. **Khu vực Người đồng hành trên Trang chủ (`/#nguoi-dong-hanh`)**:
   - `p02-home-advisors-390.png` (390px mobile): 4 avatar hiển thị sắc nét cùng tên và vai trò.
   - `p02-home-advisors-1440.png` (1440px desktop): Grid 4 cột cân đối, responsive mượt mà.
3. **Khu vực Người hỗ trợ trên Chi tiết Lô đất (`/lo-dat/mien-xanh-ven-song#ho-tro`)**:
   - `p02-detail-support-390.png` (390px mobile): Avatar chuyên viên Nguyễn Minh Anh hiển thị đúng.
   - `p02-detail-support-1440.png` (1440px desktop): Bố cục thông tin liên hệ và avatar chuyên viên chuẩn xác.

---

## 3. Kiểm định Fallback & Xử lý lỗi

- **Thử nghiệm tải ảnh hỏng**: Thử truyền `src="/images/broken-link.webp"`, component `Avatar` ngay lập tức chuyển sang render initials fallback trên nền theme màu cố định tương ứng (`avatar-theme-teal`, `avatar-theme-sage`, `avatar-theme-navy`, `avatar-theme-sand`). Layout không bị sập hay giật giật (CLS = 0).
- **Thử nghiệm thay đổi `src`**: Khi `src` thay đổi từ ảnh hỏng sang ảnh hợp lệ hoặc giữa 2 ảnh khác nhau, state lỗi được reset tự động theo mô hình declarative mà không gây render cascade.
- **Tiếp cận (Accessibility)**: Với avatar trang trí đặt cạnh tên chuyên viên (`decorative={true}`), thẻ ảnh sinh ra `aria-hidden="true"` và `alt=""` để trình đọc màn hình không đọc lặp tên 2 lần. Khi đứng độc lập, `alt="Chân dung [Tên]"` được cung cấp đầy đủ.

---

## 4. Kết quả Kiểm thử Tự động

- `pnpm lint`: **0 warning, 0 error** (đạt `--max-warnings=0`).
- `pnpm typecheck`: **Hoàn thành thành công** (`next typegen && tsc --noEmit`).
- `pnpm test`: **42/42 tests passed** (unit test home, journey, nft).
- `playwright test` (accessibility + journey): **22/22 tests passed** trên cả desktop-chromium và mobile-chromium.
