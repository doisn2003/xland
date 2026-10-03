# Bằng chứng nghiệm thu P07 — Nền GSAP an toàn cho React và Mobile

Mốc thực hiện: **P07 (Motion Foundation & Safe Client Island)**  
Thời gian: 04/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Vitest, Playwright (Chromium Desktop & Mobile)  
Phiên bản cài đặt chính xác: `gsap@3.15.0`, `@gsap/react@2.1.2` (pnpm `--save-exact`)  
Commit cơ sở: `63b7380` (sau P06)  

---

## 1. Hạng mục Triển khai & Kết quả Kỹ thuật

| Hạng mục | Chi tiết thực thi | Kết quả thị giác & kỹ thuật |
| :--- | :--- | :--- |
| **Cài đặt Dependency** | `pnpm add --save-exact gsap@3.15.0 @gsap/react@2.1.2`. Tuyệt đối không sinh lockfile của npm/yarn, không dùng ký tự `^` hay `~`. | ĐẠT: Ghi nhận chính xác phiên bản `gsap@3.15.0` (chuẩn GreenSock license) và `@gsap/react@2.1.2`. |
| **Module Motion Client** | Tạo `src/components/motion/gsap-core.ts` quản lý plugin đăng ký một lần an toàn; `src/components/motion/use-reduced-motion.ts` dùng `useSyncExternalStore` chuẩn React 19 để bắt media query `prefers-reduced-motion`. | ĐẠT: Không ném hydration warning, không cascading render, dọn dẹp listener tự động khi unmount. |
| **Client Island Scoped** | Tạo component `StoryImageReveal` tại `src/components/motion/story-image-reveal.tsx`, bọc khung ảnh trong Server Component `xland-story.tsx`. Dùng `useGSAP` với `scope: containerRef` và `gsap.matchMedia()`. | ĐẠT: Chỉ bọc phần ảnh, giữ nguyên nội dung văn bản/tiêu đề/link render Server Component từ đầu, không `ssr: false` cho toàn section. |
| **Kịch bản Reveal Thử nghiệm** | - **Desktop (≥1024px)**: Mask `inset(8% 8% 8% 8%) → inset(0% 0% 0% 0%)`, scale `1.04 → 1`, thời lượng 850ms, ease `power2.out`.<br/>- **Mobile (<1024px)**: Opacity `0.2 → 1`, translateY `12px → 0`, thời lượng 600ms, ease `power2.out`.<br/>- **Reduced Motion**: Bỏ toàn bộ mask/transform, giữ nguyên bản tĩnh cuối.<br/>- **Deep-link `#cach-hoat-dong` / đã trong viewport**: Hiển thị ngay lập tức không trễ. | ĐẠT: Chuyển động mượt mà, kết thúc bằng `clearProps`, không để lại stale inline styles. |
| **Progressive Enhancement** | CSS mặc định trong `globals.css` là `opacity: 1`, hiển thị bình thường khi tắt JS hoặc lỗi tải script. Không có `display: none` hay `opacity: 0` tĩnh trong stylesheet. | ĐẠT: Nội dung marketing và ảnh luôn đọc được dù JS bị ngắt. |
| **Cô lập Bundle (Code Splitting)** | Module motion chỉ được tải khi truy cập trang Home. Các route nghiệp vụ (`/lich-hen`, `/nft/[slug]`, `/da-luu`, `/trai-nghiem`) không import GSAP. | ĐẠT: Test Playwright xác nhận route `/lich-hen` tải 0 script liên quan đến GSAP motion island. |

---

## 2. Đo đạc Baseline & JS Delta

- **Kích thước JS tải trang (Production Build đo bằng Playwright Network Tracker):**
  - **Trang chủ (`/`)**: ~641.83 KB JS nén (chứa GSAP + ScrollTrigger + Story island). Delta JS tăng ~48 KB so với baseline không có motion (nằm trong giới hạn cho phép ≤60 KB của BRIEF F).
  - **Trang Lịch hẹn (`/lich-hen`)**: ~703.98 KB JS nén (chứa logic form/store/journey, **hoàn toàn 0 KB GSAP**).

---

## 3. Ảnh chụp Nghiệm thu (5 Ảnh có Metadata)

Lưu trữ tại `docs/qa/ui-upgrade/P07/` kèm [metadata.json](./metadata.json):

1. `p07-story-reveal-1440.png`: Khung ảnh Xland Story trên Desktop 1440px sau khi reveal mask hoàn tất, sắc nét, không vỡ layout.
2. `p07-story-reveal-390.png`: Khung ảnh Xland Story trên Mobile 390px hoàn tất fade-up 600ms, căn chỉnh gọn gàng.
3. `p07-story-reduced-motion-1440.png`: Khi bật `prefers-reduced-motion: reduce`, ảnh tĩnh hiển thị ngay lập tức, `transform = none`.
4. `p07-story-deeplink-1440.png`: Khi truy cập trực tiếp `/#cach-hoat-dong`, ảnh hiển thị ngay tức thì, không bị nhấp nháy từ trạng thái ẩn.
5. `p07-story-zoom200.png`: Giao diện tại 1440px phóng to 200% CSS zoom, khung ảnh và layout co giãn đúng container, không tràn ngang.

---

## 4. Kết quả Kiểm thử Tự động

- **Vitest Unit Tests**: `4/4 test files passed, 46/46 tests passed (100%)`:
  - `nft.test.ts`: 13 tests.
  - `journey.test.ts`: 22 tests.
  - `home.test.ts`: 8 tests.
  - `motion.test.ts`: 3 tests (kiểm tra GSAP core registration, SSR an toàn của StoryImageReveal, semantic HTML của XlandStory).
- **ESLint & TypeScript**: `0 error, 0 warning`.
- **Next.js Production Build**: `25/25 routes compiled successfully`.
- **Playwright E2E Suite**:
  - `motion.spec.ts`: **10/10 tests passed (100%)** trên cả Desktop và Mobile Chromium (test scroll reveal, deep link, reduced motion, route back-and-forth 5 lần, và cô lập bundle route nghiệp vụ).
  - Toàn bộ suite 54 tests E2E trước đó tiếp tục đạt 100%.

---

## 5. Kết luận & Ranh giới

- Phase P07 đã hoàn thành xuất sắc việc thiết lập nền tảng GSAP an toàn, hiện đại theo đúng tiêu chuẩn React 19 / Next.js Server Components.
- Đúng theo yêu cầu ràng buộc: **Chỉ reveal thử một ảnh tại Xland story**, tuyệt đối **không animate các section còn lại trước Phase P08**.
