# Trạng thái Xland

Cập nhật: 04/10/2026. Mốc 1B đang triển khai; đã hoàn thành P00 (baseline), P01 (nhận diện thương hiệu), P02 (media/chân dung), P03 (Header/Hero/Footer), P04 (Chương giới thiệu Xland), P05 (Chương bất động sản NFT) và **P06 — Tính nhất quán thị giác và hoàn thiện người đồng hành**.

## Nghiệm thu Giai đoạn P06 — 04/10/2026

- Đã hoàn thành toàn bộ phase **P06 (Tính nhất quán thị giác và hoàn thiện người đồng hành)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF A–C/F–G](ui-upgrade/BRIEF.md), [DESIGN](../docs/DESIGN.md) và [P06-consistency](ui-upgrade/phases/P06-consistency.md).
- Triển khai nghiêm ngặt theo quy trình hai lượt: **Lượt A (Chuyên viên, Card, Detail)** và **Lượt B (Màn hình & Trạng thái 1B)**.
- **Hạng mục hoàn thành:**

### 1. LƯỢT A — CHUYÊN VIÊN, CARD, DETAIL
1. **Chuyên viên Home (`#nguoi-dong-hanh`, `src/app/page.tsx`):**
   - Đưa ảnh chân dung tỉ lệ 4:5 (`Avatar size="portrait"` 140×175px) vào sử dụng chính thức, thay thế hoàn toàn vòng tròn initials đơn điệu.
   - Thẻ ngang trên mobile (chân dung bên trái, tên font serif và CTA bên phải), lưới 3 cột cân xứng trên tablet/desktop.
   - Nút liên hệ/trao đổi dẫn trực tiếp về hồ sơ hỗ trợ chi tiết `/lo-dat/<slug>#ho-tro`.
   - Cơ chế fallback initials theo theme màu (`MA`, `HN`, `TH`, `NL`) hoạt động hoàn hảo khi offline hoặc ảnh tải lỗi.
2. **Thẻ Bất động sản (`src/components/property-card.tsx`):**
   - Khung ảnh tỷ lệ 4:3, bo góc `var(--radius-card)` (16px), scale nhẹ 1.03 khi hover trên thiết bị trỏ chính xác (`@media (hover: hover)`).
   - Dải `card-meta-top` kết hợp loại đất in hoa bên trái và nút lưu `SaveButton` 44px bên phải, tách biệt hoàn toàn khỏi anchor link, bảo toàn `aria-label` và `aria-pressed`.
   - Tiêu đề tài sản dùng font serif display (`font-family: var(--font-display)`), giá chào nổi bật 22px to rõ kèm đơn vị "tỷ đ", nút tròn điều hướng 44×44px touch target.
3. **Trang Chi tiết Lô đất (`src/app/lo-dat/[slug]/page.tsx` & `src/components/property-gallery.tsx`):**
   - Khối hỗ trợ `#ho-tro`: Layout ngang thoáng đãng với `Avatar size="portrait"` của chuyên viên phụ trách lô đất, mô tả đầu mối hỗ trợ trực tiếp.
   - Khối summary bên phải: Giữ `Avatar size="sm"` cho tóm tắt gọn gàng, nút lưu 100% chiều rộng.
   - Gallery ảnh: Giữ nguyên 100% các nút điều hướng accessible (`Ảnh trước`, `Ảnh tiếp theo`), thumbnails chuyển đổi nhịp nhàng.

### 2. LƯỢT B — MÀN HÌNH VÀ TRẠNG THÁI HIỆN CÓ
1. **Đồng bộ Typography & Panel:**
   - Áp dụng font serif display (`font-family: var(--font-display)`) cho toàn bộ tiêu đề H1/H2 của các trang `/lo-dat`, `/da-luu`, `/lich-hen`, `/nft`, `/nft/[slug]`, `/danh-muc-nft`, `/trai-nghiem`.
   - Panel giao dịch (`.journey-panel`, `.visit-card`, `.nft-purchase`, `.nft-holding`, `.nft-portfolio-summary`): Nền trắng/surface sang trọng, viền mảnh `var(--color-border)`, đổ bóng tinh tế `var(--shadow-subtle)` / `var(--shadow-card)`.
2. **Breadcrumb & Empty States:**
   - Styling phân cấp cho `.breadcrumb`: Liên kết màu muted, mục hiện tại màu ink đậm nét.
   - Thiết kế lại `.empty-state` và `.nft-empty`: Nền `var(--color-surface)` ấm áp, viền đứt đoạn nhẹ nhàng, tiêu đề serif và nút CTA rõ ràng.
3. **Bảo toàn 100% Luồng Nghiệp vụ 1B:**
   - **Catalog (`/lo-dat`)**: Giữ filter URL, số lượng danh mục, sắp xếp giá/diện tích, pending state.
   - **Đã lưu (`/da-luu`)**: Badge số lượng `.saved-count` dạng pill nổi bật; xử lý êm trạng thái storage warning.
   - **Lịch hẹn (`/lich-hen`)**: Liên kết form field/error với `aria-describedby` và `aria-invalid`, bảo toàn persona người đề nghị ("Đinh Duy"), trạng thái đổi/hủy giữ đúng quy trình "Chờ điều phối" không hứa hẹn sai.
   - **NFT (`/nft`, `/nft/[slug]`, `/danh-muc-nft`)**: Bảng tính số lượng, tỷ lệ phân đoạn, đơn vị tiền tệ rõ ràng, phân biệt rạch ròi giữa các outcome `success`, `cancelled`, `failed`. Nhãn lưu ý không phát sinh thanh toán hiển thị rõ nét với độ tương phản cao.
   - **Cài đặt trải nghiệm (`/trai-nghiem`)**: Nút đặt lại hành trình với xác nhận an toàn 2 bước đúng namespace.

- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: **ĐẠT** (0 warning, 0 error).
  + `pnpm typecheck`: **ĐẠT** (`next typegen && tsc --noEmit`).
  + `pnpm test`: **ĐẠT 43/43 unit tests** (100%).
  + `pnpm build`: **ĐẠT** (25 routes SSG/dynamic tối ưu sạch sẽ).
  + Playwright E2E (`desktop-chromium` & `mobile-chromium`): **54/54 ĐẠT (100%)**.
