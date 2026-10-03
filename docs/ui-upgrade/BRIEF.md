# Hợp đồng thiết kế và thực thi

Ngày 01/10/2026. Áp dụng cho P00–P09 trong [lộ trình](../UI-UPGRADE.md). Các giá trị dưới đây là **đề xuất cho vòng nâng cấp**, chưa phải tokens đang chạy. Khi P01 thực thi, ghi giá trị đã chọn vào `docs/DESIGN.md` cùng CSS; không để hai bộ đặc tả cạnh tranh.

## A. Những điều phải giữ

- Next.js/React/TypeScript/Tailwind, pnpm và runtime đã khóa; đọc hướng dẫn Next trong bản cài trước khi dùng API. Không nâng framework hoặc cài cả bộ UI vì cần một icon.
- Tiếng Việt, mobile first, dùng rõ từ NFT. Font mặc định tiếp tục Noto Serif 500/600 + Be Vietnam Pro 400/500/600 local. Kiểm dấu “Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫”.
- 10 hồ sơ cùng nguồn; giữ id, slug, giá, diện tích, nhóm, trạng thái và thứ tự danh mục. Không sửa query/model/store để làm bố cục thuận tiện hơn.
- Giữ URL filter, Back/reload, lưu nhiều tab, lịch chờ điều phối, NFT thành công/hủy/lỗi, tồn và reset. Không đổi namespace localStorage, nhận PII, ví thật, thanh toán, backend/admin hoặc smart contract.
- Nội dung sản phẩm không phủ nhãn demo/mẫu/minh họa. Tài liệu nội bộ ghi bản chất fixture và nguồn media; không dựng xác minh, sở hữu pháp lý, thành tích, số khách hàng, đánh giá hoặc lợi nhuận.
- Link thật, button thật, disabled có lý do. Không `href="#"`, alert thay luồng, link lồng button, CTA gọi Zalo/điện thoại chưa được cung cấp.

## B. Hướng nghệ thuật

**Xland: những miền đất có chiều sâu, thông tin có trật tự, người đồng hành gần gũi.** Chất lượng cao cấp đến từ crop ảnh tốt, tỷ lệ lớn/nhỏ, typography và chi tiết đồng nhất. Không biến mọi khối thành card trắng có shadow, không dùng hàng loạt gradient vàng hoặc ánh kim giả.

Nhịp trang đề xuất: **hero → search/danh mục hiện có → câu chuyện Xland sáng → chương NFT xanh đậm → người đồng hành sáng ấm → CTA/footer**. Search phải xuất hiện sớm. Giữ đủ 10 hồ sơ và điều khiển nhóm; không lén giảm danh mục nhằm rút chiều dài trang. Tối ưu thứ tự/số lượng trang chủ khác hiện tại là quyết định sản phẩm riêng.

### B1. Màu và vật liệu

| Vai trò | Giá trị đề xuất | Cách sử dụng |
| --- | --- | --- |
| Primary | `#164B60` | Button chính, link trên nền sáng |
| Primary hover / pressed | `#103B4D` / `#0B2C3B` | Phản hồi thao tác rõ, không flash |
| Ink | `#102D3B` | Tiêu đề, nền chương NFT/footer |
| Canvas / surface | `#FFFFFF` / `#F5F3EE` | Trắng và trắng ấm; độ đổi nền nhìn thấy nhưng nhẹ |
| Text / muted | `#243842` / `#5A6B73` | Nội dung chính/phụ, vẫn đo tương phản |
| Accent | `#B89962` | Đường kẻ, chi tiết logo/chỉ mục; không dùng chữ nhỏ trên trắng |
| On dark accent | `#D8C49D` | Nhấn trên nền Ink |
| Border | `#D7DEDF` | Phân vùng; không làm dấu focus duy nhất |
| Success / warning / danger | Giữ giá trị đang có nếu đạt | Màu trạng thái kèm chữ/icon; phân biệt với màu thương hiệu |

Map vào tên token hiện có, thêm token semantic khi có nơi dùng; không giữ mã hex rải rác. P01 phải đo chữ/nền/hover/focus thực tế. Primary trắng chữ, inverse nền sáng chữ Ink, secondary viền/chữ Primary, text link có phản hồi underline. Trên ảnh dùng overlay đủ tương phản, không dựa vào một vùng ảnh tình cờ tối.

### B2. Chữ, khoảng cách, hình khối

