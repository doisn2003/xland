# Nguồn tài nguyên Xland

Cập nhật 25/09/2026. Quyết định mới của chủ dự án: **dùng ảnh chụp thật cho demo trình nhà đầu tư, không dùng ảnh AI**. Ưu tiên cảnh quan Việt Nam, màu tự nhiên, bộ ảnh có cùng bối cảnh; chất lượng và độ tin cậy quan trọng hơn vẻ hào nhoáng giả tạo.

## Ảnh đã tuyển

Ảnh tải từ trang nguồn Pexels có tác giả và giấy phép; bản nguồn tải về nằm trong `assets/media/stock/`, bản WebP phục vụ web ở `public/images/`. Không hotlink khi người dùng mở ứng dụng. Ảnh được nén/đổi định dạng, crop bằng CSS cho từng khung; không dùng AI sửa cảnh quan, không thêm ranh giới thửa đất.

| File | Nguồn / tác giả | Sử dụng |
| --- | --- | --- |
| `cam-ranh.webp` | [Pexels 37114134](https://www.pexels.com/photo/aerial-view-of-vietnamese-countryside-landscape-37114134/), Hữu Thịnh 79, trang nguồn ghi Cam Ranh, máy FC3582 | Hero, card nhà vườn và gallery bối cảnh Khánh Hòa |
| `cam-lam.webp` | [Pexels 35995797](https://www.pexels.com/photo/aerial-view-of-agricultural-landscape-in-vietnam-35995797/), Hữu Thịnh 79, trang nguồn ghi Cam Lâm, máy FC3582 | Card ven sông, phần giới thiệu NFT, gallery bối cảnh Khánh Hòa |
| `dong-bang.webp` | [Pexels 28055363](https://www.pexels.com/photo/aerial-view-of-rural-vietnamese-landscape-28055363/), HONG SON, cảnh quan nông thôn Việt Nam | Card và chi tiết hồ sơ đồng quê |
| `assets/media/stock/nha-trang.jpg` | [Pexels 37177938](https://www.pexels.com/photo/serene-beach-at-sunset-with-rocky-shoreline-37177938/), Hữu Thịnh 79 | Ứng viên đã tải; chưa đưa vào giao diện vì chưa cần bối cảnh biển |

Giấy phép: [Pexels License](https://www.pexels.com/license/), kiểm tra ngày 25/09/2026: cho phép dùng ảnh miễn phí và chỉnh sửa; không bắt buộc ghi công. Giữ công tác giả trong caption gallery/tài liệu để dễ truy vết. Không ngụ ý nhiếp ảnh gia, người hoặc tổ chức trong ảnh bảo chứng cho Xland; không bán lại ảnh riêng lẻ.

Các ảnh trên **không xác minh một lô đất đang bán**. Gallery ghi bối cảnh khu vực; hai ảnh Cam Lâm/Cam Ranh không được mô tả là hai góc chụp cùng thửa. Home có nhãn gọn “Bản demo · Dữ liệu mẫu”; footer và phần thông tin detail giải thích ảnh bối cảnh và dữ liệu giả định. Không dán nhãn “AI” lên ảnh vì ảnh AI không được dùng.

Khi có nguồn hàng đối tác, thay gallery bằng ảnh thực địa cùng tài sản, có quyền công bố và hồ sơ đi kèm. Không chuyển fixture thành hàng thật chỉ bằng bỏ nhãn demo.

WebP hiện có chiều rộng 1600–1920px, khoảng 353–442KiB cho ảnh lớn; Next Image tạo biến thể theo `sizes` để card/mobile không tải toàn bộ bản lớn. SHA-256 lưu tại [media-checksums.json](references/media-checksums.json). Cần đo payload thực tế khi nghiệm thu hiệu năng.

## Font

Nguồn: [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl). Tải TTF và OFL cho Cinzel, Josefin Sans, Noto Serif, Be Vietnam Pro để đối chiếu; lưu tại `docs/references/fonts/`.

- Kiểm cmap của chuỗi tiếng Việt trong DESIGN: Cinzel thiếu 10 ký tự, gồm các dấu Việt và ký hiệu ₫. Kết quả tại [glyph-check.json](references/fonts/glyph-check.json).
- Chốt **Noto Serif 500/600 + Be Vietnam Pro 400/500/600**; hai font đáp ứng chuỗi thử. Josefin Sans có glyph chuỗi thử nhưng chọn Be Vietnam Pro để UI tiếng Việt đồng nhất với cặp dự phòng đã định.
- Font phục vụ web là WOFF2 local trong `src/app/fonts/`, dùng `next/font/local`; không yêu cầu tải Google Fonts khi build hoặc khi người xem mở demo. Giữ OFL bên cạnh font.
- Subset giữ Latin, Vietnamese U+1E00–1EFF, dấu câu và ký hiệu ₫; công cụ chuyển đổi fontTools 4.66.0/Brotli 1.2.0, không phải dependency runtime của website.
- Đã xem chữ Việt trên home/detail ở desktop/mobile; kiểm tra zoom và các weight nằm trong vòng QA 1A. Glyph coverage không tự chứng minh mọi tình huống hiển thị đều đạt.

## Tham chiếu thiết kế

- `docs/references/luxeestate-desktop.png`: full page mẫu tại viewport yêu cầu 1440×1000.
- `docs/references/luxeestate-mobile.png`: full page mẫu tại viewport yêu cầu 390×844.
- Nguồn [uupm.cc/demo/real-estate](https://uupm.cc/demo/real-estate), lưu 25/09/2026 qua trình duyệt Codex. Chỉ làm tài liệu tham khảo, không phục vụ các ảnh này như media Xland.

Ảnh AI từng thử đã loại khỏi thư mục public trước khi triển khai UI. Bốn JPG gốc/PDF của chủ dự án giữ nguyên. Video sẽ tuyển footage thật ở mốc 1B, chưa có video hoặc quyền footage nào được ghi nhận là hoàn thành.
