# Xland

Website đất nền và bất động sản NFT, mobile first, tiếng Việt. Mốc 1A có trang chủ, tìm kiếm cục bộ, card và chi tiết lô đất; dùng fixture tập trung gồm 10 bất động sản (1 đô thị, 4 vùng ven đô thị, 2 Ocean Park Hưng Yên, 3 vùng quê), ảnh thật kết hợp phối cảnh. Các hành trình mua NFT/lịch hẹn/video thuộc mốc 1B.

## Chạy local

Máy cần pnpm **11.25.0** và Node đủ để chạy pnpm (từ 22.13). Khuyến nghị cài Node **24.21.0**. `devEngines.runtime` tự tải và khóa Node 24.21.0 cho các lệnh trong dự án; không thay Node toàn máy. Lần cài đầu cần Internet.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở http://localhost:3000. Chưa cần `.env` hoặc tài khoản dịch vụ. Dùng pnpm, không dùng `npm install`/yarn để tránh lockfile khác và kiểm tra runtime khác nhau.

Trên máy Windows hiện tại, Node mặc định còn là 20.x. Sau khi dependency đã được cài, mở PowerShell tại repo và ưu tiên Node đã khóa của dự án trong phiên terminal trước khi chạy các lệnh trên:

```powershell
$env:Path = (Join-Path $PWD 'node_modules/.bin') + ';' + $env:Path
pnpm dev
```

Lệnh này chỉ đổi PATH của terminal hiện tại. Với checkout mới chưa cài dependency, cần Node từ 22.13 để bootstrap như yêu cầu ở đầu trang.

## Kiểm tra

```sh
pnpm test:e2e:install
pnpm check
```

`check` chạy lần lượt lint → typecheck → unit test → production build → E2E. E2E tự mở server production tại `127.0.0.1:3100`, rồi đóng khi xong; cần cổng này trống. Chromium và WebKit được cài một lần bằng script trên (Linux CI có thể cần `pnpm exec playwright install --with-deps chromium webkit`).

| Lệnh | Công dụng |
| --- | --- |
| `pnpm lint` | ESLint, không chấp nhận warning |
| `pnpm typecheck` | Sinh route types và kiểm tra TypeScript strict |
| `pnpm test` / `pnpm test:watch` | Vitest một lần / theo dõi thay đổi |
| `pnpm build` / `pnpm start` | Build / chạy production tại cổng 3000 |
| `pnpm test:e2e` | Test production đã build, Chromium desktop/mobile và WebKit mobile |
| `pnpm check` | Toàn bộ các bước kiểm tra |

Bộ kiểm tra gồm 8 unit test và 39 E2E trên Chromium desktop, Chromium mobile và WebKit giả lập iPhone 13. Bao phủ thứ tự nhóm, lọc kết hợp/empty/reset, cả 7 trang chi tiết mới, home → detail, gallery, trạng thái tạm dừng, 404, media fallback, bàn phím, menu, reduced motion, CSS zoom 200%, 5 viewport và axe WCAG A/AA. UI không phủ nhãn demo/mẫu; nguồn và giới hạn nằm trong tài liệu nội bộ. WebKit giả lập không thay kiểm tra máy thật.

## Phiên bản đã khóa

Ghi nhận ngày 25/09/2026. Dependency trực tiếp dùng số phiên bản chính xác; dependency gián tiếp và runtime nằm trong `pnpm-lock.yaml`.

| Thành phần | Phiên bản |
| --- | --- |
| Node.js LTS | 24.21.0 |
| pnpm | 11.25.0 |
| create-next-app (công cụ khởi tạo) | 16.3.6 |
| Next.js / eslint-config-next | 16.3.6 |
| React / React DOM | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS / @tailwindcss/postcss | 4.3.3 |
| ESLint | 9.39.5 |
| Vitest | 5.0.1 |
| @playwright/test | 1.63.0 |
| @types/node | 24.13.6 |
| @types/react / @types/react-dom | 19.3.0 |

React, TypeScript và ESLint giữ nhánh của template Next.js đã chọn. ESLint 9.39.5 có cảnh báo deprecated từ registry; các plugin React/JSX accessibility hiện dùng bởi cấu hình Next còn giới hạn peer ESLint 9. Cần nâng đồng bộ khi các plugin hỗ trợ ESLint mới; không ép peer dependency hay tắt lint để che cảnh báo này.

## Cấu trúc và triển khai

- `src/app`: App Router, home, chi tiết động theo slug, 404, CSS tokens và font local Noto Serif/Be Vietnam Pro.
- `src/components`, `src/data`: component tương tác và fixture dùng chung.
- `tests/unit`, `tests/e2e`: Vitest và Playwright.
- `assets`: giữ nguyên PDF/ảnh nguồn; phối cảnh mới có PNG và prompt riêng. `public/images` chứa WebP được tuyển chọn.
- [PREPARE.md](PREPARE.md): phạm vi, tiêu chí và lộ trình.
- [AGENTS.md](AGENTS.md): quy tắc phát triển; [docs/STATUS.md](docs/STATUS.md): tiến độ thực tế.
- [docs/DESIGN.md](docs/DESIGN.md): tokens, typography, responsive, home/card/detail và tiêu chí nghiệm thu 1A. Tokens trong tài liệu khớp CSS thực thi.

## Tiếp tục phát triển

Đọc STATUS → PREPARE → DESIGN. Bằng chứng 1A ở `docs/qa/2026-09-25-1a/README.md`, vòng mở rộng danh mục ở `docs/qa/2026-09-25-catalog/README.md`; bước tiếp theo là mốc 1B theo STATUS. Chạy production (`pnpm build`, `pnpm start`) rồi `pnpm exec node scripts/capture-ui.mjs` để chụp lại home/detail/card; `pnpm exec node scripts/measure-hero.mjs` để đo tương phản chữ trên hero. Đặt `XLAND_CAPTURE_DIR` để lưu ảnh vào thư mục QA mới và `XLAND_DETAIL_SLUG` để chọn hồ sơ chi tiết cần chụp. Không cập nhật ảnh nghiệm thu mà chưa xem lại.

Frontend hướng tới Vercel với Node 24.x, install `pnpm install --frozen-lockfile`, build `pnpm build`, preset Next.js. Chưa tạo deployment. Trang demo có metadata `noindex`; đây không phải cơ chế xác thực/bảo mật.

Backend Node.js/Railway, Supabase và NFT ERC-1155 thuộc giai đoạn sau. Ứng dụng chưa nối backend, ví, smart contract hay xử lý tiền thật.
