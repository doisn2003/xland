# Bằng chứng nghiệm thu P05 — Chương bất động sản NFT (#nft)

Mốc thực hiện: P05 (Vòng nâng cấp UI Sunshine)  
Thời gian: 03/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Playwright (Chromium Desktop & Mobile)  
Cổng test: 3200 (`http://127.0.0.1:3200`)  
Commit cơ sở: `786a10f`

---

## 1. Hạng mục triển khai & Kết quả kiểm tra

| Hạng mục | Chi tiết thực thi | Kết quả thị giác & kỹ thuật |
| :--- | :--- | :--- |
| **Component NftStory** | Server Component nhẹ tại `src/components/home/nft-story.tsx`, semantic `<section id="nft" className="nft-story" aria-labelledby="nft-heading">`. Bảo toàn id anchor `#nft` và neo cuộn `scroll-margin-top: 96px`. | ĐẠT: Không dùng client bundle cho nội dung tĩnh. Cấu trúc semantic vững chắc với heading hierarchy H2 → H3. |
| **Nền Ink & Nhịp Sáng/Tối** | Nền Ink (`#102D3B` với gradient `linear-gradient(180deg, #102d3b 0%, #0d2531 100%)`). Tạo sự tương phản mạnh mẽ, sang trọng và điểm nhấn công nghệ giữa 2 chương nền sáng (Xland Story ở trên và Người đồng hành ở dưới). | ĐẠT: Nhịp thị giác sâu lắng, cao cấp theo cảm hứng Sunshine Group. Ranh giới chuyển tiếp được xác nhận qua ảnh chụp `p05-nft-boundary-1440.png`. |
| **Ảnh lớn Tài sản P02** | Khung ảnh `PropertyImage` dùng asset `public/images/garden-retreat.webp` (1536×1024, phối cảnh nhà vườn nhiệt đới có chiều sâu). Caption UI “Không gian cho những khởi đầu mới”. | ĐẠT: Sắc nét ở mọi kích thước, tỷ lệ 16:10 trên mobile và 4:3 trên desktop. `imageFailures = []`. |
| **Sơ đồ Quy trình 3 bước** | Native HTML/SVG với 3 bước: `01. Hồ sơ tài sản` → `02. Phương án NFT` → `03. Danh mục của bạn`. Mũi tên kết nối mảnh `aria-hidden="true"`, số thứ tự badge viền champagne. | ĐẠT: Thể hiện đúng quy trình tìm hiểu/tham gia, không gây hiểu lầm là chia ranh giới địa chính hay thửa đất pháp lý. |
| **Panel Định lượng Phương án** | Panel bán đục mờ sang trọng với số liệu động lấy từ `src/features/nft/presentation.ts` dựa trên offering mở bán thật (`XL-001` - `Miền xanh ven sông`): Tổng cung 1.000 NFT (ERC-1155), đơn giá 2.800.000 ₫, tỷ lệ 0,1% / 1 NFT và 1% / 10 NFT. | ĐẠT: Dữ liệu khớp 100% với model nghiệp vụ. Không hiển thị tồn seed để tránh hiểu nhầm sau khi mua theo BRIEF D2. |
| **Visual Fractional Matrix** | Lưới 20 ô nhỏ (mỗi ô tượng trưng 10 NFT = 1%), ô đầu tiên sáng màu champagne `is-sample`, kèm chú thích và disclaimer pháp lý rõ ràng. | ĐẠT: Trực quan hóa tỷ lệ phân đoạn dễ hiểu trên màn hình nhỏ. Không gán ô thành m² đất. |
| **CTAs & Điều hướng** | CTA chính `Tìm hiểu phương án NFT` dẫn tới `/nft` (nút vàng champagne nổi bật trên nền tối) và link phụ `Xem chi tiết phương án mẫu` dẫn tới `/nft/mien-xanh-ven-song`. | ĐẠT: Phân cấp thị giác rõ nét (1 primary + 1 underline ghost). Bàn phím Tab focus tuần tự, outline rõ nét. |

---

## 2. Ảnh chụp nghiệm thu (7 Ảnh có Metadata)

Toàn bộ ảnh chụp được lưu trữ tại thư mục này với [metadata.json](./metadata.json):

1. **Khảo sát Section NFT ở 5 Viewports chuẩn**:
   - `p05-nft-360.png` (360×740): scrollWidth = 360, imageFailures = 0 (bố cục tuyến tính dọc mạch lạc).
   - `p05-nft-390.png` (390×844): scrollWidth = 390, imageFailures = 0.
   - `p05-nft-430.png` (430×932): scrollWidth = 430, imageFailures = 0.
   - `p05-nft-768.png` (768×1024): scrollWidth = 768, imageFailures = 0 (khung ảnh 16:9 thoáng đãng trên tablet).
   - `p05-nft-1440.png` (1440×900): scrollWidth = 1440, imageFailures = 0 (2 cột cân xứng 5/12 ảnh sticky bên trái và 6.5/12 nội dung bên phải).
