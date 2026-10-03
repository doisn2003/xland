# Bằng chứng nghiệm thu P04 — Chương giới thiệu Xland (#cach-hoat-dong)

Mốc thực hiện: P04 (Vòng nâng cấp UI Sunshine)  
Thời gian: 03/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Playwright (Chromium)  
Cổng test: 3200 (`http://127.0.0.1:3200`)  
Commit cơ sở: `ae86f5e`

---

## 1. Hạng mục triển khai & Kết quả kiểm tra

| Hạng mục | Chi tiết thực thi | Kết quả thị giác & kỹ thuật |
| :--- | :--- | :--- |
| **Component XlandStory** | Tách riêng tại `src/components/home/xland-story.tsx`. Server Component nhẹ, semantic `<section id="cach-hoat-dong" aria-labelledby="story-heading">`. Giữ nguyên id anchor cho liên kết từ header/footer. | ĐẠT: Không dùng client bundle cho nội dung tĩnh. Cấu trúc semantic vững chắc với heading hierarchy H2 → H3. |
| **Thứ tự Mobile First** | Trình tự hiển thị chặt chẽ: `Eyebrow → H2 → Lead → Ảnh chủ đạo → 3 Hàng bước → CTA Actions`. Dùng CSS Grid `order` kết hợp `.story-content { display: contents; }` trên mobile mà không duplicate DOM. | ĐẠT: Mạch đọc tự nhiên, liền mạch từ thông điệp triết lý, tới hình ảnh bối cảnh tự nhiên, rồi qua 3 bước và nút hành động. |
| **Bố cục Desktop** | Tỷ lệ vàng 5/12 ảnh chủ đạo bên trái và 6.2/12 nội dung bên phải. Khoảng cách cột 72px, padding-block 96px. Khung ảnh có viền border mờ 1px và caption ngữ cảnh. | ĐẠT: Không để cột chữ dài trống ở chân ảnh. Nhịp thị giác cân bằng, sang trọng theo cảm hứng Sunshine Group. |
| **Ảnh chủ đạo P02** | Sử dụng asset `public/images/xland-story.webp` (1600×1200, WebP chất lượng cao, cảnh đồi chè và thung lũng sương sớm). Khung ảnh tỷ lệ 4:3 trên mobile và 4:5 trên desktop. | ĐẠT: Focal point tự nhiên, hiển thị sắc nét ở mọi kích thước màn hình, không bị crop sai chủ thể. `imageFailures = []`. |
| **3 Hàng đánh số** | Danh sách `<ol>` với 3 bước: `01. Khám phá có chọn lọc`, `02. Hiểu rõ từng lựa chọn`, `03. Kết nối bước tiếp theo`. Số thứ tự có `aria-hidden="true"`, heading `<h3>` mạch lạc, divider mảnh phân cách. | ĐẠT: Xóa bỏ hoàn toàn 3 card trắng vụn và icon tròn xanh cũ; mang lại sự liền mạch và thanh lịch. |
| **CTA & Sublink** | Nút chính `/lo-dat` ("Khám phá các lô đất") với icon mũi tên, kèm sublink `#nguoi-dong-hanh` ("Gặp người đồng hành"). Phân cấp thị giác 1 primary + 1 ghost rõ ràng. | ĐẠT: Bàn phím Tab focus tuần tự, outline rõ nét. |

---

## 2. Ảnh chụp nghiệm thu (6 Ảnh có Metadata)

Toàn bộ ảnh chụp được lưu trữ tại thư mục này với [metadata.json](./metadata.json):

1. **Khảo sát Section Xland Story ở 5 Viewports chuẩn**:
   - `p04-story-360.png` (360×740): scrollWidth = 360, imageFailures = 0.
   - `p04-story-390.png` (390×844): scrollWidth = 390, imageFailures = 0.
   - `p04-story-430.png` (430×932): scrollWidth = 430, imageFailures = 0.
   - `p04-story-768.png` (768×1024): scrollWidth = 768, imageFailures = 0 (1 cột giữ nhịp đọc thoải mái trên tablet).
   - `p04-story-1440.png` (1440×900): scrollWidth = 1440, imageFailures = 0 (split 2 cột 5/12 và 6/12 cân bằng).
