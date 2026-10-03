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
| P05 | Đã hoàn thành | NftStory component Server Component, nền Ink full-width, ảnh garden-retreat.webp, sơ đồ quy trình 3 bước HTML/SVG, panel định lượng presentation động, visual matrix 20 ô, CTA /nft + link phụ /nft/mien-xanh-ven-song, 7 ảnh tại docs/qa/ui-upgrade/P05/; 43/43 unit đạt, 54/54 E2E desktop/mobile-chromium đạt |
| P06 | Chưa bắt đầu | UI các luồng chưa đổi |
| P07 | Chưa bắt đầu | GSAP và @gsap/react chưa cài |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P05 / 03/10/2026 / nền commit 786a10f.
Kết quả và file đã thay đổi:
- src/components/home/nft-story.tsx: Tạo mới component NftStory (Server Component), semantic section id="nft", heading H2 "Một tài sản. Một phương án rõ ràng.", sơ đồ quy trình 3 bước (Hồ sơ tài sản → Phương án NFT → Danh mục của bạn) bằng native HTML/SVG, panel định lượng lấy số liệu từ nguồn thật (1.000 NFT, 2.800.000 ₫, 0,1% và 1%), lưới Visual Matrix 20 ô nhỏ trực quan hóa tỷ lệ phân đoạn, nút CTA chính /nft và link phụ /nft/mien-xanh-ven-song, đầy đủ data hooks cho GSAP.
- src/features/nft/presentation.ts: Tạo helper thuần getFeaturedOfferingPresentation() và formatNftShare() derive dữ liệu an toàn từ offering mở bán thật (XL-001 - Miền xanh ven sông), có unit test biên độ đầy đủ.
- src/app/page.tsx: Thay thế khối checklist tích xanh cũ bằng <NftStory />, bảo toàn thứ tự các section trên trang chủ.
- src/app/globals.css: Loại bỏ CSS nft cũ; định nghĩa layout responsive cho .nft-story, .nft-story-inner, .nft-flow, .nft-panel, .nft-visual-matrix, .nft-actions trên nền Ink full-width. Trên mobile (<1024px) áp dụng display contents kết hợp order tự nhiên. Trên desktop (≥1024px) bố cục 2 cột cân xứng 5/12 ảnh sticky và 6.5/12 nội dung.
- tests/unit/nft.test.ts: Bổ sung bộ test unit cho presentation helper (đạt 43/43 unit tests).
- scripts/capture-p05.mjs: Tạo script capture tự động kiểm tra và chụp 7 ảnh có metadata tại 5 viewports (360/390/430/768/1440px), zoom 200%, ranh giới sáng-tối, dark focus và kiểm tra không chứa từ cấm.
- docs/qa/ui-upgrade/P05/: Lưu trữ 7 ảnh nghiệm thu, metadata.json và báo cáo chi tiết README.md (imageFailures = 0, scrollWidth = clientWidth).
- docs/DESIGN.md: Bổ sung mục 12.9 quy chuẩn thiết kế Section NFT Story (màu sắc, tỷ lệ, sơ đồ quy trình, visual fractional matrix, typography, data hooks).
- docs/STATUS.md: Bổ sung mục Nghiệm thu P05 với số liệu kiểm tra thực tế.
Quyết định đã thực thi:
- Xóa bỏ triệt để danh sách 3 checklist tích xanh đơn điệu của mốc 1A; thay bằng sơ đồ quy trình 3 bước trực quan và panel thông số phương án cao cấp.
- Nền Ink (#102D3B) full-width với gradient nhẹ tạo khoảng lặng thị giác tương phản mạnh mẽ giữa chương Xland Story (nền sáng) và Người đồng hành (nền sáng).
- Dữ liệu định lượng lấy trực tiếp từ offering mở bán thật (XL-001), loại bỏ hoàn toàn tồn seed khỏi section marketing theo BRIEF D2 để tránh hiểu nhầm sau khi mua.
- Sơ đồ quy trình và visual matrix nhấn mạnh việc phân đoạn theo phương án phát hành, có disclaimer rõ ràng không thay thế quyền sử dụng đất hoặc chia ranh giới vật lý.
- Độ tương phản WCAG 2 AAA: H2 (14.2:1), CTA chính (7.8:1), link phụ (12.5:1).
Hành vi bắt buộc đã giữ:
- 43/43 unit tests pass 100%.
- 54/54 Playwright E2E tests (accessibility WCAG 2 AA & journey) pass 100% trên cả Desktop và Mobile Chromium.
- Toàn bộ luồng nghiệp vụ 1B (search, filter, save, booking, purchase panel, catalog) hoạt động nguyên vẹn.
- Giữ nguyên anchor #nft, liên kết footer và header không bị xáo trộn.
Kiểm tra:
- pnpm lint: ĐẠT (0 warning, 0 error).
- pnpm typecheck: ĐẠT (0 error).
- pnpm test: ĐẠT (43/43 unit tests passed).
- pnpm build: ĐẠT (25 routes SSG/dynamic tối ưu sạch sẽ).
- Playwright E2E desktop-chromium & mobile-chromium: ĐẠT 54/54.
Ảnh và điểm đã quan sát:
- 7 ảnh chụp trong docs/qa/ui-upgrade/P05/ xác nhận nền Ink sang trọng, ảnh nhà vườn nhiệt đới sắc nét, sơ đồ quy trình mạch lạc, panel định lượng rõ ràng, không tràn ngang ở zoom 200%.
Blocker / rủi ro / nội dung còn dở:
- 8 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và 6 file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P06-journeys.md (Nhiệm vụ P06 — Nâng cấp UI các luồng nghiệp vụ)
2. docs/ui-upgrade/BRIEF.md (Mục F/G — Quy chuẩn kiểm tra và nghiệm thu)
3. docs/DESIGN.md (Mục 12 — Design System & Tokens)
4. src/features/journey/ (Luồng lưu lô đất, lịch xem thực địa, reset demo)
5. src/features/nft/purchase-panel.tsx (Giao diện mua NFT và portfolio)
6. src/app/globals.css (CSS tokens và forms/controls)
```

## Điểm mở cần kế thừa

- WebKit sai viewport trong QA 30/09; cần đối chứng môi trường. Không tự sửa CSS để che sai số.
- Chưa có Lighthouse ba lần hoặc kết quả thiết bị thật.
- Persona hỗ trợ hiện nằm trong fixture property; cần ánh xạ avatar ổn định ở P02, không đổi id/slug tài sản.
- Lịch có cửa sổ fixture 01–31/10/2026; sau thời gian này vẫn phải dùng kịch bản/clock đã quy định, không sửa nghiệp vụ chỉ để screenshot có dữ liệu.
- Toàn mốc 1B còn các tính năng được liệt kê trong STATUS; chúng nằm ngoài vòng thẩm mỹ này.
