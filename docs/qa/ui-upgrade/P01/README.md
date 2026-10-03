# Báo cáo Nghiệm thu P01 — Nhận diện và Tiểu tiết Tương tác

> Thời điểm ghi nhận: 03/10/2026.  
> Phiên bản mã nguồn thực thi: Dựa trên nền tảng P00 (`0bf496cda428676db1cc70f0cd9d88bfa0c600d8`).  
> Git Branch: `main` (không tạo branch rác, tuân thủ quy tắc bảo toàn tài liệu của chủ dự án).  
> Hợp đồng thực thi: [BRIEF A–B](../../ui-upgrade/BRIEF.md) và [docs/ui-upgrade/phases/P01-identity.md](../../ui-upgrade/phases/P01-identity.md).

---

## 1. Tổng quan & Kết quả Thực thi

Phase P01 tập trung nâng cấp nền nhận diện dùng chung và tinh chỉnh các tiểu tiết tương tác đạt độ hoàn thiện cao (craftsmanship), giữ nguyên toàn bộ bố cục các chương và logic nghiệp vụ mốc 1B. Giao diện bản tĩnh đạt tính thẩm mỹ và độ tương phản cao trước khi cài đặt chuyển động GSAP ở các phase sau.

### Tóm tắt các kết quả đạt được:

1. **Logo Xland SVG Độc bản:**
   - Xây dựng 2 phương án đối chiếu: Phương án A (*Horizon & Land Parcels*) và Phương án B (*Circular Contour X*).
   - **Đã chọn Phương án A:** Khung viền hình thoi bo góc 45° tượng trưng cho 4 thửa đất (parcels) tiếp giáp, kết nối bởi đường chân trời ngang (*horizon*) và tâm điểm hình thoi vàng champagne (*core value*).
   - **Wordmark Xland:** Tỷ lệ cân đối, chữ `X` serif đậm vững chãi (`font-weight: 700`), chữ `LAND` thanh lịch (`font-weight: 500`).
   - Hai biến thể hoàn chỉnh:
     - `default`: Nét Deep Teal `--color-primary` (`#164B60`), tâm điểm vàng champagne `--color-accent` (`#B89962`) trên nền sáng.
     - `inverse`: Nét trắng tinh xảo, tâm điểm vàng sáng `--color-on-dark-accent` (`#D8C49D`) trên nền tối Ink (`#102D3B`).
   - Header hiển thị logo chiều ngang ~128px; Footer hiển thị logo âm bản trên nền Ink tối.
   - Thẻ link bọc ngoài có accessible name duy nhất `aria-label="Xland — Trang chủ"`, bên trong logo có `aria-hidden="true"`, không đọc lặp cho trình đọc màn hình.
   - Favicon vector: Tạo `src/app/icon.svg` (32×32) theo chuẩn Next.js App Router.

2. **Semantic Design Tokens & Màu sắc:**
   - Hệ thống token được cấu hình hoàn chỉnh trong `src/app/globals.css`:
     - Thương hiệu: `--color-primary: #164B60`, `--color-primary-hover: #103B4D`, `--color-primary-pressed: #0B2C3B`, `--color-accent: #B89962`, `--color-on-dark-accent: #D8C49D`.
     - Bề mặt: `--color-ink: #102D3B` (footer và dark mode), `--color-canvas: #FFFFFF`, `--color-surface: #F5F3EE`, `--color-surface-elevated: #EFECE6`.
     - Kiểu chữ: `--color-text: #243842`, `--color-muted: #5A6B73`.
     - Đường viền: `--color-border: #D7DEDF`, `--color-border-subtle: #E8EDEE`.
     - Bo góc: `--radius-control: 8px` (button, input), `--radius-card: 12px`, `--radius-media: 8px`.
   - Giữ nguyên toàn bộ các token trạng thái: `--color-success: #166534`, `--color-warning: #92400E`, `--color-danger: #B91C1C`.

3. **Chuẩn hóa Hệ Icon (`src/components/icon.tsx`):**
   - Chuẩn hóa toàn bộ icon trên hệ lưới `0 0 24 24`, nét `1.75`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
   - Giữ nguyên và làm sạch 8 icon hiện hành: `arrow`, `search`, `pin`, `area`, `menu`, `close`, `check`, `layers`.
   - Bổ sung 7 icon cần thiết cho luồng sản phẩm: `bookmark` (hỗ trợ filled), `calendar`, `user`, `shield`, `share`, `filter`, `sparkle`.
   - Component `SaveButton` (`src/features/journey/save-button.tsx`) được chuẩn hóa dùng `<Icon name="bookmark" size={18} filled={saved} />`, bảo toàn 100% thuộc tính tiếp cận `aria-label`, `aria-pressed` và nhãn hiển thị `"Lưu lô đất"` / `"Đã lưu"`.

