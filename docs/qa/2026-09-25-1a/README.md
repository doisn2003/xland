# QA mốc 1A — 25/09/2026

Phạm vi: home/card/detail, hoàn thiện trên commit gốc `be8213a`. Tài liệu tiến độ chính: [STATUS](../../STATUS.md).

## Bằng chứng thị giác

| Viewport | Home | Detail |
| --- | --- | --- |
| 360 × 900 | [Home](home-360.png) | [Detail](detail-360.png) |
| 390 × 900 | [Home](home-390.png) | [Detail](detail-390.png) |
| 430 × 900 | [Home](home-430.png) | [Detail](detail-430.png) |
| 768 × 900 | [Home](home-768.png) | [Detail](detail-768.png) |
| 1440 × 1000 | [Home](home-1440.png) | [Detail](detail-1440.png) |

Card: [390px](card-390.png), [1440px](card-1440.png). Màn hình đầu: [home mobile](home-390-fold.png), [detail mobile](detail-390-fold.png).

Tham chiếu LUXEESTATE chụp mới cùng viewport bằng Chromium: [390 × 900](reference-390.png), [1440 × 1000](reference-1440.png); nguồn [uupm.cc/demo/real-estate](https://uupm.cc/demo/real-estate), ngày 25/09/2026. Chỉ dùng để đối chiếu thiết kế, không dùng ảnh tham chiếu làm media sản phẩm. Ảnh tham chiếu cũ trong `docs/references/` giữ nguyên.

Đối chiếu: giữ header sáng, hero ảnh lớn/overlay, serif với điểm nhấn vàng, CTA xanh, bộ lọc nổi và card ảnh bo góc. Xland dùng tiếng Việt, nội dung đất nền, một cột trên mobile; không sao chép thành tích hoặc thông số biệt thự của mẫu. Phối cảnh nhà vườn nằm ở phần cảm hứng NFT, cạnh các ảnh cảnh quan thật. Đã xem chữ/dấu, crop, khoảng cách, thứ tự nội dung và layout ở 5 kích thước. Đây là bằng chứng kiểm tra của người triển khai, không thay quyết định nghiệm thu mỹ thuật của chủ dự án.

## Kết quả kỹ thuật

- `pnpm check`: lint + typecheck + 5 unit + build + 33 E2E đạt; 3 project Chromium desktop, Pixel 7, WebKit iPhone 13.
- Axe WCAG 2 A/AA + 2.1 AA: home/detail tại 390/1440px, cả 3 project không violation.
- Kiểm tra bàn phím: skip link, thứ tự filter, submit Enter, mở detail, điều khiển gallery; mobile menu Escape trả focus; CSS zoom 200% và reduced motion.
- [layout.json](layout.json): mọi ảnh home/detail có `scrollWidth = clientWidth`, không ảnh hỏng. E2E kiểm thêm cuộn ngang thật bằng `scrollTo`.
- [webkit-viewport.json](webkit-viewport.json): iPhone emulation và desktop responsive trên HTML tối giản/Xland đều không tái hiện lỗi viewport cũ. Vì vậy khôi phục test mobile đầy đủ, không giữ workaround desktop.
- [hero-contrast.json](hero-contrast.json): 41 vùng dòng chữ, 5 viewport, mức tối thiểu chữ thường 5,30:1, chữ lớn 3,96:1. Script ẩn màu chữ nhưng giữ bố cục/overlay, chụp nền rồi lấy pixel sáng nhất trong toàn bộ hình chữ nhật từng dòng để tính mức tương phản thấp nhất. Đây là phép đo bảo thủ cho màu chữ sáng trên ảnh tối; axe riêng không đủ kiểm chữ trên ảnh.
- [media-checksums.json](media-checksums.json): SHA-256/bộ ảnh phục vụ web; nguồn và prompt ở [ASSETS](../../ASSETS.md).

WebKit Windows mặc định bỏ qua link khi Tab trong kiểm tra tối giản; khai báo `tabIndex={0}` cho skip link giúp người dùng bàn phím truy cập mục bỏ qua điều hướng. Không bỏ assertion, không sửa DOM trong E2E để ép test đạt.

## Tái lập

Sau `pnpm check`, mở production bằng `pnpm start`, rồi:

```sh
pnpm exec node scripts/capture-ui.mjs
pnpm exec node scripts/measure-hero.mjs
```

Mặc định `http://127.0.0.1:3000`; có thể đổi bằng `XLAND_URL`. Không cần dependency mới. Test artifacts tạm trong `test-results/` được gitignore; thư mục này chỉ lưu bằng chứng được chọn cho mốc 1A.

Chưa có Lighthouse, kiểm tra thiết bị thật, browser zoom thật, hoặc baseline visual regression tự động. Mốc 1B và phát hành Vercel chưa thuộc kết quả lần này.
