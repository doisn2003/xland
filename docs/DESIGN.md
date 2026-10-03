# Xland — Thiết kế mốc 1A

Cập nhật: 25/09/2026. Đặc tả và quyết định thực thi; kết quả nghiệm thu kỹ thuật và ảnh kiểm tra nằm trong STATUS. Phạm vi và quyết định sản phẩm nằm trong [PREPARE.md](../PREPARE.md); kết quả kiểm tra nằm trong [STATUS.md](STATUS.md).

**Định hướng tiếp theo — 01/10/2026:** chủ dự án yêu cầu nâng chất lượng giao diện theo Sunshine Group, tập trung mobile, logo/icon/button/avatar, hai chương Xland/NFT và GSAP. Xem [lộ trình 10 phase](UI-UPGRADE.md) và [đặc tả đề xuất](ui-upgrade/BRIEF.md). Chưa triển khai vòng này; các token/font/layout đang chạy bên dưới vẫn là hiện trạng. Khi thực thi P01 và các phase sau, cập nhật chính tài liệu này cùng CSS; không xem bảng màu đề xuất là token đã áp dụng.

## 1. Đích thiết kế và tham chiếu

Xland là website khám phá đất nền và bất động sản phân đoạn bằng NFT, tiếng Việt, mobile first. Cảm giác cần đạt: sáng, cao cấp, thoáng và thông tin rõ ràng.

