# Xland: quy tắc thực thi

- Đọc `PREPARE.md` và `docs/STATUS.md` trước khi làm; giữ thay đổi đang có của chủ dự án.
- Phạm vi hiện tại: scaffold rồi demo frontend; chưa triển khai backend/admin, ví thật hoặc smart contract.
- Next.js/TypeScript/Tailwind trên Vercel; Node.js/Railway, Supabase và ERC-1155 ở giai đoạn backend. UI gọi rõ NFT.
- Bám mẫu LUXEESTATE, mobile first, tiếng Việt. Trang scaffold chưa phải giao diện đã nghiệm thu.
- Khi làm UI mốc 1A, đọc `docs/DESIGN.md`: home/card/detail trước, cùng fixture; ghi quyết định font/media sau khi kiểm tra. Token CSS thực thi và tài liệu phải khớp.
- Link/nút phải hoạt động hoặc disabled có lý do; không dùng `href="#"`/`alert()` thay luồng hoàn chỉnh. Không dựng thành tích hoặc dữ liệu tài sản thật từ mẫu.
- Kiểm tra UI tại 360/390/430/768/1440px, bàn phím, dấu Việt và reduced motion; lưu ảnh đối chiếu trước khi báo đạt thị giác. WebKit giả lập không phải iPhone thật.
- Dùng pnpm và phiên bản đã khóa; không thêm lockfile của npm/yarn. Không cài dependency nếu chưa có nhu cầu cụ thể.
- Trước khi dùng API Next.js, đọc phần tương ứng trong `node_modules/next/dist/docs/` nếu có; dùng tài liệu chính thức khi bản cài không chứa hướng dẫn.
- Tách fixture khỏi UI. Không thu dữ liệu/tiền thật hoặc báo giao dịch demo là on-chain.
- Không sửa/xóa tài liệu và ảnh nguồn; không commit secret, build hoặc kết quả test tạm.
- Chạy kiểm tra phù hợp thay đổi; trước mốc bàn giao chạy `pnpm check`. Không bỏ qua lỗi bằng cách tắt type/lint hoặc cho phép bộ test rỗng.
- Cập nhật `docs/STATUS.md` với kết quả thực sự, giới hạn và bước tiếp theo; chỉ đánh dấu checklist đã hoàn thành sau khi kiểm tra.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
