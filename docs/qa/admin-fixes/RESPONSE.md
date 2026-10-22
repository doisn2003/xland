# Phản hồi audit Admin — 22/10/2026

Tôi nhận trách nhiệm về năm lỗi QA-01–QA-05. Kiểm thử ban đầu của tôi thiếu
trường hợp sửa đồng thời qua hai module, timestamp có mili giây, JSON number
vượt giới hạn và kiểm tra bytes thực sau signed upload. Kết quả xanh trước đó
không đủ để loại trừ những lỗi này.

Nguồn: [báo cáo tester nguyên bản](TESTER-REPORT.md). Các file bằng chứng liên kết
trong báo cáo gốc nằm trên máy tester và không được đính kèm cùng REPORT.md;
không tuyên bố đã chạy lại harness riêng của tester. Các kiểm tra dưới đây là
hồi quy bổ sung ở checkout hiện tại, trên PostgreSQL QA riêng.

## Lỗi đã sửa

| ID | Thay đổi | Kiểm chứng |
| --- | --- | --- |
| QA-01 / P1 | GET video trả `media._version`; PATCH media lồng bắt buộc version, khóa và kiểm tra hàng media trong cùng transaction. Form gửi version của cả video và media. | Form cũ sau khi Media được sửa nhận 409; giá trị mới được giữ. Race video/Media có đúng một 200 và một 409. |
| QA-02 / P2 | Mọi đường ghi Media đang được video tham chiếu phải giữ URL và storage key không rỗng. Khi gắn media vào video, backend khóa và kiểm tra media để tránh race. | Null và chuỗi rỗng bị 409; không làm hỏng video công khai. |
| QA-03 / P2 | Form giữ giây/mili giây, dùng UTC+7; PATCH bỏ timestamp không chỉnh. Backend so `Date.getTime()` thay vì stringify làm mất mili giây. | Unit kiểm timestamp, offset, độ chính xác và thời gian được sửa. API đóng slot có reservation với thời gian chính xác vẫn thành công; đổi giờ thật vẫn bị chặn. |
| QA-04 / P2 | Admin API bắt buộc chuỗi decimal cho PostgreSQL numeric/bigint; form chuyển cả giá trị default sang chuỗi. | Raw JSON number 9007199254740993 bị 400; chuỗi tương ứng được giữ nguyên và mobile DTO vẫn chính xác. |
| QA-05 / P2 | Upload vào bucket staging private. Finalize đọc bytes thật, so size/MIME/signature, rồi xuất đúng bytes đã xác minh sang key cuối mới. Bản ghi PostgreSQL lưu quyền sở hữu, kết quả và SHA-256. Form chỉ nhận URL/key sau finalize. | Fake PNG, file rỗng, size/MIME không khớp đều bị từ chối. API chặn gắn staging hoặc object managed chưa xác minh, kể cả URL mã hóa. Finalize chỉ chủ upload dùng được và retry trả cùng kết quả. |

