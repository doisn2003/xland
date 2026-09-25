# Trạng thái Xland

Cập nhật: 25/09/2026.

## Mốc hiện tại

Đã tạo nền Next.js/TypeScript/pnpm và các lệnh kiểm tra. Đã hoàn thiện AGENTS, README, STATUS và DESIGN đủ để triển khai mốc 1A. Chưa hoàn thành giao diện mốc 1A; checklist scaffold chưa đóng vì còn một kiểm tra WebKit thất bại.

## Phạm vi

- Frontend Vercel; backend Node.js/Railway và Supabase ở giai đoạn sau.
- Demo NFT dùng dữ liệu mẫu; ERC-1155 triển khai khi phát triển backend.
- PDF và bốn ảnh nguồn được giữ nguyên.

## Kiểm tra

- `pnpm dev --hostname 127.0.0.1`: khởi động được. GET `http://127.0.0.1:3000` trả HTTP 200, có nội dung Xland/Bản trải nghiệm; server được giữ chạy để xem local trong phiên làm việc.
- `pnpm install --frozen-lockfile`: đạt; Node dự án 24.21.0, pnpm 11.25.0. Bảng phiên bản đầy đủ trong README.
- `pnpm check`: lint, typecheck, 1 unit test và production build đạt; E2E đạt 5/6, toàn chuỗi chưa đạt.
- Chromium desktop/mobile: home và 404/điều hướng đạt. WebKit mobile: 404/điều hướng đạt; kiểm tra cuộn ngang thất bại (`scrollX` 65px).
- Chẩn đoán WebKit trên Windows: trang HTML tối giản cũng cho `innerWidth` 325px trong thiết bị có screen width 390px, body khoảng 390.68px. Đo theo khung CSS loại được chênh lệch phép đo, nhưng vẫn cuộn ngang khi thử thực tế. Chưa kết luận chất lượng mobile đạt; cần phân biệt lỗi giả lập/runtime với lỗi viewport trước khi đóng scaffold. Không skip test, không che overflow bằng CSS. Thử ép width 100% và deviceScaleFactor 1 không giải quyết nên đã hoàn nguyên.
- `git diff --check`: đạt, Git chỉ cảnh báo chuyển LF/CRLF. PDF/ảnh nguồn không thay đổi.

Chưa kiểm tra trên thiết bị iOS/Android thật, chưa có visual baseline, Lighthouse hoặc deployment Vercel. Cảnh báo deprecated của ESLint 9 được ghi trong README; chưa ép nâng vượt peer support.

## Tiếp theo

1. Giải quyết kiểm tra viewport/cuộn ngang WebKit mobile còn thất bại, chạy lại phần liên quan và `pnpm check` trước khi đóng scaffold.
2. Theo DESIGN: lưu tham chiếu bền vững, thử glyph/font tiếng Việt, tuyển media và ghi ASSETS.
3. Triển khai tokens, fixture và home/card/detail; kiểm tra thị giác mobile/desktop trước khi sang các luồng 1B.
