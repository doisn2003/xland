# Website user tích hợp backend — 26/10/2026

Tài liệu bàn giao mã nguồn theo [kế hoạch tích hợp](XLAND-SERVER-INTEGRATION-PLAN.md).
Website dùng cùng `/api/v1`, UUID và danh tính Xland với Flutter. Bản cập nhật này
chưa được triển khai lên Vercel/Railway. Không migrate, seed hay sửa dữ liệu trên
database dùng chung trong quá trình thực hiện.

## Căn cứ đã đối chiếu

- Website baseline `892af4c`; server baseline `eac2291`; mobile baseline `147cd72`
  cùng các thay đổi mobile đang có trong workspace. Giữ thay đổi của chủ dự án.
- Router/Zod/service/repository, SQL migrations, entity và mapper Dart là nguồn
  hợp đồng hiện hành. Hai phụ lục `docs/integration/*2026-10-22.md` được kế hoạch
  dẫn tới không có trong checkout; không giả định nội dung hoặc số liệu cũ còn đúng.
- `src/features/user/contract.ts`: 48 DTO và 22 enum sinh từ entity mobile,
  kèm SHA-256 nguồn đã chuẩn hóa LF. Build web không cần checkout Flutter.
  Chạy `node scripts/sync-mobile-contract.mjs` khi chủ động cập nhật hợp đồng;
  sau đó rà mapper và chạy lại unit/contract test.
- Wire decoder kiểm trường bắt buộc, enum, null, thời gian, số tiền nguyên dạng
  chuỗi và diện tích thập phân. Dùng BigInt cho VND, không chuyển giá qua Number.
  AuthorProfile chuyển wire phẳng thành domain có `author`; trường kể chuyện
  optional trong agenda/speaker giữ tương thích mapper mobile.
- Probe Railway chỉ đọc: 16 GET public khớp decoder, danh mục có 21 lô đất.
  Author profile và author videos đã hoạt động. Không đăng nhập hoặc gọi maps
  trong probe vì maps có thể ghi cache/quota và gọi nhà cung cấp.

## Database và quyền

Đã áp dụng/replay 18 migration trên PostgreSQL 17.10 cô lập, từ
`0001_c3_foundation.sql`, `0001a_managed_role_bridge.sql` đến
`0017_admin_rbac_moderator.sql`. Có 43 bảng `xland`, tất cả bật RLS và FORCE RLS.
Đây là bằng chứng của schema từ source hiện hành trong môi trường QA, không phải
snapshot mới của database production.

| Nhóm | Bảng và quan hệ đáng chú ý | Cách website sử dụng |
| --- | --- | --- |
| Identity | user_identities, auth_sessions, user_profiles, user_contacts, user_settings, user_roles, auth_external_identities, auth_otp_challenges, auth_rate_buckets | Bearer opaque riêng Xland; profile/contact không tự gộp danh tính đăng nhập |
| Catalog | geo_locations, consultants, properties, property_media | UUID canonical; code chỉ hiển thị; approval khác sale status |
| Social | videos, video_likes, video_comments, author_follows, saved_videos, saved_properties, consultant_reviews | Author độc lập consultant; lưu/like/follow và delete comment kiểm owner |
| Legal/area | property_legal_items, property_documents, document_access_grants, property_nearby_amenities, map_area_cache, map_daily_usage | Chỉ nhận projection public; không có storage key/toạ độ riêng trong web |
| Booking/payment | site_visit_slots, site_visit_bookings, slot_reservations, booking_status_history, payment_intents, payment_receipts, payment_provider_events, payment_status_history | Slot API là nguồn giờ/sức chứa; đọc trạng thái, không tự xác nhận/thu tiền |
| Community | events, saved_events, event_registrations, clubs | Đăng ký pending và payment disabled; giữ trạng thái cancelled |
| Requests/finance/retry | support_requests, saved_finance_plans, idempotency_records | Consent, owner lists, immutable snapshot, retry cùng key/body |
| Admin | admin_audit_log, admin_uploads | Namespace và phiên Admin riêng; BFF user không chuyển tiếp `/admin` |

Website không kết nối PostgreSQL/Supabase trực tiếp. Backend thiết lập role và
`xland.user_id` trong transaction; kiểm thử integration dùng role API thực để
kiểm RLS/column grants, context reset, rollback, race và quyền hai tài khoản.
Không cần migration mới cho bản tích hợp này.

## Những hành trình đã nối API