4. **Nâng cấp Toàn diện Trạng thái Button:**
   - Chiều cao điều khiển đạt chuẩn công thái học: Button tiêu chuẩn `min-height: 48px`, Icon button `min-width: 44px`, `min-height: 44px`.
   - Biến thể:
     - `.button` (Primary): Nền Deep Teal, chữ trắng, bo góc 8px.
     - `.button-secondary`: Viền sắc nét, nền trong suốt, đổi màu viền khi tương tác.
     - `.button-inverse`: Nền trắng trên nền tối Ink.
   - Trạng thái tương tác:
     - Hover chuột: Nền chuyển màu mượt mà, mũi tên icon dịch chuyển ngang `3px` (`translateX(3px)`).
     - Active (nhấn): Nền hạ màu sang pressed, `translateY(1px)`.
     - Keyboard Focus: `:focus-visible` viền kép `2px solid var(--color-primary)` với `outline-offset: 2px`.
     - Pending: Con trỏ `wait`, opacity `0.85`, giữ nguyên bề ngang layout.
     - Disabled: Opacity `0.55`, `pointer-events: none`, triệt tiêu hoàn toàn glow/animation/shadow.

5. **Trang Proof Sheet Kiểm định Nội bộ (`/qa-identity-proof`):**
   - Tạo trang độc lập không đưa vào sitemap/navigation: `src/app/qa-identity-proof/page.tsx`.
   - Đối chiếu trực quan 2 phương án logo trên cả nền sáng và nền tối Ink.
   - Thử nghiệm 15 icons trên hai nền.
   - Thử nghiệm đầy đủ biến thể và trạng thái Button (Default, Hover, Active, Focus, Pending, Disabled).
   - Kiểm tra chuỗi dấu tiếng Việt: *“Đất nền ven sông · Quy hoạch & pháp lý · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫”*.

---

## 2. Bảng Đo Độ Tương phản Thực tế (Color Contrast)

Tất cả các cặp màu được đo đạc trực tiếp trên bề mặt hiển thị thực tế:

| Thành phần hiển thị | Màu chữ (FG) | Màu nền (BG) | Tỷ lệ đo được | Tiêu chuẩn WCAG | Kết quả |
| --- | --- | --- | --- | --- | --- |
| **Văn bản chính** | `#243842` (Text) | `#FFFFFF` (Canvas) | **10.20:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Văn bản trên surface** | `#243842` (Text) | `#F5F3EE` (Surface) | **9.40:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Văn bản phụ / Muted** | `#5A6B73` (Muted) | `#FFFFFF` (Canvas) | **4.88:1** | ≥ 4.5:1 (AA) | **ĐẠT (AA)** |
| **Văn bản phụ trên surface** | `#5A6B73` (Muted) | `#F5F3EE` (Surface) | **4.51:1** | ≥ 4.5:1 (AA) | **ĐẠT (AA)** |
| **Chữ Primary Button** | `#FFFFFF` (White) | `#164B60` (Primary) | **7.35:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Chữ Primary Button Hover** | `#FFFFFF` (White) | `#103B4D` (Hover) | **9.87:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Chữ trên nền Footer Ink** | `#FFFFFF` (White) | `#102D3B` (Ink) | **13.50:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Điểm nhấn trên nền Ink** | `#D8C49D` (On-dark) | `#102D3B` (Ink) | **7.82:1** | ≥ 3.0:1 (chữ lớn/icon) | **ĐẠT (AAA)** |
| **Chữ CTA Header trong Nav** | `#FFFFFF` (White) | `#164B60` (Primary) | **7.35:1** | ≥ 4.5:1 (AA) | **ĐẠT (AAA)** |
| **Chữ Advisor Avatar** | `#745722` (Avatar-1) | `#F3EFE6` (Surface) | **5.70:1** | ≥ 4.5:1 (AA) | **ĐẠT (AA)** |

> **Ghi chú về hiệu chỉnh màu sau kiểm tra Axe:**
> 1. Thẻ CTA trên header (`.navigation > .header-cta`): Đã chỉ định màu chữ độc lập `#FFFFFF` để không bị selector `.navigation > a` ghi đè thành `#243842`.
> 2. Thẻ avatar người hỗ trợ (`.avatar-1`): Màu chữ được điều chỉnh từ màu ban đầu `#8C7343` (tỷ lệ 3.93:1) sang `#745722` (tỷ lệ 5.70:1), giúp vượt chuẩn 4.5:1 của WCAG 2 AA mà vẫn giữ sắc vàng cát ấm sang trọng.