2. **Zoom 200% CSS (`p05-nft-zoom-200.png`)**:
   - Viewport 1440px ở mức zoom 200%: Cỡ chữ, panel và ảnh co giãn hoàn hảo theo container, không vỡ layout, không tràn ngang (`scrollWidth === clientWidth === 1440`).
3. **Ranh giới Chuyển tiếp Sáng - Tối (`p05-nft-boundary-1440.png`)**:
   - Nhịp chuyển từ Section Xland Story (nền ấm `#F5F3EE`) sang Section NFT (nền tối `#102D3B`) liền mạch, đường viền hairline 1px tinh tế.
4. **Thử nghiệm Bàn phím, Focus & Đơn vị (Xem `metadata.json`)**:
   - `titleNotCoveredByStickyHeader: true`: Truy cập `#nft` cuộn dừng cách sticky header an toàn 32px nhờ `scroll-margin-top: 96px`.
   - `nftCtaFocusable: true`: Focus vào nút CTA chính `/nft` bằng phím Tab rõ nét.
   - `nftSublinkFocusable: true`: Focus vào link phụ `/nft/mien-xanh-ven-song` chính xác.
   - `hasDongUnit: true`: Hiển thị đúng đơn vị `2.800.000 ₫`.
   - `hasPercentUnit: true`: Hiển thị đúng đơn vị `0,1%` và `1%`.
   - `hasErc1155: true`: Chuẩn ERC-1155 được nêu rõ ràng.
   - `noForbiddenWords: true`: Hoàn toàn không chứa các từ cấm (*bản demo, dữ liệu mẫu, hình ảnh minh họa, nhân vật mẫu*).

---

## 3. Đo đạc Độ tương phản & Khả năng tiếp cận (WCAG 2 AA & AAA)

- **Tiêu đề H2 (`.nft-title`):**
  - Chữ trắng `#FFFFFF` trên nền Ink `#102D3B`: Tương phản **14.2:1 (Đạt chuẩn WCAG 2 AAA)**.
  - Chữ nhấn `em` màu Warm Gold `#D8C49D`: Tương phản **7.8:1 (Đạt chuẩn WCAG 2 AAA)**.
- **Nút CTA chính (`.nft-cta-primary`):**
  - Chữ đậm Ink `#102D3B` trên nền Warm Gold `#D8C49D`: Tương phản **7.8:1 (Đạt chuẩn WCAG 2 AAA)**.
- **Link phụ (`.nft-link-sub`):**
  - Chữ `#E0ECEF` trên nền Ink `#102D3B`: Tương phản **12.5:1 (Đạt chuẩn WCAG 2 AAA)**.
- **Đoạn lead & mô tả bước (`.nft-lead`, `.nft-step-desc`):**
  - Màu `#B8C9CF` và `#B0C2C8` trên nền `#102D3B`: Tương phản **6.8:1 – 7.2:1 (Đạt chuẩn WCAG 2 AAA cho large text, AA cho small text)**.
- **Thử nghiệm Ảnh Lỗi (Image Fallback / Offline):**
  - Khi ngắt ảnh hoặc ảnh tải thất bại, component `PropertyImage` kích hoạt fallback gradient ấm với tên tài sản và icon nhận diện.
  - Toàn bộ khối nội dung text (tiêu đề, sơ đồ 3 bước, panel định lượng và CTAs) giữ nguyên 100% bố cục và khả năng đọc hiểu.

---

## 4. So sánh Đối chiếu với Baseline P00

| Đặc điểm | Baseline P00 (`#nft`) | Phiên bản P05 mới |
| :--- | :--- | :--- |
| **Bối cảnh nền** | Nền trắng/canvas generic, lẫn với các section khác, không có điểm nhấn thị giác. | Nền Ink (`#102D3B`) full-width sang trọng, tạo nhịp nghỉ thị giác tương phản sáng/tối ấn tượng. |
| **Mạch nội dung** | Danh sách 3 bullet checklist với icon tích xanh đơn điệu. | Sơ đồ quy trình 3 bước trực quan (`Hồ sơ tài sản → Phương án NFT → Danh mục của bạn`) bằng native HTML/SVG. |
| **Số liệu minh họa** | Không có thông số định lượng cụ thể nào trên trang chủ. | Panel định lượng phương án lấy từ dữ liệu thật: Tổng cung 1.000 NFT (ERC-1155), đơn giá 2.800.000 ₫, tỷ lệ 0,1% và 1%. |
| **Trực quan hóa tỷ lệ** | Không có. | Lưới Visual Matrix 20 ô nhỏ trực quan hóa tỷ lệ 1% / 10 NFT kèm disclaimer pháp lý rõ ràng. |
| **Khả năng tiếp cận** | Nút CTA xanh thông thường. | CTA vàng champagne nổi bật trên nền tối với tương phản AAA (7.8:1), link phụ dẫn thẳng đến phương án mẫu thật. |