`file-type` kiểm signature ở worker có timeout 10 giây. Đây là xác minh loại và
dung lượng, **không phải antivirus, giải mã mọi frame hay bảo đảm file không thể
hỏng ở phần nội dung sâu**. [Tài liệu thư viện](https://github.com/sindresorhus/file-type#readme).
File mới trong các bucket Admin phải có bản ghi xác minh. Tham chiếu legacy không
đổi được giữ để không phá dữ liệu đang có; URL ngoài các bucket Admin vẫn theo
validation HTTPS hiện hữu, không được coi là đã xác minh bytes.

## Các nghi vấn và thiếu sót khác

- **S-01:** không hỗ trợ đổi slot. Thay giờ xác nhận sang giờ khác lịch đã đặt bị
  chặn, kể cả status không đổi hoặc có reason. Thay đổi trạng thái vẫn cần reason,
  kiểm cọc và lịch sử. Chỉnh metadata khác cùng status vẫn có audit tên trường;
  không ghi một chuyển trạng thái giả vào `booking_status_history`.
- **S-02:** đã đối chiếu mã Dart thật: `wireInt` từ chối số âm, và mapper pháp lý
  dùng `wireInt` cho sortOrder. Đây là lỗi tương thích xác nhận thêm; API đã chặn
  sort_order âm. Không sửa mã mobile.
- **S-03:** storage key phải canonical, không `..`, backslash, đoạn rỗng hoặc
  percent encoding. Key managed mới phải có kết quả finalize; metadata size/MIME
  của tài liệu phải khớp tệp đã kiểm tra. Gate download mobile không thay đổi.
- **S-04:** mapper Dart bỏ qua unknown keys nên chưa chứng minh đây là lỗi app.
  Tuy nhiên Admin đã chuyển JSON nghiệp vụ sang schema strict để giữ contract
  chính xác. Description tùy chọn của AgendaItem/Speaker vẫn được chấp nhận đúng
  mapper đã đối chiếu.
- **Tái lập test:** backend nay kèm seed/contract/finance fixtures và snapshot
  Dart có provenance/SHA-256. Không thay expected value hoặc bỏ assertion.
  `XLAND_MOBILE_ROOT` cho phép kiểm với checkout Dart thật và kiểm drift; nếu không
  đặt thì báo rõ dùng snapshot. Test không còn cần checkout `brain` bên cạnh.
- **Layout checkout:** E2E Admin nhận `XLAND_SERVER_ROOT`; khi thiếu backend, báo
  lỗi cấu hình cụ thể. Không tự tái sử dụng API QA cũ để tránh kiểm nhầm phiên bản.

## Kết quả kiểm tra bản sửa

| Kiểm tra | Kết quả |
| --- | --- |
| Backend typecheck/lint/build | Đạt |
| Backend unit, có đối chiếu snapshot với mobile checkout thật | 29/29 đạt |
| Admin API + PostgreSQL QA riêng | **138 kiểm tra đạt**; HTTP Storage double chỉ dùng cho mô phỏng lỗi/ownership/DB |
| Integration PostgreSQL hiện hữu | 36/36 đạt |
| Contract HTTP/mobile | 2/2 đạt; không tương đương chạy ứng dụng Dart trên thiết bị |
| Website lint/typecheck/build | Đạt |
| Website unit | 50/50 đạt, gồm hồi quy form Admin |
| Supabase Storage thật | **7 probe đạt**: PNG/MP4/private PNG hợp lệ, fake PNG/empty/size mismatch/MIME mismatch bị chặn; private staging không đọc public được |
| Cleanup Storage | Xóa đúng key của invocation QA, xác minh 0 object trong ba prefix riêng; không ghi business rows |
| DB chung | Backup trước migration; restore 42 bảng / 716 dòng vào DB riêng, digest khớp. Các bảng nghiệp vụ đối chiếu không có dòng bị thêm/sửa/xóa |

Bằng chứng: [Admin](backend-checks.json), [Storage thật](storage-checks.json),
[DB/backup](database-verification.json).

Migration mới `0013_admin_upload_verification.sql` và
`0014_admin_verified_upload_hash.sql` cùng bucket private `xland-admin-staging`
đã được áp dụng vào Supabase dự án. Migration cũ không bị chỉnh checksum.
Tài khoản Admin cũ giữ nguyên.

## Giới hạn nghiệm thu

Theo phạm vi đã thống nhất để tiết kiệm quota, không dựng lại preview bị policy
chặn, không chạy lại E2E/browser hoặc điều tra tiếp WebKit trong lượt sửa này.
Không có ảnh Admin mới và không tuyên bố nghiệm thu UI độc lập. Các lỗi WebKit
trong báo cáo tester vẫn là mục chưa giải quyết, chưa quy thành lỗi Xland.

Chưa chạy thiết bị mobile thật, kiểm TLS/reverse proxy, tải lớn hay phát hành
hosting. Staging/private objects không hợp lệ có thể còn để dọn sau; chưa có cron
dọn orphan. Bucket cuối chỉ nhận bytes đã qua kiểm tra nhưng việc xuất Storage
và commit PostgreSQL không phải distributed transaction; lỗi sau khi xuất có thể
để lại object hợp lệ chưa gắn hồ sơ. Không tự xóa media cũ.

Preview khởi động trước bản sửa không được dùng làm bằng chứng cho bản sửa.
Khi triển khai, cập nhật backend và website cùng phiên bản, chạy migrations/setup
trước, rồi khởi động lại dịch vụ. Không gửi URL localhost máy này cho tester ở
máy khác; dùng QA trên máy tester hoặc một môi trường staging có địa chỉ truy cập.
