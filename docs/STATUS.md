# Trạng thái Xland

Cập nhật: 25/09/2026, sau vòng làm giàu danh mục mốc 1A và kiểm tra lại toàn bộ.

## Mốc hiện tại

**Đã hoàn tất phần triển khai và QA local mốc 1A: home, card, chi tiết.** Bản trước đã có UI trong commit `be8213a`, nhưng STATUS còn dừng ở scaffold và lỗi WebKit. Phiên này tiếp tục trên code đó, không làm lại scaffold. Chủ dự án có thể xem bản local để đánh giá mỹ thuật; đây chưa phải toàn bộ demo 1B hay bản production.

## Đã hoàn thành

- Trang chủ theo hướng LUXEESTATE; **10 bất động sản** từ fixture dùng chung. Thứ tự cố định: **Đô thị (1) → Vùng ven đô thị (4) → Ocean Park (2) → Vùng quê (3)**. Chọn nhóm kết hợp filter cục bộ khu vực/giá/không gian, empty state và xóa lọc.
- Thêm 7 hồ sơ: Góc phố Long Biên; Hiên xanh Đông Anh, Vườn nhỏ Gia Lâm, Lối nắng Hoài Đức, Miền vườn Thanh Trì; Nhà phố Ocean Park 2 và Biệt thự Ocean Park 3 tại Hưng Yên. Mỗi hồ sơ có ảnh, giá, diện tích đất, mặt tiền, đường tiếp cận, loại tài sản và người hỗ trợ. Giữ nguyên 3 hồ sơ vùng quê.
- Card → chi tiết đúng giá/diện tích/người hỗ trợ; gallery trước/sau/thumbnail, thông tin đất, trạng thái tạm dừng, phương án NFT, lô liên quan và 404.
- Theo yêu cầu mới nhất: bỏ nhãn demo/mẫu/minh họa và câu chữ nói về tiến độ lập trình khỏi UI. Hồ sơ/giá/persona vẫn là mock; không thêm chứng nhận pháp lý hoặc thành tích giả.
- Kết hợp ảnh cảnh quan thật Pexels ở hero/card/gallery với phối cảnh nhà vườn mới ở section NFT. Bổ sung 7 ảnh riêng bằng image_gen cho 7 hồ sơ mới; gallery nhà phố/biệt thự dùng tỷ lệ 3:2 trên desktop để không cắt mái. Nguồn, PNG, prompt và giới hạn ở ASSETS; không sửa PDF/ảnh nguồn đã có.
- Trang chủ hiển thị tối đa 3 người hỗ trợ không lặp; chi tiết hiển thị tối đa 3 bất động sản liên quan theo thứ tự nhóm.
- Noto Serif + Be Vietnam Pro local, CSS tokens, dấu Việt, layout 360/390/430/768/1440px.
- Sửa focus của skip link trên WebKit bằng `tabIndex={0}`; giữ điều hướng bàn phím và menu Escape/trả focus. Tăng overlay hero mobile và nền dòng địa điểm để bảo đảm chữ rõ trên ảnh.
- Đồng bộ AGENTS, PREPARE, DESIGN, ASSETS và README với yêu cầu ảnh/câu chữ mới.