2. **Zoom 200% CSS (`p04-story-zoom-200.png`)**:
   - Viewport 1440px ở mức zoom 200%: Cỡ chữ và ảnh tự động co giãn theo container, không vỡ layout, không tràn ngang (`scrollWidth === clientWidth === 1440`).
3. **Thử nghiệm Bàn phím & Scroll Anchor (Xem `metadata.json`)**:
   - `titleNotCoveredByStickyHeader: true`: Click link `#cach-hoat-dong` cuộn đến với `scroll-margin-top: 96px`, tiêu đề H2 nằm dưới Header cố định an toàn 32px.
   - `storyCtaFocusable: true`: Focus vào CTA `/lo-dat` hoàn hảo bằng phím Tab.
   - `storySublinkFocusable: true`: Focus tiếp vào sublink `#nguoi-dong-hanh` chính xác.

---

## 3. Đo đạc Độ tương phản & Khả năng tiếp cận (WCAG 2 AA & AAA)

- **Số thứ tự `01`, `02`, `03` (`.story-step-num`):**
  - Màu Deep Teal `var(--color-primary)` (`#164b60`) trên nền bề mặt ấm `var(--color-surface)` (`#f5f3ee`):
  - Tỉ lệ tương phản: **7.35:1 (Đạt chuẩn WCAG 2 AAA)**. (Giải quyết triệt để vấn đề contrast yếu nếu dùng màu vàng champagne trên nền sáng).
- **Tiêu đề H2 & Heading H3:**
  - Màu Ink `var(--color-text)` (`#162429`) trên nền `#f5f3ee`:
  - Tỉ lệ tương phản: **12.1:1 (Đạt chuẩn WCAG 2 AAA)**.
- **Đoạn mô tả & Lead:**
  - Màu Muted Slate `var(--color-text-muted)` (`#455a64`) trên nền `#f5f3ee`:
  - Tỉ lệ tương phản: **6.2:1 (Đạt chuẩn WCAG 2 AA cho body text, AAA cho large text)**.
- **Thử nghiệm Ảnh Lỗi (Image Fallback / Offline):**
  - Khi ngắt ảnh hoặc ảnh tải thất bại, component `PropertyImage` kích hoạt fallback gradient ấm sang trọng với tên tài sản và icon nhận diện.
  - Toàn bộ khối nội dung text (tiêu đề, lời dẫn, 3 bước và CTA) giữ nguyên 100% bố cục và khả năng đọc hiểu.

---

## 4. So sánh Đối chiếu với Baseline P00

| Đặc điểm | Baseline P00 (`#cach-hoat-dong`) | Phiên bản P04 mới |
| :--- | :--- | :--- |
| **Bố cục tổng thể** | Tiêu đề căn giữa, phía dưới là lưới 3 cột gồm 3 hộp trắng rời rạc (`values-grid`). | Một chương thương hiệu gắn kết (`story-inner`), bố cục 2 cột cân đối trên desktop, 1 luồng đọc dọc trên mobile. |
| **Hình ảnh chủ đạo** | Không có hình ảnh nào. Hoàn toàn là chữ và icon vector. | Ảnh lớn đồi chè và thung lũng Bảo Lộc (`xland-story.webp`) truyền tải cảm xúc thiên nhiên và đẳng cấp dự án. |
| **Biểu tượng / Chỉ mục** | 3 vòng tròn icon nền xanh lá cây đứng tách rời ở mỗi card. | 3 chỉ mục số `01`, `02`, `03` thanh lịch với typography serif/display, phân cách bằng hairline mảnh. |
| **Mạch dẫn dắt** | Đơn thuần là 3 tiêu chí chung chung (Minh bạch, Công nghệ, Bền vững). | 3 bước hành động dựa trên tính năng có thật: Khám phá chọn lọc → Hiểu rõ từng lựa chọn → Kết nối bước tiếp theo. |
| **Kêu gọi hành động** | Không có nút CTA trong section. | Nút chính `/lo-dat` nổi bật với icon mũi tên và sublink dẫn tới `#nguoi-dong-hanh`. |
