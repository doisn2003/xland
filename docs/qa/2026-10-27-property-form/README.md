# QA form lô đất — 27/10/2026

- `create-{360,390,430,768,1440}.png`: form tạo với switch nhiều lô ở đầu, chọn Quảng Ninh → Đặc khu Vân Đồn, một Loại đất, địa chỉ cũ tùy chọn. Dữ liệu QA riêng, không phải hồ sơ thật.
- Ảnh studio và Tổng quan user được cập nhật trong `../2026-10-27-subplots/`. Tổng quan có địa chỉ cũ và loại đất công nghiệp; studio có switch thống nhất với form tạo.
- Đã kiểm năm chiều rộng không tràn ngang, keyboard Space đổi switch mà không mất draft, reduced motion và Axe WCAG A/AA. Chụp từ đầu trang để fixed sidebar/skip-link không bị lệch trong full-page screenshot.
- E2E admin kiểm 34 tỉnh/thành, 54 xã/phường/đặc khu Quảng Ninh, tìm không dấu, chọn tỉnh khác xóa xã, POST tạo multi-estate mở studio, PATCH bật/tắt, lưu/xóa địa chỉ cũ qua reload và không làm tròn giá lớn.
- E2E user chạy Chromium desktop/mobile và WebKit mobile, kiểm địa chỉ cũ, loại đất công nghiệp, badge, cây lô, phân trang và điều hướng nhiều cấp. Đây là trình duyệt giả lập, không phải thiết bị vật lý.

`pnpm check`: lint/typecheck/build, 46 unit, 21/21 E2E đạt. `pnpm test:admin property-form.spec.ts subplots.spec.ts`: 2/2 đạt. Backend có 292 HTTP admin checks và 2 contract suites; Flutter có 42 test liên quan, analyze đạt. Chi tiết schema, nguồn địa giới và nâng cấp database tại [PROPERTY_FORM](../../../../../xland-server/docs/PROPERTY_FORM.md).

Smoke trực tiếp localhost:3000 sau migration/restart: POST tạo hồ sơ 201, PATCH bật/tắt 200/200, danh mục Quảng Ninh 54 xã/phường/đặc khu, website user hiển thị địa chỉ cũ. Hồ sơ probe chờ duyệt đã được xóa. Kết quả riêng tư ở `.local/property-form-smoke/result.json`, không đưa phiên đăng nhập/dữ liệu database vào Git.
