# Bằng chứng nghiệm thu P06 — Tính nhất quán thị giác và hoàn thiện người đồng hành

Mốc thực hiện: **P06 (Consistency & Persona Polish)** — Chia 2 lượt: Lượt A (Chuyên viên, Card, Detail) và Lượt B (Màn hình & Trạng thái 1B)  
Thời gian: 04/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Vitest, Playwright E2E (Chromium Desktop & Mobile)  
Commit cơ sở: `e4e6631` (sau P05)  
Kết quả tự động: **54/54 tests E2E PASSED (100%)**, **43/43 unit tests PASSED**, **25/25 routes build thành công**, **lint 0 warning**, **typecheck 0 error**.

---

## 1. Tổng quan hai lượt thực thi

### LƯỢT A — CHUYÊN VIÊN, CARD, DETAIL
1. **Chuyên viên Home (`#nguoi-dong-hanh`)**:
   - Sử dụng ảnh chân dung tỉ lệ 4:5 (`Avatar size="portrait"` 140×175px) đã chuẩn bị từ P02 với ánh sáng ấm, tông màu đồng nhất.
   - Bố cục responsive: Thẻ ngang trên mobile (chân dung bên trái, tên font serif và CTA bên phải), thẻ dọc 3 cột trên tablet/desktop.
   - Nút liên hệ/trao đổi dẫn trực tiếp đến `/lo-dat/<slug>#ho-tro` của lô đất mà chuyên viên phụ trách.
   - Bảo toàn initials fallback theo chủ đề màu sắc (`MA`, `HN`, `TH`, `NL`) khi ảnh chưa tải hoặc tải lỗi.
2. **Property Card (`components/property-card.tsx`)**:
   - Khung ảnh tỷ lệ 4:3, bo góc `var(--radius-card)`.
   - Dải `card-meta-top` kết hợp loại đất in hoa bên trái và `SaveButton` 44px bên phải, tách biệt hoàn toàn khỏi anchor link, giữ nguyên `aria-label` và `aria-pressed`.
   - Tên tài sản dùng font serif display sang trọng, giá chào to rõ 22px (`strong`) kèm đơn vị "tỷ đ", nút tròn điều hướng 44×44px touch target.
   - Hover mượt mà chỉ kích hoạt trên con trỏ chính xác (`@media (hover: hover)`), tỉ lệ scale nhẹ 1.03 không cắt focus ring.
3. **Detail Page (`app/lo-dat/[slug]/page.tsx` & `property-gallery.tsx`)**:
   - Khối hỗ trợ `#ho-tro`: Dùng `Avatar size="portrait"` với bố cục thông thoáng, tên chuyên viên nổi bật, lời giới thiệu đầu mối ấm áp.
   - Khối summary bên phải: Giữ `Avatar size="sm"` cho tóm tắt gọn gàng, nút lưu 100% chiều rộng.
   - Gallery ảnh: Giữ nguyên các nút chuyển ảnh accessible (`Ảnh trước`, `Ảnh tiếp theo`), thumbnails chuyển đổi mượt mà.

### LƯỢT B — MÀN HÌNH VÀ TRẠNG THÁI HIỆN CÓ
1. **Đồng bộ Typography & Panel toàn hệ thống**:
   - Tiêu đề H1, H2 của các trang `/lo-dat`, `/da-luu`, `/lich-hen`, `/nft`, `/nft/[slug]`, `/danh-muc-nft`, `/trai-nghiem` được áp dụng font serif display (`font-family: var(--font-display)`), tạo nhịp điệu thương hiệu cao cấp thống nhất từ ngoài vào trong.
   - Panel giao dịch (`.journey-panel`, `.visit-card`, `.nft-purchase`, `.nft-holding`, `.nft-portfolio-summary`): Nền trắng/surface sang trọng, viền mảnh `var(--color-border)`, đổ bóng tinh tế `var(--shadow-subtle)` / `var(--shadow-card)`.
2. **Breadcrumb & Empty States**:
   - Thêm styling chuẩn cho `.breadcrumb`: Phân cấp rõ ràng giữa liên kết và mục hiện tại.
   - Thiết kế lại `.empty-state` và `.nft-empty`: Nền `var(--color-surface)` ấm áp, viền đứt đoạn trang nhã, tiêu đề serif và nút CTA dẫn đường rõ ràng.
3. **Các luồng nghiệp vụ 1B bảo toàn 100%**:
   - **Catalog (`/lo-dat`)**: Giữ nguyên URL filter, danh mục phân loại có số lượng (`Tất cả`, `Đô thị`, `Vùng ven`, `Vùng quê`), sắp xếp giá/diện tích, trạng thái `pending`.
   - **Đã lưu (`/da-luu`)**: Badge số lượng `.saved-count` dạng pill nổi bật; xử lý êm trạng thái storage warning.
   - **Lịch hẹn (`/lich-hen`)**: Liên kết form field/error với `aria-describedby` và `aria-invalid`, bảo toàn persona người đề nghị ("Đinh Duy"), trạng thái đổi/hủy giữ đúng quy trình "Chờ điều phối" không hứa hẹn sai.
   - **Bất động sản NFT (`/nft`, `/nft/[slug]`, `/danh-muc-nft`)**: Bảng tính số lượng, tỷ lệ phân đoạn, đơn vị tiền tệ rõ ràng, phân biệt rạch ròi giữa các outcome `success`, `cancelled`, `failed`. Nhãn lưu ý không phát sinh thanh toán hiển thị rõ nét với độ tương phản cao.
   - **Cài đặt trải nghiệm (`/trai-nghiem`)**: Nút đặt lại hành trình với xác nhận an toàn 2 bước đúng namespace.