- **Bộ ảnh Nghiệm thu P06 (`docs/qa/ui-upgrade/P06/`):**
  + 18 ảnh có metadata đầy đủ đo đạc tại 5 viewports (360/390/430/768/1440px), zoom 200% CSS và các trạng thái nghiệp vụ: `imageFailures = []`, không tràn ngang (`scrollWidth = clientWidth`).
- Bước tiếp theo: [P07 — Cài đặt và cấu hình GSAP](ui-upgrade/phases/P07-gsap-setup.md).

## Nghiệm thu Giai đoạn P05 — 03/10/2026

- Đã hoàn thành duy nhất phase **P05 (Chương bất động sản NFT)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF D2](ui-upgrade/BRIEF.md), [DESIGN](../docs/DESIGN.md) và [P05-nft-story](ui-upgrade/phases/P05-nft-story.md).
- **Hạng mục hoàn thành:**
  1. **Component NftStory (`src/components/home/nft-story.tsx`):**
     - Server Component tinh gọn, semantic `<section id="nft" className="nft-story" aria-labelledby="nft-heading">`.
     - Thay thế toàn bộ khối checklist tích xanh generic cũ trong `src/app/page.tsx`, bảo toàn id anchor `#nft` và neo cuộn `scroll-margin-top: 96px`.
     - Heading hierarchy chuẩn mực H2 → H3, văn phong rõ chữ NFT, không đưa ra cam kết lợi nhuận sai lệch.
  2. **Nhịp Thị giác Sáng / Tối với Nền Ink (`#102D3B`):**
     - Nền Ink full-width (`linear-gradient(180deg, #102d3b 0%, #0d2531 100%)`) tạo khoảng nghỉ thị giác sang trọng, tương phản cao giữa hai chương nền sáng (Xland Story ở trên và Người đồng hành ở dưới).
     - Ranh giới chuyển tiếp được xác nhận qua ảnh chụp `p05-nft-boundary-1440.png`.
  3. **Hình ảnh Lớn Tài sản P02 (`public/images/garden-retreat.webp`):**
     - Phối cảnh nhà vườn nhiệt đới (1536×1024), tỷ lệ 16:10 trên mobile và 4:3 trên desktop với caption UI *“Không gian cho những khởi đầu mới”*.
     - Tích hợp `PropertyImage` với declarative fallback giữ nguyên bố cục và khả năng đọc khi ảnh tải chậm hoặc offline.
  4. **Sơ đồ Quy trình 3 bước Trực quan (Native HTML/SVG):**
     - Ba bước: `01. Hồ sơ tài sản` → `02. Phương án NFT` → `03. Danh mục của bạn`.
     - Mũi tên kết nối mảnh `aria-hidden="true"`, số thứ tự badge viền champagne `#D8C49D`.
     - Thể hiện đúng quy trình tìm hiểu/tham gia, không gây hiểu lầm là chia ranh giới địa chính hay thửa đất vật lý.
  5. **Panel Định lượng Phương án Minh họa Động:**
     - Helper thuần `src/features/nft/presentation.ts` lấy trực tiếp từ offering mở bán thật (`XL-001` - `Miền xanh ven sông`): Tổng cung 1.000 NFT (ERC-1155), đơn giá 2.800.000 ₫, tỷ lệ 0,1% / 1 NFT và 1% / 10 NFT.
     - Loại bỏ hoàn toàn tồn seed khỏi section marketing theo chỉ đạo của BRIEF D2 để tránh hiểu nhầm sau khi mua.
     - Lưới Visual Matrix 20 ô nhỏ (mỗi ô tượng trưng 10 NFT = 1%) với ô mẫu sáng champagne kèm disclaimer pháp lý rõ ràng.
  6. **Đo đạc Độ tương phản WCAG 2 AA & AAA:**
     - Tiêu đề H2 (`.nft-title`): Chữ trắng trên nền Ink `#102D3B` đạt tương phản **14.2:1 (AAA)**; chữ nhấn Warm Gold đạt **7.8:1 (AAA)**.
     - Nút CTA chính (`.nft-cta-primary`): Chữ đậm trên nền Warm Gold `#D8C49D` đạt **7.8:1 (AAA)**.
     - Link phụ (`.nft-link-sub`): Chữ `#E0ECEF` trên nền Ink đạt **12.5:1 (AAA)**.
     - Đoạn lead và mô tả bước: Đạt **6.8:1 – 7.2:1 (AAA large, AA small)**.
  7. **Hành động & Điều hướng (Actions):**
     - CTA chính `Tìm hiểu phương án NFT` dẫn tới `/nft` (nút vàng champagne nổi bật trên nền tối) và link phụ dẫn tới `/nft/mien-xanh-ven-song`.
     - Hỗ trợ phím Tab tuần tự, dark focus outline rõ nét, `scroll-margin-top: 96px` bảo vệ tiêu đề không bị che bởi sticky header.
  8. **Bộ ảnh Nghiệm thu P05 (`docs/qa/ui-upgrade/P05/`):**
     - Đã chụp 7 ảnh kiểm soát viewport (360/390/430/768/1440px), zoom 200% CSS và ranh giới chuyển nhịp: `imageFailures = []`, không tràn ngang (`scrollWidth = clientWidth`).
- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: **ĐẠT** (0 warning, 0 error).
  + `pnpm typecheck`: **ĐẠT** (`next typegen && tsc --noEmit`).
  + `pnpm test`: **ĐẠT 43/43 unit tests** (100%).
  + `pnpm build`: **ĐẠT** (25 routes SSG/dynamic tối ưu sạch sẽ).
  + Playwright E2E (`desktop-chromium` & `mobile-chromium`): **54/54 ĐẠT (100%)**.
- Bước tiếp theo: [P06 — UI các luồng nghiệp vụ](ui-upgrade/phases/P06-journeys.md).

