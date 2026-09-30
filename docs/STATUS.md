# Trạng thái Xland

Cập nhật: 30/09/2026, bắt đầu vòng phát triển tiếp theo của mốc 1B.

## Vị trí trong lộ trình

**1A đã có triển khai và bằng chứng QA ngày 25/09; 1B đang triển khai, chưa hoàn tất.** Kho mã đầu phiên sạch, HEAD `e8790ab`; luồng NFT đã có từ commit `6f4504c`, nhưng STATUS cũ chưa phản ánh. Phiên này tiếp tục nền đó, không làm lại scaffold và không triển khai backend/admin.

| Phần của 1B | Trạng thái hiện tại |
| --- | --- |
| NFT → số lượng → xem lại → mua → danh mục | Đã có; kiểm tra lại thành công/hủy/lỗi, reload/reset, tồn và chống trùng. Nối CTA từ home/chi tiết và đồng bộ copy theo yêu cầu sản phẩm. |
| Danh sách `/lo-dat` | Đã triển khai filter URL theo khu vực/giá/không gian/nhóm, sort, reset, empty; hỗ trợ Back/reload/chia sẻ. |
| Lưu `/da-luu` | Đã triển khai card/detail/liste cùng state, bỏ lưu/empty/reload/nhiều tab. |
| Xem thực địa `/lich-hen` | Đã triển khai form từ đúng lô, validation, xem lại, gửi một lần, lịch sử, đề nghị đổi/hủy. Gửi mới chờ sắp xếp; đổi/hủy chờ xử lý. |
| Reset `/trai-nghiem` | Đặt lại favorites/lịch về seed và NFT/tồn/lịch sử; có xác nhận, không xóa key khác. |
| Video, người đăng/theo dõi, chuyên gia/consent, đăng bán | **Chưa triển khai** trong vòng này. |
| QA toàn mốc, Vercel và kịch bản nhà đầu tư đầy đủ | **Chưa đạt/chưa phát hành**. WebKit viewport còn lỗi; các hành trình còn thiếu không được tính là đã xong. |

## Chi tiết thay đổi vòng này

- Dùng chung 10 hồ sơ và nguồn media 1A; thêm fixture persona/lịch ở `src/data/journey.ts`, tách model/adapter khỏi component.
- Home vẫn chọn nhóm cục bộ; bấm tìm dẫn tới danh sách có URL. Parse tham số theo allowlist, bỏ tham số lặp/không hợp lệ; khóa điều khiển trong khi navigation để tránh đọc state cũ. Giữ DOM điều khiển để không mất focus khi filter cập nhật.
- Lưu dữ liệu không nhạy cảm trong `xland.demo.journey.v1`; đọc sau hydrate, kiểm phiên bản/phát lại lệnh, chịu được storage hỏng/bị chặn. Khóa từng sổ nếu Web Locks khả dụng, đồng bộ qua storage event.
- Lịch nhận ngày 01–31/10/2026, 09:00/14:00, 1–8 người; persona Minh An cố định. Không có trường nhập điện thoại/email. Cửa sổ ngày, phí 0 ₫ và 3 lịch ban đầu là giả định kịch bản, không phải dịch vụ đang vận hành.
- Hồ sơ tạm dừng bị chặn cả CTA lẫn truy cập URL form trực tiếp. Model từ chối `sold`; catalog hiện chưa có fixture `sold` để kiểm end-to-end riêng.
- Chống trùng mã lệnh và yêu cầu đang xử lý trên cùng lô. Đổi lịch lưu đề nghị mới và giữ lịch gốc; hủy chuyển `cancel_requested`, không giả xác nhận điều phối.
- NFT dùng ngôn ngữ sản phẩm, vẫn ghi rõ yêu cầu không phát sinh thanh toán. Không dựng mint, receipt hoặc explorer. Reset toàn bộ và reset riêng NFT đều có hướng dẫn trong DEMO.
- Giữ font/token, package/pnpm-lock, PDF và ảnh nguồn. Không thêm dependency, secret hoặc backend; chưa commit.

## Kiểm tra thực tế ngày 30/09

