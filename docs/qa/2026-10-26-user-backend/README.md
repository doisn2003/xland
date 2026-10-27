# QA website user — 26/10/2026

Production build local, API Express và PostgreSQL QA riêng. Full `pnpm check`
đạt trong một lượt: lint, typecheck, 42 unit và 18/18 E2E; không skip WebKit.
Sáu hành trình rộng được chạy trên Desktop Chromium, Pixel 7 Chromium và iPhone
13 WebKit. Toàn bộ 5 viewport được kiểm width/overflow thực tế, keyboard,
reduced-motion; Axe đăng nhập/danh mục không có vi phạm trong ruleset WCAG A/AA.

Ảnh `home-*`, `catalog-*`, `detail-*` chụp từ chính lượt đạt đó: 360/390/430 dùng
WebKit, 768/1440 dùng Chromium. Đã xem ảnh ở cả 5 kích thước, rà chữ Việt, khoảng
cách lề, bố cục và trạng thái thiếu media. Hero mobile đã sửa width ghi đè gutter.
Ảnh catalog là full page; home/detail là khung nhìn đầu 960 CSS px.

Dataset của PostgreSQL QA có 4 lô đất và media không khả dụng để kiểm fallback
trung tính. Không dùng ảnh mẫu thay ảnh không tải được. Các ảnh có `live` trong tên
là website production build local đọc Railway và media công khai, không mutation
hoặc maps/provider. Không phải bằng chứng deployment Vercel mới.

Ảnh đọc API Railway: [Catalog 390](catalog-live-390.png),
[detail 390](detail-live-390.png), [home 1440](home-live-1440.png).

| Viewport | Home | Catalog | Detail |
| --- | --- | --- | --- |
| 360 | [Ảnh](home-360.png) | [Ảnh](catalog-360.png) | [Ảnh](detail-360.png) |
| 390 | [Ảnh](home-390.png) | [Ảnh](catalog-390.png) | [Ảnh](detail-390.png) |
| 430 | [Ảnh](home-430.png) | [Ảnh](catalog-430.png) | [Ảnh](detail-430.png) |
| 768 | [Ảnh](home-768.png) | [Ảnh](catalog-768.png) | [Ảnh](detail-768.png) |
| 1440 | [Ảnh](home-1440.png) | [Ảnh](catalog-1440.png) | [Ảnh](detail-1440.png) |

WebKit Windows có giới hạn SameSite đã tái hiện trên HTTP server tối giản:
Chromium báo Lax và không gửi cookie trong POST chéo site, WebKit báo None và vẫn
gửi. Gate kiểm header Lax/HttpOnly và Origin enforcement thực bằng form chéo site
trên cả ba project; HTTPS Secure/host-only được kiểm bằng unit BFF. Không tuyên bố
đã nghiệm thu Safari/iPhone vật lý hoặc Google/OTP/tiles live.

Xem [bàn giao](../../USER-BACKEND-INTEGRATION.md) về policy và cách chạy lại.