---

## 2. Ma trận Route / State và Ảnh chụp Nghiệm thu (18 Ảnh)

Toàn bộ ảnh chụp được lưu trữ tại thư mục này kèm theo file [metadata.json](./metadata.json):

| STT | File ảnh | Route / Section | Viewport | Trạng thái hiển thị |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `p06-advisors-home-360.png` | `/#nguoi-dong-hanh` | 360×740 | Chuyên viên Home mobile thẻ ngang, portrait 4:5 sắc nét |
| 2 | `p06-advisors-home-390.png` | `/#nguoi-dong-hanh` | 390×844 | Chuyên viên Home mobile tiêu chuẩn, tên serif + CTA |
| 3 | `p06-advisors-home-430.png` | `/#nguoi-dong-hanh` | 430×932 | Chuyên viên Home màn hình lớn, typography thoáng |
| 4 | `p06-advisors-home-768.png` | `/#nguoi-dong-hanh` | 768×1024 | Chuyên viên Home tablet 3 cột cân xứng |
| 5 | `p06-advisors-home-1440.png` | `/#nguoi-dong-hanh` | 1440×900 | Chuyên viên Home desktop thẻ dọc cao cấp |
| 6 | `p06-advisors-zoom200.png` | `/#nguoi-dong-hanh` | 1440 (zoom 200%) | Không vỡ khung, font và ảnh co giãn chuẩn container |
| 7 | `p06-card-grid-390.png` | `/#kham-pha` | 390×844 | Lưới card mobile: ảnh 4:3, meta top, giá 22px, nút tròn 44px |
| 8 | `p06-card-grid-1440.png` | `/#kham-pha` | 1440×900 | Lưới card desktop 3 cột: badge NFT, trạng thái giới thiệu |
| 9 | `p06-detail-support-390.png` | `/lo-dat/...#ho-tro` | 390×844 | Khối hỗ trợ detail mobile với ảnh portrait chuyên viên |
| 10 | `p06-detail-support-1440.png`| `/lo-dat/...#ho-tro` | 1440×900 | Khối hỗ trợ detail desktop: portrait + mô tả đầu mối |
| 11 | `p06-saved-empty-390.png` | `/da-luu` | 390×844 | Màn hình Đã lưu: Empty state với viền nét đứt sang trọng |
| 12 | `p06-saved-populated-1440.png`| `/da-luu` | 1440×900 | Màn hình Đã lưu: Badge saved-count + lưới card đã lưu |
| 13 | `p06-visit-form-390.png` | `/lich-hen?lo=...` | 390×844 | Form đặt lịch xem thực địa trên mobile |
| 14 | `p06-visit-list-1440.png` | `/lich-hen` | 1440×900 | Danh sách lịch hẹn đã có với các status badge |
| 15 | `p06-nft-detail-390.png` | `/nft/...` | 390×844 | Chi tiết phương án NFT + Purchase panel mobile |
| 16 | `p06-nft-detail-1440.png` | `/nft/...` | 1440×900 | Chi tiết phương án NFT + Purchase panel sticky desktop |
| 17 | `p06-nft-portfolio-1440.png`| `/danh-muc-nft` | 1440×900 | Danh mục NFT: Thống kê tổng quan & Lịch sử yêu cầu |
| 18 | `p06-experience-reset-390.png`| `/trai-nghiem` | 390×844 | Panel đặt lại trải nghiệm với xác nhận an toàn |

---

## 3. Kết quả Kiểm thử Tự động (Automated Verification)

- **Vitest Unit Tests**: `3/3 test files passed, 43/43 tests passed (100%)`.
- **Next.js Production Build**: `25/25 routes static/dynamic compiled successfully`.
- **ESLint & TypeScript**: `0 error, 0 warning`.
- **Playwright E2E Suite**: `54/54 tests passed across desktop-chromium and mobile-chromium`:
  - `accessibility.spec.ts`: Đạt kiểm tra a11y tại 390px, 1440px, keyboard skip link, zoom 200%.
  - `catalog.spec.ts`: Đạt lọc danh mục, URL query, chi tiết 7 bất động sản mới.
  - `journey.spec.ts`: Đạt lưu card/detail chia sẻ tab/reload, đặt/đổi/hủy lịch hẹn không tự động hứa hẹn, phục hồi storage lỗi.
  - `nft.spec.ts`: Đạt mua/hủy/lỗi NFT demo, quota remaining, portfolio ledger, reset đúng namespace.
  - `scaffold.spec.ts`: Đạt ngữ nghĩa tiếng Việt, responsive 5 kích thước, reduced motion.

---

## 4. Kết luận

Phase P06 đã hoàn thành trọn vẹn cả 2 lượt:
1. **Lượt A**: Tinh chỉnh toàn diện hình tượng người đồng hành bằng ảnh chân dung portrait 4:5 sắc nét, đồng bộ thiết kế card bất động sản và khối hỗ trợ trang chi tiết.
2. **Lượt B**: Lan tỏa đồng bộ ngôn ngữ thiết kế mới (typography display serif, breadcrumb, empty states, input controls, panels) vào toàn bộ các màn hình nghiệp vụ 1B mà không làm thay đổi hay phá vỡ bất kỳ logic/state/model nào.