| Kiểm tra | Kết quả |
| --- | --- |
| `pnpm check` cuối | **Chưa đạt toàn bộ**: lint, typecheck, **42/42 unit**, production build đạt; **74/81 E2E đạt**, 7 lỗi WebKit viewport/overflow. |
| Chromium desktop / Pixel 7 | **54/54 E2E đạt**; URL/history, lưu/nhiều tab, lịch tạo/đổi/hủy, reset, NFT và accessibility. |
| WebKit iPhone 13 emulation | **20/27 E2E đạt**; các hành trình chức năng đạt. 7 bài liên quan layout/overflow/zoom thất bại; không skip hoặc nới assertion. |
| Responsive và ảnh Chromium | 35 ảnh ở 360/390/430/768/1440px cho catalog, đã lưu, form/xem lại/lịch, NFT, reset; không tràn ngang, không lỗi ảnh hoặc pageerror trong capture. Đã xem đối chiếu font/card/màu với tham chiếu 1A/LUXEESTATE. |
| Accessibility | Axe WCAG 2 A/AA + 2.1 AA trên các route mới tại 390/1440px ở Chromium; keyboard/focus, reduced motion; cả hai project Chromium đạt. Không quy kết các bài WebKit bị chặn trước scan là đã đạt. |
| Git | `git diff --check` được dùng trước bàn giao. Không thay package/lockfile, cấu hình test project hoặc tài nguyên nguồn. |

Bằng chứng: [QA 1B](qa/2026-09-30-1b/README.md), [layout](qa/2026-09-30-1b/layout.json), [WebKit probe](qa/2026-09-30-1b/webkit-viewport.json). Trace tạm nằm trong `test-results/` (gitignored), không đưa vào Git.

### WebKit: giới hạn đang mở

Đã tái hiện trên cả **HTML tối giản không có CSS Xland** và `/lo-dat`: yêu cầu 390px nhưng `innerWidth=325`, `clientWidth=326`, `scrollWidth=391`, `scrollX=65`, DPR=3,59375. Desktop WebKit đối chứng cũng báo chiều rộng 326 thay 390. Windows AppliedDPI đọc được là 115; hệ số 115/96 khớp DPR đối chứng, nhưng chưa xác nhận toàn bộ nguyên nhân trong WebKit. Không đổi DPI toàn máy, không che overflow, không đổi project iPhone sang desktop để làm xanh kiểm tra.

Kết quả ngày 25/09 bên dưới là lịch sử; phiên hiện tại không tái xác nhận được trạng thái WebKit đạt đó. Cần kiểm tra lại trên môi trường WebKit có viewport đúng (và thiết bị thật khi có) trước khi đóng QA 1B. WebKit giả lập không phải iPhone thật.

## Bước tiếp theo

1. Giải quyết môi trường/viewport WebKit và chạy lại đầy đủ gate `pnpm check`; chưa gắn nhãn bản đã nghiệm thu hoặc phát hành.
2. Triển khai chuyên gia gắn lô đất, consent theo từng yêu cầu; hồ sơ người đăng/theo dõi và wizard gửi duyệt.
3. Tuyển media có nguồn/quyền, làm ít nhất 3 clip phát được và nhóm Bắc/Trung/Nam/KCN theo PREPARE; mở rộng fixture trạng thái khi cần.
4. Hoàn thiện reset các module mới, QA toàn hành trình và kịch bản 5–7 phút, sau đó mới đến mốc 2/Vercel.

Chưa có Lighthouse 3 lần, thiết bị iOS/Android thật hoặc visual regression baseline được duyệt. Chưa deployment, backend/admin, Supabase, ví, thanh toán hoặc smart contract. ERC-1155 vẫn thuộc giai đoạn backend.

Bản production local đang phục vụ tại **http://127.0.0.1:3200**. Kịch bản và các giới hạn dữ liệu ở [DEMO](DEMO.md).

## Lịch sử mốc 1A — 25/09/2026

Phần dưới giữ kết quả của vòng trước, không thay cho kết quả 30/09 ở trên.

### Đã hoàn thành tại 25/09

- Hero trang chủ đã chuyển sang ảnh `assets/images/hero.jpg` do chủ dự án cung cấp; bản WebP phục vụ web nằm tại `public/images/hero.webp`, giữ overlay và responsive crop.

