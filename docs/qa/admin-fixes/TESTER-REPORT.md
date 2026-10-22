# Xland Admin — audit độc lập 22/10/2026

## 1. Kết luận: CHƯA ĐẠT

Đã chứng minh **5 lỗi: 1 P1 và 4 P2**. Lỗi quan trọng nhất là form video cũ có thể ghi đè cập nhật mới ở module Media mà không báo xung đột. Các lỗi khác: xóa URL của video đang công khai; form làm mất giây/mili giây; API nhận số tiền JSON không an toàn; upload không xác minh nội dung file.

Admin đã có triển khai thực và các nghiệp vụ chính chạy được qua API/PostgreSQL. Kiểm tra quyền đã thử chặn guest, customer, consultant, role bị thu hồi, identity bị disable, session hết hạn và token đã logout. Không phát hiện đường vượt quyền trong các ca này; không suy ra đã loại trừ mọi lỗ hổng.

**Không nghiệm thu đầy đủ UI Admin hoặc mapper Dart.** Chủ dự án đã yêu cầu **bỏ qua kiểm thử trình duyệt còn lại**. Mã Dart không có trong checkout hiện tại. Kết luận chỉ áp dụng cho code và các ca có bằng chứng bên dưới; không phải tuyên bố production-ready.

Không sửa code sản phẩm, test/helper có sẵn, dependency hay mobile. Không commit, push hoặc deploy. Ưu tiên sửa QA-01, sau đó QA-02–QA-05, thêm hồi quy tương ứng và chạy lại phần chưa kiểm chứng khi đủ môi trường.

## 2. Môi trường và an toàn dữ liệu

| Thành phần | Thực tế |
|---|---|
| Website | D:/Xproject/Xland; main; HEAD d4832f3f4706d8c2cfca13af7e24fa23157df5c6; đầu phiên sạch |
| Backend | D:/Xproject/xland-server/xland-server; main; HEAD 2a2d7b8077517bd85e490dbdb9bcdd4d1e0be5c0; đầu phiên sạch |
| Mobile | D:/Xproject/xland-mobile; HEAD 21f24cdc0d47dbb7d197db933bd6f49a6e38aa0c; chỉ có README, thiếu lib/; giữ nguyên file untracked FEED_FEATURE_BLUEPRINT.md |
| Runtime | Backend Node 24.19.0, npm thực tế 10.9.2 (package yêu cầu 11.17.0); website Node 24.21.0, pnpm 11.25.0; Next 16.3.6 |
| Database QA | PostgreSQL 17.10 embedded, 127.0.0.1:55447; cluster riêng .local/independent-20261022; database ngẫu nhiên xland_test_independent_* |
| API QA | Express thực tại 127.0.0.1:3007/api/v1; adminRouter và mobile routes thực; không mock repository/auth/transaction |
| BFF | Handler Next thực gọi API/DB QA; chỉ mock context cookies() của Next; không thay cho browser/TLS |
| Browser đã dùng trước khi đổi phạm vi | Playwright 1.63.0; Chromium 153.0.8010.12; WebKit 26.6 trên Windows; hồi quy user và HTML đối chứng; không phải iPhone thật |
| Supabase | Fingerprint 03d6c297d77a1029; DB chỉ SELECT trong BEGIN READ ONLY rồi ROLLBACK; Storage chỉ object có prefix QA riêng |

Đường dẫn C:/OwnProject/XLAND-PROJECT trong yêu cầu không tồn tại. Hai preview 3200/3005 không lắng nghe lúc đầu. Đã đọc AGENTS, PREPARE, STATUS, ADMIN, package/scripts, migration, Admin/BFF và service/repository liên quan trước khi chạy.

Không chạy admin:setup, seed, reset hoặc migration vào DB dùng chung. Thay role, disable identity, hết hạn session, CRUD, booking và receipt simulation chỉ ở DB riêng. Không gọi payment provider, tạo giao dịch thật hoặc sửa dữ liệu mobile.

[Kiểm tra shared DB chỉ đọc](live-readonly.json) xác nhận tài khoản được yêu cầu active, có role Admin, hash Argon2id và khớp thông tin đăng nhập chủ dự án cung cấp. Không xuất mật khẩu/hash/token. Migration 0012 hiện diện. **203 cột / 15 module** khớp tên, kiểu và nullable giữa shared DB và QA.

### Lệnh và kết quả

