# Xland

Website bất động sản và NFT, mobile first. Đã có trang chủ, bộ lọc và chi tiết lô đất theo hướng LUXEESTATE, với ảnh chụp thật và dữ liệu mẫu. Tiến độ/giới hạn cập nhật tại docs/STATUS.md.

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
| `pnpm test:e2e` | Test production đã build, Chromium desktop/mobile và WebKit (Windows dùng desktop responsive có touch) |
| `pnpm check` | Toàn bộ các bước kiểm tra |

Các test kiểm tra fixture/lọc, home → detail, gallery, empty/reset, 404, hồ sơ tạm dừng, lỗi media, menu Escape/focus, reduced motion và không cuộn ngang tại năm độ rộng. Axe kiểm tra home/detail theo WCAG 2 A/AA và 2.1 AA. WebKit trên Windows không thay thế Safari/iPhone thật; xem STATUS để biết phạm vi đã chạy.

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
| @axe-core/playwright | 4.13.0 |
| @types/node | 24.13.6 |
| @types/react / @types/react-dom | 19.3.0 |

React, TypeScript và ESLint giữ nhánh của template Next.js đã chọn. ESLint 9.39.5 có cảnh báo deprecated từ registry; các plugin React/JSX accessibility hiện dùng bởi cấu hình Next còn giới hạn peer ESLint 9. Cần nâng đồng bộ khi các plugin hỗ trợ ESLint mới; không ép peer dependency hay tắt lint để che cảnh báo này.

## Cấu trúc và triển khai

- `src/app`: App Router, layout, home, chi tiết lô đất, 404, tokens CSS và font local.
- `src/components`, `src/data`: UI tái sử dụng và fixture dùng chung.
- `tests/unit`, `tests/e2e`: Vitest và Playwright.
- `assets`: tài liệu/ảnh nguồn, giữ nguyên; chưa tự đưa lên public.
- [PREPARE.md](PREPARE.md): phạm vi, tiêu chí và lộ trình.
- [AGENTS.md](AGENTS.md): quy tắc phát triển; [docs/STATUS.md](docs/STATUS.md): tiến độ thực tế.
- [docs/DESIGN.md](docs/DESIGN.md): tokens, typography, responsive, home/card/detail và tiêu chí nghiệm thu 1A. Tokens đã có trong CSS; phần nghiệm thu còn lại theo STATUS.

## Tiếp tục phát triển

Đọc STATUS → phần phạm vi trong PREPARE → DESIGN. Thứ tự: lưu tham chiếu, thử font Việt và tuyển media → ghi ASSETS → triển khai tokens/fixture → home/card/detail → đối chiếu mobile/desktop và chạy kiểm tra. Bộ tài liệu đã sẵn sàng không đồng nghĩa giao diện 1A đã hoàn thành.

Frontend hướng tới Vercel với Node 24.x, install `pnpm install --frozen-lockfile`, build `pnpm build`, preset Next.js. Chưa tạo deployment. Trang demo có metadata `noindex`; đây không phải cơ chế xác thực/bảo mật.

Backend Node.js/Railway, Supabase và NFT ERC-1155 thuộc giai đoạn sau. Ứng dụng chưa nối backend, ví, smart contract hay xử lý tiền thật.

## NFT — phần demo 1B đã có

Mở `/nft` → Miền xanh ven sông → chọn số NFT → đồng ý điều kiện mẫu → xem lại → xác nhận mô phỏng → danh mục. Các tình huống hủy/thất bại và reset tại [docs/DEMO.md](docs/DEMO.md).

`src/features/nft/model.ts` chứa phương án mẫu và quy tắc số lượng/tồn/tiền/sổ đơn; `store.ts` là adapter trình duyệt có phiên bản. UI không nối backend hoặc ví thật. Không thêm dependency cho form đơn giản này; validation thuần TypeScript dùng chung khi ghi và phục hồi demo.
