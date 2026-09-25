# QA — Mở rộng danh mục mốc 1A

Ngày 25/09/2026. Kiểm tra production local bằng Chromium; E2E chạy thêm Chromium Pixel 7 và WebKit iPhone 13 emulation. Không thay bằng chứng vòng trước ở ../2026-09-25-1a/.

## Phạm vi

Thêm 7 hồ sơ và 7 ảnh riêng; tổng 10 bất động sản. Thứ tự: Đô thị (1) → Vùng ven đô thị (4) → Ocean Park (2) → Vùng quê (3). Nút nhóm kết hợp bộ lọc khu vực/giá/không gian. Ba hồ sơ cũ vẫn giữ id/slug và ảnh. Gallery nhà phố/biệt thự desktop 3:2 để giữ trọn kiến trúc, mobile 4:3. Người hỗ trợ ở home không lặp; liên quan tối đa 3 hồ sơ.

## Kết quả

- pnpm check đạt: lint, typecheck, 8 unit, build 13 trang (10 trang chi tiết), 39/39 E2E trong 51,5 giây.
- 13 E2E trên mỗi trình duyệt: thứ tự nhóm, chọn nhóm bằng Space, lọc kết hợp/empty/reset, cả 7 route mới và ảnh, giá/diện tích; đồng thời giữ các kiểm tra gallery, 404, fallback, keyboard/menu, zoom và reduced motion.
- Axe không có violation trong phạm vi home/detail đã kiểm tra tại 390/1440px.
- [layout.json](layout.json): home và chi tiết Biệt thự Ocean Park 3 tại 360/390/430/768/1440px, scrollWidth = clientWidth, không ảnh hỏng.
- Đã xem ảnh giao diện, dấu Việt và cách nhóm nút tự xuống dòng trên mobile. Hai ảnh kiến trúc không còn bị cắt mái ở desktop.
- Chưa kiểm tra thiết bị thật hoặc đo Lighthouse; chưa có baseline mỹ thuật được chủ dự án duyệt. Mỗi hồ sơ mới hiện có một ảnh.

## Ảnh đối chiếu

| Viewport | Toàn trang chủ | Danh mục | Biệt thự Ocean Park 3 |
| --- | --- | --- | --- |
| 360 | [home](home-360.png) | [catalog](catalog-360.png) | [detail](detail-360.png) |
| 390 | [home](home-390.png) | [catalog](catalog-390.png) | [detail](detail-390.png) |
| 430 | [home](home-430.png) | [catalog](catalog-430.png) | [detail](detail-430.png) |
| 768 | [home](home-768.png) | [catalog](catalog-768.png) | [detail](detail-768.png) |
| 1440 | [home](home-1440.png) | [catalog](catalog-1440.png) | [detail](detail-1440.png) |

- Ocean Park: [lọc mobile](ocean-filter-390.png), [lọc desktop](ocean-filter-1440.png).
- Nhà phố: [mobile](townhouse-390.png), [desktop](townhouse-1440.png).
- Card đô thị: [mobile](card-390.png), [desktop](card-1440.png).
- [Nguồn ảnh và giới hạn](../../ASSETS.md), [prompt gốc](../../../assets/media/generated/catalog-1a/prompts.json).

Chụp lại bằng scripts/capture-ui.mjs với XLAND_CAPTURE_DIR=docs/qa/2026-09-25-catalog và XLAND_DETAIL_SLUG=biet-thu-ocean-park-3, sau khi build và khởi động production local.