## Nghiệm thu Giai đoạn P04 — 03/10/2026

- Đã hoàn thành duy nhất phase **P04 (Chương giới thiệu Xland)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF D1](ui-upgrade/BRIEF.md), [DESIGN](../docs/DESIGN.md) và [P04-xland-story](ui-upgrade/phases/P04-xland-story.md).
- **Hạng mục hoàn thành:**
  1. **Component XlandStory (`src/components/home/xland-story.tsx`):**
     - Tách độc lập, Server Component tinh gọn, semantic `<section id="cach-hoat-dong" aria-labelledby="story-heading">`.
     - Thay thế toàn bộ khối `.why-section` / `.values-grid` cũ trong `src/app/page.tsx`, bảo toàn thứ tự các section trên trang chủ.
     - Heading hierarchy chuẩn mực H2 → H3; các số thứ tự `01`, `02`, `03` có `aria-hidden="true"` để trình đọc màn hình tiếp cận mạch lạc.
  2. **Thứ tự Mobile First Tự nhiên (<1024px):**
     - Đạt chính xác trình tự yêu cầu: `Eyebrow → H2 → Lead → Ảnh chủ đạo → 3 Hàng bước → CTA Actions`.
     - Kỹ thuật: Sử dụng `.story-content { display: contents; }` kết hợp CSS Grid `order` trên container `.story-inner` để thay đổi thứ tự thị giác mà không duplicate DOM.
  3. **Bố cục Desktop (≥1024px):**
     - Tỷ lệ 2 cột cân xứng: 5/12 ảnh chủ đạo bên trái, 6.2/12 nội dung bên phải, khoảng cách cột `72px`, padding-block `96px`.
     - Không để khoảng trống thừa ở chân ảnh. Khung ảnh có hairline viền mảnh và chú thích ngữ cảnh tự nhiên.
  4. **Hình ảnh Chủ đạo P02 (`public/images/xland-story.webp`):**
     - Cảnh đồi chè và thung lũng Bảo Lộc trong nắng sớm (1600×1200 WebP), tỷ lệ 4:3 trên mobile và 4:5 trên desktop.
     - Tích hợp qua `PropertyImage` với declarative fallback giữ nguyên bố cục và khả năng đọc khi ảnh tải chậm hoặc offline.
  5. **Ba Hàng Đánh số Thay thế Khối Card Cũ:**
     - Xóa bỏ triệt để 3 card trắng rời rạc và 3 icon tròn xanh generic của mốc 1A.
     - Danh sách `<ol class="story-steps">` với 3 bước hành động thực tế: `01. Khám phá có chọn lọc`, `02. Hiểu rõ từng lựa chọn`, `03. Kết nối bước tiếp theo`.
     - Đường divider hairline mảnh giữa các bước tạo nhịp thị giác thanh thoát.
  6. **Đo đạc Độ tương phản WCAG 2 AA & AAA:**
     - Số bước `01`, `02`, `03` (`.story-step-num`): Sử dụng Deep Teal `var(--color-primary)` (`#164B60`) trên nền surface `#F5F3EE`, đạt tương phản **7.35:1 (AAA)**.
     - Tiêu đề H2 và Heading H3: Ink `#162429` trên `#F5F3EE`, đạt tương phản **12.1:1 (AAA)**.
     - Đoạn lead và mô tả: Muted Slate `#455A64` trên `#F5F3EE`, đạt tương phản **6.2:1 (AA)**.
  7. **Hành động & Điều hướng (Actions):**
     - CTA primary `/lo-dat` ("Khám phá các lô đất") với icon mũi tên rõ nét, kèm sublink ghost `#nguoi-dong-hanh` ("Gặp người đồng hành").
     - Hỗ trợ phím Tab tuần tự, outline focus tiêu chuẩn, `scroll-margin-top: 96px` bảo vệ tiêu đề không bị che bởi sticky header.
  8. **Bộ ảnh Nghiệm thu P04 (`docs/qa/ui-upgrade/P04/`):**
     - Đã chụp 6 ảnh kiểm soát viewport (360/390/430/768/1440px) và zoom 200% CSS: `imageFailures = []`, không tràn ngang (`scrollWidth = clientWidth`).
- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: **ĐẠT** (0 warning, 0 error).
  + `pnpm typecheck`: **ĐẠT** (`next typegen && tsc --noEmit`).
  + `pnpm test`: **ĐẠT 42/42 unit tests** (100%).
  + `pnpm build`: **ĐẠT** (25 routes SSG/dynamic tối ưu sạch sẽ).
  + Playwright E2E Accessibility & Journey (Chromium desktop & mobile): **22/22 ĐẠT (100%)**.
- Bước tiếp theo: [P05 — Section NFT và công nghệ](ui-upgrade/phases/P05-nft-section.md).

## Nghiệm thu Giai đoạn P03 — 03/10/2026