## Kiểm tra thực tế

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm install --frozen-lockfile` | Đạt; giữ nguyên package/lockfile. Có hai lần tải bị timeout, lần thử lại hoàn tất. |
| `pnpm check` cuối | **Đạt**: lint, typecheck, 8 unit test, production build (10 trang chi tiết), **39/39 E2E**. |
| Trình duyệt E2E | Chromium desktop, Chromium Pixel 7, **WebKit iPhone 13 emulation**; 13 test/project; kiểm tra cả 7 trang chi tiết mới, thứ tự danh mục, chọn nhóm bằng bàn phím và lọc kết hợp. |
| Overflow | Home/detail tại 360/390/430/768/1440px: layout không tràn; vòng mở rộng lưu thêm layout của Biệt thự Ocean Park 3. Vòng QA trước thử cuộn ngang `scrollX = 0`. |
| Accessibility | Axe WCAG 2 A/AA + 2.1 AA trên home/detail tại 390/1440px, không có violation; kiểm tra bàn phím, menu, CSS zoom 200%, reduced-motion và fallback ảnh. |
| Tương phản trên ảnh hero | 41 vùng dòng chữ ở 5 viewport, tất cả đạt; mức thấp nhất chữ thường 5,30:1, chữ lớn 3,96:1. Phương pháp và JSON tại thư mục QA. |
| Ảnh | Đã lưu/xem danh mục và chi tiết biệt thự ở 5 viewport, card, bộ lọc Ocean Park và chi tiết nhà phố 390/1440px. Không có ảnh lỗi trong capture. Tham chiếu mẫu và bằng chứng trước được giữ riêng. |
| Git | `git diff --check` đạt; package/lockfile và PDF/ảnh nguồn đã có không thay đổi. Chưa tạo commit. |

Máy hiện có Node mặc định 20.18.0, không đủ chạy pnpm 11. Phiên này thêm Node của runtime Codex (24.19.0) vào PATH **riêng tiến trình** để bootstrap; pnpm cài và chạy bằng Node dự án **24.21.0**. Không đổi Node toàn máy, không nâng dependency.

### Lỗi WebKit ghi ở phiên trước

Đã thử lại cả HTML tối giản và Xland với iPhone 13 emulation trên Windows: `innerWidth/clientWidth/scrollWidth = 390`, `scrollX = 0`. Không tái hiện sai lệch 325/390 và cuộn 65px đã ghi trước đây. Bỏ nhánh dùng Desktop Safari thu nhỏ trên Windows, khôi phục project `mobile-webkit` dùng iPhone 13 ở mọi OS. Toàn bộ 11 test WebKit mobile đã đạt; không skip và không che overflow bằng CSS. Chưa xác định nguyên nhân gốc của sai lệch ở môi trường phiên trước.

Bằng chứng vòng danh mục mới: [QA catalog](qa/2026-09-25-catalog/README.md), [layout mới](qa/2026-09-25-catalog/layout.json).

Bằng chứng vòng 1A trước: [QA 1A](qa/2026-09-25-1a/README.md), [viewport WebKit](qa/2026-09-25-1a/webkit-viewport.json), [layout](qa/2026-09-25-1a/layout.json).

## Giới hạn và bước tiếp theo

- 7 hồ sơ mới mỗi hồ sơ có một ảnh. Giá/diện tích/persona và ảnh tạo mới là fixture; dữ liệu chưa lưu vào database/backend.
- Chưa kiểm tra iPhone/Android thật; CSS zoom 200% không thay kiểm tra zoom của trình duyệt/thiết bị thật. Chưa đo Lighthouse 3 lần hoặc đặt visual regression baseline được chủ dự án duyệt.
- Chưa triển khai 1B: danh sách có filter URL, lưu, video, lịch hẹn, chuyên gia, đăng bán, mua NFT và danh mục NFT. Nút mua hiện disabled với lý do **Chưa mở bán**; CTA hỗ trợ chỉ mở thông tin người hỗ trợ, không gửi yêu cầu ra ngoài.
- Chưa deployment Vercel, backend/admin, Supabase, ví, thanh toán hoặc smart contract. ERC-1155 thuộc giai đoạn backend.
- Tiếp theo: luồng NFT → chọn số lượng → xác nhận → danh mục, state cục bộ/reset và kiểm thử tồn/chống trùng; sau đó các hành trình đất nền theo PREPARE. Giữ nguyên quyết định UI dùng ngôn ngữ sản phẩm, ghi giới hạn mock trong tài liệu nội bộ.

Xem local: `pnpm dev`, hoặc `pnpm build` rồi `pnpm start`. Phiên bàn giao giữ production server tại `http://127.0.0.1:3000`.
