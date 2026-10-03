# Xland — Lộ trình nâng cấp giao diện

Ngày soạn: 01/10/2026. Khảo sát bắt đầu 30/09/2026. **Đây là tài liệu triển khai, chưa phải giao diện đã nâng cấp.**

## Mục tiêu và vị trí trong lộ trình

Nâng chất lượng hình ảnh, nhận diện, tiểu tiết tương tác và chuyển động của Xland theo định hướng mobile first. Sunshine Group là tham chiếu mới về chất lượng trình bày theo yêu cầu chủ dự án; Xland vẫn có bản sắc riêng và các hành trình khám phá đất, lưu, lịch hẹn, NFT hiện có.

Nền mã khảo sát: `0bf496c` trên `main`, vòng chức năng 1B đã commit/push trước khi nghiên cứu. **1A có bằng chứng nghiệm thu; 1B mới hoàn thành một phần.** Việc hoàn tất lộ trình giao diện này không đồng nghĩa hoàn tất video, chuyên gia/consent, người đăng/theo dõi, đăng bán, backend hoặc toàn mốc 1B. Xem [STATUS](STATUS.md) và [PREPARE](../PREPARE.md).

Yêu cầu mới thay định hướng tham chiếu cho vòng nâng cấp này: học Sunshine ở nghệ thuật bố cục, tỷ lệ ảnh, nhịp kể chuyện và độ chăm chút. LUXEESTATE vẫn là lịch sử của bản 1A. Không sao chép logo, nội dung, video hoặc dự án Sunshine thành tài sản Xland.

## Bộ tài liệu

- [Nghiên cứu và khoảng cách hiện tại](ui-upgrade/RESEARCH.md): bằng chứng quan sát, giới hạn và quyết định chọn lọc.
- [Đặc tả thiết kế và hợp đồng chung](ui-upgrade/BRIEF.md): nhận diện, mobile, copy, media, GSAP, accessibility, hiệu năng.
- [Sổ bàn giao giữa các phase](ui-upgrade/HANDOFF.md): đầu mối ghi trạng thái ngắn; STATUS vẫn là nguồn tiến độ chính.
- [Ảnh tham chiếu đã chụp](references/2026-09-30-sunshine/README.md).

## Chạy từng phase

Mỗi file dưới đây có **một prompt có thể sao chép nguyên khối**. Chạy tuần tự, một phase mỗi phiên triển khai; bắt đầu P00. Prompt yêu cầu agent đọc hợp đồng chung và các file đúng phạm vi, thực hiện, kiểm tra rồi bàn giao. Không gửi cả 10 prompt trong một lượt. Không mặc định tạo nhiều agent hoặc sửa đồng thời `globals.css` và trang chủ.

| Phase | Kết quả cần có | Phụ thuộc | Quy mô dự kiến* |
| --- | --- | --- | --- |
| [P00 — Baseline](ui-upgrade/phases/P00-baseline.md) | Hiện trạng tái lập, ảnh trước, tuyến kiểm tra và blocker | Không | 2–4 file hỗ trợ/QA |
| [P01 — Nhận diện](ui-upgrade/phases/P01-identity.md) | Logo SVG, icon, token, button/focus đồng bộ | P00 | 5–7 file thực thi |
| [P02 — Media và chân dung](ui-upgrade/phases/P02-media.md) | Manifest, crop, media nội dung và avatar persona | P01 | 4–6 file + media |
| [P03 — Header, hero, footer](ui-upgrade/phases/P03-shell-hero.md) | Ấn tượng đầu tiên và điều hướng mobile | P02 | 4–6 file |
| [P04 — Giới thiệu Xland](ui-upgrade/phases/P04-xland-story.md) | Chương thương hiệu có ảnh và câu chuyện riêng | P03 | 3–5 file |
| [P05 — Bất động sản NFT](ui-upgrade/phases/P05-nft-story.md) | Chương NFT có sơ đồ và số liệu đúng nguồn | P04 | 3–5 file |
| [P06 — Chuyên viên và các màn hình](ui-upgrade/phases/P06-consistency.md) | Chân dung, card/detail và giao diện trạng thái đồng bộ | P05 | Hai lượt nhỏ trong cùng phase |
| [P07 — Nền GSAP](ui-upgrade/phases/P07-motion-foundation.md) | Một lớp motion có cleanup/fallback, một tích hợp thử | P06 | 4–6 file + lockfile |
| [P08 — Biên đạo chuyển động](ui-upgrade/phases/P08-motion-scenes.md) | Reveal ảnh và nhịp cuộn cho các chương đã dựng | P07 | 4–6 file |
| [P09 — Nghiệm thu](ui-upgrade/phases/P09-acceptance.md) | Bằng chứng responsive, chức năng, motion, hiệu năng | P08 | QA + sửa lỗi có giới hạn |

