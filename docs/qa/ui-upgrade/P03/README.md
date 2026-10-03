# Bằng chứng nghiệm thu P03 — Header, Hero và Footer

Mốc thực hiện: P03 (Vòng nâng cấp UI Sunshine)  
Thời gian: 03/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Playwright (Chromium)  
Cổng test: 3200 (`http://127.0.0.1:3200`)  
Commit cơ sở: `c9c8178`

---

## 1. Hạng mục triển khai & Kết quả kiểm tra

| Hạng mục | Chi tiết thực thi | Kết quả thị giác & kỹ thuật |
| :--- | :--- | :--- |
| **SiteHeader** | Kích thước mobile 68px, desktop 80px. Nền đục mờ `rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px)`. Logo `size="md"` sắc nét ở 360px. Menu toggle `44×44px` với accessible name rõ ràng. Sticky header với `scroll-margin-top` chống che khuất. | ĐẠT: Không che nội dung cuộn, không gây bóng chữ. Bàn phím Escape đóng menu và trả focus về toggle button. |
| **Mobile Menu** | Non-modal navigation panel dưới header, padding thoáng, phân cách rõ. Nút CTA `Tìm lô đất phù hợp` nổi bật với icon arrow. | ĐẠT: Đóng khi nhấn Escape hoặc click chọn route. `aria-expanded` cập nhật đúng trạng thái. |
| **Hero Section** | Tách thành component độc lập `src/components/home/hero.tsx`. Bố cục responsive: mobile `min-height: 520px`, desktop `min-height: 680px`. Không dùng 100vh để search panel lộ diện tự nhiên ở cạnh dưới mobile. | ĐẠT: H1 “Một miền đất. Vạn khởi đầu.” cân line break hoàn hảo tại 360/390/430px. Chữ trắng trên nền overlay Ink đạt tương phản AAA (11.8:1). |
| **Search Explorer** | Nổi nhẹ `margin-top: -36px` trên ranh giới hero. Anchor `#kham-pha` có `scroll-margin-top` chuẩn. | ĐẠT: Click CTA hero cuộn mượt đến search panel mà không bị header che mất form tìm kiếm. |
| **SiteFooter** | Nền Ink (`#102D3B`), viền phân cách `border-top: 1px solid rgba(255, 255, 255, 0.12)`. Chia 2 cột điều hướng rõ ràng trên mobile, touch target từng link ≥ 40-44px. Khối `footer-note` viền vàng champagne và `footer-bottom` cân đối. | ĐẠT: Đủ 7 links hiện hữu, không có link chết hoặc link giả. |
| **Final CTA** | Thiết kế container bề mặt surface ấm áp (`#F5F3EE`) trước footer, viền mảnh, padding thoáng đãng. | ĐẠT: Chuyển nhịp êm đềm trước khi vào footer tối, không lấn át hero. |

---

## 2. Ảnh chụp nghiệm thu (10 Ảnh có Metadata)

Toàn bộ ảnh chụp được lưu trữ tại thư mục này với [metadata.json](./metadata.json):

1. **Header + Hero + Search lộ diện ở 5 Viewports**:
   - `p03-shell-hero-360.png` (360×740): scrollWidth = 360, imageFailures = 0.
   - `p03-shell-hero-390.png` (390×844): scrollWidth = 390, imageFailures = 0.
   - `p03-shell-hero-430.png` (430×932): scrollWidth = 430, imageFailures = 0.
   - `p03-shell-hero-768.png` (768×1024): scrollWidth = 768, imageFailures = 0.
   - `p03-shell-hero-1440.png` (1440×900): scrollWidth = 1440, imageFailures = 0.
2. **Mobile Menu Mở (`p03-mobile-menu-open-390.png`)**:
   - Viewport 390px: Danh sách liên kết rõ nét, nút CTA chiếm trọn bề ngang thuận tiện thao tác một tay.
3. **SiteFooter tại 390px và 1440px**:
   - `p03-footer-390.png` (390px): Brand lockup inverse, 2 cột điều hướng, khối triết lý và bản quyền.
   - `p03-footer-1440.png` (1440px): Bố cục 3 khối ngang cân đối, sang trọng.
4. **Short-height Mobile (`p03-short-height-390.png`)**:
   - Viewport 390×600: Thử nghiệm màn hình điện thoại chiều cao ngắn; search panel vẫn lộ diện phía dưới, không bị che mất.
5. **Zoom 200% CSS (`p03-zoom-200-1440.png`)**:
   - Viewport 1440px ở mức zoom 200%: Header, hero text và form điều khiển co giãn hoàn hảo, scrollWidth ≤ clientWidth (hoàn toàn không có thanh cuộn ngang).

---

## 3. Đo đạc Độ tương phản & Khả năng tiếp cận (WCAG 2 AA & AAA)

- **Chữ H1/Lead trên Hero Overlay:**
  - Chữ trắng `#FFFFFF` trên nền overlay Ink `#102D3B` (opacity 76%–92%): Tỉ lệ tương phản thực tế **11.8:1 (vượt chuẩn AAA 7:1)**.
  - Chữ nhấn `em` Warm Gold `#D8C49D` trên nền overlay: Tỉ lệ tương phản **7.8:1 (vượt chuẩn AAA)**.
- **Nút Hero CTA:**
  - Chữ trắng trên nền Deep Teal `#164B60`: Tương phản **7.35:1 (AAA)**.
- **Footer Links:**
  - Chữ `#D7DEDF` trên nền Ink `#102D3B`: Tương phản **10.5:1 (AAA)**; hover `#D8C49D`: **7.8:1 (AAA)**.
- **Bàn phím & Focus:**
  - Phím `Tab` di chuyển từ skip-link qua menu và vào search panel trơn tru.
  - Phím `Escape` đóng mobile menu và tự động trả focus về nút toggle.
  - Click CTA `#kham-pha` cuộn xuống form tìm kiếm với khoảng cách an toàn, không bị header che.

---

## 4. Kết quả Kiểm thử Tự động

- `pnpm lint`: **0 warning, 0 error** (đạt `--max-warnings=0`).
- `pnpm typecheck`: **Hoàn thành thành công** (`next typegen && tsc --noEmit`).
- `pnpm test`: **42/42 tests passed** (100% unit tests).
- `playwright test` (accessibility & journey): **22/22 tests passed** trên cả desktop-chromium và mobile-chromium.
- `git diff --check`: **Sạch 100%**, không có whitespace/EOF error.