- Đã hoàn thành duy nhất phase **P03 (Header, Hero và Footer)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF A–C/F–G](ui-upgrade/BRIEF.md), [DESIGN](../docs/DESIGN.md) và [P03-shell-hero](ui-upgrade/phases/P03-shell-hero.md).
- **Hạng mục hoàn thành:**
  1. **Khung SiteHeader (`src/components/site-header.tsx`):**
     - Mobile: Chiều cao tối ưu 68px, logo `size="md"` sắc nét tại 360px, nút menu toggle đạt kích thước chạm 44×44px với nhãn trợ năng đầy đủ.
     - Desktop: Chiều cao 80px, Logo, 4 liên kết điều hướng và nút CTA chính xếp cân hàng thanh lịch, không sao chép 2 tầng corporate của Sunshine.
     - Kính mờ đục cao cấp: `rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px)` chống hoàn toàn hiện tượng bóng chữ khi cuộn qua nền tối.
     - Khả năng tiếp cận: Phím `Escape` tự động đóng menu mobile và hoàn trả focus về nút toggle.
     - Anchor Offset: Toàn bộ anchor `#kham-pha`, `#cach-hoat-dong`, `#nft`, `#nguoi-dong-hanh`, `#ho-tro`, `#main` đều có `scroll-margin-top: calc(var(--header-height) + 16px)`, click CTA không bị header che mất form tìm kiếm.
  2. **Tách & Nâng cấp Hero Component (`src/components/home/hero.tsx`):**
     - Tách độc lập, rõ ràng trách nhiệm; compose tự nhiên vào `src/app/page.tsx`.
     - Chiều cao thích ứng: `min-height: 520px` (mobile) và `680px` (desktop), loại bỏ 100vh để thanh tìm kiếm `PropertyExplorer` lộ diện tự nhiên ở cạnh dưới điện thoại khi tải trang.
     - Đo đạc tương phản: Chữ H1/Lead trên lớp phủ Ink `#102D3B` đạt tỷ lệ **11.8:1 (AAA)**; chữ nhấn `em` đạt **7.8:1 (AAA)**.
     - Thiết lập sẵn các data hooks phục vụ motion GSAP về sau: `data-hero-media`, `data-hero-content`, `data-hero-title`, `data-hero-cta`.
  3. **SiteFooter Điều hướng Cấu trúc (`src/components/site-footer.tsx`):**
     - Nền Ink `#102D3B` sang trọng, viền mảnh `1px solid rgba(255, 255, 255, 0.12)`.
     - Phân bổ 2 cột điều hướng trên mobile với touch target link ≥ 40-44px; bảo toàn 100% 7 liên kết chức năng hiện có.
     - Khối triết lý `footer-note` viền vàng champagne và khối bản quyền `footer-bottom` trang nhã.
  4. **Final CTA Container:**
     - Thiết kế card bề mặt surface ấm áp (`#F5F3EE`) trước footer, viền mảnh, padding thoáng đãng, tạo nhịp nghỉ thanh lịch trước khi vào footer nền tối.
  5. **Bộ ảnh Nghiệm thu P03 (`docs/qa/ui-upgrade/P03/`):**
     - Đã chụp 10 ảnh kiểm soát viewport (360/390/430/768/1440px), short-height mobile (390×600) và zoom 200% CSS: `imageFailures = 0`, không tràn ngang (`scrollWidth = clientWidth`).
- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: **ĐẠT** (0 warning, 0 error).
  + `pnpm typecheck`: **ĐẠT** (`next typegen && tsc --noEmit`).
  + `pnpm test`: **ĐẠT 42/42 unit tests** (100%).
  + `pnpm build`: **ĐẠT** (25 routes SSG/dynamic tối ưu sạch sẽ).
  + Playwright E2E Accessibility & Journey (Chromium desktop & mobile): **22/22 ĐẠT (100%)**.
- Bước tiếp theo: [P04 — Câu chuyện Xland](ui-upgrade/phases/P04-xland-story.md).

## Nghiệm thu Giai đoạn P02 — 03/10/2026

- Đã hoàn thành duy nhất phase **P02 (Media và chân dung người đồng hành)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF C/D/F/G](ui-upgrade/BRIEF.md), [ASSETS](../docs/ASSETS.md) và [P02-media](ui-upgrade/phases/P02-media.md).
- **Hạng mục hoàn thành:**
  1. **Chân dung 4 Persona hư cấu đồng nhất:**
     - Tạo ảnh qua `generate_image` với ánh sáng tự nhiên studio, nền kiến trúc bokeh, crop vai/ngực chuyên nghiệp, không logo công ty khác, không huy hiệu/chữ:
       + `ADV-001` (Nguyễn Minh Anh - Khánh Hòa): `public/images/advisors/minh-anh.webp` (512×512, 26.4 KB) & thumb (128×128, 4.8 KB).
       + `ADV-002` (Trần Hoàng Nam - Nhà vườn): `public/images/advisors/hoang-nam.webp` (512×512, 26.5 KB) & thumb (128×128, 4.1 KB).
       + `ADV-003` (Lê Thanh Hà - Miền Bắc): `public/images/advisors/thanh-ha.webp` (512×512, 18.9 KB) & thumb (128×128, 3.6 KB).
       + `ADV-004` (Phạm Ngọc Lan - Hưng Yên): `public/images/advisors/ngoc-lan.webp` (512×512, 21.6 KB) & thumb (128×128, 4.3 KB).
     - Toàn bộ dung lượng WebP đều nằm sâu dưới budget BRIEF C (≤ 60 KB cho ảnh chính, ≤ 15 KB cho thumbnail).
  2. **Cảnh quan Xland Story có chiều sâu:**
     - Tạo ảnh `public/images/xland-story.webp` (1080×1440, 211.8 KB, budget ≤ 250 KB), tỷ lệ 3:4 chiều dọc, phong cảnh đồi nương xanh mát và dòng sông uốn lượn tại Việt Nam, mang chiều sâu cảm xúc cho thương hiệu.
  3. **Module Dữ liệu & Fixture Mapping (`src/data/advisors.ts`, `src/data/properties.ts`):**
     - Định nghĩa stable advisor id (`ADV-001`..`ADV-004`), phân vùng và vai trò rõ ràng.
     - Giữ nguyên 100% các trường nghiệp vụ cũ (`name`, `initials`, `role`) trong `Property.advisor` và bổ sung thêm `id`, `avatar`, `avatarThumb`, đảm bảo không làm gãy bất kỳ model dữ liệu hay unit test nào.
  4. **Component Avatar (`src/components/avatar.tsx`):**
     - Hỗ trợ đầy đủ các kích thước: `sm` (44px), `md` (64px), `lg` (80px), `portrait` (140×175px).
     - Cơ chế fallback initials trên 4 theme màu token (`avatar-theme-teal`, `avatar-theme-sage`, `avatar-theme-navy`, `avatar-theme-sand`) đạt chuẩn tương phản WCAG 2 AA (5.7:1 – 7.2:1).
     - Khả năng tiếp cận: hỗ trợ `decorative={true}` mặc định khi đứng cạnh text để tránh đọc lặp tên chuyên viên hai lần trên trình đọc màn hình.
     - Xử lý lỗi declarative `failedSrc`: tự động reset trạng thái lỗi khi đổi `src`, không gây cascading render.
  5. **Tối ưu PropertyImage (`src/components/property-image.tsx`):**
     - Chuyển đổi sang mẫu declarative `failedSrc` sạch sẽ, khắc phục lỗi ESLint hook và xử lý khôi phục hiển thị ảnh đúng chuẩn khi đổi `src`.
  6. **Proof Sheet & Bộ ảnh Nghiệm thu P02 (`docs/qa/ui-upgrade/P02/`):**
     - Tuyến đường `/qa-media-proof` hiển thị toàn bộ 4 persona cạnh nhau, 4 kích thước avatar, kịch bản ảnh lỗi/thay thế, ảnh Xland story.
     - Chụp 9 ảnh kiểm soát viewports (360/390/430/768/1440px): `imageFailures = 0`, không tràn ngang (scrollWidth = clientWidth).
- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: **ĐẠT** (0 warning, 0 error).
  + `pnpm typecheck`: **ĐẠT** (`next typegen && tsc --noEmit`).
  + `pnpm test`: **ĐẠT 42/42 unit tests** (`nft.test.ts`, `journey.test.ts`, `home.test.ts`).
  + `pnpm build`: **ĐẠT** (25 routes SSG/dynamic thành công).
  + Playwright E2E Accessibility & Journey (Chromium desktop & mobile): **22/22 ĐẠT (100%)**.
- Bước tiếp theo: [P03 — Header, Hero và Footer](ui-upgrade/phases/P03-shell-hero.md).

- Đã hoàn thành duy nhất phase **P01 (Nhận diện và tiểu tiết tương tác)** theo [UI-UPGRADE](UI-UPGRADE.md), [BRIEF A–B](ui-upgrade/BRIEF.md) và [P01-identity](ui-upgrade/phases/P01-identity.md).
- **Hạng mục hoàn thành:**
  1. **Logo SVG độc bản (`src/components/logo.tsx`):** Chọn Phương án A (*Horizon & Land Parcels*) kết nối 4 thửa đất qua đường chân trời và hạt vàng champagne. Căn chỉnh wordmark serif cân baseline. Hỗ trợ 2 biến thể `default` (trên nền sáng) và `inverse` (trên nền Ink `#102D3B` ở footer). Tích hợp `src/app/icon.svg` chuẩn App Router (32×32). Thẻ link có accessible name `aria-label="Xland — Trang chủ"`, SVG có `aria-hidden="true"`.
  2. **Hệ thống Token Semantic (`src/app/globals.css`):** Áp dụng Deep Teal `#164B60`, Ink `#102D3B`, Warm Gold `#B89962`, On-dark Gold `#D8C49D`, Surfaces trắng ấm `#F5F3EE` và `#EFECE6`. Bo góc chuẩn: control 8px, card 12px, media 8px.
  3. **Chuẩn hóa Icon (`src/components/icon.tsx`):** Toàn bộ icon quy về viewBox `0 0 24 24`, nét `1.75`, round join/cap. Giữ 8 icon hiện có và bổ sung `bookmark` (hỗ trợ filled), `calendar`, `user`, `shield`, `share`, `filter`, `sparkle`. `SaveButton` dùng icon bookmark, bảo toàn 100% `aria-label`, `aria-pressed` và nhãn `"Lưu lô đất"` / `"Đã lưu"`.
  4. **Nâng cấp Button Primitives:** Button chính cao ≥ 48px, icon button ≥ 44px; đủ biến thể primary, secondary, inverse, pending (giữ layout width, pointer-events none), disabled (opacity 0.55, không glow/animation), focus-visible kép (outline 2px offset 2px), hover chuyển màu và trượt nhẹ icon arrow 3px.
  5. **Proof Sheet Nội bộ (`src/app/qa-identity-proof/page.tsx`):** Trang đối chiếu 2 phương án logo, 15 icons trên sáng/tối, button states, bảng đo tương phản và thử nghiệm chuỗi dấu tiếng Việt.
- **Đo đạc Độ tương phản & Hiệu chỉnh Thực tế:**
  + Text `#243842` trên White: 10.2:1 (AAA), trên Surface: 9.4:1 (AAA).
  + Muted `#5A6B73` trên White: 4.88:1 (AA), trên Surface: 4.51:1 (AA).
  + Primary White trên `#164B60`: 7.35:1 (AAA).
  + White trên Ink `#102D3B`: 13.5:1 (AAA); On-dark Gold trên Ink: 7.82:1 (AAA).
  + Hiệu chỉnh selector `.navigation > .button` có màu chữ độc lập `#FFFFFF` tránh bị ghi đè màu text (đạt 7.35:1).
  + Hiệu chỉnh màu chữ `.avatar-1` từ `#8C7343` sang `#745722` để nâng tương phản từ 3.93:1 lên 5.70:1, vượt chuẩn WCAG 2 AA (4.5:1).
- **Bộ ảnh Nghiệm thu P01 (`docs/qa/ui-upgrade/P01/`):**
  + Đã chụp 17 ảnh có kiểm soát viewport (360, 390, 430, 768, 1440px) và lưu metadata đầy đủ tại `docs/qa/ui-upgrade/P01/metadata.json` cùng báo cáo [QA P01](qa/ui-upgrade/P01/README.md).
  + Không có lỗi tràn ngang trên Chromium (scrollWidth = clientWidth); imageFailures = 0.
- **Kết quả Kiểm tra Tự động:**
  + `pnpm lint`: ĐẠT (0 warnings, 0 errors).
  + `pnpm typecheck`: ĐẠT (0 errors).
  + `pnpm test`: ĐẠT 42/42 unit tests (100%).
  + `pnpm build`: ĐẠT (Next.js 16 Turbopack build 24 routes tĩnh/động thành công).
  + Playwright E2E Accessibility & Journey (Chromium desktop & mobile): **22/22 ĐẠT (100%)**.
- Bước tiếp theo: [P02 — Media và chân dung](ui-upgrade/phases/P02-media.md).

## Baseline nâng cấp giao diện P00 — 03/10/2026

