# P00 — Đóng baseline trước khi sửa giao diện

Đầu ra: một baseline tái lập và danh sách rủi ro, không redesign. Phụ thuộc: không. Đọc chung: [BRIEF](../BRIEF.md). Sao chép prompt dưới đây vào phiên triển khai.

```text
Bạn tiếp tục Xland tại D:\Xproject\Xland. Thực hiện duy nhất P00 của docs/UI-UPGRADE.md. Mục tiêu là tạo baseline hiện tại để mọi thay đổi thẩm mỹ sau này có thể đối chiếu và không phá các luồng 1B.

ĐỌC TRƯỚC
- AGENTS.md, PREPARE.md; phần hiện tại và giới hạn WebKit trong docs/STATUS.md.
- docs/UI-UPGRADE.md, docs/ui-upgrade/BRIEF.md, RESEARCH.md, HANDOFF.md.
- package.json, playwright.config.*; scripts/capture-ui.mjs, capture-1b.mjs, probe-webkit.mjs; tests/e2e theo hành trình cần chụp.
- Đọc các vùng tương ứng trong app/page.tsx, globals.css, layout/header và features thay vì nạp toàn bộ source.

PHẠM VI
Được tạo/cập nhật script capture nhỏ khi script hiện có thiếu metadata và docs/qa/ui-upgrade/P00/, HANDOFF, STATUS. Không đổi UI, token, fixture nghiệp vụ, dependency, test project hoặc assertion để làm baseline đẹp. Giữ toàn bộ thay đổi sẵn có của chủ dự án.

THỰC HIỆN
1. Ghi git branch/HEAD/status, phiên bản runtime/pnpm thực dùng, cách chạy production local và URL. Nếu port 3200 là server cũ, xác minh bản build trước khi dùng; không dừng tiến trình không thuộc công việc này. Baseline phải khớp commit/working tree được ghi.
2. Đối chiếu route và CTA: /, /lo-dat, /lo-dat/goc-pho-long-bien, một hồ sơ NFT, /da-luu, /lich-hen, /nft, /nft/[slug] thật lấy từ fixture, /danh-muc-nft, /trai-nghiem. Ghi các anchor cach-hoat-dong, nft, nguoi-dong-hanh, ho-tro và nơi gọi chúng.
3. Chụp home ở 360/390/430/768/1440px, cả trang và crop có ngữ cảnh hero, Xland, NFT, chuyên viên. Chụp detail đô thị + detail NFT tại 390/1440. Dùng script 1B hiện có hoặc bổ sung tối thiểu để ghi lại các màn chức năng; tái sử dụng bằng chứng cũ chỉ khi ghi rõ ngày/commit và xác nhận chưa đổi.
4. Chờ font/ảnh và state seed có chủ ý trước capture. Mỗi ảnh ghi route, viewport yêu cầu/innerWidth/clientWidth/scrollWidth, browser, reducedMotion, state và commit. Không snapshot ngẫu nhiên lúc localStorage chưa hydrate. Dùng browser context riêng, không reset dữ liệu của người dùng đang xem.
5. Ghi hiện trạng logo/icon/button, crop, bố cục Xland/NFT/avatar; mỗi vấn đề phải chỉ ra element/file và ảnh minh chứng. Không ghi các nhận xét chung như “chưa premium” mà không có vị trí cần sửa.
6. Chạy pnpm check để xác nhận nền hiện tại. Đối chiếu lịch sử 42 unit và 74/81 E2E, không giả định các số này vẫn đúng. Nếu lỗi, phân nhóm regression thực, test chưa ổn định, lỗi môi trường; lưu báo cáo gọn, trace tạm giữ gitignored.
7. Nếu WebKit vẫn sai viewport, chạy probe HTML tối giản và trang Xland, ghi số đo. Có thể dùng môi trường sẵn có khác để đối chứng; không thay DPI toàn máy, sửa overflow hoặc đổi iPhone project thành desktop. Chưa giải quyết được thì ghi blocker, không lặp vô hạn. P00 có thể hoàn tất việc ghi baseline với blocker rõ; P09 vẫn chưa được nghiệm thu khi gate đó mở.

ĐIỀU KIỆN ĐẠT
- Có ảnh baseline mới đã xem, metadata tái lập và danh sách điểm cần sửa có ưu tiên.
- Kết quả check thực tế có số đạt/lỗi; không đánh dấu các bài không chạy là đạt.
- Không có thay đổi giao diện/fixture/package ngoài phạm vi.
- Ghi mối liên hệ dữ liệu: PropertyExplorer/query; SaveButton/journey store; visit form/model; NFT catalog/purchase/model/store. Đây là các biên không viết lại trong phase thẩm mỹ.

BÀN GIAO
Tạo README tại docs/qa/ui-upgrade/P00/ nêu baseline, test, ảnh và blocker. Cập nhật HANDOFF với 3–6 file P01 cần đọc đầu tiên và STATUS với kết quả thật. Đọc git diff và chạy git diff --check. Kết thúc bằng kết quả, file bằng chứng, giới hạn và bước P01; không tự thực hiện P01 hay tuyên bố hoàn tất 1B.
```