Backend chạy từ thư mục backend với Node 24.19.0 đứng đầu PATH. npm 10.9.2 chỉ thực thi scripts với dependency đã có; không install hoặc thay lockfile. Đây là sai khác môi trường so với npm 11.17.0 khai báo trong package, cần giữ khi tái lập. Website dùng node_modules/.bin để chọn Node khóa 24.21.0. Không cài thêm dependency.

| Lệnh | Kết quả | Bằng chứng |
|---|---|---|
| Backend npm run lint / typecheck / build | Đạt với sản phẩm đầu phiên | backend-lint.log, backend-typecheck.log, backend-build.log |
| Backend npm test | **10/12 đạt, 2 thất bại** do thiếu finance-v1-vectors.json và common.dart; không xác nhận lại 26 ca được báo trước | [log](backend-test.log) |
| Backend npm run test:admin | Bị chặn lúc import helper vì thiếu ../xland-mobile/lib/domain/entities/common.dart; chưa chạy 83 ca cũ | [log](backend-test-admin.log) |
| Backend npm run test:integration | Runner tạo DB local rồi dừng vì thiếu ../brain/logs/agent-c/fixtures/v0.1.json; không xác nhận 36 ca | [log](backend-test-integration.log) |
| Backend npm run test:contract | Bị chặn bởi fixture thiếu; không xác nhận 2 ca contract | [log](backend-test-contract.log) |
| Website pnpm check | Lint, typecheck, **46/46 unit**, production build đạt; E2E **105/114 đạt, 9 lỗi WebKit**; gate tổng không đạt | [log lần đầu](website-check.log) |
| pnpm exec playwright test --last-failed --workers=1 | Đúng 9 ca lỗi: **2 đạt, 7 vẫn lỗi**; không sửa/skip assertion/project | [log chạy lại](user-rerun.log) |
| Website pnpm test:admin | Không khởi động runner: spawn ...cmd.exe ENOENT; cwd ../../xland-server không tới backend thật ở layout hiện tại | [log](admin-original.log), [config](D:/Xproject/Xland/playwright.admin.config.ts:6) |
| node --import tsx tests/admin-independent/run.mjs --serve | Harness mới: **83 kiểm tra, 80 đạt, 3 đỏ**; không phải 83 ca của agent trước | [kết quả](api-results.json), [log](independent-run.log) |
| node --import tsx tests/admin-independent/extended.mjs | 14 probe: 9 đạt/quan sát thành công, 5 assertion đỏ; không tự tính mọi probe đỏ thành bug | [kết quả](extended-results.json) |
| node --import tsx tests/admin-independent/crud-roundtrip.mjs | **12/12 module writable** cập nhật → GET lại → SQL khớp | [kết quả](crud-roundtrip.json) |
| Frontend: node --import file:///D:/Xproject/xland-server/xland-server/node_modules/tsx/dist/loader.mjs docs/qa/admin-independent/frontend-probes.mjs | Dùng chính initial/serialize sản phẩm: 3 đạt, 1 đỏ QA-03 | [kết quả](frontend-probes.json) |
| pnpm exec vitest run --config docs/qa/admin-independent/vitest.config.mjs | 1 scenario nhiều assertion BFF đạt; chỉ cookie context được mock | [log](bff-test.log), [chi tiết](bff-results.json) |
| node --import tsx tests/admin-independent/storage.mjs | HTTP Storage thật: valid/private/path/overwrite/MIME; phát hiện QA-05 | [kết quả](storage-results.json) |
| node --import tsx tests/admin-independent/verify-storage-cleanup.mjs | Prefix QA còn **0 object** cả hai bucket | [kết quả](storage-cleanup-verified.json) |
| node --import tsx tests/admin-independent/live-readonly.mjs | Shared DB READ ONLY: account/role/hash verification, metadata, migration | [kết quả](live-readonly.json) |
| node docs/qa/admin-independent/browser-diagnostic.mjs | HTML tối giản tái hiện viewport WebKit sai; Chromium đúng 5 độ rộng | [số liệu](browser-diagnostic.json) |
| Lint lần cuối sau thêm harness, git diff --check ở hai repo | Đạt, không tắt rule; src/test cũ không đổi | backend-lint-final.log, website-lint-final.log |

