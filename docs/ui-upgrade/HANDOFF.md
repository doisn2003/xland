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
| P03 | Đã hoàn thành | SiteHeader kính mờ 68/80px, mobile menu Escape/focus, Hero component tách riêng không 100vh lộ search, SiteFooter 2 cột điều hướng, final-cta card, 10 ảnh tại docs/qa/ui-upgrade/P03/; 42/42 unit đạt, 22/22 a11y & journey E2E đạt |
| P04 | Chưa bắt đầu | Giới thiệu Xland chưa đổi |
| P05 | Chưa bắt đầu | Section NFT chưa đổi |
| P06 | Chưa bắt đầu | UI các luồng chưa đổi |
| P07 | Chưa bắt đầu | GSAP và @gsap/react chưa cài |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P03 / 03/10/2026 / nền commit c9c8178.
Kết quả và file đã thay đổi:
- src/components/home/hero.tsx: Tách section Hero thành component riêng biệt, semantic h1, eyebrow tag, nút CTA, thông tin phụ và các data hooks cho GSAP (data-hero-media, data-hero-content, data-hero-title, data-hero-cta).
- src/app/page.tsx: Compose Hero component, tinh chỉnh bố cục, giữ nguyên PropertyExplorer, các section và các flow chức năng.
- src/components/site-header.tsx: Cập nhật SiteHeader với chiều cao 68px (mobile) / 80px (desktop), nền kính mờ đục blur 16px, menu toggle chạm 44x44px có aria nhãn rõ ràng, mobile navigation panel có padding và CTA nổi bật, xử lý phím Escape hoàn trả focus về toggle.
- src/components/site-footer.tsx: Tái cấu trúc SiteFooter với 2 cột điều hướng dễ quét trên mobile, đủ 7 links hiện có, khối footer-note viền vàng và footer-bottom cân đối.
- src/app/globals.css: Thêm token --header-height, quy định scroll-margin-top cho các anchor chính (#kham-pha, #cach-hoat-dong, #nft, #nguoi-dong-hanh, #ho-tro, #main), tạo kiểu cho Hero, Header, Mobile menu, Footer và Final CTA card.
- scripts/capture-p03.mjs: Script tự động kiểm tra và chụp 10 ảnh có metadata tại 5 viewports tiêu chuẩn, short-height mobile (390x600), zoom 200%, kiểm tra tương tác phím Escape và scroll anchor không bị header che.
- docs/qa/ui-upgrade/P03/: Lưu trữ 10 ảnh chụp, metadata.json và báo cáo nghiệm thu README.md (imageFailures = 0, không tràn ngang).
- docs/DESIGN.md: Cập nhật mục 12.7 đặc tả Khung giao diện (Shell), Hero và Footer.
- docs/STATUS.md: Cập nhật trạng thái nghiệm thu P03 với các số liệu test thực tế.
Quyết định đã thực thi:
- Không dùng 100vh cho Hero để thanh tìm kiếm PropertyExplorer lộ diện tự nhiên ở cạnh dưới màn hình điện thoại khi vừa tải trang.
- Nền header dùng kính đục mờ rgba(255, 255, 255, 0.96) kết hợp backdrop-filter blur 16px để ngăn chặn hoàn toàn bóng chữ khi cuộn qua nền tối.
- Gắn scroll-margin-top: calc(var(--header-height) + 16px) vào tất cả các anchor id để bảo đảm người dùng bấm link nội trang không bị header che mất nội dung.
- Giữ nguyên toàn bộ 7 link trong footer và 5 link trong header; không bịa đặt số hotline hay địa chỉ chưa được phê duyệt.
Hành vi bắt buộc đã giữ:
- 42/42 unit tests tiếp tục pass 100%.
- 22/22 Playwright E2E tests (accessibility WCAG 2 AA & journey) tiếp tục pass 100% trên cả Desktop và Mobile Chromium.
- Toàn bộ flow nghiệp vụ 1B (search, filter, save, booking, purchase panel, catalog) hoạt động trơn tru.
Kiểm tra:
- pnpm lint: ĐẠT (0 warning, 0 error).
- pnpm typecheck: ĐẠT (0 error).
- pnpm test: ĐẠT (42/42 unit tests passed).
- pnpm build: ĐẠT (25 routes SSG/dynamic tối ưu sạch sẽ).
- Playwright E2E a11y & journey: ĐẠT 22/22.
Ảnh và điểm đã quan sát:
- 10 ảnh chụp trong docs/qa/ui-upgrade/P03/ xác nhận logo sắc nét, header thanh thoát, hero tương phản AAA (11.8:1), footer chia cột khoa học, short-height mobile hiển thị search panel rõ ràng.
Blocker / rủi ro / nội dung còn dở:
- 7 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và 6 file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P04-xland-story.md (Nhiệm vụ P04 — Câu chuyện Xland)
2. docs/ui-upgrade/BRIEF.md (Mục D1 — Xland story và anchor cach-hoat-dong)
3. docs/ASSETS.md (Mục xland-story.webp)
4. docs/DESIGN.md (Mục 12 — Design System & Tokens)
5. src/app/page.tsx (Section cach-hoat-dong hiện tại)
6. public/images/xland-story.webp (Ảnh câu chuyện thương hiệu đã tạo ở P02)
```

## Điểm mở cần kế thừa

- WebKit sai viewport trong QA 30/09; cần đối chứng môi trường. Không tự sửa CSS để che sai số.
- Chưa có Lighthouse ba lần hoặc kết quả thiết bị thật.
- Persona hỗ trợ hiện nằm trong fixture property; cần ánh xạ avatar ổn định ở P02, không đổi id/slug tài sản.
- Lịch có cửa sổ fixture 01–31/10/2026; sau thời gian này vẫn phải dùng kịch bản/clock đã quy định, không sửa nghiệp vụ chỉ để screenshot có dữ liệu.
- Toàn mốc 1B còn các tính năng được liệt kê trong STATUS; chúng nằm ngoài vòng thẩm mỹ này.
