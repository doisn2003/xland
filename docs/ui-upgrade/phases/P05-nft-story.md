# P05 — Chương bất động sản NFT

Đầu ra: section NFT có hình thức riêng và giải thích trực quan đúng dữ liệu. Phụ thuộc P04. Hợp đồng: [BRIEF D2](../BRIEF.md).

```text
Thực hiện P05: dựng lại riêng chương #nft trên home Xland, tạo trải nghiệm sang trọng và dễ hiểu hơn ảnh + checklist hiện tại. Giữ chữ NFT rõ ràng. Không sửa luồng mua, model/store hoặc phát sinh giao dịch thật.

ĐỌC TRƯỚC
AGENTS, PREPARE phần NFT, STATUS, DESIGN, ASSETS, UI-UPGRADE; BRIEF A/B/C/D2/F/G, HANDOFF P04. Đọc home, src/data/properties.ts, features/nft/model.ts và catalog để xác định nguồn phương án/tổng cung/giá/tỷ lệ; chỉ đọc store để hiểu điều gì là state động. Xem test NFT đang có trước khi tính ví dụ.

PHẠM VI
components/home/nft-story.tsx, CSS riêng, page.tsx để compose; helper presentation nhỏ nếu thật cần và test tương ứng. Không mua NFT trên home, không đổi consent, ledger, quantity validation, tồn hoặc route /nft. Không thêm chart/3D/canvas library. Sơ đồ dùng HTML/SVG native.

THỰC HIỆN
1. Dùng cấu trúc/copy BRIEF D2: một H2 mạnh, lead ngắn, ảnh tài sản, panel phương án, tuyến “Hồ sơ tài sản → Phương án NFT → Danh mục của bạn” và CTA /nft. Không viết đoạn pháp lý dài hoặc mô tả kỹ thuật blockchain trên marketing section.
2. Desktop nền Ink full-width, container nội dung cùng hệ; ảnh lớn một phía, heading/panel phía còn lại. Một panel sáng có thể chồng nhẹ vùng ảnh trong wrapper định kích thước. Mobile xếp tuyến tính và panel trong flow, không overlap text, không lấy ảnh lặp làm nhiều góc chụp.
3. Màu chữ trắng/ngà có tương phản trên nền Ink; đường nối/chỉ mục champagne tiết chế. Typography rõ thứ bậc: tiêu đề → ba nhãn bước → thông số → chú thích ngắn. Không icon đồng xu crypto bay, neon tím, biểu đồ lợi nhuận hoặc đếm số giả.
4. Sơ đồ thể hiện QUY TRÌNH tìm hiểu/tham gia, không chia bản đồ thửa đất thành quyền sở hữu pháp lý. Nếu có hình nhiều ô, ghi rõ là biểu diễn số lượng NFT theo phương án; không gán mỗi ô thành m² đất. Đọc bằng screen reader vẫn hiểu nhờ nội dung HTML cạnh sơ đồ; decorative SVG aria-hidden.
5. Ví dụ định lượng lấy cùng offering đang mở từ nguồn hiện có, không chọn ngẫu nhiên mỗi render. Tổng cung 1.000/1 NFT 0,1%/10 NFT 1% chỉ dùng nếu fixture tại thời điểm chạy đúng như vậy; derive bằng helper hiện hữu hoặc helper presentation được test. Giá format vi-VN từ nguồn, không hardcode trong chuỗi marketing. Không hiển thị tồn seed như tồn hiện tại sau khi mua; ưu tiên bỏ tồn khỏi section này.
6. Không chuyển toàn bộ section sang client chỉ để hiển thị ví dụ tĩnh. Không import store client vào server section. Nếu không thể lấy nguồn dùng chung sạch, tách selector thuần nhỏ; không viết lại hợp đồng NFT.
7. CTA chính “Tìm hiểu phương án NFT” dẫn /nft. Có thể link phụ tới phương án đang minh họa bằng slug thật; không dựng mục đang mở nếu nguồn thực tế paused/soldout. Các trạng thái demo/mua/không thanh toán hiện có giữ nguyên trong route nghiệp vụ.

KIỂM TRA
Ảnh và panel ở 360/390/430/768/1440; text zoom 200%, dark focus, Tab/Enter, SVG không overflow và không che nội dung khi ảnh lỗi. Chụp cả ranh giới từ Xland story sang NFT và sang chuyên viên để xem nhịp sáng/tối. Kiểm H2/CTA/đơn vị %, ₫ và dấu tiếng Việt.
Lint/typecheck, unit NFT; nếu thêm tính tỷ lệ có test tổng cung/quantity/format biên phù hợp, không test mirror implementation. E2E home → NFT → chọn/xem lại/hủy/thành công → danh mục xác nhận nghiệp vụ không đổi. Không sửa tồn để ví dụ nhìn đẹp.

ĐẠT VÀ BÀN GIAO
Người xem phân biệt được tài sản, phương án và NFT; thông số khớp nguồn; không có lời hứa quyền pháp lý hoặc return. Bản tĩnh đủ chất lượng, chưa cần motion. Lưu ảnh, test, ghi DESIGN/HANDOFF về nguồn dữ liệu, component/hook và hình sơ đồ; STATUS ghi phần đã làm. Dừng P05, không redesign toàn route mua trong cùng phiên.
```