**Minh bạch lỗi harness:** CRUD roundtrip lần đầu báo ngày pháp lý lùi một ngày vì harness chuyển PostgreSQL DATE qua JS Date local rồi toISOString UTC. API trả đúng ngày. Đã sửa riêng phép đối chứng SQL thành checked_date::text, giữ assertion ngày chính xác, chạy lại 12 ca đạt. [Lần đầu](crud-roundtrip-first.json) được giữ. Không sửa sản phẩm/test cũ. Lint harness từng báo một import không dùng; chỉ import đó được sửa.

### Hồi quy user, WebKit và phạm vi browser

Chromium desktop/mobile **76/76 đạt** ở lượt đầy đủ. WebKit 29/38 đạt lượt đầu; chạy lại 9 lỗi có 7 vẫn lỗi. Không gộp kết quả thành toàn bộ xanh.

HTML không có CSS Xland, yêu cầu 390px: WebKit innerWidth=325, clientWidth=326, scrollWidth=391, scrollX=65, DPR=3.59375. Chromium 390/390/390, scrollX=0. Cùng sai lệch có ở 360/430/768/1440. Đã xem [ảnh Chromium](minimal-chromium-390.png) và [ảnh WebKit](minimal-webkit-390.png). Đây là bằng chứng blocker viewport môi trường, không chứng minh mọi lỗi WebKit Xland đều do môi trường. Hai ca chỉ đạt khi chạy lại vẫn cần theo dõi sự không ổn định.

Khởi động preview Next QA 3102 bị automatic approval review từ chối hai lần, chỉ trả **“blocked by policy”**. Không vượt chặn. Chủ dự án sau đó yêu cầu **bỏ qua kiểm thử trình duyệt**. Không có ảnh Admin độc lập; ảnh của agent triển khai không được dùng làm bằng chứng nghiệm thu mới.

## 3. Ma trận nghiệm thu

“Đạt” dưới đây chỉ áp dụng phần API/DB và ca ghi rõ; **không bao gồm UI Admin**. Ma trận từng cột, required/default/readonly/enum/reference: [SCHEMA-MATRIX.md](SCHEMA-MATRIX.md). CHECK/UNIQUE/FK nguyên văn lấy từ PostgreSQL: [database-schema.json](database-schema.json). Metadata: [schema.json](schema.json).