| Hạng mục | Mobile 360–430 | Desktop 1440 |
| --- | --- | --- |
| H1 | 38–44px, line-height 1.18–1.25 | 64–76px, 1.12–1.2 |
| H2 chương | 30–34px, 1.25–1.35 | 44–56px, 1.15–1.25 |
| Body | 16px, 1.65–1.8 | 16–18px, tối đa khoảng 60 ký tự/dòng |
| Eyebrow | 11–12px, tracking vừa, không ép chữ dài | 12px |
| Gutter | 20px; không dưới 16px | 32px, container 1200px |
| Section spacing | 56–72px, ưu tiên nhịp thật của nội dung | 96–120px |
| Button | Cao ít nhất 48px, label 14–16px | Cao 48–52px |

Đây là khoảng bắt đầu, không khóa line break bằng `<br>` hàng loạt. 768px là tablet có chủ ý: một hoặc hai cột theo chỗ trống, chưa ép bố cục desktop. Radius ảnh chủ đạo 4–8px; card 12px; control 8px; pill chỉ dành badge/chip. Nếu thay radius cũ, cập nhật token và kiểm toàn bộ form. Hairline, nền và khoảng cách là phân cấp chính; shadow chỉ nơi thực sự nổi.

### B3. Logo, icon, button

- Logo đề xuất: biểu tượng SVG riêng từ đường chân trời và hai nét gợi thửa đất/chữ X; wordmark Xland cân quang học. Không dùng biểu tượng Sunshine, không để font raster. Có màu đơn, inverse, biểu tượng 24/32px và lockup header/footer; logo link có tên truy cập duy nhất.
- Hệ icon: viewBox 24, nét khoảng 1.5–1.75, đầu/join tròn, optical bounds nhất quán. Icon 16/20/24 theo vị trí; icon đơn có vùng chạm 44–48px. Decorative `aria-hidden`; icon button có label. Giữ `Icon` hiện có, mở rộng có chọn lọc.
- Button: default, hover, pressed, focus-visible, disabled, pending. Hover chỉ với pointer fine/hover hover; arrow dịch 3–4px, không đổi kích thước nút. Pending giữ chiều rộng và có thông báo; disabled không animation. Focus nhìn rõ trên cả nền sáng/tối, không bị clip bởi mask ảnh.
- Không “magnetic cursor”, đổi con trỏ toàn trang, sparkle vô tận hoặc rung CTA. Trên touch phải hiểu trạng thái mà không hover.

## C. Media và người đồng hành

| Slot | Tỷ lệ đề xuất | Định hướng | Budget ban đầu cho file tối ưu* |
| --- | --- | --- | --- |
| Hero | Crop dọc theo chiều cao nội dung; desktop rộng | Cảnh quan/kiến trúc Việt Nam có khoảng thở đặt chữ | Mobile 250–400KB |
| Xland story | Mobile 4:5 hoặc 5:4; desktop 4:5 | Một ảnh chủ đạo có foreground/midground/background | 150–250KB mobile |
| NFT story | Mobile 4:3; desktop theo khung editorial | Tài sản/không gian gắn phương án, cộng sơ đồ HTML/SVG | 120–220KB mobile |
| Card | 4:3 | Nhất quán với detail cùng tài sản | 60–150KB |
| Avatar | 1:1 bản nhỏ; 4:5 bản chân dung | Ánh sáng tự nhiên, nền trung tính, trang phục lịch sự | 15–40KB bản nhỏ; 60–100KB chân dung |

\* Budget là mục tiêu, đo cả resource trình duyệt nhận qua image optimizer, không chỉ file gốc. Không hy sinh khuôn mặt/kiến trúc bằng nén quá mức để đạt số.

Chọn ảnh từ tài nguyên đã rõ quyền hoặc tạo riêng đúng skill khi triển khai. Mỗi asset cần id, file web, bản nguồn giữ nguyên, loại (ảnh thật/stock/phối cảnh/portrait persona), nguồn/ngày/quyền, alt, kích thước, byte, focal point desktop/mobile và nơi dùng. Nếu dùng ảnh người thật cần quyền cho ngữ cảnh; mặc định chân dung persona được tạo riêng, không giả chứng thực cá nhân có thật. Không thêm review, huy hiệu hoặc “đang online” giả.

Ảnh avatar cùng người phải giống nhau trên home/card/detail; stable advisor id là khóa, không index mảng. Tách metadata người hỗ trợ khỏi UI; không nhân bản hồ sơ nghiệp vụ. Nếu thiếu quyền/asset, fallback initials được thiết kế tốt và ghi rõ pending trong bàn giao, không coi P02 đạt phần chân dung.

