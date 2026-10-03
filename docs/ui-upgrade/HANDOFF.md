# Bàn giao vòng nâng cấp giao diện

Ngày lập: 01/10/2026. Tài liệu kế hoạch đã có; **chưa bắt đầu triển khai P00**. Nguồn tiến độ chính: [STATUS](../STATUS.md). Không ghi đè lịch sử QA bằng dự kiến.

## Trạng thái

| Phase | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| P00 | Đã hoàn thành | Baseline 50 ảnh có metadata tại docs/qa/ui-upgrade/P00/; 42/42 unit đạt, 74/81 E2E đạt; xác nhận WebKit blocker |
| Phase | Trạng thái | Bằng chứng / ghi chú |
| --- | --- | --- |
| P00 | Đã hoàn thành | Baseline 50 ảnh có metadata tại docs/qa/ui-upgrade/P00/; 42/42 unit đạt, 74/81 E2E đạt; xác nhận WebKit blocker |
| P01 | Đã hoàn thành | Logo SVG độc bản (Phương án A), 15 icon chuẩn hóa, semantic tokens, button primitives, proof sheet, 17 ảnh tại docs/qa/ui-upgrade/P01/; 42/42 unit đạt, 22/22 a11y & journey E2E đạt |
| P02 | Đã hoàn thành | Chân dung 4 persona hư cấu, cảnh quan Xland story, module advisors, Avatar component (sm/md/lg/portrait) & themes initials, PropertyImage failedSrc, proof sheet /qa-media-proof, 9 ảnh tại docs/qa/ui-upgrade/P02/; 42/42 unit đạt, 22/22 a11y & journey E2E đạt |
| P03 | Chưa bắt đầu | Header/hero/footer chưa đổi |
| P04 | Chưa bắt đầu | Giới thiệu Xland chưa đổi |
| P05 | Chưa bắt đầu | Section NFT chưa đổi |
| P06 | Chưa bắt đầu | UI các luồng chưa đổi |
| P07 | Chưa bắt đầu | GSAP và @gsap/react chưa cài |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P02 / 03/10/2026 / nền commit 9c195d2.
Kết quả và file đã thay đổi:
- assets/media/generated/advisors/ & public/images/advisors/: Tạo 4 chân dung persona hư cấu đồng nhất (Nguyễn Minh Anh, Trần Hoàng Nam, Lê Thanh Hà, Phạm Ngọc Lan) kèm WebP 512x512 (18.9-26.5 KB) và thumbnail 128x128 (3.6-4.8 KB), vượt sâu budget BRIEF C.
- assets/media/generated/story/ & public/images/xland-story.webp: Ảnh cảnh quan Xland story 1080x1440 (211.8 KB, budget <= 250 KB) có chiều sâu thiên nhiên Việt Nam.
- src/data/advisors.ts: Tạo mới module danh bạ người đồng hành với stable ID (ADV-001..ADV-004), theme fallback, helper lookups.
- src/data/properties.ts: Gắn advisors mapping trực tiếp vào 10 fixtures, giữ nguyên 100% shape nghiệp vụ cũ (name, initials, role).
- src/components/avatar.tsx: Component Avatar hỗ trợ kích thước sm (44px), md (64px), lg (80px), portrait (140x175px); cơ chế fallback initials 4 theme màu token đạt tương phản WCAG 2 AA (5.7:1-7.2:1); decorative a11y tránh đọc lặp tên; mô hình declarative failedSrc.
- src/components/property-image.tsx: Chuẩn hóa mô hình declarative failedSrc để khôi phục hiển thị ảnh đúng chuẩn khi đổi src và thỏa mãn react-hooks linter.
- src/app/globals.css: Bổ sung CSS tokens và styling cho Avatar (.avatar-image-wrap, .avatar-photo, .avatar-portrait, 4 themes màu fallback).
- src/app/qa-media-proof/page.tsx: Tuyến đường proof sheet nội bộ kiểm tra 4 persona, các kích thước Avatar, cảnh quan Xland story và kịch bản ảnh lỗi.
- scripts/capture-p02.mjs & scripts/process-media.mjs: Công cụ xử lý WebP canvas và script chụp kiểm thử 9 viewports chuẩn.
- docs/qa/ui-upgrade/P02/: Lưu trữ 9 ảnh chụp, metadata.json và báo cáo nghiệm thu README.md (imageFailures = 0, không tràn ngang).
- docs/ASSETS.md: Cập nhật đầy đủ bảng danh mục tài sản, nguồn, bản quyền, dimensions, bytes và prompt của toàn bộ asset P02.
- docs/DESIGN.md: Cập nhật mục 12.5 và 12.6 đặc tả component Avatar và asset slots.
- docs/STATUS.md: Cập nhật trạng thái nghiệm thu P02 với các số liệu test thực tế.
Quyết định đã thực thi:
- Dùng Chromium canvas Playwright để chuyển đổi WebP tối ưu dung lượng cao cấp mà không cần cài thêm dependency sharp bên ngoài.
- Không sửa bất kỳ trường nghiệp vụ nào của fixture Property; không đổi id/slug/giá/diện tích/trạng thái.
- Thuộc tính decorative={true} mặc định trên Avatar khi đặt cạnh tên người hỗ trợ giúp ẩn thẻ img khỏi VoiceOver/NVDA, loại bỏ hoàn toàn lỗi đọc lặp tên.
- Sử dụng mô hình state failedSrc declarative thay vì useEffect setState để tránh cascading render.
Hành vi bắt buộc đã giữ:
- 42/42 unit test cũ tiếp tục pass 100% không cần sửa một dòng test nào.
- 22/22 Playwright E2E accessibility & journey tests trên Chromium desktop & mobile tiếp tục pass 100%.
- Không chạm vào logic form/query/store, không đổi dữ liệu giao dịch hoặc seed ledger.
Kiểm tra:
- pnpm lint: ĐẠT (0 warning, 0 error).
- pnpm typecheck: ĐẠT (0 error).
- pnpm test: ĐẠT (42/42 unit tests passed).
- pnpm build: ĐẠT (25 routes SSG/dynamic tối ưu sạch sẽ).
- Playwright E2E a11y & journey: ĐẠT 22/22.
Ảnh và điểm đã quan sát:
- 9 ảnh chụp trong docs/qa/ui-upgrade/P02/ xác nhận 4 persona đồng điệu phong cách, avatar hiển thị sắc nét ở mọi kích thước, fallback initials hiển thị chuẩn khi ảnh hỏng, không tràn ngang ở bất kỳ viewport nào.
Blocker / rủi ro / nội dung còn dở:
- 7 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và 6 file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P03-shell-hero.md (Nhiệm vụ P03 — Header, Hero và Footer)
2. docs/ui-upgrade/BRIEF.md (Mục A — Header/Hero/Footer Sunshine)
3. docs/DESIGN.md (Mục 12 — Design System & Tokens)
4. src/components/site-header.tsx (Header hiện tại)
5. src/components/site-footer.tsx (Footer hiện tại)
6. src/app/page.tsx (Hero section trang chủ hiện tại)
```

## Điểm mở cần kế thừa

- WebKit sai viewport trong QA 30/09; cần đối chứng môi trường. Không tự sửa CSS để che sai số.
- Chưa có Lighthouse ba lần hoặc kết quả thiết bị thật.
- Persona hỗ trợ hiện nằm trong fixture property; cần ánh xạ avatar ổn định ở P02, không đổi id/slug tài sản.
- Lịch có cửa sổ fixture 01–31/10/2026; sau thời gian này vẫn phải dùng kịch bản/clock đã quy định, không sửa nghiệp vụ chỉ để screenshot có dữ liệu.
- Toàn mốc 1B còn các tính năng được liệt kê trong STATUS; chúng nằm ngoài vòng thẩm mỹ này.
