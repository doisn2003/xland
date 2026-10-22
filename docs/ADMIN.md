# Xland Admin — phân tích, kế hoạch và vận hành

Cập nhật: 22/10/2026. Phạm vi đã được chủ dự án mở rộng sang fullstack Admin. Mã nguồn website nằm tại `xland-website/xland`; API nằm tại `xland-server`. Các route website user đang có được giữ lại, không kết nối sang dữ liệu thật trong phiên này.

## 1. Kết quả khảo sát

- Server: Express 5, TypeScript, `pg`, Zod; endpoint hiện hữu dưới `/api/v1`.
- PostgreSQL: schema `xland`, migration có checksum; tất cả bảng ứng dụng bật FORCE RLS. Các vai trò SQL riêng phục vụ API, xác thực, thanh toán và bản đồ.
- Xác thực mobile: bearer token ngẫu nhiên, DB chỉ giữ SHA-256 digest, thời hạn 24 giờ; mật khẩu Argon2id. Role nghiệp vụ lưu trong `user_roles`, khác với `public_role` dùng hiển thị.
- Supabase đích được xác minh qua fingerprint `03d6c297d77a1029`, vẫn giữ phân loại môi trường `supabase_mock` hiện có; không tự đổi thành production.
- Trước thay đổi: 20 lô đất, 96 video, 8 tư vấn viên, 9 lịch hẹn. Bucket cũ `public-media` chỉ nhận PNG/MP4 và giới hạn 15 MB.
- Website có palette xanh `#164b60`, nền sáng `#f5f3ee`, điểm nhấn `#b89962`; font Be Vietnam Pro và Noto Serif. Admin dùng lại các token này.

### Các nghiệp vụ và quan hệ

| Module | Bảng chính | Luồng quản trị |
| --- | --- | --- |
| Lô đất | properties, geo_locations | Tạo/sửa thông tin, giá/diện tích, địa giới, tọa độ, nguồn và kiểm duyệt; mở các hồ sơ con từ trang chi tiết |
| Video feeds | videos, property_media, user_profiles | Chọn lô/người đăng; tải video/ảnh bìa; caption, thời lượng, thời gian đăng, kiểm duyệt; ẩn bằng deleted_at |
| Tư vấn viên | consultants, user_profiles, user_contacts, user_roles | Tạo hồ sơ và liên hệ trong một transaction; đồng bộ tên, avatar, vai trò công khai khi chỉnh sửa |
| Lịch xem thực địa | site_visit_bookings, booking_status_history, slot_reservations | Danh sách toàn hệ thống, liên hệ khách, nhu cầu hỗ trợ, phân công, trạng thái, lịch sử và trạng thái cọc |
| Khung giờ | site_visit_slots | Tạo lịch có sức chứa/điểm hẹn; đóng nhận lịch; bảo vệ khung giờ đã có khách |
| Pháp lý | property_legal_items | Checklist, ngày kiểm tra, trạng thái, thứ tự |
| Tài liệu | property_documents | File, MIME, dung lượng, ngày tải, quyền truy cập, bản xem trước đã che thông tin |
| Tiện ích | property_nearby_amenities | Loại tiện ích, khoảng cách, biểu tượng và tọa độ xấp xỉ |
| Hỗ trợ | support_requests | Tra cứu nội dung/consent/liên hệ, phân công và xử lý trạng thái |
| Sự kiện | events, event_registrations | Tạo/sửa sự kiện, chương trình, diễn giả, quyền lợi; xem đăng ký |
| Câu lạc bộ | clubs | Nội dung, khu vực, hoạt động, media và đầu mối hỗ trợ |
| Người dùng | user_profiles | Xem hồ sơ; không cung cấp API sửa quyền hoặc đọc hash/token |
| Nhật ký | admin_audit_log | Theo dõi người thực hiện, module, hồ sơ và tên các trường đã thay đổi |

## 2. Kế hoạch triển khai và kết quả

1. **Đối chiếu nghiệp vụ/schema/API/mobile:** đã đọc migration 0001–0011, repository/service/HTTP schema và mapper Dart. Giữ nguyên URL, DTO, logic xác thực và payment của mobile.
2. **Nền phân quyền:** migration `0012_admin_workspace.sql`, role nghiệp vụ `admin`, role SQL `xland_admin` NOLOGIN/NOINHERIT/NOBYPASSRLS và nhật ký chỉ thêm mới. API kiểm tra role mỗi request và trong transaction ghi.
3. **API Admin:** namespace `/api/v1/admin`, danh sách phân trang/tìm kiếm/lọc, metadata schema, hồ sơ chi tiết, tạo và cập nhật; không mở API SQL hoặc bảng tùy ý.
4. **Website Admin:** `/admin/login`, dashboard, sidebar, 15 module. Form nhận metadata từ schema thực; các nhóm lồng có nút thêm/xóa và upload tương ứng.
5. **Storage:** upload trực tiếp bằng URL ký từ backend, lưu URL/key vào PostgreSQL; tách bucket media công khai và tài liệu riêng tư.
6. **Tích hợp & kiểm chứng:** kiểm thử PostgreSQL riêng, kiểm tra các DTO qua oracle từ Dart, kiểm thử giao diện, đối chiếu dữ liệu trước/sau và cập nhật tài liệu.