| Yêu cầu → UI | API Admin → bảng | Quyền / quy tắc | Ca và kết quả |
|---|---|---|---|
| Admin riêng → /admin/login, /admin | session → identities/roles/sessions | Admin; role/identity/session còn hiệu lực | **Đạt API:** guest401, customer/consultant403, thu role403, disable/expire/logout401; API results + extended |
| Lô đất → /admin/properties | properties → properties/geo_locations/consultants | Đọc/tạo/sửa; unique, giá, diện tích, địa giới/FK, version | **Không đạt QA-04** numeric JSON; string money/create/edit/nullable/negative/overflow/concurrent 200+409 đạt |
| Video → /admin/videos | videos → videos/property_media/profiles | Đọc/tạo/sửa; media đúng lô/video/feed, rollback | **Không đạt QA-01/02**; tạo video và đọc feed, rollback media khi video invalid đạt |
| Tư vấn → /admin/consultants | consultants → consultants/identities/profiles/contacts/settings/roles | Đọc/tạo/sửa; đồng bộ nhiều bảng | **Đạt API:** create/edit/contact-only, profile sync, rollback invalid contact, SQL roundtrip |
| Lịch hẹn → /admin/bookings | bookings → bookings/history/reservations/payments | Đọc/sửa điều phối; không tạo; giữ yêu cầu gốc/tài chính | **Đạt guard đã thử:** reason, cọc, confirm/complete/cancel/release, transition ngược; S-01 giờ xác nhận cần chốt |
| Khung giờ → /admin/slots | slots → site_visit_slots | Đọc/tạo/sửa; giữ thời gian/lô khi có khách, capacity | **Không đạt QA-03** ở form; partial API close và race 1 chỗ → 201/409, 1 reservation đạt |
| Hỗ trợ → /admin/support | support → support_requests | Đọc; sửa status/recipient/consultant; không sửa yêu cầu gốc | **Đạt API:** original message bị chặn; responded/closed save/reload/SQL |
| Media → /admin/media | media → property_media | Đọc/tạo/sửa; giữ liên kết feed | **Không đạt QA-01/02**; alt_text update đạt |
| Pháp lý → /admin/legal | legal → property_legal_items | Đọc/tạo/sửa; verified cần ngày, date, sort unique | **Đạt ca API/date**; S-02 sort âm chưa kết luận mobile |
| Tài liệu → /admin/documents | documents → property_documents | Đọc/tạo/sửa metadata; private prefix | **Đạt ca metadata**; public bucket key bị chặn cho granted; S-03 key; download mobile chưa nghiệm thu |
| Tiện ích → /admin/amenities | amenities → property_nearby_amenities | Đọc/tạo/sửa; property FK/enum | **Đạt API:** create market/living, edit distance → SQL |
| Sự kiện → /admin/events | events → events/event_registrations | Đọc/tạo/sửa; thời gian/duration/JSON/capacity | **Đạt API:** create, mobile register, hạ capacity bị chặn, edit agenda/speaker/benefit → SQL |
| CLB → /admin/clubs | clubs → clubs | Đọc/tạo/sửa; JSON, recipient | **Đạt API:** create/mobile GET/edit summary/activities → SQL |
| Đăng ký → /admin/registrations | registrations → event_registrations | Chỉ đọc | **Đạt API:** list, POST/PATCH405 |
| Người dùng → /admin/users | users → user_profiles | Chỉ đọc; không cấp role/hash/token | **Đạt API:** list, POST/PATCH405, mass assignment bị chặn |
| Audit → /admin/audit | audit → admin_audit_log | API chỉ đọc; server append-only, field names | **Đạt ca thử:** actor/entity/action, không contact/token, role cũ không SELECT, UPDATE bị chặn |
| Upload trong form | uploads → Supabase buckets | MIME/size khai báo, path/visibility/overwrite | **Không đạt QA-05** nội dung; giới hạn, private, tamper/no-overwrite đạt |
| Metadata → editor | schema → information_schema | 203 cột/15 module, readonly/derived | **Đạt độ bao phủ metadata**, chưa nghiệm thu toàn UX và mọi biên của từng cột |
| List/filter/relation picker | list/lookups | allowlist, search literal, pagination, >50 relation | **Đạt API:** 56 consultant QA, 2 trang 25 không trùng, tìm 054 ngoài top50, giữ selected ID; UI chưa thử |
| BFF → /admin/api | handler → API QA | Origin/JSON/size/token/cookie options/logout | **Đạt handler**; browser cookie/TLS/proxy chưa kiểm |
| Mobile | API hiện hữu → Dart mapper | DTO/enum/semantics | HTTP property/feed/consultant/event/club/legal/area/booking đọc được; **bị chặn Dart** do thiếu source |
| UI Admin | login/dashboard/create/edit/reload/logout, 5 widths | keyboard/loading/error/back/duplicate submit/a11y | **Chưa kiểm tra / bỏ qua theo yêu cầu** |

Không áp đặt hard delete hoặc CRUD mọi bảng. Registrations/users/audit chỉ đọc; bookings/support không tạo qua Admin là đúng phạm vi. ID/timestamp/audit/derived price/date/time/counter/rating/next-available không buộc nhập tay. Quan hệ và nhóm media/contact/reason ngoài cột đơn nằm trong SCHEMA-MATRIX.

## 4. Lỗi đã chứng minh

### QA-01 — P1 — Form video cũ ghi đè cập nhật Media, bỏ qua optimistic concurrency

**Chắc chắn cao**, tái hiện HTTP + PostgreSQL. P1 vì mất cập nhật trong nghiệp vụ video; có thể phục hồi URL/thumbnail cũ âm thầm. Audit chỉ lưu tên trường, không đủ phục hồi giá trị đã mất.

**Code:** [service.ts:143](D:/Xproject/xland-server/xland-server/src/admin/service.ts:143) so version videos; [service.ts:150](D:/Xproject/xland-server/xland-server/src/admin/service.ts:150), [service.ts:153](D:/Xproject/xland-server/xland-server/src/admin/service.ts:153) ghi media không kiểm version media; [editor.tsx:23](D:/Xproject/Xland/src/features/admin/editor.tsx:23) luôn gửi toàn object media.

**Điều kiện:** A mở video; B sửa cùng media qua module Media. Version videos không thay đổi khi B lưu.

**Tái hiện:**

1. A GET /api/v1/admin/videos/<video>, giữ version và media.
2. B GET/PATCH /admin/media/<media> với version hợp lệ, alt_text = “Concurrent media edit”.
3. A PATCH video bằng version cũ, đổi caption, gửi lại media cũ.
4. GET media lại.