| Route user | Tính năng và API nguồn |
| --- | --- |
| `/`, `/lo-dat` | Home/catalog, địa giới, lọc/sort/cursor theo URL, total/criteria từ API |
| `/lo-dat/[propertyId]` | SSR theo UUID, metadata từ hồ sơ, 404, image/video, legal, tiện ích, consultant, bản đồ lazy, tài chính |
| `/dang-nhap`, `/tai-khoan`, `/tai-khoan/cai-dat` | Password, Google GIS theo cấu hình, OTP theo capability; profile/settings/null-vs-omit/logout |
| `/da-luu` | Lô đất, video, sự kiện theo tài khoản; không còn favorite store local |
| `/video`, `/video/[id]` | Recommended/following/filter/cursor; playback, like/save, comments, delete-own, sourceVideoId khi đặt lịch |
| `/nguoi-dang/[id]`, `/chuyen-gia/[id]`, `/dang-theo-doi` | Author thường hoặc consultant, video, theo dõi; property/review của consultant |
| `/ho-tro` | Ngữ cảnh property/consultant, loại yêu cầu, consent chủ động, idempotency, trạng thái received và lịch sử |
| `/lich-hen`, `/lich-hen/[id]` | Khoảng ngày/slot/timezone/sức chứa, review, create gated, list/detail/history, payment read/refresh |
| `/su-kien`, `/su-kien/[id]`, `/dang-ky-su-kien` | Agenda/speakers/benefits/save; đăng ký gated; pending, chưa thu phí |
| `/cau-lac-bo`, `/cau-lac-bo/[id]` | Danh sách và chi tiết câu lạc bộ |
| `/tai-chinh` | Estimate backend, lưu snapshot, danh sách/xóa kế hoạch, lịch sử result=null, PRICE_MISMATCH |
| `/nft`, `/dang-ban` | Coming soon có giải thích; `/danh-muc-nft` chuyển về `/nft` |

Share dùng URL do backend cấp để giữ mobile App Links. Không tự đổi hostname.
Danh sách đã lưu property theo giới hạn hiện tại của API: lô paused/sold có thể
không xuất hiện; UI nói rõ. Chi tiết vẫn hiển thị trạng thái API trả về.

Đã xóa `src/data`, các feature journey/NFT/property-query demo, route slug fixture,
`/trai-nghiem` và hai route QA công khai. Test của store demo được thay bằng test
API; fixture chỉ tồn tại trong kiểm thử PostgreSQL cô lập. Ảnh thương hiệu,
tài liệu nguồn và bằng chứng lịch sử được giữ nguyên. Nội dung do backend cấp
có thể vẫn là pilot/illustrative; kết nối thật không chứng minh nguồn hàng thật.

## Phiên, BFF và retry

- `/api/xland/[...path]` allowlist method/path/query; JSON tối đa 64 KiB; không
  chuyển Authorization/Admin cookie/X-Forwarded-For từ browser, không redirect upstream.
- HTTPS dùng `__Host-xland_session`: HttpOnly, Secure, SameSite=Lax, Path=/,
  không Domain, hạn không vượt expiresAt/24 giờ. HTTP local dùng tên riêng
  `xland_user_session`. Bearer không trả trong JSON, không lưu localStorage.
- Mutation kể cả login/logout kiểm Origin chính xác, Fetch Metadata và JSON.
  Không dùng cookie SameSite làm lớp chống CSRF duy nhất. HTTP 403 khi origin sai.
- Server GET/mutation no-store; SWR cache thuộc cây UI của từng tab. Login/logout
  reload và BroadcastChannel xóa trạng thái giữa các tab. Khi 401, bỏ view cá nhân.
  Public GET được phép thử lại một lần dưới guest sau token hết hạn; private list
  và mutation không retry ẩn.
- Không xóa cookie từ một phản hồi 401 đến muộn vì có thể ghi đè phiên mới của tab
  khác. Explicit logout thành công hoặc token đã revoke mới xóa cookie; lỗi mạng
  giữ phiên và báo chưa thành công. Đây là điều chỉnh có chủ ý so với đề xuất cũ.
- Key tạo bằng randomUUID, ổn định theo SHA-256 path/body trong sessionStorage;
  không lưu body/contact/token. Timeout giữ key cho thao tác thử lại. Cùng body/key
  trả cùng kết quả; đổi body là ý định mới. Ref lock chống click đôi, không tự gửi lại.
- Request ID/Retry-After và lỗi nghiệp vụ được giữ; 5xx không lộ lỗi DB/provider.
  Không có refresh-token hoặc reset-password/đăng ký tài khoản giả.

## Bản đồ

Theo mapper mobile hiện hành: Geoapify + OSM attribution; named administrative area
trong phạm vi Việt Nam, Google search/directions chỉ bằng tên khu vực. Metadata sai
bị từ chối; planning sai chỉ làm tắt lớp quy hoạch, không phá bản đồ nền.
Tile đi qua `/api/xland-map`, chỉ cho path/z/x/y hợp lệ của origin API cố định,
không chuyển cookie/key ra ngoài. Bản đồ tải khi khách bấm; không dựng tọa độ thửa
đất từ dữ liệu cũ. Provider outage/quota có trạng thái lỗi/link khu vực.