Ảnh dưới fold lazy; khung giữ tỷ lệ từ đầu; dùng `PropertyImage`/Next Image phù hợp. Chỉ preload ứng viên LCP cần thiết. Nếu thay src sau lỗi, fallback phải phục hồi đúng khi đổi ảnh. Chưa cần tải video, remote image host hoặc thêm thư viện gallery.

## D. Hai chương trọng tâm

### D1. Xland story — giữ anchor `cach-hoat-dong`

Nội dung đề xuất:

> VỀ XLAND  
> Mỗi miền đất, một khởi đầu đáng hiểu.  
> Từ góc phố đến khoảng xanh, Xland đặt thông tin và người đồng hành cạnh nhau để bạn tìm hiểu một lựa chọn phù hợp.

Ba bước có tiêu đề và một câu: **01 Khám phá có chọn lọc** (khu vực/ngân sách/không gian); **02 Hiểu rõ từng lựa chọn** (hồ sơ/ảnh/lối tiếp cận); **03 Kết nối bước tiếp theo** (người hỗ trợ/xem thực địa/tìm hiểu NFT). Đó là mô tả chức năng đang có, không cam kết hồ sơ đã được thẩm định.

Mobile: eyebrow → H2 → lead → ảnh chính → ba hàng đánh số với divider → link “Khám phá các lô đất” tới `/lo-dat`. Desktop: ảnh chiếm khoảng 5/12, nội dung 6/12 và một cột khoảng thở; chỉ mục nằm trên cùng trục. Có thể dùng một hình đường địa hình rất nhẹ, chỉ trang trí. Không thêm ảnh thứ hai nếu chỉ làm rối. Chữ không nằm trong bitmap; link bàn phím không bị mask.

### D2. NFT story — giữ anchor `nft`

> BẤT ĐỘNG SẢN NFT  
> Một tài sản. Một phương án rõ ràng.  
> Khám phá cách phân đoạn bằng NFT, đọc số lượng và tỷ lệ trong phương án trước khi lựa chọn.

Nền Ink, tiêu đề trắng, nhấn champagne; ảnh tài sản và một panel sáng chứa thông tin. Một tuyến ba bước **Hồ sơ tài sản → Phương án NFT → Danh mục của bạn** bằng HTML/SVG nhỏ. Đây là sơ đồ quy trình, không phải bản đồ địa chính hay chia thửa pháp lý.

Ví dụ lấy từ phương án mở bán trong fixture: tổng cung 1.000 NFT; 1 NFT tương ứng 0,1% theo phương án; 10 NFT là 1%; giá lấy từ model hiện có. Tất cả tính từ nguồn thật của ứng dụng, không hardcode bản sao trong copy. Nếu hiển thị tồn, phải dùng state hiện hành và xử lý hydration; mặc định section marketing chỉ dùng tổng cung/tỷ lệ tĩnh để tránh nhầm tồn ban đầu với tồn sau mua. Không diễn đạt tỷ lệ này như giấy chứng nhận quyền sở hữu đất hoặc diện tích vật lý cụ thể.

Mobile: heading/lead → media → panel/sơ đồ tuyến dọc → CTA “Tìm hiểu phương án NFT” tới `/nft`. Desktop dùng hai vùng lệch cân bằng, panel chồng nhẹ trong vùng ảnh có kích thước dự phòng; không nổi đè nội dung tại 360px. Không nhúng purchase form vào trang chủ. Giữ nội dung xác nhận không thanh toán trong luồng đang có.

## E. Motion contract — đề xuất GSAP

GSAP chỉ phụ trách trình bày. Native scroll là mặc định; không ScrollSmoother/Lenis, scroll hijack, pin trên mobile, carousel tự chạy hay text split theo từng ký tự tiếng Việt trong vòng này. Hover button/icon vẫn CSS.

| Scene | Mobile | Desktop | Reduced motion |
| --- | --- | --- | --- |
| Hero | Chữ/CTA hiện ngay; ảnh có thể settle scale 1.025→1 trong 700–900ms | Tương tự, tối đa 1.04→1 | Ảnh và chữ tĩnh |
| Xland ảnh | Reveal ngắn từ crop sẵn + opacity/translate ≤12px, 550–700ms | Mask từ inset 8%→0 và scale 1.04→1, 800–1000ms nếu profile đạt | Bỏ mask/transform |
| Xland steps | Xuất hiện theo nhóm, stagger ≤60ms, tổng ≤900ms | Reveal 16–24px, stagger ≤90ms | Hiện đầy đủ |
| NFT | Sơ đồ hiện theo bước, không chạy số giá/tỷ lệ | Có thể thêm parallax ảnh ≤24px, một scene duy nhất | Sơ đồ và số cuối tĩnh |
| Chân dung | Reveal nhẹ một lần khi vào viewport | Stagger ≤80ms, crop không cắt mặt | Hiện đầy đủ |

