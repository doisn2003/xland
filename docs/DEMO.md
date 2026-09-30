# Demo NFT Xland

## Kịch bản nhanh

1. Từ trang chủ chọn Bất động sản NFT, hoặc mở `/nft`.
2. Mở Miền xanh ven sông: 1.000 NFT cố định, 240 đã bán và 10 giữ chỗ theo kịch bản; 750 còn lại ban đầu.
3. Nhập 10 NFT: tỷ lệ 1%, giá 2.800.000 ₫/NFT, tổng 28.000.000 ₫, phí mẫu 0%.
4. Đọc điều kiện mẫu, tự chọn ô đồng ý, bấm Xem lại trước khi mua.
5. Xác nhận mua NFT mô phỏng, rồi Xem danh mục NFT. Danh mục hiển thị 10 NFT, 1%, vốn mua 28 triệu; reload vẫn giữ dữ liệu nếu trình duyệt cho phép lưu.
6. Tạo yêu cầu khác để thử Hủy yêu cầu hoặc mở Thử tình huống lỗi → Mô phỏng thất bại. Hai trường hợp có lịch sử nhưng không tăng nắm giữ/giảm tồn.
7. Trong danh mục chọn Đặt lại demo NFT → Xác nhận đặt lại. Danh mục/lịch sử trống, tồn khôi phục 750.

Hai phương án còn lại minh họa Hết NFT và Tạm dừng; vẫn xem được hồ sơ/điều kiện nhưng không nhận mua.

## Dữ liệu và giới hạn

- Tài khoản/ví trải nghiệm không có địa chỉ thật. Không cần cài ví, ký, chuyển tiền; không gọi RPC, mint hoặc xác nhận on-chain.
- ERC-1155 là chuẩn cho giai đoạn backend. Token ID mẫu cố định theo tài sản; chưa có chain/contract address. Tỷ lệ dùng tổng phương án, không dùng số đã bán làm mẫu số.
- Sổ đơn mô phỏng dùng `xland.demo.nft.v1` trong localStorage. Reset chỉ ghi lại namespace này; không xóa dữ liệu khác của trình duyệt. Các luồng demo khác chưa có state để reset.
- Dữ liệu đọc sau hydrate, kiểm tra phiên bản và phát lại đơn hợp lệ để tính số dư/tổng tiền. Dữ liệu lỗi hoặc cũ mở phiên trống và có thông báo; không tin số dư đã lưu.
- Nếu storage bị chặn/đầy, có thông báo và giữ dữ liệu trong bộ nhớ cho phiên hiện tại; reload sẽ mất. Đây không phải tài khoản hoặc ví bền vững.
- Web Locks tuần tự hóa thao tác mua/reset giữa các tab nếu trình duyệt hỗ trợ. Không có Web Locks thì chỉ bảo đảm trong một tab; đây không phải cơ chế chống bán vượt tồn cho backend thật.
- Mỗi yêu cầu xác nhận có mã DEMO chống cộng lặp; hủy/thất bại không ghi nhận nắm giữ. Tối đa 1.000 thao tác trong một phiên, sau đó cần reset.
- Thời gian lịch sử thuộc kịch bản cố định ngày 29/09/2026, hiển thị giờ Việt Nam; không giả làm thời điểm giao dịch thật.
- Chưa có chuyển nhượng, thoái vốn, lợi nhuận, thanh toán hoặc quyền tài sản thật. Phí 0% là giả định demo.

Luồng NFT là một phần mốc 1B. Các luồng danh sách/lưu/video/lịch/chuyên gia/đăng bán và bản Vercel vẫn theo PREPARE, chưa coi toàn bộ demo gọi vốn đã hoàn thành.
