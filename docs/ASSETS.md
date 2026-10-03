# Nguồn tài nguyên Xland

Cập nhật 25/09/2026. Quyết định mới nhất của chủ dự án: **kết hợp ảnh chụp thật và ảnh ảo/phối cảnh đẹp**, giao diện trình nhà đầu tư không phủ nhãn demo/mẫu/minh họa. Quyết định này thay thế yêu cầu chỉ dùng ảnh thật của phiên trước. Ưu tiên cảnh quan Việt Nam, màu tự nhiên, bộ ảnh có cùng bối cảnh; chất lượng và độ tin cậy quan trọng hơn vẻ hào nhoáng giả tạo.

## Ảnh đã tuyển

Ảnh tải từ trang nguồn Pexels có tác giả và giấy phép; bản nguồn tải về nằm trong `assets/media/stock/`, bản WebP phục vụ web ở `public/images/`. Không hotlink khi người dùng mở ứng dụng. Ảnh được nén/đổi định dạng, crop bằng CSS cho từng khung; không dùng AI sửa cảnh quan, không thêm ranh giới thửa đất.

| File | Nguồn / tác giả | Sử dụng |
| --- | --- | --- |
| `cam-ranh.webp` | [Pexels 37114134](https://www.pexels.com/photo/aerial-view-of-vietnamese-countryside-landscape-37114134/), Hữu Thịnh 79, trang nguồn ghi Cam Ranh, máy FC3582 | Hero, card nhà vườn và gallery bối cảnh Khánh Hòa |
| `cam-lam.webp` | [Pexels 35995797](https://www.pexels.com/photo/aerial-view-of-agricultural-landscape-in-vietnam-35995797/), Hữu Thịnh 79, trang nguồn ghi Cam Lâm, máy FC3582 | Card ven sông, gallery bối cảnh Khánh Hòa |
| `dong-bang.webp` | [Pexels 28055363](https://www.pexels.com/photo/aerial-view-of-rural-vietnamese-landscape-28055363/), HONG SON, cảnh quan nông thôn Việt Nam | Card và chi tiết hồ sơ đồng quê |
| `assets/media/stock/nha-trang.jpg` | [Pexels 37177938](https://www.pexels.com/photo/serene-beach-at-sunset-with-rocky-shoreline-37177938/), Hữu Thịnh 79 | Ứng viên đã tải; chưa đưa vào giao diện vì chưa cần bối cảnh biển |
| `assets/images/hero.jpg` → `hero.webp` | Ảnh nguồn do chủ dự án cung cấp, 1376 × 768 | Hero trang chủ; crop responsive với overlay tối để giữ rõ chữ |

Giấy phép: [Pexels License](https://www.pexels.com/license/), kiểm tra ngày 25/09/2026: cho phép dùng ảnh miễn phí và chỉnh sửa; không bắt buộc ghi công. Giữ công tác giả trong caption gallery/tài liệu để dễ truy vết. Không ngụ ý nhiếp ảnh gia, người hoặc tổ chức trong ảnh bảo chứng cho Xland; không bán lại ảnh riêng lẻ.

Các ảnh trên **không xác minh một lô đất đang bán**. Gallery ghi bối cảnh khu vực; hai ảnh Cam Lâm/Cam Ranh không được mô tả là hai góc chụp cùng thửa. UI không dán nhãn demo/mẫu/minh họa theo yêu cầu mới nhất. Caption vẫn ghi địa điểm bối cảnh/tác giả; tài liệu này ghi rõ stock và fixture, không coi ảnh là chứng cứ lô đất đang bán.

Khi có nguồn hàng đối tác, thay gallery bằng ảnh thực địa cùng tài sản, có quyền công bố và hồ sơ đi kèm. Không chuyển fixture thành hàng thật chỉ bằng bỏ nhãn demo.

WebP hiện có chiều rộng 1600–1920px, khoảng 353–442KiB cho ảnh lớn; Next Image tạo biến thể theo `sizes` để card/mobile không tải toàn bộ bản lớn. SHA-256 lưu tại [media-checksums.json](references/media-checksums.json). Cần đo payload thực tế khi nghiệm thu hiệu năng.

## Font

Nguồn: [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl). Tải TTF và OFL cho Cinzel, Josefin Sans, Noto Serif, Be Vietnam Pro để đối chiếu; lưu tại `docs/references/fonts/`.

- Kiểm cmap của chuỗi tiếng Việt trong DESIGN: Cinzel thiếu 10 ký tự, gồm các dấu Việt và ký hiệu ₫. Kết quả tại [glyph-check.json](references/fonts/glyph-check.json).
- Chốt **Noto Serif 500/600 + Be Vietnam Pro 400/500/600**; hai font đáp ứng chuỗi thử. Josefin Sans có glyph chuỗi thử nhưng chọn Be Vietnam Pro để UI tiếng Việt đồng nhất với cặp dự phòng đã định.
- Font phục vụ web là WOFF2 local trong `src/app/fonts/`, dùng `next/font/local`; không yêu cầu tải Google Fonts khi build hoặc khi người xem mở demo. Giữ OFL bên cạnh font.
- Subset giữ Latin, Vietnamese U+1E00–1EFF, dấu câu và ký hiệu ₫; công cụ chuyển đổi fontTools 4.66.0/Brotli 1.2.0, không phải dependency runtime của website.
- Đã xem chữ Việt trên home/detail ở desktop/mobile; kiểm tra zoom và các weight nằm trong vòng QA 1A. Glyph coverage không tự chứng minh mọi tình huống hiển thị đều đạt.

## Tham chiếu thiết kế

- `docs/references/luxeestate-desktop.png`: full page mẫu tại viewport yêu cầu 1440×1000.
- `docs/references/luxeestate-mobile.png`: full page mẫu tại viewport yêu cầu 390×844.
- Nguồn [uupm.cc/demo/real-estate](https://uupm.cc/demo/real-estate), lưu 25/09/2026 qua trình duyệt Codex. Chỉ làm tài liệu tham khảo, không phục vụ các ảnh này như media Xland.

Ảnh AI từng thử ở phiên trước đã loại khỏi public; phiên này bổ sung phối cảnh nhà vườn theo quyết định mới (chi tiết dưới đây). Bốn JPG gốc/PDF của chủ dự án giữ nguyên. Video sẽ tuyển footage thật ở mốc 1B, chưa có video hoặc quyền footage nào được ghi nhận là hoàn thành.

## Phối cảnh bổ sung ngày 25/09/2026

- `public/images/garden-retreat.webp`: 1536 × 1024, 458.954 byte; dùng trong section giới thiệu NFT trên home. Ảnh ảo nhà vườn nhiệt đới, không phải ảnh thực địa hay phương án xây dựng đã được phê duyệt cho XL-001. Không gắn vào gallery chứng minh hiện trạng lô đất.
- Tạo bằng công cụ **image_gen tích hợp**; không dùng ảnh bên thứ ba làm đầu vào. Nguồn PNG giữ tại `assets/media/generated/garden-retreat.png`, prompt đầy đủ ở `assets/media/generated/garden-retreat.prompt.txt`. Chuyển WebP quality 85 bằng sharp; Next Image tạo biến thể phù hợp viewport.
- Vai trò thị giác: cảnh quan thật ở hero/card/gallery, phối cảnh ở phần cảm hứng. Caption UI “Không gian cho những khởi đầu mới”; thông tin nguồn/phân loại giữ trong tài liệu này theo yêu cầu chủ dự án.

## Bộ ảnh bổ sung cho 7 hồ sơ — 25/09/2026

Tạo bằng **image_gen tích hợp**, không dùng ảnh bên thứ ba làm đầu vào. Bảy ảnh là cảnh dựng cho fixture, không phải ảnh thực địa hoặc xác nhận một tài sản đang bán. Giữ nhãn/nguồn kỹ thuật trong tài liệu nội bộ theo quyết định của chủ dự án.

| Ảnh trong `public/images/` | Hồ sơ | Phân loại | WebP (byte) |
| --- | --- | --- | --- |
| `long-bien.webp` | XL-004 · Góc phố Long Biên | Đô thị | 304.872 |
| `dong-anh.webp` | XL-005 · Hiên xanh Đông Anh | Vùng ven đô thị | 326.808 |
| `gia-lam.webp` | XL-006 · Vườn nhỏ Gia Lâm | Vùng ven đô thị | 373.658 |
| `hoai-duc.webp` | XL-007 · Lối nắng Hoài Đức | Vùng ven đô thị | 372.946 |
| `thanh-tri.webp` | XL-008 · Miền vườn Thanh Trì | Vùng ven đô thị | 402.194 |
| `ocean-park-2.webp` | XL-009 · Nhà phố Ocean Park 2 | Ocean Park | 403.880 |
| `ocean-park-3.webp` | XL-010 · Biệt thự Ocean Park 3 | Ocean Park | 422.548 |

Ảnh 1536 × 1024, WebP quality 83; Next Image tạo kích cỡ cho từng card/viewport. PNG gốc và [prompt đầy đủ](../assets/media/generated/catalog-1a/prompts.json) nằm trong `assets/media/generated/catalog-1a/`, giữ nguyên output ở thư mục generated_images của Codex. Mỗi hồ sơ mới dùng một ảnh riêng; không nhân cùng ảnh thành nhiều góc chụp.

Bối cảnh tên dự án/loại hình Ocean Park tham khảo [Vinhomes Ocean Park 2](https://market.vinhomes.vn/du-an/vinhomes-ocean-park-2), [Ocean Park 3](https://oceanpark3.vinhomes.vn/) và [thông tin địa bàn Ocean City](https://market.vinhomes.vn/phan-khu/pho-bien-vinhomes-ocean-park-3-2), tra ngày 25/09/2026. Không tải/sao chép ảnh thương mại của dự án, không lấy giá/ưu đãi từ nguồn làm dữ liệu thật. Diện tích, giá, người hỗ trợ, vị trí của từng căn/lô và hình thức kiến trúc trong fixture đều là giả định; không công bố mã căn thật hoặc quan hệ đối tác với chủ đầu tư.


## Sử dụng lại ở mốc 1B — 30/09/2026

Danh sách `/lo-dat`, `/da-luu`, trang chi tiết và các route NFT tiếp tục dùng chính media của 10 hồ sơ đã phân loại ở trên. Không thêm ảnh/video, không thay tài liệu/ảnh nguồn. Việc nối media vào luồng lưu, lịch xem hoặc mua NFT không biến ảnh stock/phối cảnh thành bằng chứng xác minh tài sản. Lịch, persona, giá và phương án NFT vẫn là fixture nội bộ; video chưa được tuyển và chưa triển khai trong vòng này.

## Bổ sung Media và Chân dung Persona — P02 (03/10/2026)

Triển khai theo hợp đồng [BRIEF C](ui-upgrade/BRIEF.md). Tạo ảnh chân dung cho 4 persona hư cấu và cảnh quan Xland Story bằng công cụ `generate_image`. Bản gốc JPG lưu tại `assets/media/generated/` kèm prompt; bản WebP tối ưu phục vụ web tại `public/images/`.

### 1. Bảng Chân dung 4 Persona Người đồng hành

| ID | Persona | Vai trò | File WebP (kèm Thumb) | Kích thước | Dung lượng (Byte / KB) | Prompt tóm tắt & Phong cách |
| --- | --- | --- | --- | --- | --- | --- |
| `ADV-001` | **Nguyễn Minh Anh** (MA) | Chuyên viên khu vực Khánh Hòa | `advisors/minh-anh.webp`<br/>`advisors/minh-anh-thumb.webp` | 512 × 512<br/>128 × 128 | 27.050 byte (26.4 KB)<br/>4.932 byte (4.8 KB) | Nữ 29 tuổi, người Việt Nam, nụ cười ấm áp, trang phục kem thanh lịch. Ánh sáng cửa sổ tự nhiên, nền nội thất mờ sâu. Bản gốc: `assets/media/generated/advisors/minh-anh.jpg`. |
| `ADV-002` | **Trần Hoàng Nam** (HN) | Chuyên viên trải nghiệm nhà vườn | `advisors/hoang-nam.webp`<br/>`advisors/hoang-nam-thumb.webp` | 512 × 512<br/>128 × 128 | 27.116 byte (26.5 KB)<br/>4.236 byte (4.1 KB) | Nam 34 tuổi, người Việt Nam, nét mặt điềm đạm, blazer xám nhạt và sơ mi xanh. Ánh sáng ban ngày, nền gỗ ấm mờ. Bản gốc: `assets/media/generated/advisors/hoang-nam.jpg`. |
| `ADV-003` | **Lê Thanh Hà** (TH) | Chuyên viên khu vực miền Bắc | `advisors/thanh-ha.webp`<br/>`advisors/thanh-ha-thumb.webp` | 512 × 512<br/>128 × 128 | 19.382 byte (18.9 KB)<br/>3.702 byte (3.6 KB) | Nữ 36 tuổi, người Việt Nam, phong thái chững chạc, blazer navy thanh lịch. Ánh sáng dịu, nền mờ trung tính. Bản gốc: `assets/media/generated/advisors/thanh-ha.jpg`. |
| `ADV-004` | **Phạm Ngọc Lan** (NL) | Chuyên viên khu vực Hưng Yên | `advisors/ngoc-lan.webp`<br/>`advisors/ngoc-lan-thumb.webp` | 512 × 512<br/>128 × 128 | 22.150 byte (21.6 KB)<br/>4.444 byte (4.3 KB) | Nữ 28 tuổi, người Việt Nam, phong cách hiện đại năng động, blazer màu be sáng. Ánh sáng tự nhiên, nền văn phòng sáng sủa. Bản gốc: `assets/media/generated/advisors/ngoc-lan.jpg`. |

- **Giới hạn & Quy chuẩn:** Chân dung persona là hư cấu, phục vụ minh họa trải nghiệm người đồng hành; không gán vào người thật, không dán huy hiệu/logo/chữ lạ.
- **Focal point:** Tâm điểm ngực và khuôn mặt (center 50% 50%).
- **Fallback:** Khi không có ảnh hoặc ảnh tải lỗi, hiển thị `initials` (MA, HN, TH, NL) trên 4 theme màu tương phản cao cố định (`avatar-theme-teal`, `avatar-theme-sage`, `avatar-theme-navy`, `avatar-theme-sand`).

### 2. Cảnh quan Xland Story (Section Về Xland)

| Slot | File WebP | Kích thước | Dung lượng (Byte / KB) | Nguồn & Bản quyền |
| --- | --- | --- | --- | --- |
| `xland-story` | `public/images/xland-story.webp` | 1080 × 1440 (Tỷ lệ 3:4) | 216.926 byte (211.8 KB) | Tạo bằng `generate_image` ngày 03/10/2026. Bản gốc lưu tại `assets/media/generated/story/xland-story.jpg`, prompt tại `xland-story.prompt.txt`. Phối cảnh cảnh quan tự nhiên có chiều sâu (tiền cảnh cây cỏ, trung cảnh dòng sông uốn quanh thửa đất xanh, hậu cảnh núi đồi sương sớm). |

- **Focal point:** Chiều dọc 3:4, ưu tiên vùng trung cảnh dòng sông và thung lũng (center 50% 60%).
- **Ngân sách:** Nằm trong budget 150–250KB của BRIEF C.

### 3. Vị trí sử dụng Ảnh chân dung Chuyên viên (P06)

Từ phase P06, ảnh chân dung chuyên viên được đưa vào sử dụng chính thức trên giao diện:

| Slot hiển thị | Component / File | Kích thước / Tỉ lệ | Persona áp dụng | Mục đích & Trải nghiệm |
| --- | --- | --- | --- | --- |
| **Chuyên viên Home** | `section#nguoi-dong-hanh`<br/>`src/app/page.tsx` | `size="portrait"`<br/>(140 × 175px, tỉ lệ 4:5) | `ADV-003` (Lê Thanh Hà)<br/>`ADV-004` (Phạm Ngọc Lan)<br/>`ADV-001` (Nguyễn Minh Anh) | Thẻ ngang mobile và thẻ dọc 3 cột desktop. Nút CTA dẫn trực tiếp về hồ sơ hỗ trợ chi tiết `/lo-dat/<slug>#ho-tro`. Thay thế hoàn toàn vòng tròn initials đơn điệu. |
| **Khối Hỗ trợ Detail** | `section#ho-tro`<br/>`src/app/lo-dat/[slug]/page.tsx` | `size="portrait"`<br/>(140 × 175px, tỉ lệ 4:5) | Tương ứng theo lô đất (`advisor.id`):<br/>- `ADV-001`: Khánh Hòa<br/>- `ADV-002`: Nhà vườn<br/>- `ADV-003`: Miền Bắc<br/>- `ADV-004`: Hưng Yên | Chân dung sắc nét, ấm áp tạo sự tin cậy trong khối tư vấn trực tiếp của lô đất. |
| **Sidebar Summary Detail** | `.property-summary`<br/>`src/app/lo-dat/[slug]/page.tsx` | `size="sm"`<br/>(36 × 36px, tròn) | Tương ứng theo lô đất | Thumbnail nhỏ gọn kèm tên chuyên viên trong khối tóm tắt giá và đặt lịch nhanh. |

**Quy tắc hiển thị & Fallback:**
- Luôn hiển thị ảnh chân dung WebP đã chuẩn bị (`advisors/*.webp`).
- Nếu ảnh tải chậm hoặc offline, hệ thống tự động kích hoạt huy hiệu `initials` với màu sắc nhận diện tương phản chuẩn WCAG 2 AA (`avatar-theme-teal`, `avatar-theme-sage`, `avatar-theme-navy`, `avatar-theme-sand`).
- Không dùng initials làm hình chính khi ảnh chân dung đã sẵn sàng.