\* Là giới hạn lập kế hoạch, không phải quota cứng hay ước lượng context window của một model. Không tính file bằng chứng và cập nhật tài liệu. Nếu một phase phát sinh thay đổi ngoài phạm vi đáng kể, ghi điểm tách cụ thể vào HANDOFF trước khi triển khai tiếp; không nén QA để giữ số file.

## Cách giữ chất lượng trong context hữu hạn

1. Đọc `AGENTS.md`, `PREPARE.md`, phần hiện tại của `STATUS.md`, BRIEF và đúng prompt; tra DESIGN/ASSETS theo mục liên quan. Không nạp toàn bộ ảnh, log test, lịch sử chat hay mọi prompt vào cùng context.
2. Đọc implementation tại thời điểm chạy. Đường dẫn mới trong prompt là đề xuất; tái sử dụng component tương đương nếu phase trước đã tạo. Không dựng abstraction chỉ để khớp tên tài liệu.
3. Mỗi phase giải quyết một lớp trách nhiệm. P01–P06 dựng bản tĩnh đẹp và dùng được; P07–P08 thêm chuyển động; P09 kiểm tra tổng thể. Không đợi GSAP để làm bố cục đẹp.
4. Chừa khoảng một phần ba phiên làm việc cho đọc diff, kiểm tra và sửa lỗi. Đây là cách tổ chức công việc, không phải cam kết token hoặc thời gian.
5. Nếu phải đổi phiên, ghi: đã sửa gì, chưa sửa gì, file/selector/API quyết định, lệnh và kết quả thật, blocker và thao tác tiếp theo. Phiên mới đọc HANDOFF thay vì suy đoán từ ảnh.
6. Đạt phase nghĩa là có implementation và bằng chứng phù hợp. Có file, build xanh hoặc screenshot đẹp riêng desktop chưa đủ. Không tự chuyển mọi trạng thái thành “hoàn tất”.

## Điều kiện hoàn tất vòng nâng cấp

- Logo/icon/button/ảnh/avatar có cùng ngôn ngữ; mobile 360/390/430px có bố cục chủ động, chữ dễ đọc, CTA dễ chạm.
- Hai section Xland và NFT có cấu trúc thị giác riêng, nội dung ngắn rõ, dẫn đến hành trình hoạt động.
- GSAP làm rõ thứ tự xem và chiều sâu hình ảnh; reduced motion và khi module animation lỗi vẫn đọc và thao tác được.
- Các đường dẫn, bộ lọc URL, lưu, lịch, NFT/tồn/danh mục/reset giữ đúng hành vi hiện có.
- Có bằng chứng tại 360/390/430/768/1440px, bàn phím, zoom, lỗi ảnh, reduced motion, kiểm tra hiệu năng và `pnpm check` theo P09.
- Chưa đóng gate nếu WebKit vẫn sai viewport hoặc test còn lỗi. Giới hạn môi trường phải ghi rõ, không sửa assertion để làm xanh.
- `DESIGN.md` mô tả đúng CSS thực thi, `ASSETS.md` ghi quyền/nguồn thực tế, `STATUS.md` ghi kết quả thật và phần 1B còn thiếu.

**Trạng thái khi soạn:** nghiên cứu và 10 prompt đã viết; P00–P09 đều chưa triển khai. Không cài GSAP, không đổi source UI, font, fixture nghiệp vụ hoặc dependency trong phiên viết tài liệu.