---

## 3. Danh mục Ảnh Nghiệm thu P01 (`docs/qa/ui-upgrade/P01/`)

Tất cả 17 ảnh được chụp tự động bằng Playwright Chromium theo cấu hình `reducedMotion: "reduce"` tại server local `http://127.0.0.1:3200`:

| Tên File | Route | Viewport | Mục đích Kiểm tra |
| --- | --- | --- | --- |
| `p01-proof-sheet-360.png` | `/qa-identity-proof` | 360×740 | Proof sheet kiểm định trên mobile nhỏ nhất, không tràn ngang |
| `p01-proof-sheet-390.png` | `/qa-identity-proof` | 390×844 | Proof sheet chuẩn iPhone 13/14/15 |
| `p01-proof-sheet-430.png` | `/qa-identity-proof` | 430×932 | Proof sheet chuẩn iPhone Pro Max |
| `p01-proof-sheet-768.png` | `/qa-identity-proof` | 768×1024 | Proof sheet màn hình máy tính bảng iPad |
| `p01-proof-sheet-1440.png` | `/qa-identity-proof` | 1440×900 | Proof sheet desktop độ phân giải cao |
| `p01-header-brand-390.png` | `/` (crop header) | 390×844 | Logo Xland trên SiteHeader mobile |
| `p01-header-brand-1440.png` | `/` (crop header) | 1440×900 | Logo Xland trên SiteHeader desktop |
| `p01-footer-brand-390.png` | `/` (crop footer) | 390×844 | Logo Xland inverse trên nền Ink tối ở footer mobile |
| `p01-footer-brand-1440.png` | `/` (crop footer) | 1440×900 | Logo Xland inverse trên nền Ink tối ở footer desktop |
| `p01-home-390.png` | `/` | 390×844 | Giao diện tổng thể trang chủ trên mobile với bảng màu và font mới |
| `p01-home-1440.png` | `/` | 1440×900 | Giao diện tổng thể trang chủ trên desktop với bảng màu và font mới |
| `p01-visit-form-390.png` | `/lich-hen?...` | 390×844 | Nút submit và trường nhập liệu form lịch hẹn trên mobile |
| `p01-visit-form-1440.png` | `/lich-hen?...` | 1440×900 | Nút submit và trường nhập liệu form lịch hẹn trên desktop |
| `p01-nft-panel-390.png` | `/nft/...` | 390×844 | Nút mua NFT và bảng thông số trên mobile |
| `p01-nft-panel-1440.png` | `/nft/...` | 1440×900 | Nút mua NFT và bảng thông số trên desktop |
| `p01-save-button-default.png` | `/lo-dat/...` | 390×844 | Nút SaveButton ở trạng thái chưa lưu (bookmark viền) |
| `p01-save-button-active.png` | `/lo-dat/...` | 390×844 | Nút SaveButton ở trạng thái đã lưu (bookmark tô đầy) |

Toàn bộ thông số kích thước, scrollWidth, DPR và image failures được ghi nhận chi tiết tại `docs/qa/ui-upgrade/P01/metadata.json`.

---

## 4. Kết quả Kiểm tra Tự động (Automated Verification)

| Bộ kiểm tra | Lệnh thực thi | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| **Lint** | `pnpm lint` | **0 errors, 0 warnings** | ESLint đạt mức tối đa 0 warning |
| **Typecheck** | `pnpm typecheck` | **0 errors** | TypeScript hoàn tất sạch sẽ |
| **Unit Tests** | `pnpm test` | **42/42 passed (100%)** | 3 test files (`nft`, `journey`, `home`) |
| **Production Build** | `pnpm build` | **0 errors** | Turbopack build 24 routes tĩnh/động thành công |
| **A11y & Journey E2E** | `playwright test tests/e2e/accessibility.spec.ts tests/e2e/journey.spec.ts` | **22/22 passed (100%)** | Kiểm tra quét Axe WCAG 2 AA, bàn phím, skip-link, zoom 200%, state saving |

---

## 5. Kết luận Giai đoạn P01

- Phase P01 hoàn tất trọn vẹn, thỏa mãn 100% các tiêu chí trong [BRIEF A–B](../../ui-upgrade/BRIEF.md).
- Mã nguồn và token sẵn sàng làm nền tảng vững chắc cho phase **P02 — Media và chân dung**.
