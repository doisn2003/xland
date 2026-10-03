# P02 — Nghệ thuật hình ảnh và chân dung

Đầu ra: media có nguồn, crop và metadata để các section dùng ngay. Phụ thuộc P01. Hợp đồng: [BRIEF C](../BRIEF.md).

```text
Thực hiện P02: chuẩn bị ảnh và chân dung người đồng hành cho vòng nâng cấp Xland. Tập trung chất lượng hình, crop mobile và tính nhất quán; chưa dựng lại home hay cài GSAP.

ĐỌC TRƯỚC
AGENTS.md, PREPARE.md, STATUS, docs/ASSETS.md, DESIGN, UI-UPGRADE và BRIEF A/C/D/F/G, HANDOFF P01. Đọc src/data/properties.ts, components/property-image.tsx, property-gallery.tsx, các nơi dùng property.advisor trong home/card/detail. Xem ảnh nguồn và asset hiện có trước khi chọn ảnh mới.

PHẠM VI
Media web mới, metadata media/advisor trong src/data nếu cần, PropertyImage/Avatar phục vụ fallback; ASSETS/DESIGN/STATUS/HANDOFF và bằng chứng crop. Dự kiến 4–6 file code/data. Không đổi id/slug/giá/diện tích/trạng thái tài sản, seed ledger hoặc package. Không sửa/xóa bản ảnh nguồn; tạo derivatives riêng. Không tải video Sunshine hoặc hotlink ảnh vào sản phẩm.

THỰC HIỆN
1. Lập bảng asset-slot: hero, Xland story, NFT story, 4 persona hỗ trợ hiện có, card/detail hiện hữu. Mỗi slot ghi ảnh hiện tại có thể tái dùng hay cần bổ sung, lý do crop/quyền/chất lượng. Chỉ thêm asset có nhiệm vụ cụ thể, không làm kho ảnh dự phòng lớn.
2. Chọn hero/cảnh quan thật có nguồn rõ; Xland story cần một ảnh có chiều sâu phù hợp đất/không gian sống Việt Nam. NFT story không dùng ảnh stock để ngụ ý tài sản đã xác minh; ưu tiên media đã gắn đúng property hoặc phối cảnh có phân loại nội bộ. Giữ phối hợp ảnh thật và ảnh ảo theo yêu cầu chủ dự án.
3. Chân dung: ưu tiên tạo riêng persona hư cấu với cùng ánh sáng tự nhiên, nền trung tính, crop vai/ngực, biểu cảm chuyên nghiệp gần gũi; không logo công ty khác, không huy hiệu, không chữ trong ảnh. Nếu dùng image generation, đọc và áp dụng skill imagegen, dùng công cụ tương ứng. Không gán khuôn mặt người thật lấy tùy ý vào tên fixture. Không phải tạo mỗi persona một phong cách khác nhau.
4. Tạo stable advisor id và mapping media tối thiểu. Giữ các tên/vai trò hiện có; nếu thêm advisorId vào fixture thì kiểm toàn bộ callsite, không thay shape nghiệp vụ lớn. Avatar component hỗ trợ kích thước nhỏ và chân dung, ảnh lỗi trả initials có thiết kế, alt không đọc lặp tên ngay cạnh. Không chọn ảnh theo array index.
5. Metadata asset gồm nguồn, loại, quyền/giới hạn, file nguồn, file web, dimensions/bytes, alt, focal point cho mobile/desktop, slot dùng. Với ảnh tạo: ghi ngày/công cụ/prompt tóm tắt và persona hư cấu trong ASSETS. Không bịa tên tác giả/giấy phép hoặc ghi đã xác minh tài sản.
6. Xuất file web theo budget BRIEF; crop riêng khi cùng ảnh không thể giữ chủ thể cả hai tỷ lệ. Khung có tỷ lệ cố định, sizes đúng layout, ảnh dưới fold lazy. Đọc Next Image docs bản cài trước khi đổi API. Nếu chỉnh PropertyImage, giữ preload/fallback hiện có và xử lý đúng đổi src sau lỗi.
7. Làm contact sheet kiểm: các persona cạnh nhau, Xland/NFT/hero ở 360/390/430/768/1440. Kiểm mặt/mắt/tay nếu ảnh tạo, đường kiến trúc, chữ/logo lạ, vùng đặt heading và vùng crop. Loại ảnh lỗi, không dùng overlay để che lỗi cấu trúc.

KIỂM TRA VÀ ĐIỀU KIỆN ĐẠT
Asset path tồn tại, không lỗi tải; trọng lượng và kích thước ghi đúng; cùng advisor có cùng chân dung ở mọi kích thước. Thử lỗi ảnh và ảnh thay src; layout không sập. Chạy lint/typecheck/unit liên quan nếu đổi code/fixture; kiểm model cũ không đổi kết quả. Lưu contact sheet và bảng network resource thực tế, không chỉ đo file gốc.

Nếu công cụ tạo hoặc nguồn quyền chưa có, hoàn thiện metadata/fallback và các asset còn lại, ghi chính xác slot còn thiếu; không báo đạt toàn bộ P02. Đừng tự mở rộng sang xây hồ sơ chuyên gia/consent.

BÀN GIAO
ASSETS có nguồn và giới hạn từng asset, DESIGN có crop/slot cuối, HANDOFF có asset id/path và API Avatar/PropertyImage để P03–P06 dùng. Cập nhật STATUS, kiểm diff không chứa ảnh nguồn bị sửa hoặc media không rõ quyền. Chỉ nối avatar ở nơi cần chứng minh hoạt động; bố cục chuyên viên hoàn chỉnh thuộc P06.
```
