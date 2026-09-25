# XLAND - KẾ HOẠCH PHÁT TRIỂN VÀ QUY ƯỚC THỰC THI

> Cập nhật: 25/09/2026 · Trạng thái: đã khởi tạo nền ứng dụng; đang chuẩn bị giao diện demo mốc 1A.
> Đích gần nhất: website mobile first đẹp theo mẫu LUXEESTATE, có dữ liệu/media mẫu và các hành trình hoạt động để trình nhà đầu tư.
> Stack đã chốt: Next.js + TypeScript trên Vercel; backend Node.js trên Railway; PostgreSQL/Auth/Storage trên Supabase; smart contract Solidity theo ERC-1155 ở giai đoạn backend.
> Người triển khai kỹ thuật: Codex. Chủ dự án quyết định kinh doanh, ngân sách, đối tác và thời điểm chuyển sang vận hành thật.

## 1. Căn cứ và quyết định phạm vi

### Tài liệu và tài nguyên đã đọc

Đã đọc toàn bộ hai tài liệu và xem bốn ảnh hiện có trong Xland tại thời điểm cập nhật:

| Nguồn | Kết quả rà soát | Cách sử dụng |
| --- | --- | --- |
| `assets/docs/Công nghệ BĐS.pdf` | PRD 1.0, tháng 9/2026, 14 trang; nền tảng chuyên đất nền | Cơ sở nghiệp vụ: video, hồ sơ lô đất, đặt lịch thực địa, chuyên gia, Sale và vận hành |
| `PREPARE.md` bản đầu | Đề xuất RWA/NFT, đấu giá, ví, giao diện navy/champagne | Hợp nhất theo yêu cầu mới: giữ NFT phân đoạn với ERC-1155; giao diện LUXEESTATE; đấu giá chưa thuộc phạm vi |
| `assets/images/hero.jpg` | 1376 × 768, khoảng 0,98 MB; cao tầng ven biển | Tham khảo mỹ thuật; chưa phù hợp làm ảnh chính cho sản phẩm đất nền |
| `assets/images/landmark-tower.jpg` | 1376 × 768, khoảng 1,02 MB; cao ốc | Tài nguyên cũ; không suy ra phạm vi sản phẩm từ ảnh |
| `assets/images/penthouse-auction.jpg` | 1376 × 768, khoảng 0,85 MB; nội thất penthouse | Tài nguyên cũ; tên file không phải yêu cầu xây đấu giá |
| `assets/images/villa-nft.jpg` | 1376 × 768, khoảng 0,95 MB; biệt thự | Tham khảo mỹ thuật; tên file không phải yêu cầu xây NFT |

Git đã được khởi tạo, có commit `7acb455 — Initial commit`; sử dụng tiếp kho hiện tại. Đã tạo nền Next.js App Router/TypeScript strict, Tailwind, trang chờ Xland, trang 404 và bộ kiểm tra; đã có `AGENTS.md`, `README.md`, `docs/STATUS.md`. Phiên bản chính xác và lệnh chạy được ghi trong `README.md`, `package.json`, `pnpm-lock.yaml`. Đã có `docs/DESIGN.md` làm đặc tả mốc 1A; chưa có các luồng nghiệp vụ demo. Giữ nguyên PDF và ảnh nguồn; chỉ đưa tài nguyên đã tuyển chọn vào thư mục public của ứng dụng.

### Thứ tự áp dụng và định nghĩa sản phẩm

1. Yêu cầu mới nhất của chủ dự án: giao diện theo mẫu, mobile first, demo trước rồi gọi vốn; frontend Vercel, backend Node.js/Railway, Supabase; bổ sung bán bất động sản phân đoạn dưới tên **NFT**, triển khai **ERC-1155** khi phát triển backend.
2. PDF là bản cũ: dùng cho nghiệp vụ đất nền truyền thống và nguyên tắc phục vụ; phần NFT được bổ sung bằng yêu cầu mới của chủ dự án. Không coi việc PDF thiếu NFT là lý do loại tính năng này.
3. Tài liệu này: quyết định triển khai, phân kỳ và các giả định được ghi rõ.
4. Website mẫu/repo UI UX Pro Max: tham khảo thị giác và kỹ thuật, không thay thế yêu cầu kinh doanh.

**Xland giúp người dùng khám phá đất nền, tìm hiểu hồ sơ, xem thực địa và mua bất động sản phân đoạn bằng NFT để nhiều người cùng tham gia một tài sản.** Luồng mua toàn bộ và luồng mua NFT được phân biệt rõ. Người bán, người đăng, Sale, đầu nguồn, người dẫn và đội địa phương có vai trò riêng.

**Quyết định phạm vi mới:** lấy nghiệp vụ đất nền truyền thống từ PDF, bổ sung **NFT bất động sản phân đoạn** theo yêu cầu chủ dự án và dùng ngôn ngữ thiết kế LUXEESTATE. Giao diện, tài liệu và kịch bản gọi vốn ghi thẳng **NFT**, **Mua NFT**, **Số lượng NFT**, **Danh mục NFT**; chuẩn hợp đồng đã chốt là **ERC-1155**, không thay bằng ERC-20 hoặc ERC-721. Demo mô phỏng mua/nắm giữ NFT; backend mới thực hiện ví, thanh toán và giao dịch Blockchain. Đấu giá và cam kết lợi nhuận chưa thuộc phạm vi.

Trang 10 của PDF tiếp tục áp dụng cho luồng mua toàn bộ: không có giỏ thanh toán tiền đất/giữ cọc trên nền tảng. Luồng NFT là yêu cầu mới có quy trình thanh toán riêng cần thiết kế ở giai đoạn backend; không lấy giới hạn của luồng truyền thống để loại bỏ luồng NFT.

### Đối chiếu toàn bộ PRD với lộ trình

| Trang PDF | Nội dung | Demo | Sau khi nhà đầu tư đồng ý |
| --- | --- | --- | --- |
| 1-4 | Khám phá, video, tìm kiếm, hồ sơ lô đất | Luồng chính với dữ liệu mẫu | Danh mục thật, quyền xem, trạng thái bán, chất lượng dữ liệu |
| 5 | Người bán, người đăng, gửi duyệt | Hồ sơ người đăng và wizard gửi hồ sơ mẫu | Upload, kiểm duyệt, cập nhật và theo dõi quan tâm |
| 6-7 | Hai đường nhập nguồn, địa bàn, Sale | Thể hiện vai trò và đầu mối trên dữ liệu mẫu | Kho nguồn chiến lược, CRM, phân công, bàn giao, lịch sử nguồn khách |
| 8-9 | Xem thực địa, chuyên gia | Tạo yêu cầu mẫu, trạng thái, đồng ý chia sẻ | Điều phối, đổi/hủy, thông báo, đối tác, consent có lưu vết |
| 10, 12 | Giao dịch, phí, quyền lợi, admin, báo cáo | Chỉ giải thích trong câu chuyện sản phẩm; chưa làm admin | Vận hành, đối soát, phân quyền, audit, báo cáo |
| 11, 13 | Kiến thức, sự kiện, gói, quảng bá | Nội dung giới thiệu cần thiết | Nội dung cơ bản trước; sự kiện/gói/quảng bá ở giai đoạn mở rộng |
| 14 | Địa bàn, chính sách, phí, thước đo | Ghi giả định; không chặn dựng demo | Chủ dự án chốt cùng người vận hành trước pilot |
| Yêu cầu mới, ngoài PDF | Bán phân đoạn bằng NFT, chuẩn ERC-1155 | Danh sách NFT, chi tiết, chọn số lượng, mua mô phỏng, danh mục NFT | Ví, thanh toán, smart contract ERC-1155, đồng bộ Blockchain và admin NFT |

