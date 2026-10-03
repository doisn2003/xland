# P07 — Nền GSAP an toàn cho React và mobile

Đầu ra: lớp kỹ thuật nhỏ và một scene thử trên section đã có; chưa animate toàn trang. Phụ thuộc P06. Hợp đồng: [BRIEF E–F](../BRIEF.md).

```text
Thực hiện P07 cho Xland: tích hợp GSAP theo yêu cầu chủ dự án, nhưng giới hạn vào nền motion và một image reveal thử ở Xland story. Không đổi art direction hoặc hành vi nghiệp vụ trong phase này.

ĐỌC TRƯỚC
AGENTS, PREPARE, STATUS, UI-UPGRADE, BRIEF A/E/F/G, HANDOFF P06; package.json, pnpm-lock.yaml, Next docs bản cài về Server/Client Components và lazy loading, section Xland story và CSS. Đọc tài liệu chính thức GSAP React, gsap.matchMedia và ScrollTrigger được link trong RESEARCH; xác minh phiên bản/giấy phép tại ngày cài. Không lấy snippet cũ làm chân lý.

PHẠM VI
package.json/pnpm-lock, một module motion client có ownership rõ (ví dụ components/motion/), hook/config cần thật, một wrapper tích hợp vào Xland story, test motion và tài liệu. Khoảng 4–6 file code ngoài lockfile/test. Không thêm Lenis/ScrollSmoother/Framer Motion/SplitText/3D, không đổi runtime hoặc Next. Không tạo framework animation tổng quát cho mọi component.

THỰC THI
1. Ghi baseline bundle/network home và một route form từ bản tĩnh P06, production build cùng cấu hình đo. Chọn phiên bản cụ thể tương thích của gsap và @gsap/react, cài bằng pnpm --save-exact với phiên bản đã kiểm; ghi phiên bản thực vào HANDOFF. Không dùng “latest” trong tài liệu nghiệm thu hoặc sinh npm lockfile.
2. Giữ page/section nội dung là Server Components, thêm client island scoped cho motion. Nội dung HTML có từ đầu, không ssr:false cho toàn section. Nếu code-split thư viện/adapter, làm ở biên client đúng hướng dẫn Next; chụp network để xác minh route form không vô tình kéo GSAP do import root layout.
3. Dùng useGSAP scoped ref cho lifecycle và gsap.matchMedia phân nhánh ≥1024px, mobile và reduced motion theo BRIEF. Đăng ký plugin có kiểm soát; không có document-wide selector. Chỉ component sở hữu mới cleanup trigger/tween/observer của nó. Không dùng ScrollTrigger.killAll ở cleanup một section.
4. Listener/observer tự tạo phải remove/disconnect; callback muộn phải hủy hoặc gắn context-safe, không khởi tạo animation sau unmount. Async import có catch và cờ unmounted; route đi/về không để stale inline styles. Tránh mảng dependency tạo lại mỗi render khiến scene lặp.
5. Progressive enhancement: CSS mặc định visible. Khi module chưa sẵn sàng/không đủ điều kiện, giữ bản tĩnh. Không giấu heading/CTA trong stylesheet chờ JS. Nếu phần tử đã ở viewport hoặc người dùng đang focus/deep-link tới đó khi module tải xong, giữ visible thay vì chạy lại từ trạng thái ẩn. Không chờ tất cả ảnh toàn trang rồi mới cho đọc.
6. Khung ảnh cố định tỷ lệ; đo layout sau font/media liên quan khi cần và gộp refresh. Không refresh từng frame/scroll hoặc sau mỗi React render. Chỉ reveal thử một ảnh Xland dưới fold, khoảng 600ms mobile/850ms desktop; không pin/parallax ở phase nền.
7. Xác định cơ chế quan sát test: scene id/selector đủ ổn định, không debug globals tồn tại trên production. Test có thể kiểm hành vi visible, cleanup qua lifecycle/integration và console; không cần public API nội bộ của GSAP trên window.

KIỂM TRA BẮT BUỘC
- Reload và route đi/về 5 lần; resize qua 1024 và về 390; không duplicate trigger/listener, hydration warning hoặc nội dung mất.
- Reduced motion bật trước mount và đổi sau mount: static cuối, không mask/transform dư. Thử mạng chậm, import lỗi có kiểm soát, ảnh lỗi; focus Tab nhanh và mở /#cach-hoat-dong trực tiếp.
- Dev Strict Mode để phát hiện lifecycle lỗi; production build để đo chunk. Kiểm không-JS cho nội dung marketing/links, không yêu cầu các form client toàn ứng dụng hoạt động khi JS bị tắt.
- pnpm lint/typecheck, unit/test motion có ý nghĩa, E2E home/anchor/accessibility. Không assert timing tuyệt đối dễ flaky; chờ điều kiện hoàn tất/hình hiển thị với timeout hợp lý.

ĐẠT VÀ BÀN GIAO
Một scene hoạt động với cleanup/fallback; route nghiệp vụ không tải motion qua global import. Ghi phiên bản, file ownership, API adapter, strategy tải, kết quả fault test và delta JS. Chưa đạt nếu chỉ có import GSAP mà chưa kiểm unmount/reduced motion. Lưu ảnh/clip ngắn thử ở docs/qa/ui-upgrade/P07/; cập nhật DESIGN, STATUS, HANDOFF. Không animate các section còn lại trước P08.
```