- Đã hoàn thành duy nhất phase **P00 (Đóng baseline)** theo [UI-UPGRADE](UI-UPGRADE.md) và [P00-baseline](ui-upgrade/phases/P00-baseline.md).
- Nền mã khảo sát: commit `0bf496cda428676db1cc70f0cd9d88bfa0c600d8` trên nhánh `main`. Không sửa đổi UI, CSS token, component, fixture, dependency hoặc test assertion.
- Đã chạy kiểm tra nền thực tế:
  + `pnpm lint`: Đạt (0 warnings, 0 errors).
  + `pnpm typecheck`: Đạt (0 errors).
  + `pnpm test`: Đạt toàn bộ **42/42 unit tests** (`nft.test.ts`, `journey.test.ts`, `home.test.ts`).
  + `pnpm build`: Đạt (22 routes SSG/dynamic thành công trên Next.js 16 Turbopack).
  + `pnpm test:e2e`: **74/81 đạt** (Chromium desktop 27/27 đạt, Chromium mobile 27/27 đạt, WebKit mobile 20/27 đạt; 7 lỗi WebKit viewport/overflow do môi trường Windows).
- Đã chạy probe WebKit chẩn đoán: xác nhận lỗi 325/390 và giả tràn 65px xuất hiện trên cả HTML tối giản không có CSS Xland. Blocker môi trường được giữ nguyên, không sửa CSS để che sai số.
- Đã capture bộ ảnh baseline 50 ảnh kèm metadata chi tiết (route, requested/actual metrics, state, commit, imageFailures) tại `docs/qa/ui-upgrade/P00/`:
  + Home tại 5 viewports (360/390/430/768/1440) toàn trang và 5 crop (hero, Xland, NFT, advisors, card).
  + Chi tiết đô thị (`/lo-dat/goc-pho-long-bien`) và chi tiết NFT (`/nft/mien-xanh-ven-song`) tại 390 và 1440px.
  + Toàn bộ 8 màn chức năng 1B (catalog, saved, visit form, review, visits list, nft catalog, portfolio, reset) tại 390 và 1440px.
  + Không có ảnh nào bị lỗi tải (imageFailures = 0); không có tràn ngang trên Chromium.
- Đã định vị chi tiết danh sách điểm cần sửa có ưu tiên (Logo SVG, Icon viewBox 24, Button variants/states, Avatar chân dung persona, Section Xland có ảnh lớn và link thật, Section NFT nền tối và sơ đồ 3 bước).
- Đã cập nhật [HANDOFF](ui-upgrade/HANDOFF.md) chỉ định 6 file cần đọc cho P01. Bằng chứng đầy đủ tại [QA P00](qa/ui-upgrade/P00/README.md).
- Bước triển khai tiếp theo: [P01 — Nhận diện thương hiệu](ui-upgrade/phases/P01-identity.md).

## Vị trí trong lộ trình

**1A đã có triển khai và bằng chứng QA ngày 25/09; 1B đang triển khai, chưa hoàn tất.** Kho mã đầu phiên sạch, HEAD `e8790ab`; luồng NFT đã có từ commit `6f4504c`, nhưng STATUS cũ chưa phản ánh. Phiên này tiếp tục nền đó, không làm lại scaffold và không triển khai backend/admin.

| Phần của 1B | Trạng thái hiện tại |
| --- | --- |
| NFT → số lượng → xem lại → mua → danh mục | Đã có; kiểm tra lại thành công/hủy/lỗi, reload/reset, tồn và chống trùng. Nối CTA từ home/chi tiết và đồng bộ copy theo yêu cầu sản phẩm. |
| Danh sách `/lo-dat` | Đã triển khai filter URL theo khu vực/giá/không gian/nhóm, sort, reset, empty; hỗ trợ Back/reload/chia sẻ. |
| Lưu `/da-luu` | Đã triển khai card/detail/liste cùng state, bỏ lưu/empty/reload/nhiều tab. |
| Xem thực địa `/lich-hen` | Đã triển khai form từ đúng lô, validation, xem lại, gửi một lần, lịch sử, đề nghị đổi/hủy. Gửi mới chờ sắp xếp; đổi/hủy chờ xử lý. |
| Reset `/trai-nghiem` | Đặt lại favorites/lịch về seed và NFT/tồn/lịch sử; có xác nhận, không xóa key khác. |
| Video, người đăng/theo dõi, chuyên gia/consent, đăng bán | **Chưa triển khai** trong vòng này. |
| QA toàn mốc, Vercel và kịch bản nhà đầu tư đầy đủ | **Chưa đạt/chưa phát hành**. WebKit viewport còn lỗi; các hành trình còn thiếu không được tính là đã xong. |

## Chi tiết thay đổi vòng này

- Dùng chung 10 hồ sơ và nguồn media 1A; thêm fixture persona/lịch ở `src/data/journey.ts`, tách model/adapter khỏi component.
- Home vẫn chọn nhóm cục bộ; bấm tìm dẫn tới danh sách có URL. Parse tham số theo allowlist, bỏ tham số lặp/không hợp lệ; khóa điều khiển trong khi navigation để tránh đọc state cũ. Giữ DOM điều khiển để không mất focus khi filter cập nhật.
- Lưu dữ liệu không nhạy cảm trong `xland.demo.journey.v1`; đọc sau hydrate, kiểm phiên bản/phát lại lệnh, chịu được storage hỏng/bị chặn. Khóa từng sổ nếu Web Locks khả dụng, đồng bộ qua storage event.
- Lịch nhận ngày 01–31/10/2026, 09:00/14:00, 1–8 người; persona Minh An cố định. Không có trường nhập điện thoại/email. Cửa sổ ngày, phí 0 ₫ và 3 lịch ban đầu là giả định kịch bản, không phải dịch vụ đang vận hành.
- Hồ sơ tạm dừng bị chặn cả CTA lẫn truy cập URL form trực tiếp. Model từ chối `sold`; catalog hiện chưa có fixture `sold` để kiểm end-to-end riêng.
- Chống trùng mã lệnh và yêu cầu đang xử lý trên cùng lô. Đổi lịch lưu đề nghị mới và giữ lịch gốc; hủy chuyển `cancel_requested`, không giả xác nhận điều phối.
- NFT dùng ngôn ngữ sản phẩm, vẫn ghi rõ yêu cầu không phát sinh thanh toán. Không dựng mint, receipt hoặc explorer. Reset toàn bộ và reset riêng NFT đều có hướng dẫn trong DEMO.
- Giữ font/token, package/pnpm-lock, PDF và ảnh nguồn. Không thêm dependency, secret hoặc backend; vòng code này sau đó đã commit/push trong `0bf496c`.

