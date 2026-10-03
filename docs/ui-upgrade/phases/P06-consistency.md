# P06 — Người đồng hành và tính nhất quán giữa các màn hình

Đầu ra: chất lượng mới đi xuyên suốt hành trình, không chỉ đẹp trang chủ. Phụ thuộc P05. Phase có hai lượt giới hạn rõ; nếu context không đủ, bàn giao sau lượt A rồi tiếp tục B trong phiên mới.

```text
Thực hiện P06 của Xland. Hoàn thiện người đồng hành bằng portrait đã chuẩn bị và đưa ngôn ngữ thiết kế mới vào card/detail/các trạng thái 1B. Làm theo lượt A rồi B; không thiết kế lại nghiệp vụ hoặc gộp thêm tính năng 1B còn thiếu.

ĐỌC CHUNG
AGENTS, PREPARE, STATUS hiện tại; DESIGN/ASSETS liên quan, UI-UPGRADE, BRIEF A–C/F–G, HANDOFF P05. Chỉ đọc source của lượt đang thực hiện và test liên quan. Không nạp cả features/journey lẫn features/nft và mọi ảnh QA ngay đầu.

LƯỢT A — CHUYÊN VIÊN, CARD, DETAIL
File chính: home/advisors section, Avatar/media mapping P02, components/property-card.tsx, property-gallery.tsx, app/lo-dat/[slug]/page.tsx và CSS liên quan. Tối đa khoảng 6 file thực thi trong lượt.
1. Chuyên viên home: dùng portrait có cùng ánh sáng/crop; mobile card theo hàng hoặc một cột, tên/vai trò/CTA nhìn thấy; desktop tối đa ba người như logic hiện có. Không vòng initials làm hình chính khi portrait đã sẵn sàng. Không carousel auto, status online, sao đánh giá, chứng chỉ hoặc số giao dịch giả.
2. Link hỗ trợ vẫn tới đúng /lo-dat/<slug>#ho-tro. Tên người giống nhau dùng cùng advisor id/ảnh. Không tạo route hồ sơ người đăng hoặc chuyên gia mới để phục vụ CTA chưa có. Fallback ảnh/initials và alt hoạt động.
3. Card: ảnh 4:3, crop đúng chủ thể; metadata nhỏ nhưng đọc được, tên/giá là trục chính, đơn vị rõ. Badge và nút lưu không tranh vị trí; save ≥44px, tách khỏi anchor, aria-pressed giữ nguyên. Hover chỉ fine pointer, scale nhẹ và không cắt focus ring.
4. Detail: typography và nhóm dữ liệu có khoảng thở, gallery đúng tỷ lệ theo loại tài sản, support block có portrait; CTA lịch/NFT/save giữ đúng trạng thái. Không thêm sticky bottom bar nếu chưa giải quyết safe-area và việc che form/footer. Không bỏ metadata nghiệp vụ để tạo vẻ tối giản.
5. Kiểm card thường/NFT/paused/ảnh lỗi; detail đô thị/nhà phố/biệt thự/đất quê tại các viewport. Kiểm gallery buttons, lưu rồi mở /da-luu, link hỗ trợ, lịch từ đúng slug. Chạy lint/typecheck và E2E catalog/journey liên quan. Chụp/xem ảnh; ghi bàn giao A trước khi mở thêm file lượt B.

LƯỢT B — MÀN HÌNH VÀ TRẠNG THÁI HIỆN CÓ
Đọc lần lượt component render /lo-dat, /da-luu, /lich-hen, /nft, /nft/[slug], /danh-muc-nft, /trai-nghiem; model/store chỉ đọc khi cần hiểu state. Chủ yếu dùng token/component chung và CSS, không copy một layout mới vào từng route. Giới hạn khoảng 5–6 file sửa mỗi đợt; nếu vượt, chia theo journey/NFT và ghi checkpoint.
1. Soát heading, breadcrumb, label, spacing, button, error/success/empty, thumbnail/persona và nền panel. Không mọi trạng thái đều cần hình lớn; các màn giao dịch cần rõ và gọn.
2. Catalog giữ filter URL, số lượng nhóm, sort, pending và focus. Favorites có loading/empty/storage warning. Lịch giữ field/error association, review/result focus, dữ liệu persona cố định; đổi/hủy vẫn chờ điều phối. NFT giữ giá/tỷ lệ/tổng và sự khác biệt open/soldout/paused/error/cancel/success. Reset giữ xác nhận và đúng namespace.
3. Không thay đổi text thành lời hứa “đã xác nhận” khi state là chờ. Không làm nhãn không thanh toán hoặc lỗi storage nhỏ/nhạt đến khó đọc. Không chuyển cả route thành client hoặc thêm GSAP vào form để đồng bộ với marketing.
4. Thử các hành trình thật trong context test riêng: filter→detail→save→favorites; đề nghị lịch→review→gửi→đổi/hủy; NFT→quantity→review→success/cancel/fail→portfolio; reset. Kiểm reload/nhiều tab khi component state bị chạm. Không reset browser của người dùng.

TIÊU CHÍ CHUNG
Kiểm 360/390/430/768/1440, keyboard, zoom 200%, reduced motion và fallback ở vùng đổi. Chạy test hành vi của từng lượt; trước kết thúc phase chạy đầy đủ pnpm check và ghi lỗi baseline nếu còn. Không tắt kiểm tra để đạt hình thức.

BÀN GIAO
docs/qa/ui-upgrade/P06/ có ma trận route/state, ảnh chọn lọc và kết quả test; đủ chứng minh toàn hành trình mang cùng thiết kế. DESIGN ghi pattern mới, ASSETS ghi nơi dùng portrait, STATUS/HANDOFF nêu kết quả A/B riêng và các điểm chưa làm. Nếu mới xong A, đánh dấu P06 đang làm, không bảo toàn phase đã xong. Giữ model/store/fixture nghiệp vụ không đổi; đọc diff để kiểm điều đó. Không bắt đầu GSAP trước khi bản tĩnh ổn định.
```
