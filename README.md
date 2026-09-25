# Xland

Website bất động sản và NFT, mobile first. Hiện là nền ứng dụng và trang chờ tiếng Việt; chưa phải demo LUXEESTATE hoàn chỉnh.

## Chạy local

Máy cần pnpm **11.25.0** và Node đủ để chạy pnpm (từ 22.13). Khuyến nghị cài Node **24.21.0**. `devEngines.runtime` tự tải và khóa Node 24.21.0 cho các lệnh trong dự án; không thay Node toàn máy. Lần cài đầu cần Internet.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở http://localhost:3000. Chưa cần `.env` hoặc tài khoản dịch vụ. Dùng pnpm, không dùng `npm install`/yarn để tránh lockfile khác và kiểm tra runtime khác nhau.

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

Các test hiện kiểm tra thông báo dữ liệu/giao dịch mẫu có trong HTML server, trang chủ tiếng Việt/noindex, không tràn ngang, lỗi JavaScript, trang 404 và điều hướng về nhà. Đây là smoke test scaffold, chưa chứng minh chất lượng hay nghiệp vụ của demo tương lai.

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

- `src/app`: App Router, layout, trang chủ tạm, 404, CSS; font hệ thống, chưa chốt thiết kế.
- `tests/unit`, `tests/e2e`: Vitest và Playwright.
- `assets`: tài liệu/ảnh nguồn, giữ nguyên; chưa tự đưa lên public.
- [PREPARE.md](PREPARE.md): phạm vi, tiêu chí và lộ trình.
- [AGENTS.md](AGENTS.md): quy tắc phát triển; [docs/STATUS.md](docs/STATUS.md): tiến độ thực tế.
- [docs/DESIGN.md](docs/DESIGN.md): tokens, typography, responsive, home/card/detail và tiêu chí nghiệm thu 1A. Đây là đặc tả; CSS trang chờ chưa triển khai hệ thiết kế này.

## Bắt đầu mốc 1A

Đọc STATUS → phần phạm vi trong PREPARE → DESIGN. Thứ tự: lưu tham chiếu, thử font Việt và tuyển media → ghi ASSETS → triển khai tokens/fixture → home/card/detail → đối chiếu mobile/desktop và chạy kiểm tra. Bộ tài liệu đã sẵn sàng không đồng nghĩa giao diện 1A đã hoàn thành.

Frontend hướng tới Vercel với Node 24.x, install `pnpm install --frozen-lockfile`, build `pnpm build`, preset Next.js. Chưa tạo deployment. Trang demo có metadata `noindex`; đây không phải cơ chế xác thực/bảo mật.

Backend Node.js/Railway, Supabase và NFT ERC-1155 thuộc giai đoạn sau. Scaffold chưa nối backend, ví, smart contract hay xử lý tiền thật.
