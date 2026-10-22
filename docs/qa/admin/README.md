# Bằng chứng Admin — 22/10/2026

- `overview-{360,390,430,768,1440}.png`: overview trên database QA riêng; đã kiểm tra không tràn ngang.
- `property-editor-1440.png`, `property-editor-390.png`: form lô đất, điểm nổi bật và liên kết hồ sơ con.
- `live-overview-1440.png`: preview kết nối PostgreSQL/Supabase của dự án.
- `backend-checks.json`: 83 kiểm tra PostgreSQL Admin cô lập.
- `live-smoke.json`: browser login, upload thật qua BFF/API/Supabase, kiểm tra byte/key/URL và logout. File probe đã dọn; không lưu hồ sơ mẫu vào DB dùng chung.
- `video-smoke.json`: upload MP4 thật từ form feed; trình duyệt đọc được metadata/thời lượng 4 giây. File probe đã dọn; không tạo feed mẫu trên DB dùng chung.
- `target-verification.json`: restore backup trước migration (41 bảng, 691 dòng), đối chiếu dữ liệu; không chứa password, token, URL DB hoặc liên hệ khách hàng.

UI test: `tests/admin/admin.spec.ts`; config: `playwright.admin.config.ts`. API test: `xland-server/tests/admin/run-local.mjs`. Trace/debug log không commit.

Hồi quy user cuối: 110 ca đạt lượt chính; 4 ca còn lại (3 timeout, 1 reset assertion) đạt khi chạy riêng với một worker. Không bỏ qua hoặc đổi assertion test user. Xem [STATUS](../../STATUS.md).