**Mong đợi:** 409 aggregate stale, hoặc chỉ đổi caption và giữ cập nhật của B.
**Thực tế:** 200; alt_text quay về “Video QA”.

Bằng chứng rút gọn: {"status":200,"before":"Concurrent media edit","after":"Video QA"}.
Xem BUG-nested-media-optimistic-concurrency trong [api-results.json](api-results.json). Hai PATCH cùng hàng video trực tiếp có trả 200/409; lỗi ở bảng con.

**Ảnh hưởng:** mất thay đổi Admin, mobile đọc lại nội dung/URL cũ; không cần vượt quyền.
**Đề xuất:** version aggregate hoặc _media_version; lock/kiểm tra cả hai hàng; PATCH theo trường dirty.
**Hồi quy:** B sửa URL/thumbnail/alt ở Media, A chỉ sửa caption từ video stale; phải 409 hoặc bảo toàn media của B; thêm race hai endpoint.

### QA-02 — P2 — Xóa URL media vẫn giữ video công khai thiếu nguồn phát

**Chắc chắn cao.** Phạm vi một media/video, có cách khôi phục URL nên P2.

**Code:** [service.ts:169](D:/Xproject/xland-server/xland-server/src/admin/service.ts:169) yêu cầu URL khi ghi video, nhưng [service.ts:172](D:/Xproject/xland-server/xland-server/src/admin/service.ts:172) sửa Media chỉ bảo vệ kind/usage/property. [controls.tsx:42](D:/Xproject/Xland/src/features/admin/controls.tsx:42) chuyển ô trống thành null.

**Điều kiện:** video approved, chưa deleted, media video/feed đúng lô.
**Tái hiện:** GET media lấy version → PATCH /api/v1/admin/media/<id> với {"_version":"<current>","public_url":null} → GET /api/v1/videos/<video>.
**Mong đợi:** từ chối xóa nguồn phát hoặc cùng transaction ẩn video với phản hồi rõ.
**Thực tế:** PATCH200; video DTO vẫn trả200, media.url=null.

Bằng chứng: {"status":200,"mobileUrl":null}; BUG-linked-media-remains-playable trong [api-results.json](api-results.json).

**Ảnh hưởng:** Admin lưu thành công nhưng feed mobile thiếu nguồn phát. Chưa chạy trình phát trên mobile thật; null URL đã được chứng minh qua API.
**Đề xuất:** cùng invariant cho mọi đường ghi media đang được feed tham chiếu; không cho URL rỗng khi publish.
**Hồi quy:** null/rỗng URL từ module Media của feed công khai bị chặn; gallery độc lập vẫn theo quy tắc riêng.

### QA-03 — P2 — Form cắt giây/mili giây, làm thao tác đóng slot có khách bị 409

**Chắc chắn cao** ở hàm form sản phẩm + API/DB; chưa thao tác browser. Điều kiện: slot có seconds/fraction khác 0 và còn reservation. Shared DB chỉ đọc ghi nhận **0 slot đang giữ chỗ** có điều kiện này; không quy kết lịch thật đã bị ảnh hưởng.

**Code:** [controls.tsx:34](D:/Xproject/Xland/src/features/admin/controls.tsx:34) cắt tới phút, [controls.tsx:43](D:/Xproject/Xland/src/features/admin/controls.tsx:43) serialize giây 00; [editor.tsx:21](D:/Xproject/Xland/src/features/admin/editor.tsx:21) gửi toàn form; [service.ts:179](D:/Xproject/xland-server/xland-server/src/admin/service.ts:179) bảo vệ instant slot đang giữ chỗ.

**Tái hiện:** tạo slot starts_at=2026-12-05T03:00:35.123Z → đặt một booking → GET slot → dùng chính initial/serialize như Editor, chỉ đổi status closed → PATCH.
**Mong đợi:** đóng slot, giữ nguyên thời gian không chỉnh.
**Thực tế:** serialize đổi thành 03:00:00.000Z, API409 “Khung giờ đã có lịch hẹn; chỉ có thể đóng nhận lịch mới.” Đối chứng PATCH chỉ status + version trả200.

Bằng chứng: {"original":"2026-12-05T03:00:35.123Z","input":"2026-12-05T10:00","serialized":"2026-12-05T03:00:00.000Z","status":409}; [frontend-probes.json](frontend-probes.json), slot-close-partial-api-control trong [extended-results.json](extended-results.json).

