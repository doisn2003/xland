# P04 — Chương giới thiệu Xland

Đầu ra: thay hàng icon đơn sơ bằng một chương có nghệ thuật bố cục. Phụ thuộc P03. Hợp đồng: [BRIEF D1](../BRIEF.md).

```text
Thực hiện P04: thiết kế và dựng lại riêng section giới thiệu Xland #cach-hoat-dong trên trang chủ. Mục tiêu là một chương thương hiệu cao cấp, có ảnh lớn, lời giới thiệu ngắn và ba bước dễ hiểu trên mobile. Bản tĩnh phải hoàn chỉnh; không GSAP ở phase này.

ĐỌC TRƯỚC
AGENTS, PREPARE, STATUS; UI-UPGRADE, BRIEF A/B/C/D1/F/G; DESIGN phần tokens đang thực thi; ASSETS cho ảnh story; HANDOFF P03. Đọc app/page.tsx, CSS why-section/value-grid hiện có, PropertyImage và các pattern heading/link mới. Xem baseline Xland và ảnh Sunshine brand như tham chiếu nhịp bố cục, không sao chép layout/code.

PHẠM VI
Section mới components/home/xland-story.tsx và CSS tương ứng, page.tsx để thay section cũ, metadata copy nhỏ nếu cần, docs/QA. Khoảng 3–5 file thực thi. Giữ id cach-hoat-dong, link footer và thứ tự section. Không đổi hero/explorer/NFT section hoặc route nghiệp vụ.

CẤU TRÚC BẮT BUỘC
- Eyebrow “Về Xland”, H2 và lead theo BRIEF D1; được biên tập ngắn hơn để cân dòng nhưng không thêm lời hứa mới.
- Một ảnh chủ đạo đã qua P02, không lấy thêm ảnh chỉ để lấp khoảng trống.
- Ba hàng đánh số 01/02/03: khám phá có chọn lọc; hiểu rõ từng lựa chọn; kết nối bước tiếp theo. Mỗi hàng có heading và một câu ngắn dựa chức năng đã tồn tại.
- CTA /lo-dat thật. Có thể có link tới #nguoi-dong-hanh nếu giúp câu chuyện; không tạo nhiều CTA cùng mức nổi bật.

ART DIRECTION
1. Mobile theo thứ tự: eyebrow → H2 → lead → ảnh → ba hàng → CTA. H2 30–34px, body 16px; canh trái để đọc đoạn Việt dễ. Ảnh có vùng thở 24–32px, tỷ lệ 4:5 hoặc 5:4 theo asset; không dùng height cố định làm crop sai chủ thể. Ba hàng có divider mảnh, số nhỏ có trọng lượng thị giác, không ba card trắng giống nhau.
2. Desktop ảnh khoảng 5/12, nội dung khoảng 6/12; căn trục tiêu đề, số và body có chủ ý. Whitespace phải giúp đọc và tạo cân bằng, không để cột chữ dài trống ở đáy ảnh. Tablet 768 có thể một cột để giữ dòng chữ tốt; không ép split chỉ vì breakpoint cũ.
3. Dùng canvas trắng ấm hoặc trắng theo nhịp hero/catalog; accent là đường/chỉ mục vừa đủ. Nếu dùng họa tiết đường địa hình, SVG decorative opacity thấp, không cạnh tranh với ảnh/chữ và không được hiểu là bản đồ tài sản.
4. Tránh shadow/glass/bo pill hàng loạt; không còn cấu trúc ba icon xanh đứng riêng giữa section. Cảm giác cao cấp phải đến từ tỷ lệ ảnh và phân cấp đọc khi tắt animation.

KỸ THUẬT
Server Component cho nội dung; copy/fixture tách hợp lý, không đưa mảng nghiệp vụ lớn vào client. Semantic section có H2, các bước dùng ol hoặc cấu trúc heading rõ; số trang trí không đọc lặp. PropertyImage có khung/aspect-ratio và sizes; dùng focal point P02. Dự phòng wrapper ảnh cho P08 nhưng không opacity:0 mặc định. Không dùng absolute để xếp toàn bộ nội dung text.

KIỂM TRA
Chụp section và hai ranh giới trên/dưới tại 360/390/430/768/1440; zoom 200%, dấu Việt, keyboard CTA và anchor. Kiểm ảnh lỗi vẫn giữ bố cục và đọc được lời giới thiệu. So sánh với baseline: đã có ảnh chủ đạo, ít khối UI lặp và thứ tự đọc rõ hay chưa? Nếu chỉ đổi màu hàng ba card cũ thì chưa đạt.
Chạy lint/typecheck và các test home/accessibility liên quan. Cập nhật selector/text test khi copy chủ động thay, giữ assertion semantic/hành vi. Không viết snapshot khổng lồ để kiểm khoảng cách CSS.

BÀN GIAO
Lưu ảnh đã xem tại docs/qa/ui-upgrade/P04/ với ghi chú quyết định crop/line break. DESIGN ghi layout/copy cuối; HANDOFF nêu component, class/hook cho motion, ảnh id và số dòng mong muốn theo breakpoint. STATUS ghi đúng P04, chưa có motion; đọc diff/check whitespace rồi dừng.
```
