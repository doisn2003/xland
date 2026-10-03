# P09 — Nghiệm thu thị giác, hành vi và hiệu năng

Đầu ra: báo cáo có bằng chứng và quyết định đạt/chưa đạt. Phụ thuộc P08. Không xem tài liệu hay build thành công là bằng chứng đủ.

```text
Thực hiện P09 cho vòng nâng cấp giao diện Xland. Kiểm tra bản cuối trên production build, sửa lỗi cụ thể và báo cáo đúng kết quả. Không thêm feature, không tiếp tục redesign tùy hứng, không tự deploy hoặc đánh dấu toàn 1B hoàn tất.

ĐỌC TRƯỚC
AGENTS, PREPARE, STATUS hiện tại; UI-UPGRADE, BRIEF F/G và các điều kiện hoàn tất, DESIGN/ASSETS đã cập nhật, HANDOFF P08. Đọc baseline P00, báo cáo P06–P08, package scripts, playwright config và test hành trình. Chỉ mở source ứng với lỗi cần sửa.

PHẠM VI
QA scripts/tests có lý do, docs/qa/ui-upgrade/P09 và sửa regression được chứng minh. Mỗi vòng sửa tối đa một nhóm vấn đề, chạy lại check liên quan rồi chốt. Nếu lỗi đòi thiết kế/kiến trúc lớn, ghi phase cần quay lại; không nhét refactor vào nghiệm thu.

MA TRẬN THỊ GIÁC
1. Home đầy đủ và crop hero/Xland/NFT/advisors/footer; catalog; detail đô thị và detail NFT; saved; lịch form/review/list; NFT catalog/detail/review/portfolio; reset. Chụp ở 360/390/430/768/1440 theo khả năng tái dùng script hiện có, seed riêng để ảnh cùng trạng thái trước/sau.
2. Mỗi ảnh có commit/working tree, browser/version, viewport yêu cầu và đo được, zoom/reduced motion, route/state. Đối chiếu P00 ở cùng viewport, không đổi zoom để bản mới trông đẹp hơn. Xem ảnh thực sự, không chỉ kiểm file tồn tại.
3. Kiểm phân cấp/chữ/line break/dấu Việt/crop mặt/kiến trúc/overlay, khoảng cách qua ranh giới section, thống nhất logo/icon/button/portrait. Mọi chiều rộng đều cần CTA dễ chạm, không overlap/tràn ngang. Kiểm cả 768, không suy ra từ mobile và desktop.

MA TRẬN HÀNH VI
- Search/filter/sort/query/Back/reload/empty; đủ 10 fixture và đúng nhóm.
- Card/detail lưu/bỏ lưu → saved; nhiều tab/storage lỗi vẫn giữ hành vi đã có.
- Lịch từ đúng lô, validation/focus, review/gửi chống trùng; đổi/hủy chờ xử lý; paused không mở luồng gửi.
- NFT open/soldout/paused, quantity/tỷ lệ/tổng, review/success/cancel/fail, reload/tồn/portfolio/chống trùng; không thanh toán/on-chain giả.
- Reset chỉ namespace được chỉ định, có xác nhận, không thay dữ liệu ngoài trải nghiệm.
- Menu/Escape/focus/skip link, gallery controls, anchor không bị sticky header che; 404 và fallback ảnh.

ACCESSIBILITY VÀ MOTION
Kiểm keyboard không chuột, focus trên nền tối và ảnh, zoom 200%, axe trên các route bị thay, contrast text/UI. Reduced motion khi load và đổi sau mount, no-JS marketing fallback, lỗi/chậm module animation, scroll nhanh/deep link/Back, route đi/về 5 lần. Video capture 390 và 1440 thể hiện reveal; kiểm không duplicate trigger/stale style/blank section/hydration warning. Mobile không pin hoặc ép cuộn ngang.

HIỆU NĂNG
1. Đo production build, ghi runtime/browser/tool version, thiết bị giả lập, CPU/network throttle, cold/warm cache, URL, commit. Chạy Lighthouse mobile 3 lần cùng cấu hình, giữ kết quả từng lần và median, không chọn điểm tốt nhất. Dùng công cụ sẵn có; nếu phải bổ sung công cụ, chỉ phục vụ đo và ghi rõ phiên bản, không sửa dependency tùy tiện.
2. So với P06/P07: JS transfer/chunk của home và route form, image transfer/decoded size, LCP element, CLS sources. Mục tiêu lab LCP ≤2,5s/CLS ≤0,1 và budget motion BRIEF; ghi giá trị thực, không chỉ điểm tổng. INP field chưa có thì ghi chưa đo; TBT không được gọi là INP.
3. Ghi trace scroll/menu/filter; nếu animation tạo long tasks lặp, giảm scene/clip/parallax trước khi kết luận. Không tuyên bố 60fps hoặc đạt thiết bị thật nếu chỉ emulation. Kiểm ít nhất một iOS/Android thật nếu thiết bị có sẵn; không có thì để giới hạn mở.

GATE CUỐI
Chạy pnpm check đầy đủ sau sửa cuối, không tắt lint/type, skip test hoặc allow empty. Nếu WebKit sai viewport tiếp diễn, đối chứng probe/môi trường có viewport đúng; giữ số lỗi thực và ghi chưa đạt gate. Không che bằng overflow hidden. git diff --check; so source/PDF/secret/build/lockfile và các tài liệu token/media.

BÁO CÁO
README QA phải chia rõ: đạt, lỗi cần sửa, giới hạn chưa kiểm; mỗi kết luận dẫn tới test/ảnh/clip/measurement. Cập nhật STATUS và HANDOFF; nếu thiếu một gate, ghi vòng UI chưa nghiệm thu đầy đủ, dù phần thị giác có thể đã kiểm xong. DESIGN/ASSETS phải khớp implementation cuối, không để đề xuất chưa làm thành hiện trạng. Ghi rõ các chức năng 1B còn thiếu theo PREPARE, không đánh dấu chúng bằng việc UI đã đẹp.

Kết thúc bằng kết quả quan trọng, đường dẫn bằng chứng, lệnh kiểm tra và giới hạn. Việc commit/push/deploy theo yêu cầu riêng hiện hành của chủ dự án, không tự phát hành chỉ vì xong QA.
```