**Ảnh hưởng:** không đóng/sửa thuộc tính khác qua form cho slot nêu trên; timestamp khác cũng bị làm tròn khi lưu toàn form.
**Đề xuất:** giữ original instant, chỉ gửi khi dirty hoặc bảo toàn seconds/fraction. Không nới guard backend để che lỗi.
**Hồi quy:** slot có giây/mili giây và booking; UI chỉ đổi label/status phải lưu, thời gian giữ nguyên; thêm UTC+7 và agenda.

### QA-04 — P2 — API lưu sai số tiền JSON vượt Number.MAX_SAFE_INTEGER

**Chắc chắn cao**, đã gửi raw JSON literal qua HTTP. Form hiện dùng string money và roundtrip đúng; không khẳng định form đang làm sai giá.

**Code:** [service.ts:109](D:/Xproject/xland-server/xland-server/src/admin/service.ts:109) String(value) sau JSON parse; [service.ts:114](D:/Xproject/xland-server/xland-server/src/admin/service.ts:114) chỉ safe-integer check cho cột integer, không numeric/bigint.

**Điều kiện:** gọi Admin API trực tiếp bằng JSON number lớn.
**Tái hiện:** PATCH property bằng raw body {"_version":"<current>","price_total":9007199254740993}.
**Mong đợi:** 400 yêu cầu chuỗi decimal, hoặc bảo toàn chính xác.
**Thực tế:** 200; PostgreSQL/response lưu "9007199254740992". Cùng giá trị dưới dạng string lưu đúng.

Bằng chứng raw-json-money-precision trong [extended-results.json](extended-results.json): sentLiteral="9007199254740993", persisted="9007199254740992"; đối chứng money-exact-mobile và money-string-roundtrip.

**Ảnh hưởng:** client/tích hợp Admin mới dùng number lưu sai giá âm thầm.
**Đề xuất:** bắt buộc chuỗi decimal cho numeric/bigint nghiệp vụ tiền; ít nhất từ chối Number không an toàn.
**Hồi quy:** raw number 2^53+1 phải400; string cùng giá trị phải giữ đúng; max precision/overflow/0/âm/số lẻ.

### QA-05 — P2 — Signed upload chấp nhận bytes rỗng/sai loại sau kiểm tra MIME khai báo

**Chắc chắn cao**, Supabase thật, signed URL do chính AdminStorage.sign tạo. Không chứng minh XSS hoặc thực thi mã; đây là validation/tính toàn vẹn media.

**Code:** [storage.ts:23](D:/Xproject/xland-server/xland-server/src/admin/storage.ts:23) chỉ kiểm MIME/size khai báo; [storage.ts:27](D:/Xproject/xland-server/xland-server/src/admin/storage.ts:27) ký path, không có bước finalize; [controls.tsx:16](D:/Xproject/Xland/src/features/admin/controls.tsx:16), [controls.tsx:24](D:/Xproject/Xland/src/features/admin/controls.tsx:24) lấy file.type/size và coi upload200 là thành công.

**Điều kiện:** Admin/signed upload hợp lệ. File văn bản đổi đuôi PNG có thể được browser khai báo image/png. Ca empty cố ý xin size=1 rồi PUT0 byte để kiểm enforcement sau ký; không nói UI chấp nhận file.size=0 ở bước ký.

**Tái hiện:**

1. Xin signed URL image/png, size dương.
2. PUT text thuần với Content-Type image/png; hoặc body0 byte; hoặc MIME video/mp4 vào path .png đã ký.
3. Quan sát upload status.

**Mong đợi:** từ chối hoặc chưa cho gắn/publish trước khi xác minh actual bytes.
**Thực tế:** cả ba ca200. Content-Type text/html400; path tamper400; overwrite kể cả x-upsert=true400. Bucket whitelist không kiểm chữ ký nội dung.

| Probe thực | Kết quả |
|---|---|
| PNG hợp lệ / public GET | 200; hash bytes khớp |
| Text giả PNG | 200 |
| Khai size1, upload0 byte | 200 |
| MIME MP4 trên path PNG | 200 |
| MIME text/html | 400 |
| Private PDF qua public URL | 400 |

Bằng chứng [storage-results.json](storage-results.json). Media bucket50 MiB/public; documents20 MiB/private đúng. Signed TTL quan sát7200 giây; không lưu token hoặc URL ký. Đã xóa đúng key và xác minh prefix trống.

