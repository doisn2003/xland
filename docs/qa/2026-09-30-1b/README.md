# QA 1B — 30/09/2026

Vòng triển khai danh sách URL, lưu và lịch xem thực địa trên nền NFT đã có. **Chưa nghiệm thu toàn bộ 1B.** Không có backend hoặc giao dịch thật.

## Kết quả gate cuối

`pnpm check`: lint/typecheck/build đạt, **42/42 unit test**, **74/81 E2E**. Chromium desktop 27/27, Chromium Pixel 7 27/27, WebKit iPhone 13 emulation 20/27. Không skip test, không đổi Playwright project hoặc giảm điều kiện overflow.

7 bài WebKit chưa đạt:

- CSS zoom 200% (`accessibility.spec.ts`).
- Layout của bảy hồ sơ bổ sung (`catalog.spec.ts`).
- Responsive các route 1B (`journey.spec.ts`).
- Responsive các route NFT (`nft.spec.ts`).
- Layout home, layout detail và vòng 5 viewport (`scaffold.spec.ts`, 3 bài).

Những lỗi tên truy cập trường form, thao tác category khi navigation chưa xong, và test quay lại trước khi route chi tiết hoàn tất đã được sửa trước gate cuối. Vòng thử trung gian có một timeout axe khi chạy cùng capture; gate cuối chạy riêng không còn timeout này. Tất cả hành trình chức năng mới, NFT và keyboard đều đạt cả ba project.

## Ảnh đối chiếu

Production server; Chromium, reduced motion, cao 900px; font local đã tải, ảnh đã decode trước chụp. `scripts/capture-1b.mjs` tái lập 35 ảnh và [layout.json](layout.json): không overflow, ảnh lỗi hoặc pageerror. Trạng thái lưu/lịch trong mỗi viewport được tạo bằng UI.

| Viewport | Danh sách | Đã lưu | Form lịch | Xem lại | Lịch đã tạo | NFT | Reset |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 360 | [Ảnh](catalog-360.png) | [Ảnh](saved-360.png) | [Ảnh](visit-form-360.png) | [Ảnh](visit-review-360.png) | [Ảnh](visits-360.png) | [Ảnh](nft-detail-360.png) | [Ảnh](reset-360.png) |
| 390 | [Ảnh](catalog-390.png) | [Ảnh](saved-390.png) | [Ảnh](visit-form-390.png) | [Ảnh](visit-review-390.png) | [Ảnh](visits-390.png) | [Ảnh](nft-detail-390.png) | [Ảnh](reset-390.png) |
| 430 | [Ảnh](catalog-430.png) | [Ảnh](saved-430.png) | [Ảnh](visit-form-430.png) | [Ảnh](visit-review-430.png) | [Ảnh](visits-430.png) | [Ảnh](nft-detail-430.png) | [Ảnh](reset-430.png) |
| 768 | [Ảnh](catalog-768.png) | [Ảnh](saved-768.png) | [Ảnh](visit-form-768.png) | [Ảnh](visit-review-768.png) | [Ảnh](visits-768.png) | [Ảnh](nft-detail-768.png) | [Ảnh](reset-768.png) |
| 1440 | [Ảnh](catalog-1440.png) | [Ảnh](saved-1440.png) | [Ảnh](visit-form-1440.png) | [Ảnh](visit-review-1440.png) | [Ảnh](visits-1440.png) | [Ảnh](nft-detail-1440.png) | [Ảnh](reset-1440.png) |

Đã xem đại diện cả 5 chiều rộng, đối chiếu card/font/màu/spacing với [card Xland trước](../../references/xland-cards-mobile.png) và [LUXEESTATE đã lưu](../../references/luxeestate-desktop.png). Nhãn “mẫu” trong ảnh tham chiếu lịch sử không được đưa lại vào UI hiện tại. Giữ nền sáng, serif Việt, xanh CTA, card bo góc; form và lỗi dùng cùng tokens. Sửa căn đầu dòng các trường form trên tablet sau khi xem ảnh. Chưa tạo baseline visual regression được chủ dự án duyệt.

Axe trên các route mới tại 390/1440px đạt ở cả hai cấu hình Chromium. Không suy ra các phép scan WebKit nằm sau assertion viewport thất bại là đã chạy/đạt. Keyboard có kiểm tra focus lỗi, xem lại/kết quả, đóng form đổi lịch, menu và điều hướng. Reduced motion được bật trong capture và các test responsive.

## Chẩn đoán WebKit Windows

[webkit-viewport.json](webkit-viewport.json) do `scripts/probe-webkit.mjs` tạo trên HTML tối giản và trang Xland:

| Chế độ 390px | innerWidth | clientWidth | scrollWidth | scrollX | DPR |
| --- | --- | --- | --- | --- | --- |
| iPhone 13, HTML tối giản | 325 | 326 | 391 | 65 | 3,59375 |
| iPhone 13, Xland | 325 | 326 | 391 | 65 | 3,59375 |
| Desktop đối chứng, HTML/Xland | 325 | 326 | 326 | 0 | khoảng 1,1979166 |

`HKCU\Control Panel\Desktop\WindowMetrics\AppliedDPI` đọc được 115; 115/96 tương ứng hệ số đối chứng. Đây là dấu hiệu liên quan môi trường DPI, chưa phải xác nhận nguyên nhân đầy đủ. Thử compatibility layer chỉ trong tiến trình không khắc phục; không sửa registry hoặc DPI toàn máy. [Báo cáo upstream về viewport iPhone trên Windows](https://github.com/microsoft/playwright/issues/34188) là trường hợp tham khảo tương tự, không chứng minh cùng nguyên nhân.

Không dùng CSS che overflow hoặc desktop WebKit thay kết quả iPhone. Cần môi trường WebKit với viewport đúng và kiểm tra máy thật trước khi đóng gate. Kết quả đạt WebKit 25/09 là dữ kiện lịch sử; vòng này tái hiện lỗi nên STATUS đã mở lại giới hạn.

## Tái lập

```powershell
$env:Path = (Join-Path $PWD 'node_modules/.bin') + ';' + $env:Path
pnpm check
# Sau check, chạy server trong terminal riêng:
pnpm start --hostname 127.0.0.1 --port 3200
# Terminal khác:
pnpm exec node scripts/capture-1b.mjs
pnpm exec node scripts/probe-webkit.mjs
```

Node dự án 24.21.0, pnpm 11.25.0, Playwright 1.63.0 trên Windows. Traces/log tạm ở `test-results/` được gitignore; ảnh QA này là bằng chứng cần lưu. Không đo Lighthouse lần này, không thử iPhone/Android thật.
