# P01 — Nhận diện và tiểu tiết tương tác

Đầu ra: nền nhận diện dùng chung, chưa đổi bố cục các chương. Phụ thuộc P00. Hợp đồng: [BRIEF A–B](../BRIEF.md).

```text
Thực hiện P01 cho Xland: nâng logo, icon, bảng màu và trạng thái control có độ hoàn thiện cao, mobile first. Bản tĩnh phải đẹp trước khi có GSAP. Chỉ làm phase này.

ĐỌC TRƯỚC
AGENTS.md, PREPARE.md, STATUS hiện tại, docs/DESIGN.md, UI-UPGRADE.md, ui-upgrade/BRIEF.md mục A–B/F–G và HANDOFF P00. Đọc src/app/globals.css, components/icon.tsx, site-header.tsx, site-footer.tsx, features/journey/save-button.tsx và ví dụ button trong visit-form/purchase-panel. Xem baseline P00 ở 390/1440px.

PHẠM VI FILE
Chủ yếu globals.css, Icon, header/footer để nối Logo, component logo mới và asset SVG cần thiết; tối đa một primitive button nếu có nhu cầu thật. DESIGN, STATUS, HANDOFF và QA đi kèm. Không refactor mọi callsite hoặc tạo một design-system package. Không đổi logic form/query/store, không cài icon/font library. Nếu dùng API Next mới, đọc docs bản cài trước.

YÊU CẦU THIẾT KẾ
1. Tạo logo SVG riêng gợi đường chân trời/thửa đất/chữ X theo BRIEF, wordmark Xland có kerning/căn baseline cẩn thận. Dựng và xem hai phương án đơn giản ở kích thước thực, chọn một bằng lý do nhận diện/độ rõ, không để hai logo trong sản phẩm. Không lấy biểu tượng Sunshine. SVG được viết bằng code, không dùng ảnh raster cho logo.
2. Có bản màu trên trắng và inverse trên Ink; kiểm symbol 24/32px, header khoảng 112–136px chiều ngang và footer. Không cắt nét ở DPR khác nhau. Logo có accessible name duy nhất trên link, SVG trang trí không đọc lặp. Nếu đổi favicon, dùng convention Next bản cài và chỉ asset của Xland.
3. Áp dụng palette và hình khối đề xuất trong BRIEF B1/B2 bằng token semantic. Giữ token trạng thái phân biệt với thương hiệu. Kiểm mọi mã hex cũ còn tạo màu lạc nhịp; không global replace mù vào dữ liệu/ảnh. Trắng ấm dùng cho chương phù hợp, không làm text form mờ.
4. Chuẩn hóa icon trong component hiện có: viewBox/nét/căn quang học. Gom bookmark chỉ khi giảm trùng thực tế; aria-pressed và label của SaveButton phải giữ. Không thay mọi icon chỉ vì có bộ mới.
5. Button primary/secondary/inverse/text: đủ default, hover, active, keyboard focus, pending và disabled. Cao ≥48px; icon button ≥44px. Hover trên chuột có đổi màu/arrow 3–4px, không giật layout. Pending giữ width và trạng thái accessible; disabled không phát glow/animation. Không bỏ outline.
6. Giữ fonts local hiện có; chỉnh tracking/weight trong phạm vi BRIEF. Tạo proof sheet tạm hoặc trang QA có thể bỏ sau kiểm để xem logo, icon và control trên cả nền sáng/tối; không công khai route test vào navigation.

KIỂM TRA
- Đo contrast default/hover/disabled explanation/focus trên bề mặt thật; chữ thường ≥4,5:1, chữ lớn ≥3:1. Không dùng accent làm body trên trắng.
- Xem screenshot home/header/footer, form lịch và NFT ở 360/390/430/768/1440. Thử bàn phím menu/save/button, zoom 200%, reduced motion và chuỗi dấu Việt trong BRIEF.
- Chạy pnpm lint, pnpm typecheck, unit tests và E2E accessibility/hành vi control bị chạm. Không sửa expected text chỉ để bỏ qua mất label.

ĐIỀU KIỆN ĐẠT VÀ BÀN GIAO
Một logo nhất quán, một hệ token đang chạy, không có button khó đọc hoặc icon mất nghĩa. Lưu proof sheet/ảnh ở docs/qa/ui-upgrade/P01/, ghi giá trị thực thi vào DESIGN cùng lúc sửa CSS. Nếu palette điều chỉnh sau contrast, ghi giá trị cuối và lý do, không giữ bảng đề xuất như thể đã áp dụng nguyên xi. Cập nhật STATUS/HANDOFF gồm API Logo/Icon/control và file P02 cần đọc. git diff --check; không đổi layout toàn home hoặc bắt đầu GSAP.
```