## 3. Hợp đồng API mới

Next.js gọi server qua `XLAND_ADMIN_API_URL`. Trình duyệt chỉ gọi `/admin/api/*` trên cùng website. URL backend, DB và service key không đưa vào biến `NEXT_PUBLIC_*`.

| Method/path (sau `/api/v1/admin`) | Request / kết quả |
| --- | --- |
| POST /session | `{username,password}` → bearer token + session; chỉ tài khoản role admin |
| GET /session | Hồ sơ + role, yêu cầu bearer hợp lệ |
| DELETE /session | Thu hồi session trên PostgreSQL |
| GET /schema | Metadata từng module: tất cả cột, kiểu, required/readonly, mặc định, enum, tham chiếu |
| GET /overview | Số liệu thực tế và nhật ký gần đây |
| GET /locations | Danh mục tỉnh/huyện và phiên bản địa giới hiện có |
| GET /lookups/:entity?q=&id= | Tìm quan hệ, tối đa 50 kết quả, giữ hồ sơ đang chọn |
| GET /:entity?q=&page=1&limit=25&filter=&value= | Danh sách; tối đa 50/trang; bộ lọc thuộc allowlist của module |
| GET /:entity/:id | Toàn bộ hồ sơ, `_version`; video có media, tư vấn viên có contact, booking có history/payments |
| POST /:entity | Các cột snake_case có thể nhập; video có thêm object `media`; tư vấn viên có `contact` |
| PATCH /:entity/:id | Các cột được phép + `_version` đang hiển thị; 409 nếu hồ sơ đã đổi |
| POST /uploads | `{mimeType,size,privateDocument}` → URL upload ký, storageKey, publicUrl nếu công khai |

Không có hard delete. Lô đất có thể tạm dừng, video có thể ẩn, khung giờ có thể đóng. Các danh sách người dùng, đăng ký sự kiện và nhật ký là chỉ đọc. Hỗ trợ/lịch hẹn chỉ sửa các trường điều phối, không sửa yêu cầu gốc hoặc snapshot tài chính.

### Quy tắc form

- Kiểm tra tự động metadata của cả 15 module khớp toàn bộ cột `information_schema.columns`.
- ID, created_at/updated_at, giá/m² và ngày/giờ sinh tự động là trường hệ thống. Lượt xem, người theo dõi, số video và rating là chỉ đọc.
- Giá tiền/decimal truyền dưới dạng chuỗi, giữ chính xác cả giá trị lớn hơn `Number.MAX_SAFE_INTEGER`.
- Chọn mã tỉnh/huyện tự điền tên và phiên bản; backend xác minh cùng cây địa giới. Tọa độ chính xác là dữ liệu riêng của Admin.
- Điểm nổi bật dùng `{title,description}`; không chuyển thành mảng chuỗi làm hỏng mapper mobile. Agenda/speakers/benefits/media giữ nguyên cấu trúc DTO mà Dart đọc.
- Giao diện ngày giờ dùng UTC+7; API ghi ISO có offset và PostgreSQL lưu timestamptz.
- Video và media được tạo trong một transaction; nếu bất kỳ phần nào không hợp lệ, cả hai đều rollback.
- Lưu form thất bại giữ nội dung đang nhập và hiển thị lỗi; phát hiện bản ghi sửa đồng thời bằng `_version` từ PostgreSQL xmin.

### Quy tắc lịch hẹn

- awaiting_deposit → cancelled/rejected/expired; pending_confirmation → confirmed/rejected/cancelled; confirmed → completed/no_show/cancelled.
- cancel_requested → cancelled; reschedule_requested → cancelled/rejected. Admin chưa triển khai chuyển sang khung giờ khác hoặc hoàn tiền.
- Cập nhật trạng thái phải có lý do, được ghi vào history cùng transaction; kết thúc/hủy giải phóng reservation.
- Xác nhận/hoàn tất bắt buộc có cọc được xác minh theo trigger hiện có. Không tạo receipt giả hoặc mở thanh toán thật.
- Không giảm sức chứa dưới số khách/lịch đã nhận; không đổi thời gian/lô của khung giờ đang được giữ chỗ.

## 4. Storage và session

