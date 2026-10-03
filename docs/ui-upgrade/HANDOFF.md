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
| P04 | Đã hoàn thành | XlandStory component Server Component, semantic H2/H3, mobile order tự nhiên, desktop split 5/12 và 6.2/12, ảnh xland-story.webp, 3 bước đánh số 01/02/03 contrast 7.35:1 AAA, CTA /lo-dat + sublink #nguoi-dong-hanh, 6 ảnh tại docs/qa/ui-upgrade/P04/; 42/42 unit đạt, 22/22 a11y & journey E2E đạt |
| P05 | Chưa bắt đầu | Section NFT chưa đổi |
| P06 | Chưa bắt đầu | UI các luồng chưa đổi |
| P07 | Chưa bắt đầu | GSAP và @gsap/react chưa cài |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P04 / 03/10/2026 / nền commit ae86f5e.
Kết quả và file đã thay đổi:
- src/components/home/xland-story.tsx: Tạo mới component XlandStory (Server Component), semantic section id="cach-hoat-dong", heading H2 "Mỗi miền đất, một khởi đầu đáng hiểu.", danh sách ol 3 bước đánh số 01/02/03 với aria-hidden cho số thứ tự, nút CTA primary /lo-dat và sublink ghost #nguoi-dong-hanh, đầy đủ data hooks cho GSAP (data-xland-story, data-story-content, data-story-header, data-story-steps, data-story-step, data-story-actions, data-story-media).
- src/app/page.tsx: Thay thế khối .why-section và .values-grid cũ bằng <XlandStory />, bảo toàn thứ tự các section trên trang chủ.
- src/app/globals.css: Loại bỏ class .why-section và .values-grid cũ; định nghĩa layout responsive cho .xland-story, .story-inner, .story-media-frame, .story-steps, .story-step-item, .story-actions. Trên mobile (<1024px) áp dụng .story-content { display: contents; } kết hợp CSS Grid order để đạt thứ tự Eyebrow → H2 → Lead → Ảnh → 3 Hàng → CTA mà không duplicate DOM. Trên desktop (≥1024px) phân chia 2 cột cân đối 5/12 ảnh và 6.2/12 nội dung.
- scripts/capture-p04.mjs: Tạo script capture tự động kiểm tra và chụp 6 ảnh có metadata tại 5 viewports (360/390/430/768/1440px), zoom 200%, kiểm tra tương tác bàn phím và scroll anchor không bị header che lấp.
- docs/qa/ui-upgrade/P04/: Lưu trữ 6 ảnh nghiệm thu, metadata.json và báo cáo chi tiết README.md (imageFailures = 0, scrollWidth = clientWidth).
- docs/DESIGN.md: Bổ sung mục 12.8 quy chuẩn thiết kế Section Xland Story (layout, typography, contrast, data hooks).
- docs/STATUS.md: Bổ sung mục Nghiệm thu P04 với số liệu kiểm tra thực tế.
Quyết định đã thực thi:
- Triệt để xóa bỏ 3 card trắng độc lập và 3 icon tròn xanh của mốc 1A; thay thế bằng bố cục thương hiệu cao cấp gắn kết, lấy cảm hứng từ nhịp Sunshine Group.
- Số thứ tự bước 01/02/03 sử dụng token --color-primary (#164B60) trên nền --color-surface (#F5F3EE) đạt tỉ lệ tương phản 7.35:1 (chuẩn WCAG 2 AAA), vượt qua hoàn toàn bài test AxeBuilder a11y.
- Dùng .story-content { display: contents; } trên mobile để các phần tử con trực tiếp tham gia CSS Grid của .story-inner, cho phép sắp đặt thứ tự ảnh nằm giữa lead và 3 bước một cách hoàn toàn tự nhiên theo art direction.
- Khung ảnh PropertyImage tỷ lệ 4:3 (mobile) và 4:5 (desktop) với caption ngữ cảnh tự nhiên; giữ nguyên layout và khả năng đọc nếu ảnh lỗi.
- Đặt scroll-margin-top: 96px để anchor #cach-hoat-dong luôn cuộn dừng cách header cố định 28-32px an toàn.
Hành vi bắt buộc đã giữ:
- 42/42 unit tests tiếp tục pass 100%.
- 22/22 Playwright E2E tests (accessibility WCAG 2 AA & journey) tiếp tục pass 100% trên cả Desktop và Mobile Chromium.
- Toàn bộ flow nghiệp vụ 1B (search, filter, save, booking, purchase panel, catalog) hoạt động trơn tru.
- Giữ nguyên anchor #cach-hoat-dong, liên kết footer và header không bị xáo trộn.
Kiểm tra:
- pnpm lint: ĐẠT (0 warning, 0 error).
- pnpm typecheck: ĐẠT (0 error).
- pnpm test: ĐẠT (42/42 unit tests passed).
- pnpm build: ĐẠT (25 routes SSG/dynamic tối ưu sạch sẽ).
- Playwright E2E a11y & journey: ĐẠT 22/22.
Ảnh và điểm đã quan sát:
- 6 ảnh chụp trong docs/qa/ui-upgrade/P04/ xác nhận ảnh chủ đạo sắc nét, bố cục 2 cột cân xứng trên desktop, 1 luồng đọc dọc liền mạch trên mobile, không tràn ngang ở zoom 200%.
Blocker / rủi ro / nội dung còn dở:
- 7 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và 6 file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P05-nft-section.md (Nhiệm vụ P05 — Section NFT và công nghệ)
2. docs/ui-upgrade/BRIEF.md (Mục D2 — Chương NFT và công nghệ)
3. docs/DESIGN.md (Mục 12 — Design System & Tokens)
4. src/app/page.tsx (Section #nft hiện tại)
5. src/components/home/xland-story.tsx (Tham chiếu cấu trúc section vừa hoàn thiện)
6. src/app/globals.css (CSS tokens và utility layout)
```

## Điểm mở cần kế thừa

- WebKit sai viewport trong QA 30/09; cần đối chứng môi trường. Không tự sửa CSS để che sai số.
- Chưa có Lighthouse ba lần hoặc kết quả thiết bị thật.
- Persona hỗ trợ hiện nằm trong fixture property; cần ánh xạ avatar ổn định ở P02, không đổi id/slug tài sản.
- Lịch có cửa sổ fixture 01–31/10/2026; sau thời gian này vẫn phải dùng kịch bản/clock đã quy định, không sửa nghiệp vụ chỉ để screenshot có dữ liệu.
- Toàn mốc 1B còn các tính năng được liệt kê trong STATUS; chúng nằm ngoài vòng thẩm mỹ này.
