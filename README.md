# Xland

**Cập nhật 26/10/2026:** website user dùng API thật của `xland-server`, cùng tài khoản và dữ liệu với Flutter. Xem [hướng dẫn tích hợp](docs/USER-BACKEND-INTEGRATION.md) và [kết quả kiểm tra](docs/STATUS.md). Admin tại `/admin` giữ API và phiên riêng; tài liệu ở [ADMIN](docs/ADMIN.md).

Website mobile first, tiếng Việt: danh mục/chi tiết UUID, tài khoản, nội dung đã lưu, video/bình luận/theo dõi, người đăng/chuyên gia, hỗ trợ, lịch xem, cộng đồng và tài chính. Mock data, store demo, reset và giao dịch NFT giả đã được gỡ khỏi mã ứng dụng. Booking và đăng ký sự kiện có feature flag; thanh toán, đổi/hủy, tải tài liệu, NFT và đăng bán giữ trạng thái chưa khả dụng theo backend.

## Chạy local

Máy cần pnpm **11.25.0** và Node đủ để chạy pnpm (từ 22.13). Khuyến nghị cài Node **24.21.0**. `devEngines.runtime` tự tải và khóa Node 24.21.0 cho các lệnh trong dự án; không thay Node toàn máy. Lần cài đầu cần Internet.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Trước khi chạy, tạo `.env.local` theo `.env.example`, đặt `XLAND_API_BASE_URL` tới `/api/v1` của backend và `XLAND_WEB_ORIGIN=http://localhost:3000`. Không chép secret DB/Storage sang website. Mở http://localhost:3000. Dùng pnpm, không dùng `npm install`/yarn trong repo website.

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

`check` chạy lint → typecheck → unit → production build → E2E. E2E cần repo `../../xland-server` đã `npm ci`; tự tạo PostgreSQL QA độc lập, API ở `127.0.0.1:3311`, website production ở `127.0.0.1:3100`, PostgreSQL ở `55448`. Các cổng cần trống. Không đọc `DATABASE_URL` hay ghi vào database dùng chung. Chromium và WebKit cài một lần bằng script trên (Linux CI có thể cần `pnpm exec playwright install --with-deps chromium webkit`).

| Lệnh | Công dụng |
| --- | --- |
| `pnpm lint` | ESLint, không chấp nhận warning |
| `pnpm typecheck` | Sinh route types và kiểm tra TypeScript strict |
| `pnpm test` / `pnpm test:watch` | Vitest một lần / theo dõi thay đổi |
| `pnpm build` / `pnpm start` | Build / chạy production tại cổng 3000 |
| `pnpm test:e2e` | Test production đã build, Chromium desktop/mobile và WebKit mobile |
| `pnpm check` | Toàn bộ các bước kiểm tra |

Bộ kiểm tra user gọi API và PostgreSQL thật, kiểm đồng bộ bằng cùng tài khoản web/bearer mobile, hai user cách ly, logout nhiều tab, CSRF, idempotency, tài chính/hỗ trợ/lịch xem/video/cộng đồng, responsive 360/390/430/768/1440, keyboard và accessibility. Các kiểm thử store demo cũ đã được thay bằng luồng backend. WebKit giả lập không thay kiểm tra iPhone thật; giới hạn engine Windows được ghi trong tài liệu tích hợp.

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

- `src/app`: App Router, chi tiết động theo UUID, BFF cùng origin, 404/error, CSS và font local Noto Serif/Be Vietnam Pro.
- `src/features/user`: DTO đồng bộ mobile, wire validation, client/server transport và các domain user; `src/components`: UI dùng chung.
- `tests/unit`, `tests/e2e`: Vitest và Playwright.
- `assets`: giữ nguyên PDF/ảnh nguồn; phối cảnh mới có PNG và prompt riêng. `public/images` chứa WebP được tuyển chọn.
- [PREPARE.md](PREPARE.md): phạm vi, tiêu chí và lộ trình.
- [AGENTS.md](AGENTS.md): quy tắc phát triển; [docs/STATUS.md](docs/STATUS.md): tiến độ thực tế.
- [docs/DESIGN.md](docs/DESIGN.md): tokens, typography, responsive, home/card/detail và tiêu chí nghiệm thu 1A. Tokens trong tài liệu khớp CSS thực thi.

## Tiếp tục phát triển

Đọc STATUS → USER-BACKEND-INTEGRATION → kế hoạch tích hợp. Tài liệu và scripts chụp UI 1A/1B còn được giữ để đối chiếu lịch sử; đường dẫn slug/store demo trong chúng không áp dụng cho bản API. Ảnh QA hiện tại được tạo bởi `tests/e2e/backend-user.spec.ts`; xem ảnh trước khi cập nhật biên bản nghiệm thu.

Frontend Vercel với Node 24.x, install `pnpm install --frozen-lockfile`, build `pnpm build`, preset Next.js. Chưa triển khai bản tích hợp user trong lượt này. Giữ metadata `noindex` đến khi nội dung/policy đủ điều kiện phát hành; đây không phải cơ chế xác thực.

Backend Express/PostgreSQL/Railway là nguồn dữ liệu. Website không có ví, smart contract hoặc xử lý thu tiền thật.
