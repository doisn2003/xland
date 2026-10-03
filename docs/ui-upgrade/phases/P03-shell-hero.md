# P03 — Header, hero và footer

Đầu ra: ấn tượng đầu tiên nhất quán, điều hướng tốt trên điện thoại. Phụ thuộc P02. Hợp đồng: [BRIEF B–C](../BRIEF.md).

```text
Thực hiện P03 cho Xland. Nâng header, hero và footer bằng nhận diện/media đã chuẩn bị. Giữ search sớm và toàn bộ tác vụ đang có. Chưa thêm GSAP hoặc sửa hai chương Xland/NFT.

ĐỌC TRƯỚC
AGENTS, PREPARE, STATUS hiện tại; docs/DESIGN.md, ASSETS phần media dùng, UI-UPGRADE, BRIEF A–C/F–G và HANDOFF P02. Đọc src/app/page.tsx, layout.tsx, globals.css, site-header.tsx, site-footer.tsx, property-explorer.tsx và Logo/Avatar nếu phase trước đã có. Trước API mới đọc Next docs tương ứng.

PHẠM VI
Header/footer, section hero (tách components/home/hero.tsx nếu giúp rõ trách nhiệm), home để compose, CSS liên quan, tài liệu/QA. Không đổi query/store, layout provider nghiệp vụ hoặc toàn bộ page thành client. Không viết lại explorer. Dùng CSS module cho section nếu phù hợp, giữ tokens/base trong globals; không để hai nơi cùng điều khiển một selector.

THIẾT KẾ VÀ THỰC THI
1. Header mobile cao khoảng 64–72px, logo đọc rõ, menu toggle 44–48px. Desktop logo, các route hiện có và CTA chính cân hàng; không sao chép hai tầng navigation corporate của Sunshine. Nền đủ đục để nội dung cuộn bên dưới không gây bóng chữ. Giữ sticky và anchor offset chính xác.
2. Menu mobile mở có nhãn/expanded/controls, đóng Escape và khi chọn route, trả focus về toggle khi phù hợp. Nếu dùng panel non-modal, không tự thêm aria-modal hoặc trap focus; nếu đổi thành modal phải thực hiện đầy đủ focus/scroll lock/close semantics và test. Ưu tiên giữ kiểu hiện tại, chỉ nâng trình bày.
3. Hero dùng media P02, crop chủ động: mobile còn thấy chủ thể, desktop đủ khoảng trống cho chữ. Một H1 “Một miền đất. Vạn khởi đầu.” có thể giữ; cân line break tại 360/390/430, không nhét 4–5 dòng lớn vào chiều cao cố định. Mô tả ngắn, một CTA chính tới #kham-pha, thông tin phụ có thứ bậc.
4. Chiều cao hero theo nội dung/min-height phù hợp, tránh 100vh cố định che tác vụ trên điện thoại. Search hiện ngay sau hero, không bị overlap khi chữ tăng/zoom. Giữ labels và URL điều hướng hiện có. Không đặt search phía sau một intro dài.
5. Màu nhấn/overlay theo tokens P01. Đo tương phản trên crop thật ở cả mobile/desktop; không mặc định ảnh tối là đạt. H1/CTA hiển thị ngay trong HTML ban đầu, chỉ ảnh được chuẩn bị wrapper cho motion về sau. Không intro loading screen hoặc chờ logo diễn xong.
6. Footer có brand lockup inverse trên Ink hoặc nền phù hợp hệ mới, nhóm link rõ trên mobile, đủ link danh mục/lịch/lưu/reset hiện có. Không thêm địa chỉ, hotline, logo đối tác hoặc form nhận tin không có luồng thật. CTA cuối trang cân nhịp với footer, không trở thành hero thứ hai.
7. Đặt class/data hook có ý nghĩa cho motion sau này, không thêm thư viện hoặc empty wrapper hàng loạt. Để DOM semantic h1/main/nav và skip link hoạt động.

KIỂM TRA
Chụp hero/menu/footer tại 360/390/430/768/1440; kiểm short-height mobile và zoom 200%. Tab từ skip link qua menu/search, Escape trả focus, link anchor không bị header che. Test search → /lo-dat đúng query, Back giữ state; không làm mất focus do remount. Thử ảnh lỗi, chậm và font fallback. Kiểm reduced motion cho hover hiện có. Lint/typecheck + E2E navigation/catalog/accessibility liên quan; không chỉnh số đo overflow để tránh lỗi.

ĐẠT VÀ BÀN GIAO
Logo/header rõ ở 360px, hero có ảnh chủ đạo và CTA dễ nhận, search vẫn thuận tiện, footer không có link chết. Lưu ảnh đã xem/contrast và kết quả ở docs/qa/ui-upgrade/P03/. Cập nhật DESIGN phần shell/hero, STATUS và HANDOFF với DOM hook, kích thước header, image id/crop. Ghi phần motion chưa triển khai; dừng đúng P03.
```