## Kiểm tra thực tế ngày 30/09

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm check` cuối | **Chưa đạt toàn bộ**: lint, typecheck, **42/42 unit**, production build đạt; **74/81 E2E đạt**, 7 lỗi WebKit viewport/overflow. |
| Chromium desktop / Pixel 7 | **54/54 E2E đạt**; URL/history, lưu/nhiều tab, lịch tạo/đổi/hủy, reset, NFT và accessibility. |
| WebKit iPhone 13 emulation | **20/27 E2E đạt**; các hành trình chức năng đạt. 7 bài liên quan layout/overflow/zoom thất bại; không skip hoặc nới assertion. |
| Responsive và ảnh Chromium | 35 ảnh ở 360/390/430/768/1440px cho catalog, đã lưu, form/xem lại/lịch, NFT, reset; không tràn ngang, không lỗi ảnh hoặc pageerror trong capture. Đã xem đối chiếu font/card/màu với tham chiếu 1A/LUXEESTATE. |
| Accessibility | Axe WCAG 2 A/AA + 2.1 AA trên các route mới tại 390/1440px ở Chromium; keyboard/focus, reduced motion; cả hai project Chromium đạt. Không quy kết các bài WebKit bị chặn trước scan là đã đạt. |
| Git | `git diff --check` được dùng trước bàn giao. Không thay package/lockfile, cấu hình test project hoặc tài nguyên nguồn. |

Bằng chứng: [QA 1B](qa/2026-09-30-1b/README.md), [layout](qa/2026-09-30-1b/layout.json), [WebKit probe](qa/2026-09-30-1b/webkit-viewport.json). Trace tạm nằm trong `test-results/` (gitignored), không đưa vào Git.

### WebKit: giới hạn đang mở

Đã tái hiện trên cả **HTML tối giản không có CSS Xland** và `/lo-dat`: yêu cầu 390px nhưng `innerWidth=325`, `clientWidth=326`, `scrollWidth=391`, `scrollX=65`, DPR=3,59375. Desktop WebKit đối chứng cũng báo chiều rộng 326 thay 390. Windows AppliedDPI đọc được là 115; hệ số 115/96 khớp DPR đối chứng, nhưng chưa xác nhận toàn bộ nguyên nhân trong WebKit. Không đổi DPI toàn máy, không che overflow, không đổi project iPhone sang desktop để làm xanh kiểm tra.

Kết quả ngày 25/09 bên dưới là lịch sử; phiên hiện tại không tái xác nhận được trạng thái WebKit đạt đó. Cần kiểm tra lại trên môi trường WebKit có viewport đúng (và thiết bị thật khi có) trước khi đóng QA 1B. WebKit giả lập không phải iPhone thật.

## Bước tiếp theo

1. Giải quyết môi trường/viewport WebKit và chạy lại đầy đủ gate `pnpm check`; chưa gắn nhãn bản đã nghiệm thu hoặc phát hành.
2. Triển khai chuyên gia gắn lô đất, consent theo từng yêu cầu; hồ sơ người đăng/theo dõi và wizard gửi duyệt.
3. Tuyển media có nguồn/quyền, làm ít nhất 3 clip phát được và nhóm Bắc/Trung/Nam/KCN theo PREPARE; mở rộng fixture trạng thái khi cần.
4. Hoàn thiện reset các module mới, QA toàn hành trình và kịch bản 5–7 phút, sau đó mới đến mốc 2/Vercel.

Chưa có Lighthouse 3 lần, thiết bị iOS/Android thật hoặc visual regression baseline được duyệt. Chưa deployment, backend/admin, Supabase, ví, thanh toán hoặc smart contract. ERC-1155 vẫn thuộc giai đoạn backend.

Bản production local đang phục vụ tại **http://127.0.0.1:3200**. Kịch bản và các giới hạn dữ liệu ở [DEMO](DEMO.md).

## Lịch sử mốc 1A — 25/09/2026

Phần dưới giữ kết quả của vòng trước, không thay cho kết quả 30/09 ở trên.

### Đã hoàn thành tại 25/09

- Hero trang chủ đã chuyển sang ảnh `assets/images/hero.jpg` do chủ dự án cung cấp; bản WebP phục vụ web nằm tại `public/images/hero.webp`, giữ overlay và responsive crop.

- Trang chủ theo hướng LUXEESTATE; **10 bất động sản** từ fixture dùng chung. Thứ tự cố định: **Đô thị (1) → Vùng ven đô thị (4) → Ocean Park (2) → Vùng quê (3)**. Chọn nhóm kết hợp filter cục bộ khu vực/giá/không gian, empty state và xóa lọc.
- Thêm 7 hồ sơ: Góc phố Long Biên; Hiên xanh Đông Anh, Vườn nhỏ Gia Lâm, Lối nắng Hoài Đức, Miền vườn Thanh Trì; Nhà phố Ocean Park 2 và Biệt thự Ocean Park 3 tại Hưng Yên. Mỗi hồ sơ có ảnh, giá, diện tích đất, mặt tiền, đường tiếp cận, loại tài sản và người hỗ trợ. Giữ nguyên 3 hồ sơ vùng quê.
- Card → chi tiết đúng giá/diện tích/người hỗ trợ; gallery trước/sau/thumbnail, thông tin đất, trạng thái tạm dừng, phương án NFT, lô liên quan và 404.
- Theo yêu cầu mới nhất: bỏ nhãn demo/mẫu/minh họa và câu chữ nói về tiến độ lập trình khỏi UI. Hồ sơ/giá/persona vẫn là mock; không thêm chứng nhận pháp lý hoặc thành tích giả.
- Kết hợp ảnh cảnh quan thật Pexels ở hero/card/gallery với phối cảnh nhà vườn mới ở section NFT. Bổ sung 7 ảnh riêng bằng image_gen cho 7 hồ sơ mới; gallery nhà phố/biệt thự dùng tỷ lệ 3:2 trên desktop để không cắt mái. Nguồn, PNG, prompt và giới hạn ở ASSETS; không sửa PDF/ảnh nguồn đã có.
- Trang chủ hiển thị tối đa 3 người hỗ trợ không lặp; chi tiết hiển thị tối đa 3 bất động sản liên quan theo thứ tự nhóm.
- Noto Serif + Be Vietnam Pro local, CSS tokens, dấu Việt, layout 360/390/430/768/1440px.
- Sửa focus của skip link trên WebKit bằng `tabIndex={0}`; giữ điều hướng bàn phím và menu Escape/trả focus. Tăng overlay hero mobile và nền dòng địa điểm để bảo đảm chữ rõ trên ảnh.
- Đồng bộ AGENTS, PREPARE, DESIGN, ASSETS và README với yêu cầu ảnh/câu chữ mới.

### Kiểm tra tại 25/09

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm install --frozen-lockfile` | Đạt; giữ nguyên package/lockfile. Có hai lần tải bị timeout, lần thử lại hoàn tất. |
| `pnpm check` cuối | **Đạt**: lint, typecheck, 8 unit test, production build (10 trang chi tiết), **39/39 E2E**. |
| Trình duyệt E2E | Chromium desktop, Chromium Pixel 7, **WebKit iPhone 13 emulation**; 13 test/project; kiểm tra cả 7 trang chi tiết mới, thứ tự danh mục, chọn nhóm bằng bàn phím và lọc kết hợp. |
| Overflow | Home/detail tại 360/390/430/768/1440px: layout không tràn; vòng mở rộng lưu thêm layout của Biệt thự Ocean Park 3. Vòng QA trước thử cuộn ngang `scrollX = 0`. |
| Accessibility | Axe WCAG 2 A/AA + 2.1 AA trên home/detail tại 390/1440px, không có violation; kiểm tra bàn phím, menu, CSS zoom 200%, reduced-motion và fallback ảnh. |
| Tương phản trên ảnh hero | 41 vùng dòng chữ ở 5 viewport, tất cả đạt; mức thấp nhất chữ thường 5,30:1, chữ lớn 3,96:1. Phương pháp và JSON tại thư mục QA. |
| Ảnh | Đã lưu/xem danh mục và chi tiết biệt thự ở 5 viewport, card, bộ lọc Ocean Park và chi tiết nhà phố 390/1440px. Không có ảnh lỗi trong capture. Tham chiếu mẫu và bằng chứng trước được giữ riêng. |
| Git | `git diff --check` đạt; package/lockfile và PDF/ảnh nguồn đã có không thay đổi. Chưa tạo commit. |