- `xland-admin-media`: public, JPEG/PNG/WebP/MP4/WebM, tối đa 50 MiB/file.
- `xland-admin-documents`: private, PDF/JPEG/PNG, tối đa 20 MiB/file.
- Bucket `public-media` cũ không thay đổi. File mới nằm trong đường dẫn UUID dưới user ID; không ghi đè object.
- Trình duyệt upload thẳng Supabase, có tiến độ; không gửi video lớn qua Next.js/Vercel function.
- Tài liệu gốc tải vào bucket private; ảnh preview phải được người quản trị che thông tin trước khi upload công khai.
- Cơ chế download tài liệu dành cho mobile vẫn giữ dependency gate hiện có; Admin cung cấp quản lý metadata/upload, không tự thay đổi chính sách cấp quyền download.
- Cookie phiên Admin: HttpOnly, SameSite=Strict, Secure trên HTTPS, path `/admin`; token không lưu localStorage, không trả lại cho JavaScript.
- Backend giới hạn đăng nhập bằng bộ đếm PostgreSQL. BFF kiểm tra Origin/Host cho các mutation. Mật khẩu khởi tạo 6 ký tự chỉ được xử lý bởi endpoint Admin; quy tắc login mobile giữ nguyên.
- Nhật ký lưu tên trường, không sao chép mật khẩu, token, nội dung tệp hoặc thông tin liên hệ.

## 5. Chạy trên máy này

Tài khoản đã provision: **admin / 123456**. Script setup chạy lại không đổi mật khẩu hoặc chiếm tài khoản trùng tên.

Từ thư mục `xland-server`:

```powershell
npm run admin:dev
```

API nghe `127.0.0.1:3005`; script đọc các overlay riêng đã có, gồm `.env.supabase-mock`, `.env.auth`, `.env.geoapify`, `.env.p3-enrichment`. Không in secret.

Từ thư mục `xland-website/xland`, `.env.local` đã đặt:

```dotenv
XLAND_ADMIN_API_URL=http://127.0.0.1:3005/api/v1/admin
```

```powershell
pnpm build
pnpm start --hostname 127.0.0.1 --port 3200
```

Mở **http://127.0.0.1:3200/admin**. Node mặc định trên máy là 20; cần PATH Node 24 như hướng dẫn README trước khi chạy pnpm/backend.

### Khi đưa lên hosting

1. Build/deploy `xland-server` cùng các biến DB/CURSOR_SECRET đã có và `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (hoặc service-role key) ở môi trường server.
2. Migration 0012 đã có trên Supabase đích; môi trường khác cần backup, migrate và provision Admin bằng script có target guard. `admin:setup` hiện được viết cho đúng Supabase của dự án này.
3. Deploy Next.js và đặt `XLAND_ADMIN_API_URL=https://<backend>/api/v1/admin`; đặt `XLAND_ADMIN_WEB_ORIGIN=https://<website>` nếu qua reverse proxy. Không đặt key DB/Storage trên web client.
4. Kiểm tra health, login, upload, role 403 và một lượt lưu hồ sơ trước khi sử dụng.

Đã triển khai mã nguồn, áp dụng DB/Storage và chạy preview local. Việc push mã nguồn lên `main` không xác nhận bản Admin đã được phát hành thành công trên Railway/Vercel; hosting cần kiểm tra cấu hình và kết quả deployment riêng.

## 6. Kiểm thử

```powershell
# xland-server
npm run test:admin
npm test
npm run test:integration
npm run test:contract
npm run typecheck
npm run lint
npm run build

# xland-website/xland
pnpm check
pnpm test:admin
```

`test:admin` website tự dựng PostgreSQL/API riêng ở cổng 3006, Next ở 3101. Chỉ ghi dữ liệu QA vào database `xland_test_admin_*`, không ghi hồ sơ giả vào Supabase dùng chung. Ảnh QA nằm trong `docs/qa/admin/`. Runner của bộ kiểm thử cũ đã được cập nhật để nhận các bảng additive 0009–0012; oracle chỉ cho phép bỏ `description` ở AgendaItem/Speaker đúng như mapper Dart hiện hành.

Kết quả chạy cuối và các giới hạn còn lại được ghi ở `docs/STATUS.md`.

## 7. Giới hạn có chủ đích

- Chỉ role Admin có workspace này; không có màn hình quản lý cấp/thu role hoặc tài khoản tư vấn viên đăng nhập riêng.
- Địa giới nhập từ catalog đã có; chưa có module biên tập/thay phiên bản catalog.
- Không triển khai website user live, thanh toán, hoàn tiền, thay lịch xuyên slot, NFT/smart contract, gửi email/SMS hoặc transcode video.
- File đã upload nhưng chưa lưu form có thể còn trong bucket; chưa có tác vụ tự dọn file mồ côi. Không tự xóa media cũ vì có thể còn được tham chiếu.
- Số liệu dashboard là số đếm vận hành, chưa phải báo cáo doanh thu.