- Trang chủ theo hướng LUXEESTATE; **10 bất động sản** từ fixture dùng chung. Thứ tự cố định: **Đô thị (1) → Vùng ven đô thị (4) → Ocean Park (2) → Vùng quê (3)**. Chọn nhóm kết hợp filter cục bộ khu vực/giá/không gian, empty state và xóa lọc.
- Thêm 7 hồ sơ: Góc phố Long Biên; Hiên xanh Đông Anh, Vườn nhỏ Gia Lâm, Lối nắng Hoài Đức, Miền vườn Thanh Trì; Nhà phố Ocean Park 2 và Biệt thự Ocean Park 3 tại Hưng Yên. Mỗi hồ sơ có ảnh, giá, diện tích đất, mặt tiền, đường tiếp cận, loại tài sản và người hỗ trợ. Giữ nguyên 3 hồ sơ vùng quê.
- Card → chi tiết đúng giá/diện tích/người hỗ trợ; gallery trước/sau/thumbnail, thông tin đất, trạng thái tạm dừng, phương án NFT, lô liên quan và 404.
- Theo yêu cầu mới nhất: bỏ nhãn demo/mẫu/minh họa và câu chữ nói về tiến độ lập trình khỏi UI. Hồ sơ/giá/persona vẫn là mock; không thêm chứng nhận pháp lý hoặc thành tích giả.
- Kết hợp ảnh cảnh quan thật Pexels ở hero/card/gallery với phối cảnh nhà vườn mới ở section NFT. Bổ sung 7 ảnh riêng bằng image_gen cho 7 hồ sơ mới; gallery nhà phố/biệt thự dùng tỷ lệ 3:2 trên desktop để không cắt mái. Nguồn, PNG, prompt và giới hạn ở ASSETS; không sửa PDF/ảnh nguồn đã có.
- Trang chủ hiển thị tối đa 3 người hỗ trợ không lặp; chi tiết hiển thị tối đa 3 bất động sản liên quan theo thứ tự nhóm.
- Noto Serif + Be Vietnam Pro local, CSS tokens, dấu Việt, layout 360/390/430/768/1440px.
- Sửa focus của skip link trên WebKit bằng `tabIndex={0}`; giữ điều hướng bàn phím và menu Escape/trả focus. Tăng overlay hero mobile và nền dòng địa điểm để bảo đảm chữ rõ trên ảnh.
- Đồng bộ AGENTS, PREPARE, DESIGN, ASSETS và README với yêu cầu ảnh/câu chữ mới.

### Kiểm tra tại 25/09

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

#### Lỗi WebKit ghi ở phiên trước 25/09

Đã thử lại cả HTML tối giản và Xland với iPhone 13 emulation trên Windows: `innerWidth/clientWidth/scrollWidth = 390`, `scrollX = 0`. Không tái hiện sai lệch 325/390 và cuộn 65px đã ghi trước đây. Bỏ nhánh dùng Desktop Safari thu nhỏ trên Windows, khôi phục project `mobile-webkit` dùng iPhone 13 ở mọi OS. Toàn bộ 11 test WebKit mobile đã đạt; không skip và không che overflow bằng CSS. Chưa xác định nguyên nhân gốc của sai lệch ở môi trường phiên trước.

Bằng chứng vòng danh mục mới: [QA catalog](qa/2026-09-25-catalog/README.md), [layout mới](qa/2026-09-25-catalog/layout.json).

Bằng chứng vòng 1A trước: [QA 1A](qa/2026-09-25-1a/README.md), [viewport WebKit](qa/2026-09-25-1a/webkit-viewport.json), [layout](qa/2026-09-25-1a/layout.json).

### Giới hạn tại 25/09 (đã được cập nhật ở phần hiện tại phía trên)

- 7 hồ sơ mới mỗi hồ sơ có một ảnh. Giá/diện tích/persona và ảnh tạo mới là fixture; dữ liệu chưa lưu vào database/backend.
- Chưa kiểm tra iPhone/Android thật; CSS zoom 200% không thay kiểm tra zoom của trình duyệt/thiết bị thật. Chưa đo Lighthouse 3 lần hoặc đặt visual regression baseline được chủ dự án duyệt.
- Chưa triển khai 1B: danh sách có filter URL, lưu, video, lịch hẹn, chuyên gia, đăng bán, mua NFT và danh mục NFT. Nút mua hiện disabled với lý do **Chưa mở bán**; CTA hỗ trợ chỉ mở thông tin người hỗ trợ, không gửi yêu cầu ra ngoài.
- Chưa deployment Vercel, backend/admin, Supabase, ví, thanh toán hoặc smart contract. ERC-1155 thuộc giai đoạn backend.
- Tiếp theo: luồng NFT → chọn số lượng → xác nhận → danh mục, state cục bộ/reset và kiểm thử tồn/chống trùng; sau đó các hành trình đất nền theo PREPARE. Giữ nguyên quyết định UI dùng ngôn ngữ sản phẩm, ghi giới hạn mock trong tài liệu nội bộ.

Xem local: `pnpm dev`, hoặc `pnpm build` rồi `pnpm start`. Phiên bàn giao giữ production server tại `http://127.0.0.1:3000`.