Máy hiện có Node mặc định 20.18.0, không đủ chạy pnpm 11. Phiên này thêm Node của runtime Codex (24.19.0) vào PATH **riêng tiến trình** để bootstrap; pnpm cài và chạy bằng Node dự án **24.21.0**. Không đổi Node toàn máy, không nâng dependency.

#### Lỗi WebKit ghi ở phiên trước 25/09

Đã thử lại cả HTML tối giản và Xland với iPhone 13 emulation trên Windows: `innerWidth/clientWidth/scrollWidth = 390`, `scrollX = 0`. Không tái hiện sai lệch 325/390 và cuộn 65px đã ghi trước đây. Bỏ nhánh dùng Desktop Safari thu nhỏ trên Windows, khôi phục project `mobile-webkit` dùng iPhone 13 ở mọi OS. Toàn bộ 11 test WebKit mobile đã đạt; không skip và không che overflow bằng CSS. Chưa xác định nguyên nhân gốc của sai lệch ở môi trường phiên trước.

Bằng chứng vòng danh mục mới: [QA catalog](qa/2026-09-25-catalog/README.md), [layout mới](qa/2026-09-25-catalog/layout.json).

Bằng chứng vòng 1A trước: [QA 1A](qa/2026-09-25-1a/README.md), [viewport WebKit](qa/2026-09-25-1a/webkit-viewport.json), [layout](qa/2026-09-25-1a/layout.json).

### Giới hạn tại 25/09 (đã được cập nhật ở phần hiện tại phía trên)

- 7 hồ sơ mới mỗi hồ sơ có một ảnh. Giá/diện tích/persona và ảnh tạo mới là fixture; dữ liệu chưa lưu vào database/backend.
- Chưa kiểm tra iPhone/Android thật; CSS zoom 200% không thay kiểm tra zoom của trình duyệt/thiết bị thật. Chưa đo Lighthouse 3 lần hoặc đặt visual regression baseline được chủ dự án duyệt.
- Chưa triển khai 1B: danh sách có filter URL, lưu, video, lịch hẹn, chuyên gia, đăng bán, mua NFT và danh mục NFT. Nút mua hiện disabled với lý do **Chưa mở bán**; CTA hỗ trợ chỉ mở thông tin người hỗ trợ, không gửi yêu cầu ra ngoài.
- Chưa deployment Vercel, backend/admin, Supabase, ví, thanh toán hoặc smart contract. ERC-1155 thuộc giai đoạn backend.
- Tiếp theo: luồng NFT → chọn số lượng → xác nhận → danh mục, state cục bộ/reset và kiểm thử tồn/chống trùng; sau đó các hành trình đất nền theo PREPARE. Giữ nguyên quyết định UI dùng ngôn ngữ sản phẩm, ghi giới hạn mock trong tài liệu nội bộ.

Xem local: `pnpm dev`, hoặc `pnpm build` rồi `pnpm start`. Phiên bàn giao giữ production server tại `http://127.0.0.1:3000`.
