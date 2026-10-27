# Sửa treo form tạo câu lạc bộ và sự kiện — 27/10/2026

## Nguyên nhân và thay đổi

Đã mở trực tiếp `/admin/events/new` trong trình duyệt in-app đang dùng localhost và ghi nhận lỗi React lặp lại: `Maximum update depth exceeded`. Tab `/admin/clubs/new` ban đầu bị treo đến mức lệnh kiểm tra tab không nhận được phản hồi; dùng tab mới trong cùng phiên trình duyệt để tái hiện và kiểm tra bản sửa.

`AdminWorkspace` đưa `loaded.catalog` và `loaded.locations` vào dependency của effect tải dữ liệu. `loadWorkspace` trả một mảng `locations: []` mới ở mọi route ngoài hồ sơ lô đất. Sau `setLoaded`, tham chiếu mảng đổi, effect lại chạy và tiếp tục `setLoaded`. Trang tạo mới không phải chờ request hồ sơ nên vòng lặp chạy đặc biệt nhanh, gây nghẽn luồng giao diện. Đây là lỗi ở khung quản trị chung, cũng ảnh hưởng form tư vấn viên và các trang danh sách ngoài lô đất.

Bản sửa giữ metadata trong `useRef`, cập nhật sau khi tải thành công và chỉ tải lại theo route, query hoặc retry. Route được biểu diễn bằng chuỗi ổn định, không phụ thuộc identity của mảng `segments`. Giữ AbortController, xử lý lỗi/401 và tải bản ghi mới sau khi lưu; không đưa dữ liệu bản ghi vào cache. Danh mục địa điểm đã tải được giữ khi điều hướng sang module khác.

## Kiểm tra trực tiếp và hồi quy

- In-app browser localhost: nhập tiêu đề/nhãn, đổi trạng thái sự kiện; nhập tiêu đề/tóm tắt/hoạt động câu lạc bộ, thêm mục media và nhập mô tả. Sau sửa không có lỗi JavaScript mới. Chỉ nhập draft trong phiên này, không tạo sự kiện/câu lạc bộ trên database dùng chung.
- `tests/admin/community-forms.spec.ts` có hai bài riêng cho clubs/events. Mỗi bài nhập liên tục, kiểm draft không mất, thêm/xóa mục, checkbox/select, lưu POST 201, reload và đọc lại bản ghi từ API, rồi điều hướng client sang form tư vấn viên và tiếp tục nhập. Backend Express/PostgreSQL QA thật, không mock API.
- Hai bài E2E admin đã đạt; listener kiểm cả console error và pageerror. Ảnh ở 360/390/430/768/1440px, không tràn ngang, reduced motion và Axe WCAG A/AA đạt.
- `clubs-{width}.png`, `events-{width}.png`: ảnh form QA trước khi lưu. `iab-clubs.png`, `iab-events.png`: thao tác trực tiếp trên localhost trong trình duyệt người dùng chỉ định, dữ liệu kiểm tra chưa lưu.

Kết quả kiểm tra toàn website ghi tại [STATUS](../../STATUS.md). Không thay schema, backend, quyền truy cập hoặc dữ liệu nghiệp vụ trong bản sửa này.