Môi trường E2E không gọi provider; kiểm fallback unconfigured và unit contract.
Tiles/quota/chất lượng quy hoạch live vẫn cần nghiệm thu với cấu hình nhà cung cấp.

## Cấu hình và chạy

Trong `.env.local` hoặc variables Vercel, đặt:

```dotenv
XLAND_API_BASE_URL=https://xland-server-production.up.railway.app/api/v1
XLAND_WEB_ORIGIN=https://your-website.example
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
XLAND_ENABLE_BOOKING_WRITE=false
XLAND_ENABLE_EVENT_REGISTRATION=false
```

Local dùng origin chính xác, ví dụ `http://localhost:3000`. Nếu dùng `127.0.0.1`,
đổi origin tương ứng; không dùng wildcard hoặc URL có path. API phải HTTPS hoặc
HTTP loopback; cấu hình riêng Admin giữ nguyên. Không chép DB/Storage secret vào web.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Google cần OAuth client loại web với authorized JavaScript origins thực tế và
audience được backend chấp nhận, cùng dự án danh tính Flutter. Chưa có web client
trong môi trường này nên không tuyên bố đã nghiệm thu Google web–mobile; UI có
thông báo cấu hình còn thiếu. OTP theo `/auth/capabilities`, không bật SMS bằng UI.

Qua BFF, backend vẫn rate-limit theo IP mà Railway nhìn thấy. Không forward IP
khách tùy ý hoặc tăng TRUST_PROXY_HOPS. Trước rollout đông người cần kiểm topology
Vercel–Railway và thiết kế tín hiệu IP tin cậy nếu cần tách bucket; hiện chấp nhận
bucket theo IP BFF và báo Retry-After. Chưa load-test topology production.

## Kiểm thử tái lập

Trong server: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`,
`npm run build`, `npm run test:integration`, `npm run test:contract`.
Hai suite PostgreSQL chạy tuần tự; không trỏ runner vào database dùng chung.

Trong website: `pnpm test:e2e:install`, `pnpm check`. Playwright khởi tạo API/DB riêng
bằng `../../xland-server/scripts/web-test-server.mjs`: DB tên ngẫu nhiên, 18 account
tổng hợp, flags bật chỉ trong QA. File account `.local/web-user-acceptance.json`
không được commit/in/log. Unit transport mô phỏng lỗi mạng; E2E nghiệp vụ đi qua
Express và PostgreSQL thật, không route mock response nghiệp vụ.

Hồi quy Flutter dùng 8 file test repository/author/profile/session/wire/event/auth
đã đạt 36 ca. Chỉ sửa fixture expiry cố định đã hết hạn thành tương lai tương đối;
không sửa logic production Flutter. E2E web kiểm cùng account qua bearer API mobile;
đây không thay cho thao tác song song trên thiết bị Flutter thật.

Kết quả gate cuối và ảnh đã xem được ghi tại [STATUS](STATUS.md).
WebKit Windows được tái hiện độc lập: trả cookie SameSite=None và gửi cookie trong
POST chéo site dù server phát SameSite=Lax. Vì vậy kiểm raw Set-Cookie cùng hành vi
server từ chối POST chéo origin; không bỏ WebKit, không hạ Origin/HttpOnly/Secure
trên ứng dụng. Cần kiểm Safari/iPhone thật trước phát hành.

## Giới hạn phát hành và rollback

Đã code phần web tương ứng W01–W14; W03 còn cấu hình và nghiệm thu Google thật,
W02/W10 còn kiểm topology/provider triển khai. Không đánh dấu hoàn thành R01/R02
hay gate vận hành chỉ từ kết quả local.

- Booking/event write mặc định tắt theo kế hoạch. Chỉ bật khi có người tiếp nhận,
  quy tắc hold/expiry/capacity và xử lý vận hành. Bộ test chứng minh create và
  trạng thái pending/awaiting_deposit, không chứng minh quy trình kinh doanh đã chốt.
- Đổi/hủy booking, thu tiền, cấp quyền download, NFT, ví/on-chain và user đăng bán
  chưa có backend vận hành tương ứng; không có dữ liệu/giao dịch giả thay thế.
- Server sửa event status: đóng từ startsAt để khớp registration cutoff, giữ
  cancelled; list filter và detail cùng quy tắc. Thay đổi cần deploy server cùng
  hoặc trước web để live nhận hành vi mới.
- Giữ noindex. Chưa triển khai, chưa rehearsal rollback hoặc thử Google/SMS/payment
  thật. Không cam kết nguồn hàng, pháp lý, thời gian hỗ trợ hoặc thanh toán.
- Khi phát hành: deploy server đã kiểm; cấu hình origin/API và flags=false ở web;
  smoke public/login/profile/save bằng account QA; kiểm provider/Google trên domain
  thực; sau đó mới bật từng flag theo quy trình. Rollback về artifact web/server
  trước đó hoặc tắt write flags; bản này không có schema migration cần rollback.