## 2. Lộ trình và điều kiện hoàn thành

| Giai đoạn | Công việc và đầu ra | Điều kiện hoàn thành |
| --- | --- | --- |
| 0. Chuẩn bị | Kế hoạch này; tiếp theo scaffold, quy ước, nguồn ảnh, token | Ứng dụng cài/chạy được, khóa phiên bản, rõ bước tiếp theo |
| 1A. Chất lượng thị giác | Trang chủ, card, chi tiết lô đất; mock; mobile và desktop | Có ảnh so sánh; chữ Việt, bố cục, ảnh, tương phản đạt mục 9 |
| 1B. Demo tương tác | Hành trình đất nền và mua NFT ở mục 4, dữ liệu nhất quán, reset demo | Luồng mua NFT -> danh mục NFT cùng các luồng đất nền chạy liền mạch; đủ trạng thái; kiểm thử đạt |
| 2. Trình nhà đầu tư | Demo Vercel, kịch bản 5-7 phút, ảnh/video quay demo, ghi phản hồi | Bản phát hành tái lập được; chủ dự án tự trình được; rõ phần mô phỏng |
| 3. Backend, admin và Blockchain | Sau khi chủ dự án thông báo nhà đầu tư đồng ý và cho triển khai; Node.js/Railway, Supabase, ERC-1155; theo mục 10 | Luồng NFT được kiểm tra trên testnet trước mainnet; pilot thật đạt điều kiện về dữ liệu, quyền và vận hành |
| 4. Mở rộng | Tối ưu theo pilot; sự kiện, gói, quảng bá, tích hợp đối tác khi có nhu cầu | Từng hạng mục có mục tiêu sử dụng và ngân sách vận hành |

Giai đoạn 2 vẫn có thể chỉnh demo theo phản hồi. Không tự chuyển sang backend chỉ vì giao diện xong. Code được tổ chức để dùng tiếp, nhưng demo chưa đồng nghĩa hệ thống production sẵn sàng. Ước lượng theo từng mốc sau khi kiểm tra scaffold và tài nguyên; không hứa lịch cố định khi chưa có căn cứ.

## 3. Chuẩn thiết kế Xland

### Nguồn tham chiếu

