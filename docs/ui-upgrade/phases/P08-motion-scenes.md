# P08 — Biên đạo cuộn và hiển thị ảnh

Đầu ra: những chuyển động có chủ ý trên nền P07. Phụ thuộc P07. Hợp đồng: [BRIEF E](../BRIEF.md).

```text
Thực hiện P08: biên đạo GSAP cho home Xland đã thiết kế ở P03–P06. Mục tiêu là ảnh xuất hiện tinh tế và các chương có nhịp, mobile mượt và luôn dùng được. Dùng lớp nền P07; không thêm thư viện hay thay cách quản lý state nghiệp vụ.

ĐỌC TRƯỚC
AGENTS, PREPARE, STATUS; BRIEF E/F/G, DESIGN và HANDOFF P07; đọc motion adapter/config đã thực thi, components/home cho hero/Xland/NFT/advisors và CSS tương ứng. Xem clip/test P07 trước, không tạo một adapter GSAP thứ hai.

PHẠM VI
Chỉ 4 scene home, motion config/hook cần thiết và wrapper/CSS tương ứng. Khoảng 4–6 file thực thi; nếu selector nằm trong một home file lớn, tách theo trách nhiệm có lý do. Không animate form lịch, transaction panel, số giá/tồn, reset hay toàn bộ card danh mục. Không redesign layout để hợp một hiệu ứng.

BIÊN ĐẠO CỤ THỂ
1. Hero: chữ và CTA có ngay, không mask text LCP. Chỉ ảnh settle scale nhẹ khi đã sẵn sàng; nếu late load hoặc người xem đã cuộn qua thì bỏ hiệu ứng. Không autoplay video mới, splash screen, intro logo chặn tác vụ hoặc repeated tween khi Back.
2. Xland story: ảnh reveal gọn theo khung, desktop có mask inset nhẹ rồi scale về 1; mobile ưu tiên transform/opacity nhẹ hơn clip lớn. Heading/body không tách từng ký tự Việt. Ba bước reveal theo nhóm với stagger nhỏ đúng BRIEF, không chờ mỗi bước hết một màn hình. CTA không nằm trong nhóm bị delay.
3. NFT: nền/heading tĩnh; media reveal một lần, sơ đồ xuất hiện theo ba bước có tổng thời gian ngắn. Con số/tỷ lệ luôn là giá trị cuối, không count-up. Desktop có thể thêm parallax ≤24px trên lớp ảnh riêng nếu trace cho phép; mobile/reduced motion không scrub/parallax. Không pin section hoặc cuộn ngang bắt buộc.
4. Chuyên viên: portrait/caption xuất hiện nhẹ cùng nhau, stagger không quá 80ms; tên/CTA không vô hình khi focus. Không làm khuôn mặt phóng to mạnh, flip card hoặc card bám con trỏ.
5. Mỗi scene có start/end/once rõ: reveal bắt đầu gần khi top vùng vào 85–90% viewport; vùng đã đi qua khi deep link/Back phải hiện cuối. Các giá trị chỉ là điểm bắt đầu để xem và tinh chỉnh; không cứng hóa viewport height làm lỗi khi thanh trình duyệt mobile đổi.
6. Tách node chịu CSS hover khỏi node chịu GSAP transform. Overlay/mask chỉ clip media, không clip outline/heading. Không opacity/transform toàn section chứa form hoặc tab stop. Chỉ giữ will-change trong thời gian cần; cleanup đầy đủ qua adapter P07.

THỰC HIỆN THEO VÒNG NHỎ
Làm từng scene, quay clip mobile và desktop, xem nhịp vào/ra rồi mới nối scene sau. Mỗi vòng tự hỏi ảnh đã đẹp ở trạng thái đầu/cuối, chuyển động có giúp nhìn đúng thứ tự, scroll nhanh có gây trống/giật không. Nếu hiệu ứng gây hại, giảm biên độ/độ dài hoặc bỏ lớp phụ; không thêm easing phức tạp để che vấn đề crop.

KIỂM TRA
- 360/390/430/768/1440; cuộn chậm/nhanh/lên lại, resize, route đi/về, direct anchors, Back restoration. Menu và search thao tác ngay khi scene đang chạy.
- Reduced motion trước/sau mount, Tab liên tục, zoom 200%, ảnh chậm/lỗi; nội dung không bị giấu vĩnh viễn, animation không ảnh hưởng thứ tự focus.
- Lưu screenshot trạng thái cuối và video ngắn thể hiện chuyển động thật. Ảnh cuối không chứng minh chất lượng easing. Không chấm “60fps” bằng mắt; đọc trace CPU/long tasks và so P06/P07.
- Lint/typecheck/test motion + E2E home/navigation/accessibility. Production bundle delta theo cùng phương pháp P07, mục tiêu BRIEF. Giữ lỗi baseline WebKit được ghi; không thay browser assertion.

BÀN GIAO
DESIGN ghi motion matrix cuối: scene/node/start/end/duration/easing/mobile/reduced motion. HANDOFF ghi scene ownership và cách tắt từng scene để chẩn đoán, không cờ UI làm người dùng rối. STATUS chỉ đánh dấu hiệu ứng đã kiểm. docs/qa/ui-upgrade/P08/ có clip/ảnh/trace tóm tắt. Dừng sau motion ổn định, P09 sẽ nghiệm thu tổng thể.
```
