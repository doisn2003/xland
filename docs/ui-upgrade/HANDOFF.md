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
| P06 | Đã hoàn thành | Lượt A (chân dung chuyên viên 4:5, card 4:3 display serif, detail support portrait) + Lượt B (đồng bộ font serif display, breadcrumb, empty states, panels giao dịch 1B), 18 ảnh tại docs/qa/ui-upgrade/P06/; 43/43 unit đạt, 54/54 E2E đạt |
| P07 | Đã hoàn thành | Cài đặt gsap@3.15.0 và @gsap/react@2.1.2 (--save-exact), client motion island (gsap-core, use-reduced-motion, story-image-reveal), 5 ảnh tại docs/qa/ui-upgrade/P07/; 46/46 unit đạt, 64/64 E2E đạt |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P07 / 04/10/2026 / nền commit 63b7380.
Kết quả và file đã thay đổi:
- package.json & pnpm-lock.yaml: Cài đặt chính xác gsap@3.15.0 và @gsap/react@2.1.2 bằng pnpm add --save-exact.
- src/components/motion/gsap-core.ts: Module quản lý đăng ký plugin ScrollTrigger và useGSAP an toàn một lần trên client.
- src/components/motion/use-reduced-motion.ts: Hook chuẩn React 19 dùng useSyncExternalStore để theo dõi prefers-reduced-motion, không ném hydration warning hay cascading render.
- src/components/motion/story-image-reveal.tsx: Client motion island bọc khung ảnh trong Server Component xland-story.tsx; dùng useGSAP scoped ref và gsap.matchMedia() phân nhánh desktop (mask inset 8%->0%, scale 1.04->1, 850ms), mobile (opacity 0.2->1, y 12px->0, 600ms), reduced-motion (tĩnh hoàn chỉnh) và deep-link tức thì.
- src/components/home/xland-story.tsx: Giữ nguyên Server Component, chỉ bọc StoryImageReveal quanh khung ảnh; toàn bộ tiêu đề, text, link tiếp tục SSR sạch sẽ.
- src/app/globals.css: Thêm styling cho .story-reveal-container và .story-reveal-visual; giữ nguyên progressive enhancement (CSS mặc định visible 100%, không opacity: 0 trong stylesheet).
- vitest.config.mts: Bổ sung alias @ trỏ về ./src bằng import.meta.dirname.
- tests/unit/motion.test.ts: 3 test unit kiểm tra GSAP registration, SSR an toàn của StoryImageReveal và semantic HTML của XlandStory (46/46 unit tests pass).
- tests/e2e/motion.spec.ts: 10 test Playwright E2E kiểm tra scroll reveal, deep link tức thì, reduced motion static, chuyển trang qua lại 5 lần, và cô lập bundle (route /lich-hen không tải GSAP chunk).
- scripts/capture-p07.mjs: Chụp 5 ảnh có metadata tại docs/qa/ui-upgrade/P07/.
- docs/qa/ui-upgrade/P07/: 5 ảnh nghiệm thu, metadata.json, README.md chi tiết.
- docs/DESIGN.md: Bổ sung mục 12.11 quy chuẩn nền tảng GSAP và kịch bản thử nghiệm Xland Story.
- docs/STATUS.md: Bổ sung mục Nghiệm thu P07 với số liệu kiểm tra thực tế.
Quyết định đã thực thi:
- Triển khai GSAP theo mô hình Client Island cục bộ, không biến Server Component thành Client Component.
- useGSAP scoped ref tự động dọn dẹp tween/ScrollTrigger khi unmount; tuyệt đối không dùng ScrollTrigger.killAll().
- Thử nghiệm duy nhất tại khung ảnh Xland Story, bảo toàn ranh giới P07, không animate các section khác trước P08.
- Kích thước JS trang chủ chỉ tăng ~48 KB (đạt budget ≤60 KB của BRIEF F); route nghiệp vụ không tải script GSAP.
Hành vi bắt buộc đã giữ:
- 46/46 unit tests pass 100%.
- 64/64 Playwright E2E tests (bao gồm 10 test motion mới) pass 100% trên cả Desktop và Mobile Chromium.
- 25/25 routes SSG/dynamic build thành công.
- Không có lỗi lint (0 error, 0 warning) và typecheck sạch sẽ.
Kiểm tra:
- pnpm lint: ĐẠT.
- pnpm typecheck: ĐẠT.
- pnpm test: ĐẠT (46/46).
- pnpm build: ĐẠT (25/25 routes).
- Playwright E2E: ĐẠT (64/64).
Ảnh và điểm đã quan sát:
- 5 ảnh trong docs/qa/ui-upgrade/P07/ xác nhận hiệu ứng mask reveal trên desktop mượt mà, mobile fade-up gọn gàng, reduced motion giữ tĩnh hoàn chỉnh, deep-link hiển thị ngay lập tức, không tràn ngang ở zoom 200%.
Blocker / rủi ro / nội dung còn dở:
- 8 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và các file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P08-motion-choreography.md (Nhiệm vụ P08 — Hoàn thiện chuyển động toàn trang)
2. src/components/home/hero.tsx, src/components/home/xland-story.tsx, src/components/home/nft-story.tsx
```
  + src/app/page.tsx: Chuyên viên Home (#nguoi-dong-hanh) chuyển sang dùng Avatar size="portrait" (140×175px, 4:5) từ asset P02; bố cục thẻ ngang trên mobile và thẻ dọc 3 cột trên tablet/desktop; CTA link trỏ trực tiếp /lo-dat/<slug>#ho-tro; bổ sung đầy đủ data hooks (data-advisors-section, data-advisors-heading, data-advisors-grid, data-advisor-card).
  + src/components/property-card.tsx: Cấu trúc dải card-meta-top kết hợp thể loại đất và nút SaveButton 44px tách khỏi anchor link; tên tài sản font serif display (20px), giá chào nổi bật 22px (strong) to rõ kèm đơn vị "tỷ đ", nút tròn điều hướng 44×44px touch target; hover scale 1.03 tinh tế không cắt focus ring.
  + src/components/property-gallery.tsx: Giữ nguyên 100% accessible navigation buttons và thumbnails.
  + src/app/lo-dat/[slug]/page.tsx: Khối hỗ trợ #ho-tro dùng Avatar size="portrait" với layout ngang thoáng đãng; khối tóm tắt giá giữ Avatar size="sm" gọn gàng; bảo toàn toàn bộ bảng facts, tài liệu pháp lý và CTA đặt lịch.
- LƯỢT B — MÀN HÌNH VÀ TRẠNG THÁI 1B:
  + src/app/globals.css: Đồng bộ typography font serif display cho tiêu đề H1/H2 của các màn hình /lo-dat, /da-luu, /lich-hen, /nft, /nft/[slug], /danh-muc-nft, /trai-nghiem; thêm styling cho .breadcrumb, .empty-state, .nft-empty, .saved-count; tinh chỉnh subtle shadow, border và focus ring cho các panel giao dịch (.journey-panel, .visit-card, .nft-purchase, .nft-holding, .nft-portfolio-summary).
  + Giữ nguyên toàn bộ model/store/fixture nghiệp vụ 1B; không sửa text thành lời hứa sai khi state đang là chờ điều phối; không biến các trang thành pure client.
- KIỂM TRA & TÀI LIỆU:
  + scripts/capture-p06.mjs: Tự động chụp 18 ảnh có metadata đo đạc tại 5 viewports (360/390/430/768/1440px), zoom 200%, các trạng thái nghiệp vụ.
  + docs/qa/ui-upgrade/P06/: 18 ảnh nghiệm thu, metadata.json, README.md chi tiết.
  + docs/DESIGN.md: Bổ sung mục 12.10 quy chuẩn Người đồng hành, Card, Detail và Trạng thái 1B.
  + docs/ASSETS.md: Bổ sung mục 3 ghi nhận vị trí sử dụng ảnh chân dung chuyên viên.
  + docs/STATUS.md: Bổ sung mục Nghiệm thu P06 với số liệu kiểm tra thực tế.
Quyết định đã thực thi:
- Thay thế hoàn toàn vòng tròn initials đơn điệu trên Home và Detail bằng ảnh chân dung chuyên viên tỉ lệ 4:5 đã chuẩn bị từ P02 với phong cách ánh sáng ấm đồng đều.
- Thẻ bất động sản tổ chức phân cấp rõ nét: Ảnh 4:3 → Meta top (Loại đất + Nút Lưu) → Tên Display Serif → Vị trí/Diện tích/Không gian → Trục Giá chào 22px + Nút mũi tên 44px.
- Các màn hình nghiệp vụ 1B được khoác lên ngôn ngữ thiết kế nhất quán mà không làm thay đổi hay phá vỡ bất kỳ logic/state/model nào.
Hành vi bắt buộc đã giữ:
- 43/43 unit tests pass 100%.
- 54/54 Playwright E2E tests (accessibility WCAG 2 AA & journeys) pass 100% trên cả Desktop và Mobile Chromium.
- 25/25 routes SSG/dynamic build thành công.
- Không có lỗi lint (0 error, 0 warning) và typecheck sạch sẽ.
Kiểm tra:
- pnpm lint: ĐẠT.
- pnpm typecheck: ĐẠT.
- pnpm test: ĐẠT (43/43).
- pnpm build: ĐẠT (25/25 routes).
- Playwright E2E: ĐẠT (54/54).
Ảnh và điểm đã quan sát:
- 18 ảnh trong docs/qa/ui-upgrade/P06/ xác nhận ảnh portrait chuyên viên sắc nét, card bất động sản sang trọng, detail thoáng đãng, empty states và panels giao dịch hòa quyện cùng ngôn ngữ Sunshine Group.
Blocker / rủi ro / nội dung còn dở:
- 8 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và các file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P07-gsap-setup.md (Nhiệm vụ P07 — Cài đặt và cấu hình GSAP)
2. package.json, next.config.ts, src/app/globals.css
```
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