**Ảnh hưởng:** file rỗng/sai loại có thể được lưu metadata/publish như media hợp lệ. Không có bằng chứng đọc trộm private document.
**Đề xuất:** staging/finalize kiểm object existence, actual size, signature/khả năng decode trước khi publish. Giữ whitelist/path/no-upsert. Tài liệu chuẩn: [Supabase bucket restrictions](https://supabase.com/docs/guides/storage/buckets/fundamentals), [uploadToSignedUrl](https://supabase.com/docs/reference/javascript/file-buckets-uploadtosignedurl).
**Hồi quy:** MIME/extension/signature mismatch, empty sau khai size dương, actual size khác metadata; giữ form khi finalize lỗi.

## 5. Nghi vấn, giới hạn và cải tiến — tách khỏi 5 lỗi trên

### Nghi vấn cần xác minh thêm

| ID | Quan sát | Phần chưa chứng minh / bước tiếp |
|---|---|---|
| S-01 | Booking confirmed đổi confirmed_starts_at từ01/12 sang20/12 không reason; reservation giữ slot01/12, history không thêm. bookingChange return khi status không đổi ([service.ts:216](D:/Xproject/xland-server/xland-server/src/admin/service.ts:216)) | Chốt confirmed time có được khác slot yêu cầu không. Nếu không: lỗi capacity/lịch. Nếu có: cần quy tắc reservation/audit. Không tự áp đặt workflow đổi slot ngoài scope |
| S-02 | legal sort_order=-1 được lưu, mobile API trả sortOrder=-1; helper wire yêu cầu int>=0 | Thiếu Dart để chứng minh app reject; đối chiếu mapper/ý nghĩa sort. DB cho phép âm nên không tự coi là bug |
| S-03 | documents nhận key xland-admin-documents/not-owned/../unknown.pdf; guard chỉ prefix | Chưa có đường download vượt quyền, mobile download còn gate. Kiểm canonical path/object existence/ACL khi mở download |
| S-04 | JSON highlights .passthrough() nhận key lạ, DTO trả nguyên; oracle exact keys | Chưa biết Dart reject hay bỏ qua unknown field. Cần source/mapper thật trước khi kết luận contract lỗi |

Bằng chứng [extended-results.json](extended-results.json). Probe đỏ là tín hiệu kiểm tra, không tự động là bug khi kỳ vọng business/Dart chưa xác nhận.

### Đánh giá test helper và script database

- [verify-postgres-foundation.ts:27](D:/Xproject/xland-server/xland-server/scripts/verify-postgres-foundation.ts:27) bổ sung tường minh bảng của0009–0012, vẫn so exact set và FORCE RLS; kiểm thêm role maps/admin, NOLOGIN. **Không thấy làm yếu kiểm tra để bỏ bảng/RLS sai.** Harness riêng chứng minh fresh/replay/upgrade có dữ liệu và grants/policies role cũ không đổi. Fixture C4 gốc thiếu nên runner cũ vẫn bị chặn.
- [wire.ts:30](D:/Xproject/xland-server/xland-server/tests/helpers/wire.ts:30) chỉ cho thiếu description của AgendaItem/Speaker; field khác vẫn exact và kiểm kiểu; description có mặt vẫn kiểm. Thay đổi hẹp, không bỏ cả contract. **Chưa xác nhận đúng với Dart**, vì mapper thiếu. Comment nói mapper optional không phải bằng chứng; cần source đúng commit và chạy lại. Không kết luận che lỗi hoặc khẳng định tương thích chỉ từ comment.
- Không sửa helper, skip, assertion hoặc script hiện hữu trong audit.

### Chưa kiểm chứng

- UI Admin: login/dashboard/create/edit/reload/logout; sidebar/direct URL/Back/Forward; loading/empty/network401/403/409; double submit; keyboard/focus/Escape/label; 360/390/430/768/1440px và ảnh đối chiếu. **Bỏ qua theo yêu cầu chủ dự án.**
- Cookie thực trong browser, HTTPS/reverse proxy/hosting: chỉ kiểm handler options. Response BFF ca thử không có token; chưa audit toàn bộ hosting log/bundle/CDN.
- Dart/mobile thật: source thiếu; HTTP GET đúng dữ liệu quan sát không bảo đảm mọi enum/semantics/mapper.
- Chưa upload file vượt50 MiB thực, thử mạng yếu/timeout dài, đợi signed URL hết hạn2 giờ, XSS UI thật hoặc transcode. API declared-size và bucket limits đã kiểm riêng.
- Upgrade dùng dữ liệu QA tổng hợp; không restore toàn bộ dữ liệu thật hoặc lặp backup của agent trước.
- Không đo tải lớn, failover, Railway/Vercel hoặc thiết bị thật.

### Ngoài phạm vi đã chấp thuận

Website user live; thanh toán/hoàn tiền; đổi slot; UI cấp/thu role; biên tập catalog địa giới; transcode; dọn upload mồ côi; thay chính sách download mobile; ví/smart contract. Không tự ghi các mục này thành bug.

Upload thành công nhưng lưu form thất bại có thể để lại object đúng giới hạn đã công bố. Không tự dọn file cũ, không coi metadata là chứng cứ xác minh tài sản.

### Cải tiến tùy chọn

- Version fixture/oracle hoặc khai báo vị trí rõ để checkout/CI tái lập được; vẫn fail khi nguồn thiếu.
- Ánh xạ lỗi CHECK/FK tới field/thông điệp cụ thể, không lộ SQL/secret.
- Xem rate limit sau BFF: backend thấy IP BFF nên budget10/min có thể dùng chung; chưa đo điều kiện vận hành để tính bug.

## 6. File QA, cleanup và trạng thái cuối

**Sản phẩm không đổi:** src/, migrations, package/lockfile, test/helper cũ và mobile được giữ nguyên. Chỉ thêm QA và cập nhật docs/STATUS.md; không commit/push/deploy.

**Backend mới** trong [tests/admin-independent](D:/Xproject/xland-server/xland-server/tests/admin-independent):

- run.mjs: DB/API riêng,83 kiểm tra và cleanup DB của run.
- extended.mjs: receipt simulation, concurrency, probe nghi vấn và migration upgrade.
- crud-roundtrip.mjs:12 module writable → reload/SQL.
- storage.mjs và verify-storage-cleanup.mjs: object QA và xác minh xóa.
- live-readonly.mjs: chỉ SELECT shared DB.

**Thư mục báo cáo:** REPORT/SCHEMA-MATRIX; schema/database-schema; JSON kết quả API/extended/CRUD/frontend/BFF/Storage/live/cleanup; logs; frontend-probes.mjs, browser-diagnostic.mjs, bff.spec.mjs, vitest.config.mjs; hai ảnh HTML đối chứng. Danh sách chính xác và SHA-256 ở artifact-manifest.json.

**DB:** database độc lập và database upgrade được drop đúng tên đã tạo, sau đóng server/pool; xem cleanup.json. Không restore đè dữ liệu đồng thời của người khác. Cluster riêng giữ để tái lập; runner cũ bị lỗi có thể còn DB scratch trong .local, không dọn DB không được theo dõi chắc chắn.

**Storage:**6 key được cấp riêng,5 upload thành công và1 MIME bị từ chối. DELETE từng key chính xác đã ghi nhận, kể cả key chưa upload thành công; không xóa ngoài danh sách. Prefix qa-independent-20261022-9c11e23c-acfb-4d6b-88f7-067a7c350a2d còn **0 object** cả hai bucket. Key đầy đủ ở [storage-results.json](storage-results.json), [xác minh](storage-cleanup-verified.json). Không thay bucket config/object cũ.

### Tái lập harness

1. Dùng Node24 đúng package; kiểm port3007/55447 không thuộc phiên khác.
2. Nếu phiên QA cũ đã dừng, xóa đúng marker .local/independent-20261022/stop trước khi chạy lại.
3. Từ backend: node --import tsx tests/admin-independent/run.mjs --serve; chờ Independent QA ready. Script không đọc DATABASE_URL shared.
4. Chạy extended.mjs rồi crud-roundtrip.mjs; từ website chạy frontend-probes và Vitest config riêng như bảng lệnh. Các bug đang mở phải tiếp tục đỏ.
5. Tạo file .local/independent-20261022/stop để runner đóng API và drop đúng DB. Không chạy Storage script nếu chỉ cần tái hiện lỗi DB.

Chỉ đổi kết luận sau sửa lỗi, đạt hồi quy tương ứng và kiểm chứng phần còn thiếu trong phạm vi được mở tiếp.

