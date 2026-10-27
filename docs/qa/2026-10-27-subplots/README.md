# QA — một hồ sơ, nhiều lô đất — 27/10/2026

Ảnh trong thư mục này được tạo bằng Playwright với Express và PostgreSQL QA cô lập. Không phải dữ liệu hoặc phiên đăng nhập production.

- `user-{360,390,430,768,1440}.png`: hồ sơ cha, tab Tổng quan và lưới hai cột. Có năm lô để kiểm tra trang đầu bốn lô và trang sau một lô đã bán; lô đầu có lô con tiếp theo.
- `admin-{360,390,430,768,1440}.png`: studio, thống kê diện tích, form tạo lô và danh sách sau khi tạo. Số tiền rất lớn được dùng để kiểm tra không làm tròn qua JavaScript Number.
- Flutter có widget test chụp ảnh khi `CAPTURE_SUBPLOTS=true`, lưu tại `xland-mobile/.local/subplots/mobile-{width}.png`. Dùng font Roboto và MaterialIcons của ứng dụng, kiểm tra thêm text scale 1.5. Đây là widget test, không phải máy Android/iPhone thật.

Luồng E2E user kiểm badge, bố cục 2×2, trang sau/trước, trạng thái đã bán, parent → child → grandchild → parent, reduced motion và Axe WCAG A/AA. Luồng admin kiểm tạo lô, diện tích còn lại, giá VND chính xác, chờ duyệt và bật studio ở lô con.

Các ảnh đã được xem đối chiếu. Đã sửa màu chữ phần đầu studio, giá bị cắt trên card web hẹp, badge Flutter dài và thanh phân trang khi chữ lớn. Không tắt kiểm tra tương phản hoặc che lỗi overflow để làm xanh test.

Chi tiết API, quy tắc kế thừa, RLS và rollout: [PROPERTY_SUBPLOTS](../../../../../xland-server/docs/PROPERTY_SUBPLOTS.md). Kết quả bộ kiểm tra và lỗi hồi quy ngoài tính năng: [STATUS](../../STATUS.md).
