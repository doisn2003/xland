# Kịch bản trình bày nội bộ Xland — phần 1B đã triển khai

Cập nhật 30/09/2026. Hướng dẫn cho người trình bày: UI dùng ngôn ngữ sản phẩm; hồ sơ, người dùng, lịch và giao dịch vẫn là fixture/mô phỏng cục bộ. Không gửi email/SMS, nhận dữ liệu khách, thu tiền, kết nối ví hoặc ghi Blockchain.

## Hành trình đất nền

1. Từ trang chủ, chọn Khánh Hòa và dưới 3 tỷ; bấm Tìm lô đất. Kết quả ở `/lo-dat`; URL giữ khu vực/giá/không gian/nhóm/sắp xếp. Reload hoặc Back khôi phục bộ lọc.
2. Lưu Miền xanh ven sông. Mở chi tiết, đối chiếu 2,8 tỷ và 1.250 m²; trạng thái Đã lưu khớp. Mở Đã lưu từ menu; bỏ lưu để thử empty state.
3. Bấm Đề nghị xem thực địa. Chọn 05/10/2026, 09:00, 2 người. Xem lại rồi gửi. Yêu cầu mới là **Chờ sắp xếp**, chưa xác nhận buổi xem.
4. Xem lịch hẹn của tôi, reload; mở Chi tiết và lịch sử yêu cầu. Đề nghị đổi sang 06/10: lịch gốc giữ nguyên, thời gian mới chờ duyệt.
5. Thử Đề nghị hủy → Giữ lịch; sau đó Đề nghị hủy → Gửi đề nghị hủy. Trạng thái là **Chờ xử lý hủy**, không tự xác nhận thay đầu mối.
6. Khoảng xanh đồng quê đang tạm dừng: CTA bị khóa; URL trực tiếp của form cũng bị chặn. Lô không tồn tại trả 404.

Lịch gốc có 3 tình huống: Đông Anh đang điều phối, Ocean Park 2 đã xác nhận, Cam Ranh đã xem. Đây là seed, không phải khách thực sự đã nhận dịch vụ. Persona Minh An và kênh “Hộp thư Xland” là thông tin cố định; chưa có hộp thư hoặc người nhận thật.

Cửa sổ lịch **01–31/10/2026** được cố định để tái lập kịch bản; giờ 09:00/14:00, 1–8 người, phí tiếp nhận giả định 0 ₫. Khi đổi thời kỳ trình bày cần cập nhật fixture/kiểm tra lại; không coi đây là lịch hoạt động, SLA hoặc biểu phí thật.

## Hành trình NFT

1. Mở `/nft`, chọn Miền xanh ven sông. Tổng 1.000 NFT cố định; seed 240 đã bán, 10 giữ chỗ, tồn ban đầu 750.
2. Chọn 10 NFT: 1%, giá 2.800.000 ₫/NFT, tổng 28.000.000 ₫, phí giả định 0%.
3. Tự chọn ô đồng ý điều kiện → Xem lại trước khi mua → Xác nhận mua NFT → Xem danh mục NFT.
4. Danh mục có 10 NFT, tỷ lệ 1%, giá trị mua 28 triệu; reload còn giữ nếu storage khả dụng. Lặp cùng thao tác không cộng hai lần.
5. Với yêu cầu khác: Hủy yêu cầu hoặc Trường hợp không hoàn tất → Kết thúc với lỗi. Có lịch sử nhưng không tăng nắm giữ/giảm tồn.
6. Hai phương án còn lại là Hết NFT và Tạm dừng, không nhận mua.

Mã `DEMO-…` là tham chiếu nội bộ. “Đã ghi nhận mua NFT” chỉ có nghĩa mô phỏng được ghi vào localStorage, không phải receipt/transaction hash/NFT đã mint. ERC-1155 và tokenId dành cho backend sau này; chưa có chain, contract hoặc địa chỉ ví. Tỷ lệ dùng tổng phương án cố định; chưa xác lập quyền trên giấy chứng nhận đất, không cam kết lợi nhuận/thanh khoản.

## Reset và giới hạn

- Footer → Cài đặt trải nghiệm (`/trai-nghiem`) → Đặt lại trải nghiệm → Xác nhận đặt lại toàn bộ: xóa favorites, khôi phục 3 lịch seed, xóa lệnh tạo/đổi/hủy, xóa danh mục/lịch sử NFT và khôi phục tồn. Giữ trải nghiệm không thay dữ liệu.
- Reset riêng NFT vẫn ở `/danh-muc-nft`, tên Đặt lại danh mục NFT; không tác động favorites/lịch.
- Namespace `xland.demo.journey.v1` và `xland.demo.nft.v1`. Không dùng `localStorage.clear()`, không xóa key khác. Hai sổ độc lập, reset tuần tự, chưa có giao dịch nguyên tử xuyên sổ.
- Đọc sau hydrate, kiểm phiên bản, phát lại lệnh hợp lệ. Storage cũ/hỏng mở state gốc và cảnh báo; bị chặn/đầy giữ state trong bộ nhớ, báo mất sau reload.
- Web Locks tuần tự hóa từng sổ giữa các tab nếu được hỗ trợ. Storage event đồng bộ dữ liệu; không có Web Locks chỉ bảo đảm một tab. Đây không phải cơ chế đồng thời cho backend thật.
- Giới hạn 200 lệnh lịch và 1.000 đơn NFT; không thu số điện thoại, email hoặc tải giấy tờ.
- NFT dùng đồng hồ kịch bản 29/09/2026, không phải thời điểm giao dịch thật. Lịch xem ghi thứ tự thao tác, chưa có timestamp vận hành.

Video, người đăng/theo dõi, chuyên gia/consent và wizard đăng bán chưa triển khai. Chưa có bản Vercel. Đọc STATUS để phân biệt phần đã có với điều kiện hoàn tất toàn bộ 1B.
