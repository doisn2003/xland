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
| P02 | Chưa bắt đầu | Chưa tuyển/tạo avatar hoặc media mới |
| P03 | Chưa bắt đầu | Header/hero/footer chưa đổi |
| P04 | Chưa bắt đầu | Giới thiệu Xland chưa đổi |
| P05 | Chưa bắt đầu | Section NFT chưa đổi |
| P06 | Chưa bắt đầu | UI các luồng chưa đổi |
| P07 | Chưa bắt đầu | GSAP và @gsap/react chưa cài |
| P08 | Chưa bắt đầu | Chưa có choreography mới |
| P09 | Chưa bắt đầu | Chưa có nghiệm thu vòng nâng cấp |

## Bản ghi bàn giao gần nhất

```text
Phase / ngày / commit hoặc working tree: P01 / 03/10/2026 / nền commit 0bf496c.
Kết quả và file đã thay đổi:
- src/components/logo.tsx: Tạo mới component Logo và XlandSymbol SVG độc bản (Phương án A - Horizon & Parcels), wordmark serif cân baseline, hỗ trợ variant default/inverse và size sm/md/lg.
- src/app/icon.svg: Favicon vector 32x32 biểu tượng Xland chuẩn Next.js App Router.
- src/components/icon.tsx: Chuẩn hóa toàn bộ icon về viewBox 0 0 24 24, stroke 1.75, round cap/join. Bổ sung bookmark, calendar, user, shield, share, filter, sparkle.
- src/components/site-header.tsx: Nối Logo default, giữ accessible name duy nhất trên link, đảm bảo .header-cta giữ chữ trắng đạt contrast AAA.
- src/components/site-footer.tsx: Nối Logo inverse trên nền Ink tối, căn chỉnh layout footer sang trọng.
- src/features/journey/save-button.tsx: Thay SVG inline bằng <Icon name="bookmark" filled={saved} />, bảo toàn 100% aria-label, aria-pressed và text nhãn.
- src/app/globals.css: Áp dụng bảng tokens semantic (Deep Teal #164B60, Ink #102D3B, Warm Gold #B89962, On-dark Gold #D8C49D, Surfaces ấm, Radii 8/12px); Button primitives đầy đủ states (default, hover trượt arrow 3px, active, focus-visible kép, pending, disabled không glow); tinh chỉnh tương phản header button và advisor avatar.
- src/app/qa-identity-proof/page.tsx: Trang proof sheet nội bộ kiểm tra logo, icons, tokens, buttons và chuỗi dấu tiếng Việt.
- scripts/capture-p01.mjs: Script tự động chụp 17 ảnh có metadata tại 5 viewports chuẩn (360, 390, 430, 768, 1440px).
- docs/qa/ui-upgrade/P01/: Lưu trữ 17 ảnh chụp, metadata.json và báo cáo nghiệm thu README.md.
- docs/DESIGN.md: Cập nhật mục 12 tài liệu hóa tokens thực thi và các quyết định thiết kế.
- docs/STATUS.md: Cập nhật trạng thái nghiệm thu P01 với các số liệu test thực tế.
Quyết định đã thực thi:
- Đã đối chiếu 2 phương án logo: Chọn Phương án A (Horizon & Land Parcels) vì tính nhận diện đất đai rõ ràng, tính hình học chữ X khúc chiết và khả năng scale sắc nét từ 24px đến 1440px.
- Điều chỉnh màu chữ advisor avatar-1 từ #8C7343 sang #745722 trên nền #F3EFE6 để nâng tỷ lệ tương phản từ 3.93:1 lên 5.70:1, vượt chuẩn WCAG 2 AA (4.5:1).
- Quy định rõ màu chữ .navigation > .button là #FFFFFF để tránh bị ghi đè màu text menu.
Hành vi bắt buộc đã giữ:
- Giữ nguyên toàn bộ 4 biên dữ liệu 1B: SaveButton text/aria-pressed, form lịch hẹn, panel mua NFT, URL catalog query filter/sort.
- Không chạm vào logic form/query/store, không cài thêm dependency ngoài (icon/font library hay GSAP).
Kiểm tra:
- pnpm lint: ĐẠT (0 warnings, 0 errors).
- pnpm typecheck: ĐẠT (0 errors).
- pnpm test: ĐẠT (42/42 unit tests passed).
- pnpm build: ĐẠT (24 routes SSG/dynamic tối ưu sạch sẽ).
- Playwright E2E a11y & journey: ĐẠT 22/22 (100% test accessibility WCAG 2 AA, zoom 200%, keyboard, reduced motion và state saving trên cả desktop & mobile).
Ảnh và điểm đã quan sát:
- 17 ảnh chụp trong docs/qa/ui-upgrade/P01/ xác nhận logo sắc nét ở mọi kích thước, không vỡ nét ở DPR cao, nút bấm tương tác rõ ràng, không tràn ngang ở bất kỳ viewport nào.
Blocker / rủi ro / nội dung còn dở:
- 7 lỗi WebKit viewport trên môi trường Windows tiếp tục được ghi nhận và cô lập như P00; không gây ảnh hưởng đến Chromium desktop/mobile.
Phase tiếp theo và 6 file nên đọc đầu tiên:
1. docs/ui-upgrade/phases/P02-media.md (Nhiệm vụ P02 — Media và chân dung)
2. docs/ui-upgrade/BRIEF.md (Mục B4 — Media và chân dung)
3. docs/ASSETS.md (Quy định nguồn, bản quyền và phân loại stock/ảnh thực địa)
4. src/data/properties.ts (Dữ liệu hình ảnh lô đất hiện có)
5. src/data/journey.ts (Dữ liệu personas và avatar chuyên viên tư vấn)
6. docs/DESIGN.md (Mục 8 & 12 về media và tokens thiết kế)
```

## Điểm mở cần kế thừa

- WebKit sai viewport trong QA 30/09; cần đối chứng môi trường. Không tự sửa CSS để che sai số.
- Chưa có Lighthouse ba lần hoặc kết quả thiết bị thật.
- Persona hỗ trợ hiện nằm trong fixture property; cần ánh xạ avatar ổn định ở P02, không đổi id/slug tài sản.
- Lịch có cửa sổ fixture 01–31/10/2026; sau thời gian này vẫn phải dùng kịch bản/clock đã quy định, không sửa nghiệp vụ chỉ để screenshot có dữ liệu.
- Toàn mốc 1B còn các tính năng được liệt kê trong STATUS; chúng nằm ngoài vòng thẩm mỹ này.