Tham chiếu chính: [LUXEESTATE](https://uupm.cc/demo/real-estate) và ảnh chủ dự án cung cấp. Giữ header sáng, hero ảnh lớn có overlay, tiêu đề serif, nhấn vàng, CTA xanh và khối tìm kiếm nổi. Chuyển nội dung biệt thự sang đất nền; không sao chép thành tích 500+ / $2B+ / 15+ thành số liệu Xland. Thông tin font/màu của mẫu trong PREPARE là kết quả rà soát trước; các giá trị dưới đây là quyết định thiết kế Xland, không tuyên bố trích nguyên CSS mẫu.

Mốc 1A gồm trang chủ `/`, PropertyCard dùng chung và chi tiết `/lo-dat/[slug]` với dữ liệu mẫu nhất quán. Luồng lọc đầy đủ, NFT, video và lịch hẹn thuộc 1B theo PREPARE. Không đánh dấu 1A hoàn thành chỉ vì tài liệu hoặc scaffold đã có.

## 2. Design tokens

Khi triển khai, đưa tokens vào CSS variables ở `src/app/globals.css`, ánh xạ Tailwind và dùng chung toàn ứng dụng. Tokens đã được triển khai trong CSS cho home/card/detail; mọi điều chỉnh cần cập nhật đồng bộ.

| Token đề xuất | Giá trị | Cách dùng |
| --- | --- | --- |
| `--color-primary` | `#0077B6` | CTA, link, điểm nhấn thương hiệu |
| `--color-primary-hover` | `#005A8C` | Hover/active, chữ trên nền xanh nhạt |
| `--color-accent` | `#FFD700` | Nhấn tiêu đề trên ảnh tối, chi tiết trang trí |
| `--color-canvas` | `#FFFFFF` | Nền trang |
| `--color-surface` | `#F8FAFC` | Section xen kẽ, vùng dữ liệu |
| `--color-text` | `#1E293B` | Nội dung chính |
| `--color-muted` | `#64748B` | Thông tin phụ, vẫn kiểm tra tương phản |
| `--color-border` | `#E2E8F0` | Viền phân chia, không dùng một mình làm focus |
| `--color-success` | `#166534` | Trạng thái tích cực kèm chữ/icon |
| `--color-warning` | `#92400E` | Chờ xử lý kèm nhãn |
| `--color-danger` | `#B91C1C` | Lỗi, gắn với hướng dẫn sửa |
| `--radius-card` / `--radius-control` | `16px` / `12px` | Card/search và input/button |
| `--shadow-card` | `0 8px 24px rgb(15 23 42 / 8%)` | Card và panel nổi |
| `--shadow-raised` | `0 16px 40px rgb(15 23 42 / 14%)` | Hover nhẹ trên desktop |

Spacing theo thang 4, 8, 12, 16, 24, 32, 48, 64, 96px. Glass chỉ ở search/CTA: nền trắng ít nhất 90% opacity, blur 12px nếu hỗ trợ, fallback trắng đặc. Overlay hero thực thi: màu `rgb(9 24 29)`, gradient 81% → 65% trên mobile; từ 768px là 81% → 53% tại 55% chiều ngang → 18%. Dòng địa điểm có nền riêng 65% để giữ tương phản trên ảnh. Vàng không dùng cho chữ nhỏ trên nền trắng. Focus outline xanh 3px, offset 4px.

## 3. Typography và tiếng Việt

- Cặp thử theo mẫu: **Cinzel** cho tiêu đề ngắn, **Josefin Sans** cho nội dung. Đã kiểm cmap: Cinzel thiếu 10 ký tự trong chuỗi thử, xem ASSETS và glyph-check.json.
- Cặp thực thi đã chọn: **Noto Serif** heading + **Be Vietnam Pro** body/UI nếu cặp mẫu thiếu dấu hoặc khó đọc. Dùng local WOFF2: Noto Serif 500/600, Be Vietnam Pro 400/500/600; không đổi font tùy trang.
- Chỉ tải weight dùng thực tế: heading 500/600; body 400/500/600. Dùng font qua Next sau khi đọc tài liệu phiên bản cài; không phụ thuộc CDN font lúc người dùng mở demo.
- H1 mobile 40–48px / line-height 1.15; desktop 64–80px / 1.1. H2 28–40px / 1.2; card title 20–24px / 1.3. Body 16–18px / 1.6; label/phụ 14px / 1.5. Không cắt dấu hoặc ép chữ hoa toàn bộ đoạn dài.
- Chuỗi thử: “Đất nền ven sông · Quy hoạch & pháp lý · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫”. Thử weight, xuống dòng, dấu và số tại 360px và zoom 200%.

## 4. Layout responsive

| Chiều rộng | Quyết định bố cục |
| --- | --- |
| 360–767px | Gutter 20px; 1 cột; header 72px; menu thu gọn; hero nội dung tự tăng chiều cao; search xếp dọc; CTA rộng dễ chạm |
| 768–1023px | Gutter 32px; card 2 cột; header menu tùy đủ chỗ; search 2 hàng nếu cần |
| Từ 1024px | Container tối đa 1200px, gutter ít nhất 32px; card 3 cột; header 88px; hero khoảng 680–780px tùy chữ; search ngang |

Khoảng cách section mobile 48–64px, desktop 80–96px; gap card 24px. Không ấn định chiều cao text/card khiến mất nội dung. Test 360/390/430/768/1440px; thêm 1895px để so ảnh tham chiếu. Không khóa toàn website trong khung điện thoại.

## 5. Trang chủ

1. **Header:** logo Xland, Khám phá, NFT, Cách hoạt động; CTA “Khám phá lô đất”. Mobile có menu với tên truy cập, đóng bằng Escape, trả focus và trạng thái mở rõ. Link chỉ bật khi route/section đích tồn tại.
2. **Hero:** ảnh đất/cảnh quan đủ chiều sâu; điểm lấy nét riêng mobile/desktop. Một H1 ngắn, ví dụ “Khám phá đất nền. Mở lối tương lai.”, mô tả tối đa 2–3 dòng, dòng định vị “ĐẤT NỀN · KHÔNG GIAN SỐNG · NFT”. CTA dẫn tới vùng lô nổi bật trong 1A.
3. **Tìm kiếm:** khu vực, khoảng giá, nhu cầu; label luôn hiện. Giai đoạn 1A lọc cục bộ các card fixture ngay trang chủ, có xóa lọc và empty state. Khi sang 1B chuyển kết quả sang `/lo-dat` và đồng bộ URL theo PREPARE. Không có ô tìm kiếm chỉ trang trí.
4. **Lô nổi bật:** 10 bất động sản cùng fixture với detail, theo thứ tự Đô thị (1) → Vùng ven đô thị (4) → Ocean Park (2) → Vùng quê (3). Nút chọn nhóm hiển thị số lượng, kết hợp bộ lọc khu vực/giá/không gian; xóa lọc trả đủ 10 hồ sơ. Số đếm là số hồ sơ trong danh mục; không dựng doanh số hoặc số năm kinh nghiệm giả.
5. **Giá trị Xland:** khám phá hồ sơ, xem thực địa, tìm hiểu NFT; mô tả khả năng theo giai đoạn, không hứa công nghệ 3D nếu chưa có trải nghiệm tương ứng.
6. **Người hỗ trợ và CTA:** persona fixture có vai trò rõ, hiển thị bằng ngôn ngữ sản phẩm. Trong 1A dẫn đến thông tin hỗ trợ ở detail; form/lịch thật chưa có thì không giả báo gửi thành công.
7. **Footer:** thương hiệu, điều hướng đã có và thông điệp thương hiệu. Không dùng số điện thoại/đối tác thật chưa được cung cấp.

## 6. PropertyCard

- Ảnh tỷ lệ 4:3, có kích thước cố định để tránh dịch layout; object-fit cover, crop theo fixture. Badge “Đang giới thiệu”/“Tạm dừng” theo trạng thái fixture.
- Thứ tự: nhóm/loại bất động sản → vị trí → tên lô → diện tích/mục đích sử dụng → giá chào → người hỗ trợ. Đơn vị m², ₫; formatter dùng `vi-VN`. Không dùng bedrooms/bathrooms cho đất.
- Tiêu đề là link có nghĩa tới detail; nút lưu sau này tách khỏi link, không lồng button trong anchor. Trong 1A chưa triển khai lưu thì không hiển thị nút bấm giả.
- Hover trên thiết bị có chuột: nâng tối đa 4px, ảnh scale 1.03, transition 180–220ms. Focus bàn phím rõ, không cần hover để đọc thông tin. Tắt chuyển động khi reduced motion.
- Giá chưa công bố ghi “Liên hệ tìm hiểu”, không hiển thị 0 ₫. Không có ảnh dùng fallback cùng tỷ lệ kèm “Ảnh đang cập nhật”.

## 7. Chi tiết lô đất

- Breadcrumb về trang chủ/danh sách thực sự tồn tại, tên/vị trí, trạng thái và mã hồ sơ; slug không tồn tại trả 404.
- Gallery: desktop ảnh đất tỷ lệ 2.2:1, nhà phố/biệt thự 3:2 để giữ kiến trúc; mobile 4:3. Chỉ hiện thumbnails và nút trước/sau khi có nhiều ảnh; không phụ thuộc vuốt. Caption ghi tên bối cảnh và tác giả, không dán nhãn demo/minh họa. Có thể hoãn lightbox, không hoãn điều hướng ảnh.
- Desktop hai cột khoảng 2:1; trái nội dung, phải tóm tắt giá/diện tích/người hỗ trợ. Mobile một cột theo thứ tự đọc, CTA chạm tối thiểu 44px; nếu sticky phải có chừa đáy và safe-area.
- Thông tin: giá chào, diện tích, loại đất/mục đích, mặt tiền/đường tiếp cận, thời điểm cập nhật; khu vực/bản đồ minh họa được ghi đúng. Tài liệu mẫu không mang dấu chứng nhận giả.
- CTA 1A “Xem thông tin hỗ trợ” cuộn đến persona với mô tả vai trò, không nêu lộ trình phát triển trên UI. Sang 1B thay bằng “Đề nghị xem thực địa” mở form có validation/trạng thái theo PREPARE.
- Tài sản có phương án NFT hiện khối giới thiệu và thông số từ fixture. Nút mua disabled với lý do “Chưa mở bán” đến khi luồng mua được triển khai. Chỉ bật “Mua NFT” khi route/luồng 1B đã hoạt động; không đổi tên thành “suất tham gia”.

## 8. Dữ liệu, media và component

Hero hiện dùng `assets/images/hero.jpg` do chủ dự án cung cấp, chuyển sang `public/images/hero.webp` để phục vụ web; crop responsive và overlay được giữ nguyên.

Fixture tập trung trong `src/data/` hoặc module demo, không lặp nội dung riêng từng page. Hiện có 10 tài sản có id/slug ổn định, địa bàn, giá/diện tích, trạng thái, ảnh và persona hỗ trợ; một trường hợp tạm dừng để thử trạng thái. Home/card/detail dùng một nguồn dữ liệu. Phương án NFT tương lai liên kết tài sản bằng id, ERC-1155 ở giai đoạn backend.

Component theo trách nhiệm: SiteHeader, SiteFooter, PropertyExplorer, PropertyCard, PropertyGallery, PropertyImage và Icon. Không có DemoBadge trên UI. Tách khi thực sự tái sử dụng hoặc có tương tác độc lập; không tạo sẵn mọi module 1B.

Theo yêu cầu mới nhất 25/09/2026, kết hợp ảnh chụp thật và ảnh ảo/phối cảnh. Hero và 3 hồ sơ vùng quê dùng ảnh Pexels; 7 hồ sơ đô thị/vùng ven/Ocean Park có 7 ảnh riêng tạo bằng image_gen, cùng phối cảnh nhà vườn ở phần NFT. Hai hồ sơ Ocean Park là nhà phố Ocean Park 2 và biệt thự Ocean Park 3 tại Hưng Yên. Mỗi hồ sơ mới hiện có một ảnh; không nhân bản ảnh thành nhiều góc chụp. Trang chủ hiển thị tối đa 3 người hỗ trợ không trùng, chi tiết gợi ý tối đa 3 hồ sơ theo thứ tự nhóm. Ghi URL nguồn, tác giả/giấy phép khi có, phân loại stock/ảnh thực địa đã xác minh và nơi dùng trong `docs/ASSETS.md` khi tuyển media. Không mặc định bốn JPG cũ đủ quyền hoặc phù hợp. Budget ban đầu hero mobile 250–400KB, card 60–150KB; kiểm tra chất lượng crop trước tối ưu sâu. Video feed ở 1B; 1A không cần autoplay video hero.

## 9. Trạng thái và khả năng truy cập

Input có label; lỗi bằng chữ gắn trường. Link cho điều hướng, button cho hành động. Không dùng `href="#"`/alert thay chức năng. Gallery có tên nút và thứ tự focus; ảnh trang trí alt rỗng, ảnh nội dung có mô tả phù hợp. Skeleton giữ kích thước media; lỗi media, empty filter, missing slug có đường tiếp tục. Không sử dụng riêng màu để diễn đạt trạng thái.

Mục tiêu tương phản chữ thường 4.5:1, chữ lớn 3:1; kiểm tra thực tế khi có font/ảnh. Có skip link, landmark và một H1 mỗi trang. Kiểm tra keyboard, zoom 200%, reduced motion, không tràn ngang; form/sheet tương lai cần quản lý focus. Không phủ nhãn demo/mẫu/minh họa lên UI. Tài liệu nội bộ ghi rõ fixture và media; không hiển thị “đã xác nhận Blockchain” cho dữ liệu mock.

## 10. Điều kiện nghiệm thu 1A

- [x] Chốt font sau thử dấu Việt; ghi cặp/weight thực tế tại mục 3.
- [x] Lưu ảnh tham chiếu và ảnh home/card/detail cùng viewport vào `docs/qa/2026-09-25-1a/` theo mốc, có mô tả nguồn/ngày; không báo đã lưu khi chưa tạo.
- [x] Hero, header, CTA/search và card giữ đặc trưng mẫu; nội dung đất nền Xland rõ.
- [x] Home → card → detail → quay lại hoạt động, gallery/search cục bộ có trạng thái; không có CTA vô tác dụng.
- [x] Media có nguồn, phân loại và giới hạn trong ASSETS; giá/diện tích/người hỗ trợ khớp giữa home/detail.
- [x] Đạt kiểm tra viewport, bàn phím, focus, tương phản, reduced motion và fallback.
- [x] `pnpm check` đạt; bổ sung test hành vi mới thay vì chỉ dựa smoke test scaffold.
- [x] Ghi kết quả thật, ảnh đối chiếu và phần còn thiếu trong STATUS; chưa coi đây là nghiệm thu 1B hoặc production.

Đã chọn Noto Serif + Be Vietnam Pro sau kiểm tra glyph; media kết hợp ảnh chụp thật Pexels với phối cảnh nhà vườn, chi tiết tại ASSETS. Các giá trị spacing/kích cỡ có thể chỉnh khi đối chiếu ảnh; cập nhật tài liệu theo quyết định thực thi, không cần thêm vòng phê duyệt cho điều chỉnh thường lệ.


## 11. Bổ sung mốc 1B — 30/09/2026

- Giữ nguyên font Noto Serif/Be Vietnam Pro, toàn bộ tokens và nguồn media 1A; không tải thêm font/ảnh/dependency.
- Search trang chủ chuyển sang `/lo-dat`; bộ lọc khu vực/giá/không gian/nhóm và sắp xếp đồng bộ URL. Back/reload khôi phục giá trị. Khóa điều khiển trong khi chuyển URL để không gửi tiếp lựa chọn từ state cũ; cập nhật draft khi props URL đổi mà không remount toàn bộ form.
- Card và tóm tắt chi tiết có nút lưu riêng, tối thiểu 44px, tên truy cập chứa tên tài sản và `aria-pressed`. `/da-luu` có loading, empty, bỏ lưu và cảnh báo lưu trữ.
- `/lich-hen?lo=<slug>` là trang form, không dùng modal. Form có label, mô tả lỗi, focus trường lỗi; bước xem lại và kết quả nhận focus. Ngày/khung giờ/số người dùng chung validation với adapter. Người liên hệ là persona cố định, không nhập dữ liệu thật.
- Lịch hẹn trình bày dạng card 1 cột mobile, 2 cột từ 768px; chi tiết/lịch sử dùng disclosure. Đổi lịch giữ lịch gốc, hủy cần xác nhận ý định tại giao diện; cả hai chờ điều phối. CTA xem thực địa của hồ sơ tạm dừng vẫn disabled.
- Link NFT từ home/detail đi vào route đã có. Copy NFT dùng ngôn ngữ sản phẩm, không phủ nhãn demo/mẫu; xác nhận ghi rõ không phát sinh thanh toán. Mọi quyền tài sản/Blockchain vẫn chưa được xác lập trong trải nghiệm.
- `/trai-nghiem` đặt lại phần đã triển khai; footer có lối vào. Quyết định 1B thay hành vi CTA 1A được mô tả ở các mục lịch sử phía trên.
- Ảnh và kết quả kiểm tra 360/390/430/768/1440px ở `qa/2026-09-30-1b`. Chưa nghiệm thu toàn bộ 1B; WebKit viewport còn giới hạn được ghi trong STATUS.

## 12. Nâng cấp nhận diện và tiểu tiết tương tác — P01 (03/10/2026)

Triển khai theo hợp đồng [BRIEF A–B](ui-upgrade/BRIEF.md), chuẩn bị nền nhận diện tĩnh cao cấp trước khi thêm GSAP.

### 12.1. Logo Xland SVG Độc bản
- **Phương án lựa chọn:** Phương án A (*Horizon & Land Parcels*) — Khung viền hình thoi bo góc phân định 4 thửa đất (parcels) tiếp giáp, kết nối bởi đường chân trời ngang và tâm điểm hình thoi vàng champagne.
- **Wordmark:** Font chữ tiêu đề serif, kerning chặt chẽ, baseline cân xứng; chữ `X` đậm vững chãi (`font-weight: 700`), `LAND` thanh thoát (`font-weight: 500` - `600`).
- **Phiên bản:**
  - `default`: Dùng trên nền sáng (header, canvas), nét Deep Teal `--color-primary` kết hợp tâm điểm `--color-accent` (`#B89962`).
  - `inverse`: Dùng trên nền tối Ink `--color-ink` (`#102D3B`) ở footer, nét trắng sắc sảo kết hợp tâm điểm `--color-on-dark-accent` (`#D8C49D`).
- **Favicon:** Tích hợp `src/app/icon.svg` chuẩn Next.js App Router (32×32) mang biểu tượng thửa đất Xland.
- **Accessible Name:** Thẻ link bọc ngoài có `aria-label="Xland — Trang chủ"`, bên trong logo có `aria-hidden="true"`, không đọc lặp.

### 12.2. Bảng Tokens Thực thi Chính thức

| Nhóm Token | Tên Token | Giá trị CSS | Mục đích & Độ tương phản |
| --- | --- | --- | --- |
| **Brand Primary** | `--color-primary` | `#164B60` | Deep Teal — CTA, liên kết chính, biểu tượng logo. Tương phản trên trắng: 7.35:1 (AAA) |
| **Brand Hover** | `--color-primary-hover` | `#103B4D` | Trạng thái hover chuột của button chính. Tương phản trên trắng: 9.87:1 (AAA) |
| **Brand Pressed** | `--color-primary-pressed` | `#0B2C3B` | Trạng thái active/nhấn của button |
| **Brand Accent** | `--color-accent` | `#B89962` | Vàng champagne ấm — điểm nhấn logo, tag nổi bật |
| **On-Dark Accent** | `--color-on-dark-accent` | `#D8C49D` | Vàng sáng cho nền tối — tương phản trên Ink: 7.82:1 (AAA) |
| **Ink Surface** | `--color-ink` | `#102D3B` | Nền tối cao cấp của Footer và các khối night-mode |
| **Canvas** | `--color-canvas` | `#FFFFFF` | Nền trang chính |
| **Surface Warm** | `--color-surface` | `#F5F3EE` | Nền trắng ấm cho các section xen kẽ |
| **Surface Elevated** | `--color-surface-elevated` | `#EFECE6` | Nền nổi khối, search panel |
| **Text Primary** | `--color-text` | `#243842` | Chữ chính — tương phản trên trắng: 10.2:1 (AAA), trên surface: 9.4:1 (AAA) |
| **Text Muted** | `--color-muted` | `#5A6B73` | Chữ phụ, nhãn — tương phản trên trắng: 4.88:1 (AA), trên surface: 4.51:1 (AA) |
| **Border Neutral** | `--color-border` | `#D7DEDF` | Viền phân cách thanh mảnh |
| **Border Subtle** | `--color-border-subtle` | `#E8EDEE` | Đường chia tách thứ cấp |
| **Radius Control** | `--radius-control` | `8px` | Bo góc chuẩn cho input, select, button, icon button |
| **Radius Card** | `--radius-card` | `12px` | Bo góc card hồ sơ, container nổi |
| **Radius Media** | `--radius-media` | `8px` | Bo góc ảnh, video |

### 12.3. Hiệu chỉnh Tương phản Thực tế
- **Navigation Button:** `.navigation > .button` được quy định màu chữ độc lập `#FFFFFF` để không bị ghi đè bởi selector `.navigation > a` (đạt AAA 7.35:1).
- **Advisor Avatar Text:** Điều chỉnh màu chữ `.avatar-1` từ `#8C7343` thành `#745722` trên nền `#F3EFE6` để nâng tỉ lệ tương phản từ 3.93:1 lên 5.70:1, vượt chuẩn WCAG 2 AA (4.5:1).

### 12.4. Hệ Icon & Button Controls
- **Icon (`src/components/icon.tsx`):** Chuẩn hóa viewBox `0 0 24 24`, nét `1.75`, round join/cap. Hỗ trợ đủ các icon hiện hành và bổ sung `bookmark` (hỗ trợ filled), `calendar`, `user`, `shield`, `share`, `filter`, `sparkle`.
- **Button Primitives:**
  - Chiều cao tối thiểu: `min-height: 48px` (button), `min-width: 44px` (icon button).
  - Hover chuột: Màu nền đổi mượt, mũi tên icon dịch chuyển nhẹ `3px` (`translateX(3px)`).
  - Keyboard Focus: Đường viền `:focus-visible` kép `2px solid var(--color-primary)` với `offset 2px`, không làm méo layout.
  - Pending: Giữ nguyên kích thước bề ngang, con trỏ `wait`, opacity `0.85`.
  - Disabled: Độ mờ `0.55`, `pointer-events: none`, triệt tiêu toàn bộ glow/animation/shadow.
- **Proof Sheet:** Tuyến đường kiểm định nội bộ `/qa-identity-proof` hiển thị toàn bộ logo, icon 15 món, bảng màu & độ tương phản đo đạc, button states và chuỗi dấu tiếng Việt.

### 12.5. Quy chuẩn Component Avatar (`src/components/avatar.tsx`)
- **Kích thước định sẵn:**
  - `sm` (44 × 44px): Dùng cho badge chuyên viên trong card, inline context, touch target đạt tối thiểu 44px.
  - `md` (64 × 64px): Kích thước mặc định, dùng trong section người đồng hành trang chủ và detail page.
  - `lg` (80 × 80px): Dùng cho hồ sơ người đồng hành nổi bật.
  - `portrait` (140 × 175px, tỷ lệ 4:5): Dùng cho hồ sơ chi tiết và presentation card.
- **Hệ thống Theme Fallback:** Khi ảnh không tồn tại hoặc lỗi tải mạng, Avatar hiển thị chữ viết tắt (initials) trên nền màu token thương hiệu với tương phản cao (vượt chuẩn WCAG 2 AA ≥ 4.5:1):
  - `MA` (`avatar-theme-teal`): Nền `#E6F4F1`, chữ `#0F5B4C` (tương phản 6.8:1).
  - `HN` (`avatar-theme-sage`): Nền `#EDF5EE`, chữ `#2D5936` (tương phản 6.3:1).
  - `TH` (`avatar-theme-navy`): Nền `#EAF0F6`, chữ `#1E4870` (tương phản 7.2:1).
  - `NL` (`avatar-theme-sand`): Nền `#F6F0E6`, chữ `#6B4F1A` (tương phản 5.9:1).
- **Khả năng tiếp cận (A11y):** Thuộc tính `decorative` mặc định `true` khi avatar đặt cạnh tên hiển thị nhằm ẩn thẻ `img` khỏi VoiceOver/NVDA (`aria-hidden="true"`, `alt=""`), tránh đọc lặp tên người hỗ trợ hai lần.

### 12.6. Quy hoạch Asset Media & Tỷ lệ Khung hình (P02)
- **Chân dung 4 Persona hư cấu:** Định dạng WebP, ánh sáng tự nhiên studio, hậu cảnh kiến trúc bokeh sang trọng, không logo công ty khác, không huy hiệu/chữ trong ảnh.
  - `ADV-001` (Nguyễn Minh Anh): `public/images/advisors/minh-anh.webp` (512×512, 26.4 KB) & thumb (128×128, 4.8 KB).
  - `ADV-002` (Trần Hoàng Nam): `public/images/advisors/hoang-nam.webp` (512×512, 26.5 KB) & thumb (128×128, 4.1 KB).
  - `ADV-003` (Lê Thanh Hà): `public/images/advisors/thanh-ha.webp` (512×512, 18.9 KB) & thumb (128×128, 3.6 KB).
  - `ADV-004` (Phạm Ngọc Lan): `public/images/advisors/ngoc-lan.webp` (512×512, 21.6 KB) & thumb (128×128, 4.3 KB).
- **Cảnh quan Xland Story:** `public/images/xland-story.webp` (1080×1440, 211.8 KB), tỷ lệ 3:4 chiều dọc, chiều sâu phong cảnh thiên nhiên Việt Nam phù hợp cho section câu chuyện thương hiệu.
- **Tối ưu PropertyImage:** Bổ sung cơ chế declarative `failedSrc` để tự động khôi phục hiển thị ảnh khi `src` thay đổi, không gây render cascade.
- **Media Proof Sheet:** Tuyến đường `/qa-media-proof` đóng vai trò contact sheet nghiệm thu 4 persona, các kích thước Avatar, cảnh quan Xland story, và kịch bản phục hồi khi ảnh lỗi.

### 12.7. Quy chuẩn Khung giao diện (Shell), Hero và Footer (P03)
- **SiteHeader (`src/components/site-header.tsx`):**
  - Chiều cao header: `--header-height: 68px` trên mobile (<1024px), `80px` trên desktop (≥1024px).
  - Nền mờ kính đục: `rgba(255, 255, 255, 0.96); backdrop-filter: blur(16px)` loại bỏ hiện tượng bóng chữ khi cuộn qua nội dung tối/ảnh.
  - Phân cách: Viền mảnh `1px solid var(--color-border-subtle)`.
  - Menu toggle: Chạm tối thiểu 44×44px, có nhãn accessibility rõ ràng (`Mở menu điều hướng` / `Đóng menu điều hướng`).
  - Mobile Menu Panel: Non-modal navigation panel dưới header, các liên kết có touch target ≥ 44px, nút CTA `Tìm lô đất phù hợp` chiếm trọn bề ngang dễ thao tác.
  - Phím Escape: Tự động đóng menu và hoàn trả focus về toggle button.
  - Anchor Offset: Tất cả các phân đoạn chính (`#kham-pha`, `#cach-hoat-dong`, `#nft`, `#nguoi-dong-hanh`, `#ho-tro`, `#main`) đều có `scroll-margin-top: calc(var(--header-height) + 16px)` chống che lấp nội dung bởi header cố định.
- **Hero Section (`src/components/home/hero.tsx`):**
  - Chiều cao thích ứng: `min-height: 520px` trên mobile, `680px` trên desktop; không dùng 100vh để thanh tìm kiếm `PropertyExplorer` lộ diện tự nhiên ở cạnh dưới màn hình điện thoại khi vừa tải trang.
  - Lớp phủ bóng Ink: Gradient tuyến tính chuyển tiếp từ `rgb(16 45 59 / 76%)` đến `rgb(16 45 59 / 92%)` trên mobile, và 92% qua 76% đến 28% trên desktop. Độ tương phản chữ trắng trên nền đạt chuẩn AAA (11.8:1).
  - Typography: H1 “Một miền đất. Vạn khởi đầu.” cân line break hoàn chỉnh tại 360/390/430px mà không ép cứng; chữ nhấn `em` màu On-dark Gold `#D8C49D`.
  - Data hooks cho Motion tương lai (P07/P08): `data-hero-media`, `data-hero-content`, `data-hero-title`, `data-hero-cta`, `data-hero-bottom`.
- **SiteFooter (`src/components/site-footer.tsx`):**
  - Nền Ink `#102D3B`, viền trên `1px solid rgba(255, 255, 255, 0.12)`.
  - Phân nhóm 2 cột điều hướng trên mobile với touch target link ≥ 40-44px. Đủ 7 liên kết hiện hữu.
  - Khối triết lý `footer-note` viền vàng champagne và khối bản quyền `footer-bottom` trang nhã.
- **Final CTA Container:** Chuyển thể thành card bề mặt surface ấm áp (`#F5F3EE`) trước footer, viền mảnh, padding thoáng đãng, tạo nhịp nghỉ thanh lịch trước khi vào footer nền tối.

### 12.8. Quy chuẩn Chương Giới thiệu Xland Story (P04)
- **Component & Cấu trúc Semantic (`src/components/home/xland-story.tsx`):**
  - Section Server Component nhẹ, `id="cach-hoat-dong"`, `aria-labelledby="story-heading"`.
  - Heading hierarchy chuẩn: H2 cho tiêu đề section, H3 cho từng bước đánh số trong danh sách `<ol class="story-steps">`.
  - Số thứ tự bước `01`, `02`, `03` có `aria-hidden="true"` để trình đọc màn hình đọc trực tiếp tiêu đề bước mà không bị lặp âm.
- **Thứ tự Đọc & Hiển thị Mobile First (<1024px):**
  - Mạch tiếp nhận thông tin tự nhiên: `Eyebrow → H2 → Lead → Ảnh chủ đạo → 3 Hàng bước → CTA Actions`.
  - Kỹ thuật: Sử dụng `.story-content { display: contents; }` kết hợp CSS Grid `order` trên container `.story-inner` để đạt chính xác thứ tự thị giác mà không cần duplicate DOM hay phụ thuộc JavaScript.
- **Bố cục Desktop (≥1024px):**
  - Tỷ lệ 2 cột thanh lịch: Ảnh chủ đạo chiếm 5/12 bên trái, khối nội dung dẫn dắt chiếm 6.2/12 bên phải, khoảng cách cột `72px`, padding-block `96px`.
  - Khung ảnh có viền hairline `1px solid var(--color-border-subtle)` và chú thích bối cảnh tự nhiên bên dưới.
- **Asset Media:**
  - Ảnh chủ đạo `public/images/xland-story.webp` (1600×1200 WebP), tỷ lệ 4:3 trên mobile và 4:5 trên desktop.
  - Tích hợp `PropertyImage` với declarative fallback giữ nguyên bố cục và khả năng đọc khi ảnh tải chậm hoặc offline.
- **Tương phản & Khả năng tiếp cận (WCAG 2 AA & AAA):**
  - Số bước `01`, `02`, `03` (`.story-step-num`): Sử dụng Deep Teal `var(--color-primary)` (`#164B60`) trên nền bề mặt ấm `var(--color-surface)` (`#F5F3EE`), đạt tương phản **7.35:1 (AAA)**.
  - Tiêu đề H2 và Heading H3: Ink `#162429` trên `#F5F3EE`, đạt tương phản **12.1:1 (AAA)**.
  - Đoạn lead và mô tả: Muted Slate `#455A64` trên `#F5F3EE`, đạt tương phản **6.2:1 (AA)**.
  - Neo cuộn: `scroll-margin-top: 96px`, đảm bảo khi click link anchor `#cach-hoat-dong` từ bất kỳ vị trí nào, tiêu đề section luôn nằm dưới header cố định an toàn ít nhất 28–32px.
- **Data Hooks chuẩn bị cho Motion (P07/P08):**
  - `data-xland-story`: Vùng chứa toàn section.
  - `data-story-content`: Vùng văn bản và bước dẫn dắt.
  - `data-story-header`: Cụm eyebrow, tiêu đề H2 và đoạn lead.
  - `data-story-steps`: Danh sách các bước.
  - `data-story-step`: Từng bước đơn lẻ để animate staggered.
  - `data-story-actions`: Cụm nút CTA và sublink.
  - `data-story-media`: Khung ảnh chủ đạo bên cạnh.