- Mẫu chính: [LUXEESTATE / Real Estate](https://uupm.cc/demo/real-estate), đã truy cập trực tiếp trong trình duyệt Codex. Kiểm tra trực tiếp bố cục, tương tác và responsive khi triển khai; lưu ảnh đối chiếu theo mốc. Ảnh chủ dự án cung cấp là tham chiếu bổ sung.
- Repo tham khảo: `D:/Xproject/ui-ux-pro-max-skill`; `src/ui-ux-pro-max/data/products.csv` mục 36 và `typography.csv` mục 32.
- Database gợi ý Glassmorphism + Minimalism & Swiss Style, hero lớn, xanh/vàng/trắng. Đây là định hướng, không phải mã nguồn trang mẫu hoặc bằng chứng về lịch sử tạo demo.
- CSS demo đã được kiểm chứng dùng `#0077B6`, accent CSS `gold` (`#FFD700`), Cinzel + Josefin Sans. `colors.csv` trong repo có palette khác; ưu tiên mẫu đã chọn thay vì trộn các đề xuất.
- HTML/TSX tại `projects/xland-real-estate/` ở repo bên cạnh chỉ dùng để tham khảo. Thư mục này được thấy là untracked khi kiểm tra trước; không lấy làm dependency hoặc sao chép nguyên bản vào Next.js.

### Hướng thị giác

| Thành phần | Quyết định |
| --- | --- |
| Tổng thể | Nền sáng, thoáng; ảnh cảnh quan/đất nền có chiều sâu; ít trang trí; thông tin dễ đọc |
| Màu | Primary `#0077B6`, hover `#005A8C`, accent `#FFD700`; canvas `#FFFFFF`, surface `#F8FAFC`, text `#1E293B`, muted `#64748B`, border `#E2E8F0` |
| Chữ | Thử Cinzel cho tiêu đề ngắn, Josefin Sans cho nội dung. Kiểm tra đủ dấu Việt ở các weight sử dụng. Nếu thiếu glyph/đọc kém, dùng Noto Serif cho tiêu đề và Be Vietnam Pro cho UI; ghi quyết định trước khi nhân rộng |
| Hero | Ảnh rộng, overlay tối đủ đọc chữ, tiêu đề ngắn chia dòng có nhấn vàng, mô tả gọn, tìm kiếm rõ |
| Header | Nền trắng, logo Xland, ít mục, có lối vào NFT; CTA khám phá lô đất, xem thực địa hoặc mua NFT đúng ngữ cảnh |
| Search | Hộp trắng/kính nhẹ bo 16px; khu vực, khoảng giá, nhu cầu sử dụng; không dùng số phòng ngủ/phòng tắm cho đất nền |
| Card | Ảnh cùng tỷ lệ, vị trí, diện tích, giá chào, trạng thái, người hỗ trợ; bo khoảng 16px, bóng nhẹ |
| Motion | CSS transition khoảng 150-250ms; hover nhẹ trên thiết bị có chuột; reduced motion; CTA không phụ thuộc hover |
| Glass | Dùng ở tìm kiếm/CTA; nền đủ đặc khi blur không khả dụng; không phủ kính toàn ứng dụng |
| Icon | SVG nét mảnh dùng chung trong component Icon cho mốc 1A; nút chỉ có icon phải có tên truy cập; không dùng emoji làm icon chức năng |

Màn hình NFT và danh mục NFT dùng cùng hệ sáng/xanh/vàng của trang chủ; không tự chuyển sang giao diện crypto tối. Thông tin mua ưu tiên số lượng NFT, giá/NFT, tổng tiền, tỷ lệ phân đoạn và điều kiện của tài sản.

Không dùng vàng làm chữ nhỏ trên nền trắng. Nếu nút xanh/chữ trắng theo mẫu không đạt tương phản ở kích cỡ thực tế, dùng xanh đậm hơn cho nút. Chất lượng đến từ ảnh, khoảng cách và typography trước hiệu ứng.

### Mobile first và cách kết hợp video

- `/` là trang chủ/Khám phá theo LUXEESTATE trên mobile và desktop. `/video` là màn khám phá video, có CTA nổi bật từ trang chủ và URL riêng để trình demo.
- Đây là điều chỉnh có chủ ý so với trang 3 PRD vốn đề xuất mở đầu bằng video: giữ hành trình video nhưng ưu tiên giao diện website vừa được chủ dự án chọn. Không tự đổi mobile sang một sản phẩm có định vị khác.
- Thiết kế từ 360px; kiểm tra 390, 430, 768 và 1440px; desktop đối chiếu thêm ở chiều rộng ảnh tham chiếu. Layout co giãn, không đóng khung điện thoại 393px trên máy tính.
- Một cột trên mobile, 2-3 cột khi đủ chỗ; tìm kiếm rút gọn và mở bộ lọc. Điều hướng/back/CTA nhất quán; vùng chạm mục tiêu tối thiểu 44 × 44 CSS px.
- CTA cố định trên trang chi tiết không che nội dung, bàn phím hoặc safe area. Bottom sheet cho filter/form ngắn nếu hữu ích; trang riêng cho nội dung dài, không ép mọi thao tác thành sheet.
- Video có play/pause, mute, phụ đề hoặc mô tả tương đương; có nút chạm thay mọi cử chỉ vuốt. Dấu cộng trong màn video chọn nhóm nội dung; đăng bán nằm riêng, có nhãn rõ.

## 4. Phạm vi demo và kịch bản trình bày

### Các màn hình phải có

| Route dự kiến | Nội dung và hành vi cần đạt |
| --- | --- |
| `/` | Hero, tìm kiếm hoạt động, lô nổi bật, cách Xland hỗ trợ, người hỗ trợ mẫu, CTA. Counter lấy từ fixture hoặc ghi minh họa; không dùng 500+ / $2B+ / 15+ như thành tích Xland |
| `/lo-dat` | Lọc khu vực/giá/nhu cầu, sắp xếp, xóa lọc, không có kết quả. Filter trên URL để back/chia sẻ giữ trạng thái |
| `/lo-dat/[slug]` | Gallery/media, diện tích, giá, mục đích sử dụng, mặt tiền/đường tiếp cận, ngày cập nhật, trạng thái bán, tài liệu mẫu và đầu mối |
| `/video` | Ít nhất 3 clip phát được; vuốt/nút đổi clip; mở đúng hồ sơ, đặt lịch đúng lô, xem người đăng. Bắc/Trung/Nam và KCN; KCN là nhóm nội dung/loại tài sản, không phải miền địa lý |
| `/nguoi-dang/[slug]` | Hồ sơ, vai trò, nội dung, theo dõi mô phỏng. Người đăng không mặc nhiên là chủ sở hữu |
| `/da-luu` | Lưu/bỏ lưu từ card/detail, trạng thái khớp giữa các trang, empty state |
| `/lich-hen` | Yêu cầu vừa tạo, chi tiết/trạng thái, đề nghị đổi/hủy. Gửi mới là chờ sắp xếp, không tự báo đã xác nhận |
| `/ho-tro` | Form chuyên gia gắn lô đất, bên nhận mẫu, mục đích, dữ liệu chọn chia sẻ, phí mẫu nếu có; đồng ý không chọn sẵn; xem lại yêu cầu |
| `/dang-ban` | Wizard rút gọn với hồ sơ/media mẫu: thông tin lô, vai trò/quyền giới thiệu, xem trước, gửi duyệt mô phỏng. Chưa làm hệ upload/admin |
| `/nft` | Danh sách bất động sản phân đoạn bằng NFT: ảnh, giá/NFT, tổng số NFT, số còn lại, trạng thái mở bán; liên kết hồ sơ lô gốc |
| `/nft/[slug]` | Hồ sơ tài sản, phương án NFT, quyền lợi/điều kiện mẫu, tỷ lệ phân đoạn, chọn số lượng, tổng tiền/phí và xác nhận mua mô phỏng |
| `/danh-muc-nft` | NFT đang nắm giữ theo tài sản, số lượng, tỷ lệ phân đoạn, vốn mua mẫu, lịch sử giao dịch; số liệu cập nhật sau mua và reset được |

Tái sử dụng form và component giữa các route. Hoàn thiện home/detail trước, sau đó luồng mua NFT và danh mục NFT, rồi các luồng video/lịch/chuyên gia/người bán. Demo NFT là phạm vi bắt buộc của bản trình nhà đầu tư; chưa cần dashboard admin.

### Kịch bản 5-7 phút

1. Trang chủ: Xland phục vụ ai, giúp gì, dẫn vào tìm đất.
2. Lọc khu vực/giá, mở một hồ sơ có ảnh/video, đọc và lưu lại.
3. Chuyển sang video, vào đúng hồ sơ từ clip, nhận diện người hỗ trợ.
4. Đề nghị xem thực địa, mở danh sách lịch thấy yêu cầu chờ điều phối.
5. Gửi yêu cầu chuyên gia với lựa chọn dữ liệu được chia sẻ.
6. **Chọn tài sản NFT -> xem phương án NFT -> chọn số lượng NFT -> xác nhận mua NFT mô phỏng -> xem danh mục NFT.** Làm rõ tỷ lệ phân đoạn và tổng tiền trong cùng luồng.
7. Minh họa ngắn người bán gửi hồ sơ chờ duyệt; giải thích backend/admin và ERC-1155 là bước phát triển tiếp theo.
8. Reset về ban đầu cho người tiếp theo thử; kịch bản 5-7 phút ưu tiên khám phá tài sản và mua NFT, các luồng phụ mở khi cần.

**Quy ước demo NFT:** dùng tài khoản/ví mẫu; không bắt người xem cài ví, ký giao dịch hoặc chuyển tiền. Trạng thái giao dịch và mã tham chiếu phải ghi mô phỏng; không tạo link explorer giả hoặc báo đã mint on-chain. Demo có thành công, hủy và thất bại; chỉ giao dịch thành công mới tăng số NFT trong danh mục. Mua lại cùng một thao tác không được cộng số lượng hai lần.

Hiển thị nhãn gọn “Bản trải nghiệm · Dữ liệu minh họa”. Dùng persona mẫu, không yêu cầu đăng ký thật để xem demo. Không gửi email/SMS hoặc liên hệ chuyên gia thật; không thu dữ liệu cá nhân thật. Form có dữ liệu gợi ý và thông báo đúng rằng thao tác chỉ mô phỏng trên thiết bị này.

## 5. Stack và cấu trúc ứng dụng

| Hạng mục | Lựa chọn và lý do |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript strict cho website và UI admin trên Vercel |
| Phiên bản | Stable được hỗ trợ và Node.js LTS tương thích tại lúc scaffold; kiểm tra nguồn chính thức rồi khóa phiên bản, không giữ mặc định Next.js 15 từ bản cũ |
| Gói | pnpm, một lockfile, khai báo `packageManager` và Node engine để cài tái lập |
| CSS | Tailwind CSS + CSS variables làm nguồn design tokens thực thi |
| UI | Component riêng theo mẫu; shadcn/ui/Radix cho primitive cần accessibility |
| Form | Zod; React Hook Form cho form nhiều trường; schema dùng được tại biên server |
| State demo | React state/context nhỏ; URL cho filter; adapter cục bộ cho thao tác mẫu. Chưa thêm Redux/cache dữ liệu khi không cần |
| Media | `next/image`, `next/font`, video lazy load, kích thước và crop thích hợp |
| Animation | CSS trước; chỉ thêm motion library khi có tương tác cụ thể cần nó; không cài nhiều bộ hiệu ứng cùng lúc |
| Backend, giai đoạn 3 | API Node.js/TypeScript trên Railway, chia module nghiệp vụ; worker đồng bộ Blockchain khi cần. Next.js server chỉ làm SSR/BFF mỏng, không lặp logic giao dịch |
| Dữ liệu, giai đoạn 3 | Supabase PostgreSQL, Auth, Storage; SQL migrations quản lý trong repo |
| Hosting | Frontend Next.js và UI admin trên Vercel; backend Node.js và worker trên Railway sau giai đoạn demo |
| Blockchain, giai đoạn 3 | Solidity + ERC-1155 trên mạng EVM; chain cụ thể chốt khi triển khai backend; testnet trước mainnet |
| Kiểm thử | TypeScript, ESLint, Vitest, Playwright, kiểm tra accessibility; test theo rủi ro/hành trình |

**Phân chia triển khai:** Vercel phục vụ ứng dụng Next.js, gồm SSR và UI admin; Railway chạy backend Node.js và tác vụ đồng bộ Blockchain; Supabase giữ PostgreSQL/Auth/Storage; smart contract chạy trên Blockchain. Giai đoạn demo chỉ cần Next.js/mock trên Vercel. Nguồn: [Next.js trên Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Railway deployment](https://docs.railway.com/build-deploy). Không tạo thêm PostgreSQL trên Railway.

### Ranh giới mock và live

```text
Trang/component
       |
Use case + hợp đồng dữ liệu theo feature
       |
Adapter được chọn theo môi trường
       |-- Demo: fixtures + trạng thái riêng của một trình duyệt
       `-- Live: API Node.js/Railway -> Supabase + dịch vụ Blockchain (giai đoạn 3)
```

- Server Components cho phần đọc/nội dung phù hợp; Client Components cho filter, lưu, sheet, form, video và chọn số lượng NFT. Không biến toàn bộ ứng dụng thành client component.
- UI không query Supabase trực tiếp, không chứa fixture lớn. Hợp đồng theo nghiệp vụ: tìm lô, lấy hồ sơ, tạo yêu cầu; tránh framework repository tổng quát quá sớm.
- Kiểu/schema ngoài UI. Adapter live ánh xạ database sang DTO; không hứa đổi backend bằng một công tắc mà không làm auth, quyền và kiểm thử.
- Chế độ mock/live cấu hình tập trung lúc build/deploy; query string/localStorage không được bật quyền admin hoặc đổi chế độ dữ liệu.
- Thời gian mẫu/state client phải tránh hydration mismatch; không dùng bộ nhớ tiến trình Node làm kho demo dùng chung nhiều người.
- Bản live báo lỗi nếu thiếu cấu hình, không tự fallback sang mock; reset demo chỉ tồn tại trong bản demo.

### Cấu trúc dự kiến, tạo dần

```text
Xland/
  PREPARE.md                 # Phạm vi, quyết định và lộ trình
  AGENTS.md                  # Rules ngắn, dẫn tới tài liệu đúng
  README.md                  # Cài, chạy, kiểm tra, cấu hình
  docs/
    STATUS.md                # Mốc hiện tại, đã xong, còn lại, QA gần nhất
    DESIGN.md                # Ánh xạ mẫu -> Xland và quy tắc component
    DEMO.md                  # Kịch bản, reset, giới hạn
    ASSETS.md                # Nguồn, quyền sử dụng, crop, alt
    decisions/               # Quyết định có đánh đổi đáng kể
    qa/                      # Bằng chứng gắn với bản phát hành
  assets/                    # PDF/ảnh nguồn, không public mặc định
  public/media/              # Media đã chọn và tối ưu
  src/
    app/                     # Routes, layouts, metadata, loading/error/not-found
    components/              # UI primitive/thành phần dùng chung
    features/                # properties, videos, visits, experts, publishers, submissions, nft
    data/mock/               # Fixtures, demo clock, scenario, version/reset
    lib/                     # Config, format, adapter chung tối thiểu
    styles/                  # Global CSS, nguồn token thực thi
  tests/                     # Nghiệp vụ và hành trình
  backend/                   # API Node.js và worker Railway; giai đoạn 3
  contracts/                 # Solidity ERC-1155 và test hợp đồng; giai đoạn 3
  supabase/migrations/       # Chỉ tạo khi bắt đầu giai đoạn 3
```

Không tạo hết thư mục rỗng trước trang đầu tiên. Không xây `.brain/` song song với docs: `STATUS.md` là nguồn tiến độ, CSS tokens là nguồn giá trị thực thi, TypeScript/Zod là nguồn schema. `DESIGN.md` giải thích quy tắc thay vì duy trì bộ token cạnh tranh.

## 6. Dữ liệu mock và quy tắc nghiệp vụ

### Tập dữ liệu

- Khoảng 8-12 lô giả định, đủ Bắc/Trung/Nam và nội dung KCN, nhiều giá/diện tích/trạng thái. Địa bàn demo không phải cam kết phục vụ toàn quốc.
- Ít nhất 3 video, 3-4 hồ sơ người đăng/người hỗ trợ, 2 chuyên gia mẫu và lịch/yêu cầu ở nhiều trạng thái.
- Ít nhất 3 phương án NFT liên kết lô đất chuẩn: đang mở bán, hết NFT và tạm dừng; có ví/persona mẫu và lịch sử mua NFT.
- Một lô có ID chuẩn duy nhất; nhiều video/người tham gia liên kết cùng ID. Không nhân bản hồ sơ để thể hiện nhiều người đăng.
- Có sold, paused, thiếu media, không tìm thấy, không có kết quả. Giá/diện tích/trạng thái trên card-video-detail phải khớp.
- Fixture có ID ổn định, seed/version, mốc giờ tái lập. Reset khôi phục yêu thích, theo dõi, form, yêu cầu, tồn NFT, danh mục và lịch sử mua; không xóa dữ liệu ngoài namespace demo.
- Giữ trạng thái qua route/reload bằng localStorage cho dữ liệu mẫu không nhạy cảm; đọc sau hydrate, chịu được storage bị chặn/dữ liệu cũ. Live không dùng cơ chế này để xác thực hoặc bảo vệ dữ liệu.

| Nhóm dữ liệu | Nội dung chính |
| --- | --- |
| `LandPlot` | ID, slug, tiêu đề, khu vực công khai, diện tích, mục đích sử dụng, mặt tiền/đường, giá, trạng thái, cập nhật, đầu mối |
| `MediaItem` / `VideoPost` | Lô, người đăng, loại media, URL/poster, alt/caption, ngày ghi nhận, nguồn/quyền sử dụng, nhãn mẫu/tài trợ |
| `PublisherProfile` / `PlotParticipant` | Hồ sơ và vai trò trên từng lô; không suy quyền sở hữu từ quyền đăng |
| `Favorite` / `Follow` | Persona/người dùng, đối tượng, thời điểm |
| `VisitRequest` | Lô, ngày mong muốn, số người, liên hệ mẫu, trạng thái, lịch đề xuất, người phụ trách, lịch sử |
| `ExpertRequest` / `ConsentRecord` | Loại hỗ trợ, bên nhận, mục đích, dữ liệu chia sẻ, phí chấp thuận, phiên bản đồng ý, trạng thái |
| `Submission` | Người gửi, quyền giới thiệu, nội dung, trạng thái duyệt, lý do cần bổ sung |
| `NftOffering` | Lô gốc, slug, chuẩn ERC-1155, tokenId, chainId/contractAddress, tổng NFT phân đoạn cố định, số đã phát hành/đã bán/đang giữ chỗ, giá/NFT, trạng thái, điều kiện |
| `NftOrder` | Persona/người dùng, phương án NFT, số lượng, đơn giá, phí, tổng tiền, trạng thái, khóa chống trùng và mã tham chiếu demo hoặc transaction hash thật |
| `NftHolding` / `WalletProfile` | Người nắm giữ, tài sản/tokenId, số lượng NFT, giá vốn, địa chỉ ví nếu có; phân biệt danh mục mẫu và số dư đã xác nhận on-chain |

VND dùng số nguyên trong giới hạn an toàn TypeScript; database sau này dùng `bigint`/`numeric` thích hợp và ánh xạ API rõ. Không dùng float cho tính phí/đối soát. Diện tích có đơn vị m²; datetime lưu UTC, hiển thị Asia/Ho_Chi_Minh qua formatter chung; số điện thoại là chuỗi. DTO public không chứa vị trí chính xác/giấy tờ riêng/dữ liệu khách rồi chỉ che bằng CSS.

### Mô hình NFT ERC-1155 đã chốt

- Tên sản phẩm và copy UI dùng **NFT bất động sản**, **Mua NFT**, **Số lượng NFT**, **Danh mục NFT**. “Suất phân đoạn” chỉ dùng để giải thích ý nghĩa NFT, không thay tên tính năng.
- Thiết kế Xland: một tài sản với cùng bộ quyền lợi tương ứng một `tokenId`; mỗi người nắm một số lượng NFT của ID đó. Quyền lợi khác nhau phải có phương án/ID riêng, không trộn vào cùng loại.
- ERC-1155 hỗ trợ nhiều loại token trong cùng hợp đồng và số dư theo chủ sở hữu/ID; không giả định mỗi đơn vị phải có tokenId riêng. Nguồn tiêu chuẩn: [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155).
- Ví dụ mock: giá trị phân đoạn 10 tỷ đồng, tổng 1.000 NFT, giá 10 triệu/NFT; mua 10 NFT là 100 triệu trước phí, tương ứng 1% tổng phương án. Dùng tổng số NFT phân đoạn đã công bố làm mẫu số, không lấy số NFT đã bán/đã mint để tính tỷ lệ.
- Giới hạn phát hành, bán, thanh toán và quyền chuyển nhượng là logic Xland phải xây; không coi ERC-1155 tự cung cấp chúng. Tổng số NFT được chốt cho phương án; thay đổi cần quyết định nghiệp vụ và cơ chế kiểm soát, không tăng tùy ý làm đổi tỷ lệ.
- `tokenId` và số nguyên on-chain lớn truyền qua JSON dưới dạng chuỗi; chuyển đổi có kiểm tra tại adapter. Demo chưa có chain/contract triển khai thì để trống các trường đó, không điền địa chỉ hoặc transaction hash giả như dữ liệu thật.
- Hồ sơ phương án NFT phải nêu quyền lợi gắn tài sản, đơn vị đứng tên/quản lý, điều kiện chuyển nhượng/thoái vốn. Tỷ lệ NFT trên UI là tỷ lệ theo phương án, không tự khẳng định tỷ lệ trên giấy chứng nhận; hoàn thiện mô hình này trước giao dịch thật.

### Bất biến cần giữ

- Tách `publicationStatus` (draft/pending_review/published/...) và `saleStatus` (available/negotiating/sold/paused) của luồng mua toàn bộ. Sold/paused dừng lịch xem mới ở card/video/detail. NFT có `offeringStatus` riêng (draft/open/sold_out/paused/closed), không suy trạng thái mở bán NFT chỉ từ `saleStatus`.
- Đơn NFT nhận số lượng nguyên dương, không vượt tồn có thể bán; tiền mua = số NFT × đơn giá, cộng phí đã hiển thị. Chỉ trạng thái mua thành công mới cập nhật danh mục; xử lý hủy/lỗi/reset nhất quán. Backend sau này chống bán vượt số lượng bằng giao dịch dữ liệu và kiểm soát trên hợp đồng.
- Lịch xem: submitted -> arranging -> proposed -> confirmed -> completed; thêm cancelled/unavailable/no_show khi phù hợp. Demo có fixture các trạng thái; gửi mới không tự xác nhận thay điều phối viên.
- Đồng ý chia sẻ gắn từng yêu cầu chuyên gia, có bên nhận/mục đích rõ; không dùng một checkbox chung cho toàn tài khoản.
- Vị trí công khai gần đúng và có nhãn. Demo có thể dùng sơ đồ khu vực minh họa; chỉ tích hợp bản đồ bên ngoài khi có nhu cầu/cấu hình.
- Dấu xác nhận nêu phạm vi kiểm tra. Không dựng chứng thư, dấu kiểm toán, logo ngân hàng hoặc lời bảo chứng chưa có căn cứ; không gọi dữ liệu mẫu là dòng tiền thật.
- Phí, hoa hồng và SLA chưa được chốt là giả định/config demo, không hard-code thành chính sách vận hành.

## 7. Media và nội dung

Codex chủ động tuyển chọn và phối hợp nguồn media theo quyền chủ dự án đã giao. Ưu tiên [Pexels](https://www.pexels.com/license/) cho video/ảnh và [Unsplash](https://unsplash.com/license) cho ảnh; theo yêu cầu mới, chỉ dùng ảnh chụp thật cho demo, không dùng ảnh AI. Bộ ảnh cần tự nhiên, có bối cảnh nhất quán và phục vụ độ tin cậy khi trình nhà đầu tư. Kiểm tra giấy phép từng tài nguyên, ghi nguồn vào `docs/ASSETS.md`; không cần chủ dự án chọn từng ảnh. Video ưu tiên footage có sẵn, được nén và kiểm tra phát trên điện thoại.

- Tuyển ảnh đất, cảnh quan, đường tiếp cận, bối cảnh địa phương; bộ ảnh mỗi lô phải có logic. Chất lượng và đồng nhất quan trọng hơn 8K.
- Bốn ảnh cũ chỉ dùng khi hợp ngữ cảnh và rõ quyền sử dụng; chưa đủ cho catalog đất nền/video feed. Tên file không chứng minh nguồn hoặc giấy phép.
- Ghi nguồn, tác giả/giấy phép nếu có, quyền dùng demo/production, phân biệt ảnh stock minh họa bối cảnh và ảnh thực địa đã xác minh. Không gọi ảnh mô phỏng là ảnh thực địa của một lô thật.
- Hero có crop/điểm lấy nét riêng cho mobile/desktop; WebP/AVIF khi phù hợp; khai báo kích thước và `sizes`. Budget ban đầu: hero mobile khoảng 250-400 KB, thumbnail 60-150 KB; điều chỉnh sau đo chất lượng.
- Video có poster, clip ngắn được nén, chỉ phát clip đang xem; dừng ngoài viewport, không tải toàn feed. Có fallback cho autoplay bị chặn, mạng chậm và media lỗi.
- Demo dùng media quản lý trong dự án; live chuyển Storage/dịch vụ phù hợp. Không lưu upload trên ổ đĩa tạm Railway.
- Copy tiếng Việt rõ; luồng đất nền dùng “lô đất”, “giá chào”, “xem thực địa”; luồng NFT dùng thẳng “NFT”, “Mua NFT”, “Danh mục NFT”. Không né thuật ngữ NFT bằng cách đổi toàn bộ thành “suất tham gia”; giải thích ngắn ý nghĩa khi cần.

## 8. Workflow, rules và skill

Codex chịu trách nhiệm lựa chọn kỹ thuật, triển khai, tự kiểm tra, sửa lỗi, ghi giới hạn và bàn giao bằng chứng. Không yêu cầu chủ dự án duyệt từng dependency hoặc khoảng cách UI; tự xử lý lựa chọn có thể đảo ngược trong phạm vi đã chốt.

Dùng `AGENTS.md` ngắn và workflow sau; chưa cần skill riêng chỉ để lặp PREPARE. Khi một việc lặp lại đã có quy trình ổn định (visual regression, chuẩn bị demo), có thể đóng gói skill với đầu vào/đầu ra/lệnh kiểm tra/điều kiện dùng. Plugin/MCP theo nhu cầu, không là điều kiện phải cài đủ trước khi code.

### Workflow mỗi phần việc

1. Đọc `AGENTS.md`, `docs/STATUS.md`, phần PREPARE liên quan và thay đổi hiện có; không ghi đè công việc mới của chủ dự án.
2. Chọn kết quả kiểm chứng được, ví dụ tìm kiếm -> chi tiết giữ đúng filter; xác định tiêu chí và fixture.
3. Làm trọn luồng: dữ liệu, UI, tương tác, trạng thái rỗng/lỗi và responsive; tái dùng component.
4. Chạy check phù hợp, mở trình duyệt, chụp viewport cần thiết, so mẫu và sửa vấn đề nhìn thấy.
5. Cập nhật STATUS: đã làm, lệnh thực sự chạy/kết quả, bằng chứng, hạn chế, bước tiếp theo. Decision chỉ cho thay đổi đáng kể.
6. Bàn giao thay đổi/cách xem/bằng chứng/phần thiếu; không báo xong khi nút chính vô tác dụng hoặc chỉ mới build thành công.

### Rules đưa vào AGENTS.md khi scaffold

- Giữ phạm vi giai đoạn: NFT là tính năng đã được yêu cầu, ERC-1155 là chuẩn đã chốt. Demo mua NFT bằng mock trước; backend/admin/smart contract thật làm sau mốc nhà đầu tư đồng ý.
- Giữ chuẩn thiết kế đã chọn; không tự chuyển toàn hệ thống sang dark theme/style khác.
- Nút/link có hành vi hoặc disabled với lý do; không dùng `href="#"`/`alert()` thay chức năng hoàn chỉnh.
- Fixture tập trung; nội dung chưa có chứng cứ phải gọi đúng là mẫu/giả định.
- Component chia theo trách nhiệm, không tách vụn theo số dòng; không thêm dependency lớn khi primitive hiện có đủ dùng.
- Secret và quyền nằm phía server; client validation không thay server validation. Không đưa secret vào `NEXT_PUBLIC_*`, log, Git.
- Không thêm tầng tài liệu/công cụ/phê duyệt chỉ để quản lý chính chúng. Schema/token/test/docs cập nhật theo thay đổi thật.
- Không sửa PDF nguồn hoặc xóa ảnh gốc tùy tiện; file render/trích xuất tạm nằm ngoài source sản phẩm.

Dùng kho Git hiện có; scaffold chỉ kiểm tra/cập nhật `.gitignore` và lưu mốc cần thiết, không khởi tạo lại Git; không commit secret/build. Phí, đối tác, pháp lý, nhân sự vận hành thuộc chủ dự án; dùng giả định minh bạch cho demo để tiếp tục UI. Không phát sinh chi phí hoặc xuất bản thông tin ra ngoài phạm vi được cho phép.

## 9. Tiêu chí nghiệm thu demo

### Thị giác và trải nghiệm

- [ ] Giữ đặc trưng mẫu: header sáng, hero ảnh lớn, phân cấp chữ, vàng, CTA xanh, tìm kiếm nổi.
- [ ] Card/detail/video dùng chung thiết kế và dữ liệu; thông tin đất nền thay thông số biệt thự của mẫu.
- [ ] Không tràn ngang/cắt chữ ở 360/390/430/768/1440px; zoom 200% vẫn dùng được; bàn phím mobile không che form.
- [ ] Input có label, focus rõ, dùng bàn phím được; dialog/sheet giữ/trả focus và đóng đúng; lỗi gắn trường nhập.
- [ ] Mục tiêu tương phản chữ thường >= 4.5:1, chữ lớn >= 3:1; không dùng riêng màu để chỉ trạng thái; reduced motion.
- [ ] Có ảnh cùng viewport so mẫu desktop và ảnh kiểm tra chuyển thể mobile; không yêu cầu giống 100% khi đã đổi thương hiệu, tiếng Việt và nội dung.

### Chức năng

- [ ] Chạy hết kịch bản mục 4 bằng click/tap; deep link/reload/back giữ ngữ cảnh hợp lý.
- [ ] Filter, lưu/theo dõi, gửi/đổi/hủy yêu cầu mẫu và reset hoạt động; không báo gửi thật.
- [ ] Luồng NFT: chọn tài sản -> chọn số lượng -> xác nhận mua mô phỏng -> danh mục NFT hoạt động; tên tính năng ghi rõ NFT.
- [ ] Không mua 0/số âm/số lẻ/vượt tồn hoặc phương án đã dừng; tổng tiền/phí/tỷ lệ đúng; gửi trùng không tăng danh mục hai lần; hủy/lỗi không tạo NFT nắm giữ; reset khôi phục tất cả dữ liệu NFT.
- [ ] Không yêu cầu ví/tiền thật, không hiển thị giao dịch mock như đã được xác nhận trên Blockchain.
- [ ] Sold/paused không nhận lịch; consent theo từng yêu cầu; form thiếu/sai có hướng dẫn.
- [ ] Có loading/empty/error/not-found cần thiết, media fallback; không có console/hydration error chưa xử lý trên luồng chính.
- [ ] Kiểm tra Chromium/WebKit; máy thật iOS/Android khi có thiết bị. Giả lập WebKit không được ghi là đã thử iPhone thật.

### Kiểm tra kỹ thuật

Scaffold đã tạo script `lint`, `typecheck`, `test`, `test:e2e`, `build` và `check`. Trước mốc bàn giao chạy `pnpm check`: lint → typecheck → unit test → build → E2E trên production server. Cài trình duyệt lần đầu bằng `pnpm test:e2e:install`; nếu chạy E2E riêng thì build trước. Ghi kết quả thực tế trong `docs/STATUS.md`. Trong lúc phát triển chạy phần liên quan; không lặp toàn bộ khi không có thay đổi/nghi ngờ mới.

- Unit/integration: filter, format/validation, chuyển trạng thái, sold/paused, reset fixture; số lượng/tồn NFT, tổng tiền/phí, tỷ lệ phân đoạn và chống trùng đơn.
- E2E: tìm -> chi tiết -> lưu -> lịch -> xem lại; chuyên gia/consent; video -> đúng lô; wizard gửi duyệt; NFT -> chọn số lượng -> mua mô phỏng -> danh mục -> reload/reset.
- Visual regression cho home/card/detail ở viewport cố định sau khi baseline được kiểm tra; không cập nhật baseline máy móc để che lỗi.
- Accessibility scan kết hợp kiểm tra tay; không viết test chỉ kiểm class CSS hoặc sao chép logic triển khai.
- Đo build production, ghi thiết bị/mạng mô phỏng. Mục tiêu ban đầu Lighthouse mobile Performance >= 90, Accessibility >= 95 cho home/detail; lưu 3 lần chạy và điều tra chênh lệch. Điểm số không thay xem UI/thao tác thật.
- Mục tiêu vận hành: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 ở phân vị 75 khi có dữ liệu thật. Trước pilot chỉ có đo phòng thử; không báo đạt INP thực địa từ Lighthouse. Nguồn: [Web Vitals](https://web.dev/articles/vitals).

## 10. Backend, admin, Blockchain và điều kiện production

Chỉ triển khai sau mốc chuyển giai đoạn ở mục 2. Không nối Supabase thật chỉ để demo có vẻ hoàn thiện hơn.

### Thứ tự triển khai

1. Chốt pilot/hợp đồng dữ liệu: địa bàn, vai trò, nội dung công khai, chính sách lịch/chuyên gia/phí; schema, trạng thái, ma trận quyền.
2. Nền dữ liệu/auth: API Node.js trên Railway, PostgreSQL/Auth/Storage trên Supabase, migration/seed staging, auth server-side và audit; Next.js trên Vercel dùng adapter live. Backend xác minh danh tính/quyền của từng request; CORS theo origin cho phép không thay thế xác thực.
3. Nguồn hàng/admin nội dung: hồ sơ chuẩn, media, người đăng, hai đường nhận nguồn; duyệt/bổ sung/tạm dừng; nguồn chiến lược phải được người có thẩm quyền khác duyệt trước công khai.
4. Khách/điều phối: lưu/theo dõi, lịch/đổi/hủy, người dẫn, Sale, chuyển khách, chuyên gia; thông báo theo quy trình và đầu mối thật.
5. Giao dịch/đối soát: mốc và căn cứ; phí dự kiến/phải thu/đã xác minh thu; quyền lợi được duyệt/đã trả; báo cáo. Giá trị đất giao dịch, doanh thu dịch vụ và phần Xland giữ lại là các đại lượng riêng.
6. NFT trên testnet: Solidity ERC-1155, phương án phát hành, kết nối/chứng minh quyền kiểm soát ví, luồng thanh toán thử, mua NFT, danh mục và worker đồng bộ giao dịch; test smart contract/API/UI trước mainnet.
7. Pilot/củng cố: bật chức năng thật khi đạt điều kiện tương ứng; xem lỗi, phản hồi trễ, yêu cầu bỏ sót, chi phí và chất lượng trước mở rộng. Không bật bán NFT mainnet chỉ vì luồng đất nền truyền thống đã đạt.

### Admin web

UI admin bắt đầu ở `/admin` trong ứng dụng Next.js/Vercel, layout riêng; backend Node.js/Railway thực thi quyền. Module: hồ sơ/media, kiểm duyệt, khách/Sale, điều phối, chuyên gia, đối soát, báo cáo, tài khoản/quyền và NFT (phương án phát hành, tồn, đơn mua, giao dịch Blockchain, đối soát). Chỉ tách frontend admin khi có lý do cụ thể.

Quyền xét vai trò + địa bàn + phân công + thời hạn + đối tượng, không chỉ `isAdmin`. Bao gồm buyer, seller/publisher, Sale, người dẫn, đầu nguồn, CEO tỉnh, chuyên gia, kiểm duyệt, điều phối, kế toán, HĐQT, quản trị hệ thống. Một người có nhiều vai trò nhưng vẫn kiểm tra tách người nhập/người duyệt trên từng hồ sơ.

### Điều kiện riêng của NFT trước mainnet

- Smart contract ERC-1155 có quyền phát hành, giới hạn tổng NFT, kiểm soát chuyển nhượng/tạm dừng theo phương án; quản trị khóa bằng cơ chế có kiểm soát. Chốt chain, ví, kênh thanh toán và phí ở giai đoạn backend.
- Test phát hành/vượt giới hạn, số dư, chuyển, quyền operator và receiver; kiểm tra quyền admin, trường hợp lỗi và tấn công liên quan. Có kiểm toán độc lập trước giao dịch tài sản thật.
- Tách trạng thái đơn, thanh toán và Blockchain. Backend xác minh thanh toán qua nguồn đáng tin; receipt thành công và số xác nhận theo chain mới dùng để hoàn tất quyền nắm giữ. Không tin transaction hash do client gửi là bằng chứng đã mua.
- Worker xử lý sự kiện Blockchain theo cơ chế chống trùng, thử lại và phục hồi khi mất kết nối/reorg; database giữ bản đọc phục vụ UI, đối chiếu được với số dư on-chain. Không sửa số NFT trong database thay cho giao dịch hợp đồng.
- Chốt quyền gắn NFT, đơn vị quản lý tài sản, điều kiện bán/chuyển/thoái vốn và xử lý thanh toán thành công nhưng giao dịch NFT lỗi. Không công khai giấy tờ cá nhân hoặc dữ liệu khách lên Blockchain.

### Điều kiện mở live

- Supabase SSR đúng mô hình server/browser, xác minh danh tính server; không tin state UI. Nguồn: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs).
- RLS cho bảng qua Data API và policy Storage. Test đọc/ghi giữa hai người dùng, ngoài địa bàn, chưa phân công, đã thu hồi quyền. Nguồn: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Secret/service-role chỉ trên server; vượt RLS phải có kiểm tra quyền/audit; không dùng service-role làm đường tắt cho mọi request.
- Vị trí chính xác, giấy tờ, dữ liệu khách ở vùng private; truy cập có quyền/URL có hạn; cache không trộn dữ liệu tài khoản.
- Đổi giá/quyền/trạng thái/đầu mối/phân bổ phí có actor/time/reason. Transaction cho thay đổi liên quan, chống gửi trùng và cập nhật đồng thời.
- Validation server, rate limit theo rủi ro, upload kiểm loại/kích thước/quyền; log loại secret/PII không cần thiết.
- Migration thử staging; backup database và media, diễn tập restore, rollback app và kế hoạch sửa tiến khi schema đổi. Kiểm tra tính năng backup theo gói thực tế.
- Có theo dõi lỗi/uptime/độ trễ/dung lượng/ngân sách, người nhận và cách xử lý sự cố; chốt retention/xóa dữ liệu trước pilot.
- Loại bypass demo khỏi live. Kiểm tra lại auth/quyền/hành trình/vận hành sau nối dữ liệu thật; build thành công chưa đủ để gọi production ready.

## 11. Triển khai và phát hành

- Local demo chạy không cần Supabase/Railway/ví Blockchain. Deploy demo lên Vercel; chỉ cần tài khoản/quyền khi đến môi trường tương ứng, không ghi key trong tài liệu.
- Frontend Next.js deploy Vercel bằng production build và lockfile; có preview theo nhánh khi cấu hình Git remote/CI, smoke test sau deploy. UI admin cùng frontend; không chuyển toàn bộ Next.js sang Railway.
- Giai đoạn 3 thêm API Node.js trên Railway, bind `0.0.0.0`/port được cấp, healthcheck; worker đồng bộ Blockchain là tiến trình riêng khi cần. Cấu hình từng dịch vụ trong repo, `.env.example` chỉ chứa tên biến/giá trị mẫu an toàn; tách secret Vercel/Railway/Supabase.
- Tách demo/staging/production; Supabase staging/production riêng, testnet/mainnet riêng; không chạy fixture/reset lên live. Chọn region backend/database gần nhau; cấu hình vùng thực thi server Next.js phù hợp đường gọi API.
- Demo `noindex`; nếu cần hạn chế người xem dùng kiểm soát truy cập thật vì `noindex` không bảo vệ nội dung. SEO public catalog khi nội dung sẵn sàng.
- Mốc release bằng commit/tag, cấu hình, QA; quay về được bản demo tốt gần nhất. CI dùng lockfile và type/lint/test/build, không bỏ qua lỗi để deploy.
- Có local preview và media thiết yếu tại chỗ để dự phòng khi trình bày. PWA/offline đầy đủ chưa nằm trong demo; không hứa offline nếu chưa thử.

## 12. Quyết định kinh doanh trước pilot

Không chặn dựng UI bằng mock, nhưng cần chốt thật trước khi bật chức năng tương ứng:

| Quyết định | Trong demo | Thời điểm phải chốt |
| --- | --- | --- |
| Địa bàn, nguồn, người vận hành | Hồ sơ giả định có nhãn | Trước nhận hồ sơ/lịch thật |
| Quyền giới thiệu, kiểm duyệt, chia sẻ giấy tờ | Vai trò/trạng thái/phạm vi mẫu | Trước công khai nguồn thật |
| Phí xem đất/chuyên gia/dịch vụ, đổi/hủy/hoàn phí | Tình huống mẫu, không thu tiền | Trước cung cấp dịch vụ |
| CEO tỉnh, nguồn khách, phân chia quyền lợi | Chưa có thuật toán chia hoa hồng | Trước vận hành Sale/đối soát |
| Thương hiệu, media, tên đối tác | Có nguồn và nhãn minh họa | Trước công bố quan hệ/dữ liệu thật |
| NFT: quyền lợi, đơn vị quản lý, thanh toán, chuyển nhượng/thoái vốn | Phương án mẫu, mua NFT mô phỏng | Trước bán NFT thật; chuẩn ERC-1155 đã chốt, không phải quyết định còn mở |
| Vercel/Railway/Supabase/domain/ngân sách | Local trước, chuẩn bị config | Trước tạo dịch vụ có phí/phát hành môi trường của chủ dự án |

## 13. Việc tiếp theo và trạng thái

- [x] Đọc PREPARE cũ, toàn bộ PDF 14 trang và kiểm tra bốn ảnh.
- [x] Chốt đất nền + NFT phân đoạn, ERC-1155 ở backend, phong cách LUXEESTATE; frontend Vercel, Node.js/Railway và Supabase.
- [x] Viết lại phạm vi, lộ trình, workflow, tiêu chí demo và điều kiện production.
- [x] Xác nhận Git đã có, sử dụng tiếp kho hiện tại (`7acb455 — Initial commit`).
- [x] Khởi tạo Next.js/TypeScript/pnpm và script kiểm tra; ghi phiên bản chính xác.
- [x] Tạo `AGENTS.md`, `README.md`, `docs/STATUS.md`, `docs/DESIGN.md` đủ cho mốc 1A (đặc tả và workflow; chưa nghiệm thu giao diện).
- [x] Truy cập trực tiếp trang mẫu trong trình duyệt Codex để tham chiếu ngoài ảnh ban đầu.
- [ ] Lưu tham chiếu thiết kế bền vững, thử font Việt, tuyển ảnh chụp thật Pexels/Unsplash phù hợp và ghi `docs/ASSETS.md`.
- [ ] Dựng tokens/app shell/fixture; hoàn thành home/card/detail trên mobile/desktop.
- [ ] Đối chiếu trình duyệt, sửa thị giác, rồi triển khai các luồng mục 4.
- [ ] Hoàn thiện luồng mua NFT mô phỏng và danh mục NFT trong mốc 1B.
- [ ] Kiểm thử, đóng gói kịch bản và bản Vercel để trình nhà đầu tư.

**Mục tiêu vòng triển khai đầu tiên:** Next.js chạy được với trang chủ Xland và trang chi tiết lô đất đạt chất lượng theo mẫu, trên dữ liệu mẫu nhất quán. Chưa nối backend, chưa làm admin. Hiện mới có scaffold; các checklist chưa đánh dấu vẫn là việc tương lai, không phải kết quả kiểm thử đã đạt.
