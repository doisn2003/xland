# Trạng thái Xland

Cập nhật: 29/09/2026.

## Mốc hiện tại

Đã triển khai nền giao diện 1A: trang chủ, tìm kiếm cục bộ, thẻ và chi tiết lô đất. Đã kiểm tra production local và lưu ảnh desktop/mobile. Chưa đóng toàn bộ nghiệm thu 1A: còn zoom trình duyệt 200% và rà soát bàn phím toàn hành trình. Đã triển khai luồng NFT của 1B; các luồng 1B còn lại và Vercel chưa hoàn thành.

## Đã có trong mã nguồn

- Hệ tokens CSS, header/menu mobile, hero, tìm kiếm, 3 thẻ lô đất, các section giới thiệu và footer theo hướng LUXEESTATE.
- Fixture dùng chung cho home/card/detail; lọc kết hợp khu vực, khoảng giá, không gian; trạng thái rỗng và xóa lọc.
- Chi tiết `/lo-dat/[slug]`: gallery, giá/diện tích, hồ sơ mẫu, người hỗ trợ, phương án NFT giới thiệu, tài sản liên quan; slug sai trả 404.
- Ảnh chụp thật được lưu local, có nguồn tại ASSETS; không dùng ảnh AI. Noto Serif + Be Vietnam Pro phục vụ tiếng Việt, tải local.
- Media lỗi có fallback; hồ sơ tạm dừng không nhận đề nghị; không thu dữ liệu hay tiền thật.

## Kiểm tra ngày 29/09

- `pnpm check`: đạt lint, TypeScript, 17 unit test, production build và **42/42 E2E**.
- E2E gồm lọc/empty/reset, card → detail, gallery, trạng thái tạm dừng, 404, lỗi media, menu Escape/trả focus, reduced motion và không cuộn ngang ở 360/390/430/768/1440px.
- Bổ sung axe-core: home/detail qua 3 cấu hình trình duyệt, không có violations với các tags WCAG 2 A/AA và 2.1 AA. Đây là kiểm tra tự động, không thay thế đánh giá accessibility thủ công đầy đủ.
- Chromium desktop/mobile đạt. Trên Windows dùng **responsive WebKit desktop có touch**, không dùng cấu hình iPhone gặp lỗi tỷ lệ DPI. Không skip test, không che overflow. Kết quả này không chứng minh Safari trên iPhone thật; nhánh giả lập iPhone ngoài Windows chưa chạy trong phiên này.
- Đã xem home/card/detail bằng trình duyệt tại viewport cấu hình 390×844 và 1440×1000; chữ Việt, crop ảnh, thẻ và gallery hiển thị rõ. Ảnh tại `docs/references/xland-*.png`; phạm vi bằng chứng trong `docs/references/README.md`.
- Production local đã khởi động tại `http://127.0.0.1:3200` trong phiên làm việc. Khi server đã dừng, chạy lại theo README.

## Luồng NFT đã triển khai trong vòng này

- `/nft`: ba phương án liên kết ID lô gốc, trạng thái mở bán/hết NFT/tạm dừng, giá và tồn.
- `/nft/[slug]`: hồ sơ/điều kiện mẫu, chọn số lượng nguyên dương, xem tổng tiền và tỷ lệ trên tổng NFT cố định, đồng ý chủ động, xác nhận hai bước.
- `/danh-muc-nft`: nắm giữ, tỷ lệ, vốn mua, lịch sử thành công/hủy/thất bại; reload giữ trạng thái và reset có xác nhận.
- Adapter localStorage có phiên bản, đọc sau hydrate, kiểm tra dữ liệu bằng phát lại đơn; lỗi storage chuyển sang phiên bộ nhớ và thông báo rõ. Chống cộng lặp cùng mã thao tác.
- Home/header/footer và chi tiết lô đầu tiên dẫn đến luồng NFT. Đã sửa focus/scroll bước xác nhận để tiêu đề không bị header che trên mobile.
- Unit test kiểm tra số lượng, tồn/giữ chỗ, tỷ lệ, tính tiền, chống trùng, trạng thái đóng, phục hồi dữ liệu. E2E kiểm tra mua/reload/reset, hủy/thất bại, dữ liệu lỗi/storage chặn, 404, responsive và axe trên ba trang NFT.
- Đã xem catalog, form xác nhận và danh mục trên mobile/desktop; ảnh `docs/references/xland-nft-*.png`. Kịch bản thử tại `docs/DEMO.md`.

## Giới hạn còn lại

- Chưa kiểm tra zoom trình duyệt 200%, screen reader và toàn bộ thứ tự Tab; menu Escape/focus đã có E2E.
- Chưa kiểm tra thiết bị iOS/Android thật, Lighthouse hoặc deployment Vercel.
- NFT chỉ mô phỏng: chưa có ví, thanh toán, mint/chuyển nhượng hoặc quyền tài sản thật. Web Locks được dùng nếu có; chưa kiểm tra mua đồng thời nhiều tab. Xem DEMO.md về giới hạn lưu dữ liệu.
- Chưa có danh sách đồng bộ URL, lịch xem đất, video feed và các luồng 1B khác.
- Backend/admin, ví thật và ERC-1155 thuộc giai đoạn sau. PDF/bốn ảnh nguồn giữ nguyên.

## Tiếp theo — thứ tự thực thi

1. Hoàn tất zoom 200% và kiểm tra bàn phím toàn home/detail để đóng nghiệm thu 1A; sửa lỗi nếu có.
2. Mốc 1B tiếp theo: danh sách `/lo-dat` có filter/sort trên URL và lưu/bỏ lưu nhất quán; sau đó lịch xem đất, video và các luồng phụ theo PREPARE.
3. Hoàn thiện các luồng 1B còn lại, kiểm tra lại và đóng gói demo Vercel cho nhà đầu tư.
