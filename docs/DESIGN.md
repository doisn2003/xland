# Xland — Thiết kế mốc 1A

Cập nhật: 25/09/2026. Đây là đặc tả để triển khai, chưa phải bằng chứng giao diện đã nghiệm thu. Phạm vi và quyết định sản phẩm nằm trong [PREPARE.md](../PREPARE.md); kết quả kiểm tra nằm trong [STATUS.md](STATUS.md).

## 1. Đích thiết kế và tham chiếu

Xland là website khám phá đất nền và bất động sản phân đoạn bằng NFT, tiếng Việt, mobile first. Cảm giác cần đạt: sáng, cao cấp, thoáng và thông tin rõ ràng.

Tham chiếu chính: [LUXEESTATE](https://uupm.cc/demo/real-estate) và ảnh chủ dự án cung cấp. Giữ header sáng, hero ảnh lớn có overlay, tiêu đề serif, nhấn vàng, CTA xanh và khối tìm kiếm nổi. Chuyển nội dung biệt thự sang đất nền; không sao chép thành tích 500+ / $2B+ / 15+ thành số liệu Xland. Thông tin font/màu của mẫu trong PREPARE là kết quả rà soát trước; các giá trị dưới đây là quyết định thiết kế Xland, không tuyên bố trích nguyên CSS mẫu.

Mốc 1A gồm trang chủ `/`, PropertyCard dùng chung và chi tiết `/lo-dat/[slug]` với dữ liệu mẫu nhất quán. Luồng lọc đầy đủ, NFT, video và lịch hẹn thuộc 1B theo PREPARE. Không đánh dấu 1A hoàn thành chỉ vì tài liệu hoặc scaffold đã có.

## 2. Design tokens

Khi triển khai, đưa tokens vào CSS variables ở `src/app/globals.css`, ánh xạ Tailwind và dùng chung toàn ứng dụng. CSS scaffold hiện tại là tạm, chưa phải hệ token đã triển khai.

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

Spacing theo thang 4, 8, 12, 16, 24, 32, 48, 64, 96px. Glass chỉ ở search/CTA: nền trắng ít nhất 90% opacity, blur 12px nếu hỗ trợ, fallback trắng đặc. Overlay hero khởi điểm đen 45–60%, tăng vùng sau chữ theo ảnh/crop; phải đo tương phản sau khi chọn ảnh. Vàng không dùng cho chữ nhỏ trên nền trắng. Focus outline xanh 3px, offset 3px; điều chỉnh nền khi không đủ phân biệt.

## 3. Typography và tiếng Việt

- Cặp thử theo mẫu: **Cinzel** cho tiêu đề ngắn, **Josefin Sans** cho nội dung. Chưa xác nhận glyph/độ dễ đọc của font tải thực tế.
- Cặp dự phòng đã chọn: **Noto Serif** heading + **Be Vietnam Pro** body/UI nếu cặp mẫu thiếu dấu hoặc khó đọc. Kiểm tra rồi ghi quyết định tại đây trước khi nhân rộng; không đổi font tùy trang.
- Chỉ tải weight dùng thực tế: heading 500/600; body 400/500/600. Dùng font qua Next sau khi đọc tài liệu phiên bản cài; không phụ thuộc CDN font lúc người dùng mở demo.
- H1 mobile 40–48px / line-height 1.15; desktop 64–80px / 1.1. H2 28–40px / 1.2; card title 20–24px / 1.3. Body 16–18px / 1.6; label/phụ 14px / 1.5. Không cắt dấu hoặc ép chữ hoa toàn bộ đoạn dài.
- Chuỗi thử: “Đất nền ven sông · Quy hoạch & pháp lý · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫”. Thử weight, xuống dòng, dấu và số tại 360px và zoom 200%.

## 4. Layout responsive

| Chiều rộng | Quyết định bố cục |
| --- | --- |
| 360–767px | Gutter 20px; 1 cột; header 64px; menu thu gọn; hero nội dung tự tăng chiều cao; search xếp dọc; CTA rộng dễ chạm |
| 768–1023px | Gutter 32px; card 2 cột; header menu tùy đủ chỗ; search 2 hàng nếu cần |
| Từ 1024px | Container tối đa 1200px, gutter ít nhất 32px; card 3 cột; header 88px; hero khoảng 680–780px tùy chữ; search ngang |

Khoảng cách section mobile 48–64px, desktop 80–96px; gap card 24px. Không ấn định chiều cao text/card khiến mất nội dung. Test 360/390/430/768/1440px; thêm 1895px để so ảnh tham chiếu. Không khóa toàn website trong khung điện thoại.

## 5. Trang chủ

1. **Header:** logo Xland, Khám phá, NFT, Cách hoạt động; CTA “Khám phá lô đất”. Mobile có menu với tên truy cập, đóng bằng Escape, trả focus và trạng thái mở rõ. Link chỉ bật khi route/section đích tồn tại.
2. **Hero:** ảnh đất/cảnh quan đủ chiều sâu; điểm lấy nét riêng mobile/desktop. Một H1 ngắn, ví dụ “Khám phá đất nền. Mở lối tương lai.”, mô tả tối đa 2–3 dòng, nhãn “Bản trải nghiệm · Dữ liệu minh họa”. CTA dẫn tới vùng lô nổi bật trong 1A.
3. **Tìm kiếm:** khu vực, khoảng giá, nhu cầu; label luôn hiện. Giai đoạn 1A lọc cục bộ các card fixture ngay trang chủ, có xóa lọc và empty state. Khi sang 1B chuyển kết quả sang `/lo-dat` và đồng bộ URL theo PREPARE. Không có ô tìm kiếm chỉ trang trí.
4. **Lô nổi bật:** 3–6 lô mẫu; thông tin lấy từ cùng fixture với detail. Có thể dùng số lượng hồ sơ mẫu làm counter nếu nhãn rõ; không dựng doanh số hoặc số năm kinh nghiệm giả.
5. **Giá trị Xland:** khám phá hồ sơ, xem thực địa, tìm hiểu NFT; mô tả khả năng theo giai đoạn, không hứa công nghệ 3D nếu chưa có trải nghiệm tương ứng.
6. **Người hỗ trợ và CTA:** persona minh họa có vai trò rõ. Trong 1A dẫn đến thông tin hỗ trợ ở detail; form/lịch thật chưa có thì không giả báo gửi thành công.
7. **Footer:** thương hiệu, điều hướng đã có và thông báo demo gọn. Không dùng số điện thoại/đối tác thật chưa được cung cấp.

## 6. PropertyCard

- Ảnh tỷ lệ 4:3, có kích thước cố định để tránh dịch layout; object-fit cover, crop theo fixture. Badge “Đang giới thiệu”/“Tạm dừng” cùng nhãn minh họa phù hợp.
- Thứ tự: vị trí → tên lô → diện tích/mục đích sử dụng → giá chào → người hỗ trợ. Đơn vị m², ₫; formatter dùng `vi-VN`. Không dùng bedrooms/bathrooms cho đất.
- Tiêu đề là link có nghĩa tới detail; nút lưu sau này tách khỏi link, không lồng button trong anchor. Trong 1A chưa triển khai lưu thì không hiển thị nút bấm giả.
- Hover trên thiết bị có chuột: nâng tối đa 4px, ảnh scale 1.03, transition 180–220ms. Focus bàn phím rõ, không cần hover để đọc thông tin. Tắt chuyển động khi reduced motion.
- Giá chưa công bố ghi “Liên hệ tìm hiểu”, không hiển thị 0 ₫. Không có ảnh dùng fallback cùng tỷ lệ kèm “Ảnh đang cập nhật”.

## 7. Chi tiết lô đất

- Breadcrumb về trang chủ/danh sách thực sự tồn tại, tên/vị trí, trạng thái và nhãn dữ liệu mẫu; slug không tồn tại trả 404.
- Gallery: desktop ảnh lớn + thumbnails, mobile một ảnh lớn và nút trước/sau; không phụ thuộc vuốt. Mô tả ảnh phân biệt cảnh quan/đường tiếp cận/ảnh minh họa. Có thể hoãn lightbox, không hoãn điều hướng ảnh.
- Desktop hai cột khoảng 2:1; trái nội dung, phải tóm tắt giá/diện tích/người hỗ trợ. Mobile một cột theo thứ tự đọc, CTA chạm tối thiểu 44px; nếu sticky phải có chừa đáy và safe-area.
- Thông tin: giá chào, diện tích, loại đất/mục đích, mặt tiền/đường tiếp cận, thời điểm cập nhật; khu vực/bản đồ minh họa được ghi đúng. Tài liệu mẫu không mang dấu chứng nhận giả.
- CTA 1A “Xem thông tin hỗ trợ” cuộn đến persona và giải thích lịch xem thực địa thuộc demo tương tác tiếp theo. Sang 1B thay bằng “Đề nghị xem thực địa” mở form có validation/trạng thái theo PREPARE.
- Tài sản có phương án NFT có thể hiện khối giới thiệu và thông số mẫu. Chỉ bật “Mua NFT” khi route/luồng 1B đã hoạt động; không đổi tên thành “suất tham gia”.

## 8. Dữ liệu, media và component

Fixture tập trung trong `src/data/` hoặc module demo, không lặp nội dung riêng từng page. Ít nhất 3 tài sản có id/slug ổn định, địa bàn, giá/diện tích, trạng thái, ảnh và persona hỗ trợ; một trường hợp tạm dừng để thử trạng thái. Home/card/detail dùng một nguồn dữ liệu. Phương án NFT tương lai liên kết tài sản bằng id, ERC-1155 ở giai đoạn backend.

Component dự kiến theo trách nhiệm: SiteHeader, SiteFooter, DemoBadge, HeroSearch, PropertyCard, PropertyGallery, PropertyFacts, SupportPanel. Tách khi thực sự tái sử dụng hoặc có tương tác độc lập; không tạo sẵn mọi module 1B.

Ảnh ưu tiên đất/cảnh quan/đường tiếp cận đồng bộ mỗi lô; chọn stock hoặc AI theo PREPARE. Ghi URL nguồn, tác giả/giấy phép khi có, phân loại AI/stock/thực và nơi dùng trong `docs/ASSETS.md` khi tuyển media. Không mặc định bốn JPG cũ đủ quyền hoặc phù hợp. Budget ban đầu hero mobile 250–400KB, card 60–150KB; kiểm tra chất lượng crop trước tối ưu sâu. Video feed ở 1B; 1A không cần autoplay video hero.

## 9. Trạng thái và khả năng truy cập

Input có label; lỗi bằng chữ gắn trường. Link cho điều hướng, button cho hành động. Không dùng `href="#"`/alert thay chức năng. Gallery có tên nút và thứ tự focus; ảnh trang trí alt rỗng, ảnh nội dung có mô tả phù hợp. Skeleton giữ kích thước media; lỗi media, empty filter, missing slug có đường tiếp tục. Không sử dụng riêng màu để diễn đạt trạng thái.

Mục tiêu tương phản chữ thường 4.5:1, chữ lớn 3:1; kiểm tra thực tế khi có font/ảnh. Có skip link, landmark và một H1 mỗi trang. Kiểm tra keyboard, zoom 200%, reduced motion, không tràn ngang; form/sheet tương lai cần quản lý focus. Mô phỏng luôn có nhãn, không hiển thị “đã xác nhận Blockchain” cho dữ liệu mock.

## 10. Điều kiện nghiệm thu 1A

- [ ] Chốt font sau thử dấu Việt; ghi cặp/weight thực tế tại mục 3.
- [ ] Lưu ảnh tham chiếu và ảnh home/card/detail cùng viewport vào `docs/references/` theo mốc, có mô tả nguồn/ngày; không báo đã lưu khi chưa tạo.
- [ ] Hero, header, CTA/search và card giữ đặc trưng mẫu; nội dung đất nền Xland rõ.
- [ ] Home → card → detail → quay lại hoạt động, gallery/search cục bộ có trạng thái; không có CTA vô tác dụng.
- [ ] Media có nguồn và nhãn minh họa; giá/diện tích/người hỗ trợ khớp giữa home/detail.
- [ ] Đạt kiểm tra viewport, bàn phím, focus, tương phản, reduced motion và fallback.
- [ ] `pnpm check` đạt; bổ sung test hành vi mới thay vì chỉ dựa smoke test scaffold.
- [ ] Ghi kết quả thật, ảnh đối chiếu và phần còn thiếu trong STATUS; chưa coi đây là nghiệm thu 1B hoặc production.

Việc chưa chốt: font sau thử glyph, bộ media và crop thực tế. Các giá trị spacing/kích cỡ có thể chỉnh khi đối chiếu ảnh; cập nhật tài liệu theo quyết định thực thi, không cần thêm vòng phê duyệt cho điều chỉnh thường lệ.
