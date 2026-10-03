# Nghiên cứu giao diện — Xland × Sunshine

Khảo sát 30/09–01/10/2026. Nền Xland `0bf496c`. Phân biệt ba loại thông tin: **quan sát trực tiếp**, **đọc mã/tài liệu**, **đề xuất cho Xland**.

## 1. Quan sát Sunshine

Đã mở [trang chủ Sunshine Group](https://sunshinegroup.vn/) trong trình duyệt, xem đầu trang và cuộn qua phần giới thiệu ở desktop và mobile. Desktop yêu cầu/đọc được 1440×1000; mobile yêu cầu 390×844, một lần đọc DOM được 391×845. Đây là khảo sát thiết kế trên trình duyệt desktop, không phải chứng nhận iPhone thật hoặc audit toàn website.

| Quan sát trực tiếp | Bài học cho Xland |
| --- | --- |
| Hero dùng media kiến trúc lớn, chữ sáng đặt trên ảnh, logo có hình riêng | Tạo điểm nhìn và nhận diện trước khi thêm trang trí |
| Header desktop nhiều tầng, mobile thu gọn; xanh đậm/vàng xuất hiện trong nhận diện | Xland cần logo và bề mặt thương hiệu nhất quán, nhưng menu phải phục vụ tác vụ của Xland |
| Chương giới thiệu xen ảnh lớn với vùng trắng, có nền đồ họa công nghệ | Mỗi section cần một hình ảnh chủ đạo và nhịp chuyển nền rõ |
| Khu vực ngành nghề có ảnh, số thứ tự và lớp chữ phủ | Có thể dùng chỉ mục 01–03 cho câu chuyện Xland; đó là số bước, không phải thành tích |
| Mobile có đoạn giới thiệu dài; một số chữ trắng nằm trên cảnh sáng | Không bê nguyên mật độ copy hoặc mặc định tương phản trên mọi khung hình đã tốt |

Đọc DOM cho thấy ba phần tử video có autoplay/muted/loop; một số H2 desktop dùng Montserrat 24px, màu `rgb(28, 71, 124)`. Đây là mẫu quan sát tại thời điểm khảo sát, không phải toàn bộ design system. **Chưa xác minh thư viện chuyển động của Sunshine, timing, hover từng nút, điểm hiệu năng hoặc accessibility của họ.** Yêu cầu GSAP đến từ chủ dự án; tài liệu này không khẳng định Sunshine được dựng bằng GSAP.

Bằng chứng: [danh mục 7 ảnh](../references/2026-09-30-sunshine/README.md). Ảnh tham chiếu chỉ dùng nghiên cứu nội bộ; không phải media có giấy phép để đưa lên Xland.

## 2. Khoảng cách của Xland

Đã đối chiếu ảnh người dùng gửi, trang chủ local và mã nguồn. Các nhận xét sau là đánh giá thiết kế, không phải kết quả benchmark:

| Vị trí | Hiện tại | Hướng nâng cấp cụ thể |
| --- | --- | --- |
| Logo/header | Wordmark chữ + chấm nhỏ, ít đặc trưng | Dấu hiệu “miền đất/đường chân trời” bằng SVG riêng; căn quang học cùng wordmark; biến thể sáng/tối |
| Icon | 8 icon SVG outline riêng | Giữ hệ SVG nhẹ; chuẩn nét, khung, kích thước, trạng thái; bổ sung đúng icon thiếu |
| Button | Xanh, bo 12px, hover đổi nền | Hệ primary/secondary/inverse/text; tương phản, pressed, focus, pending, disabled đầy đủ |
| Giới thiệu `#cach-hoat-dong` | Ba icon và ba đoạn ngắn giống nhau, thiếu ảnh chủ đạo | Một ảnh lớn + tiêu đề chủ động + ba bước biên tập theo hàng, có đường dẫn thật |
| NFT `#nft` | Một ảnh nhà vườn và checklist chung | Chương nền đậm, ảnh tài sản và sơ đồ hồ sơ → phương án → danh mục, kèm ví dụ từ fixture |
| Người đồng hành | Vòng tròn initials, card ít thông tin phân cấp | Chân dung persona có art direction chung; ảnh lớn hơn, vai trò và CTA rõ; không dựng huy hiệu xác minh |
| Media | Có ảnh thật và phối cảnh, một số nơi dùng crop chung | Định nghĩa focal point mobile/desktop, aspect ratio và dung lượng theo slot |
| Motion | Chủ yếu CSS hover ngắn | Hai lớp GSAP: nền kỹ thuật an toàn và biên đạo từng chương; giao diện tĩnh vẫn hoàn chỉnh |
| Các luồng 1B | Đã có filter/lưu/lịch/NFT/reset | Nâng lớp trình bày; không viết lại model/store trong vòng thẩm mỹ |

Điểm mạnh nên giữ: font Noto Serif/Be Vietnam Pro đã kiểm dấu Việt; fixture dùng chung 10 tài sản; URL filter và state có kiểm thử; local fonts/media; cấu trúc Server/Client đã phân trách nhiệm; không bắt người xem cài ví.

## 3. Quyết định đề xuất

**Định hướng: kiến trúc sáng, chiều sâu xanh đậm, điểm nhấn champagne tiết chế.** Duy trì serif tiếng Việt để Xland có giọng riêng. Dùng ảnh để tạo cảm giác cao cấp, dùng chữ và khoảng cách để giải thích; bỏ tư duy mỗi section là một hàng card bo góc giống nhau.

- Desktop: bố cục lệch cân bằng, ảnh lớn, vùng chữ vừa đọc; tránh các khoảng trắng vô nghĩa.
- Mobile: kể chuyện tuyến tính, ảnh được crop riêng, không biến thành desktop thu nhỏ; ưu tiên tác vụ tìm đất, không bắt cuộn qua nhiều màn thương hiệu mới dùng được search.
- NFT: diễn đạt một cách tham gia theo phương án, số lượng và tỷ lệ. Không dùng đồng xu bay, biểu đồ giá tăng, lãi suất hoặc huy hiệu blockchain đã xác minh để tạo cảm giác tin cậy giả.
- Avatar: chân dung đồng bộ thay initials làm hình chính; fallback initials vẫn cần. Persona/nguồn/quyền ghi trong ASSETS, không gán người thật vào hồ sơ giả bằng ảnh stock tùy tiện.
- Video hero chưa phải điều kiện vòng này. Ảnh tĩnh đẹp, nhanh và reveal nhẹ là lựa chọn mặc định; video chỉ thêm khi có tư liệu/quyền và budget đo được trong phạm vi riêng.

## 4. Căn cứ kỹ thuật

- [GSAP React](https://gsap.com/resources/React/): hook chính thức hỗ trợ lifecycle/cleanup trong React. Áp dụng ở client island, không chuyển toàn trang sang client vì animation.
- [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/): xử lý khác biệt breakpoint và reduced motion, hoàn nguyên khi điều kiện đổi.
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): đồng bộ chuyển động với vị trí cuộn; đo lại khi layout thay đổi. Đây là công cụ thực thi, không phải lý do ép mọi phần tử đều animation.
- [Web Vitals](https://web.dev/articles/vitals): mốc tốt LCP ≤2,5s, INP ≤200ms, CLS ≤0,1; đánh giá field dùng phân vị 75. Lab trong dự án chỉ là kiểm tra có điều kiện đo, không đủ chứng nhận field INP.
- Đã đọc tài liệu **bản Next.js đang cài**: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `12-images.md`, `01-app/02-guides/lazy-loading.md`. Agent triển khai đọc lại mục API liên quan theo phiên bản lúc chạy, nhất là image preload/sizes và client boundary.

## 5. Giới hạn nghiên cứu

Không đo chính xác easing/duration của Sunshine từ screenshot. Không audit các trang con, pháp lý hoặc hiệu quả kinh doanh của họ. Không chấm Xland đã đạt thị giác sau nâng cấp vì chưa có implementation. Các số spacing, màu, duration và budget trong BRIEF là **quyết định đề xuất để thực thi và đo**, không phải CSS sao chép hay kết quả đã đạt.

QA hiện có của Xland vẫn là lịch sử 30/09: 42 unit đạt, 74/81 E2E đạt, 7 lỗi WebKit liên quan viewport/overflow. Nghiên cứu này không chạy lại hoặc thay thế kết quả đó.