Timing là trần khởi điểm, điều chỉnh sau xem clip. Easing gợi ý `power2.out`/`power3.out`; không bounce/elastic cho ảnh bất động sản. Không delay CTA để chờ biểu diễn. Không chạy scrub cho text hoặc form; parallax desktop tùy chọn, tắt nếu tốn tài nguyên hoặc giảm đọc hiểu.

P07 cài `gsap` và `@gsap/react` với phiên bản cụ thể đã kiểm tương thích/giấy phép tại lúc cài, qua pnpm; chưa ấn định phiên bản chưa khảo sát trong tài liệu. Dùng `useGSAP` scoped ref và `gsap.matchMedia`; mọi trigger/listener/observer và callback muộn phải có ownership/cleanup. Không gọi `killAll()` toàn cục lúc một component unmount. Hạn chế client code ở motion island; không đổi page/layout thành client và không import fixture server vào runtime animation.

Default HTML/CSS đọc được. Chỉ chuẩn bị trạng thái bắt đầu sau khi điều kiện motion và module đã sẵn sàng, trước một reveal chưa đi qua. Nếu người dùng tới anchor/scroll restoration nhanh hoặc tab focus vào vùng, hiện ngay thay vì giấu lại. Không để `opacity:0` toàn section trong stylesheet chờ JS. Lỗi import/ảnh/font không được khiến nội dung biến mất. Kích thước media định trước; refresh được gộp sau thay đổi layout thực sự, không gọi mỗi scroll/từng frame. Hủy tác vụ bất đồng bộ khi unmount.

Kiểm route đi/về 5 lần, resize qua breakpoint, reduced motion đang bật và bật sau mount, mạng chậm/ảnh lỗi, deep link tới anchor, Tab nhanh qua section. Motion không được tạo duplicate trigger, stale inline style, focus vô hình hoặc hydration warning. CSS và GSAP không cùng ghi transform trên một node; tách wrapper khi cần.

## F. Kiểm tra và thước đo

- Mọi phase UI: chụp/xem vùng đổi ở 360/390/430/768/1440; thêm trạng thái tương tác liên quan, bàn phím, zoom 200%, reduced motion. Ghi viewport yêu cầu **và đo được**, commit, route, state, browser.
- Tương phản chữ thường ≥4,5:1; chữ lớn ≥3:1; focus/điều khiển đủ phân biệt. Đo trên nền ảnh thật; axe không thay kiểm tra mắt/keyboard.
- Mỗi phase thực thi chạy lint/typecheck và test liên quan. Trước bàn giao vòng nâng cấp P09 chạy `pnpm check` toàn bộ, không skip, không cho test rỗng, không sửa assertion hành vi chỉ để hợp thẩm mỹ mới.
- Performance mục tiêu: mobile LCP ≤2,5s, CLS ≤0,1 trong cấu hình lab cố định; ghi median của 3 lần production build, cấu hình mạng/CPU/viewport/cache và phiên bản công cụ. INP ≤200ms là mục tiêu trải nghiệm/field, không báo đạt từ Lighthouse một mình.
- Ngân sách dự án đề xuất cho motion: phần JS nén tăng không quá 60KB trên home so với P06 trong cùng cách đo; route form/reset không tải GSAP do import toàn cục. Nếu vượt, phân tích chunk/cắt scene trước khi nới budget có giải trình. Đây không phải số đã đo của GSAP.
- Ghi trace tương tác scroll/filter/menu; không có long task lặp lại do animation, không tuyên bố “60fps” bằng cảm nhận. Không giữ `will-change` trên hàng chục ảnh suốt phiên.
- QA tạm (trace/log/build) giữ gitignored; chỉ đưa bằng chứng tuyển chọn có mô tả vào `docs/qa/ui-upgrade/<phase>/`. Screenshot tham chiếu Sunshine ở thư mục references, không đưa vào public.

## G. Cổng bàn giao chung

Đọc diff và bảo đảm không lẫn secret, build, nguồn/PDF bị sửa hoặc thay đổi ngoài scope. Cập nhật DESIGN/ASSETS theo điều đã làm; STATUS ghi lệnh và kết quả thật, HANDOFF ghi quyết định/file cần đọc tiếp. Không tự deploy hoặc tuyên bố hoàn tất 1B. Không đặt thêm vòng xin duyệt cho các chỉnh khoảng cách/crop thông thường đã nằm trong yêu cầu nâng cấp.
