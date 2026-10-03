# Bằng chứng nghiệm thu P08 — Biên đạo GSAP cho Home Xland (4 Motion Scenes)

Mốc thực hiện: **P08 (Home Motion Choreography)**  
Thời gian: 04/10/2026  
Môi trường test: Node.js, Next.js 16.3.6 (Turbopack), Vitest, Playwright (Chromium Desktop & Mobile)  
Nền tảng kỹ thuật: GSAP 3.15.0 & ScrollTrigger qua Client Islands scoped  
Trang chủ: `http://127.0.0.1:3100/`

---

## 1. Tóm tắt Biên đạo 4 Scenes (Motion Matrix)

| Scene | Thành phần (Node) | Kích hoạt (Start/Trigger) | Desktop (≥1024px) | Mobile (<1024px) | Reduced Motion | Thời lượng / Stagger | Cleanup |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Scene 1: Hero** | `.hero-photo` (ảnh nền) | Ngay khi ảnh sẵn sàng trong viewport | Scale nhẹ `1.04 → 1`, opacity `0.85 → 1` | Scale `1.025 → 1`, opacity `0.9 → 1` | Tĩnh, scale `1`, không tween | 850ms desktop, 700ms mobile. Ease: `power2.out`. | `clearProps: "all"` khi xong. Nếu đã cuộn qua hoặc late load thì bỏ tween. Text LCP & CTA không delay. |
| **Scene 2: Xland Story** | - Khung ảnh `.story-media-frame`<br/>- 3 bước `.story-step-item` | Top chạm `85%` viewport (ScrollTrigger) | - Ảnh: mask inset `8% → 0%`, scale `1.04 → 1`<br/>- 3 bước: fade-up `y: 16px → 0`, stagger `80ms` | - Ảnh: fade-up nhẹ `y: 12px → 0`<br/>- 3 bước: fade-up `y: 12px → 0`, stagger `50ms` | Tĩnh hoàn toàn, `transform: none` | - Ảnh: 850ms desktop, 600ms mobile<br/>- 3 bước: 550ms (tổng nhóm ≤600ms) | `clearProps: "all"` ngay sau khi hoàn tất. Nút CTA bên dưới độc lập, không delay. |
| **Scene 3: NFT Story** | - Khung ảnh `.nft-media-frame`<br/>- Parallax lớp ảnh desktop<br/>- 3 bước quy trình `[data-nft-step]` | Top chạm `88%` viewport (ScrollTrigger) | - Ảnh reveal 1 lần: scale `1.05 → 1`<br/>- Parallax ảnh: `y: -10px → +10px` (biên độ ≤20px, `scrub: 0.5`)<br/>- 3 bước flow: fade-up `y: 14px → 0`, stagger `80ms` | - Ảnh reveal: scale `1.025 → 1`<br/>- KHÔNG parallax, KHÔNG scrub<br/>- 3 bước: fade-up `y: 10px → 0`, stagger `50ms` | Tĩnh hoàn toàn, không scrub, không parallax | - Reveal ảnh: 750ms desktop, 500ms mobile<br/>- 3 bước: 500ms desktop, 400ms mobile | `clearProps: "all"`. Nền & tiêu đề tĩnh; bảng số liệu, tổng cung, đơn giá, tỷ lệ phân đoạn luôn là số cuối (không count-up). |
| **Scene 4: Chuyên viên** | 3 thẻ chuyên viên `.advisor-card` | Top chạm `85%` (desktop) / `88%` (mobile) viewport | Thẻ và chân dung xuất hiện cùng nhau, fade-up `y: 16px → 0`, stagger `70ms` | Fade-up nhẹ `y: 10px → 0`, stagger `50ms` | Tĩnh hoàn toàn, hiển thị ngay | 500ms desktop, 400ms mobile. Ease: `power2.out`. | `clearProps: "all"` ngay khi xong để trả lại 100% quyền điều khiển cho CSS `:hover` (`translateY(-2px)`, `box-shadow`) và `:focus-visible`. |

---

## 2. Đo đạc Hiệu năng & So sánh P06 / P07 / P08

Dữ liệu trích xuất từ `docs/qa/ui-upgrade/P08/trace-summary.json` và Playwright Performance Traces:

| Tiêu chí | P06 (Tĩnh không GSAP) | P07 (1 Reveal thử nghiệm) | P08 (4 Scenes biên đạo đầy đủ) | Đánh giá |
| :--- | :--- | :--- | :--- | :--- |
| **Long Task Count (>50ms)** | 0 | 0 | **0** | ĐẠT: Không có long task CPU blocker nào khi cuộn qua cả 4 scenes. |
| **Max Long Task Duration** | 0ms | 0ms | **0ms** | ĐẠT: Quá trình render và tween hoàn toàn nằm dưới 16.6ms frame budget. |
| **DOMContentLoaded** | ~35ms | ~36ms | **34ms (1440px) / 35ms (390px)** | ĐẠT: Server Component render tức thì. |
| **Trang chủ JS Bundle nén** | ~593 KB | ~641 KB | **~643 KB** | ĐẠT: Tăng vỏn vẹn ~2 KB so với P07 nhờ tái sử dụng chung `gsap-core` adapter. |
| **Route Nghiệp vụ (`/lich-hen`)** | 0 KB GSAP | 0 KB GSAP | **0 KB GSAP** | ĐẠT: Hoàn toàn cô lập, không tải một dòng code GSAP nào vào các luồng form/giao dịch. |

---

## 3. Video & Ảnh chụp Nghiệm thu

Thư mục lưu trữ: `docs/qa/ui-upgrade/P08/` kèm [metadata.json](./metadata.json):

### Video chuyển động thật:
- `p08-home-motion-flow.webm`: Video quay lại quá trình cuộn từ Hero xuống qua Xland Story, NFT Story, Chuyên viên và cuộn ngược lại. Thể hiện nhịp vào/ra mượt mà, không giật layout, không nháy trắng.

### Danh mục ảnh chụp kiểm thử:
1. **Scene 1 (Hero settle)**:
   - `p08-hero-1440.png`, `p08-hero-768.png`, `p08-hero-430.png`, `p08-hero-390.png`, `p08-hero-360.png`
2. **Scene 2 (Xland Story)**:
   - `p08-story-1440.png`, `p08-story-768.png`, `p08-story-430.png`, `p08-story-390.png`, `p08-story-360.png`
3. **Scene 3 (NFT Story)**:
   - `p08-nft-1440.png`, `p08-nft-768.png`, `p08-nft-430.png`, `p08-nft-390.png`, `p08-nft-360.png`
4. **Scene 4 (Chuyên viên)**:
   - `p08-advisors-1440.png`, `p08-advisors-768.png`, `p08-advisors-430.png`, `p08-advisors-390.png`, `p08-advisors-360.png`
5. **Các trường hợp đặc biệt**:
   - `p08-reduced-motion-advisors-1440.png`: Bật `prefers-reduced-motion: reduce`, toàn bộ thẻ tĩnh không hiệu ứng.
   - `p08-deeplink-nft-1440.png`: Truy cập trực tiếp qua hash `/#nft`, media và bảng phân đoạn hiển thị trọn vẹn ngay tức thì.
   - `p08-zoom200-story-1440.png`: Zoom 200% không vỡ layout, các bước vẫn giữ tính mạch lạc.

---

## 4. Kết quả Kiểm thử Tự động

- **Vitest Unit Tests**: `46/46 passed (100%)`.
- **ESLint & TypeScript**: `0 error, 0 warning`.
- **Next.js Production Build**: `25/25 routes compiled successfully`.
- **Playwright E2E Suite**:
  - `tests/e2e/motion.spec.ts`: **22/22 tests passed (100%)** trên cả Desktop và Mobile Chromium.
  - `tests/e2e/accessibility.spec.ts`: **6/6 tests passed (100%)** (WCAG AA color contrast, keyboard tab stop, 200% CSS zoom).
  - `tests/e2e/scaffold.spec.ts`: **20/20 tests passed (100%)** (filter, empty state, detail navigation, 404, fallback).

---

## 5. Chẩn đoán & Quản lý Scene (Handoff)

Mỗi scene được cấu trúc thành một Client Island độc lập trong thư mục `src/components/motion/`:
- `hero-settle.tsx`: Scene 1 (Hero)
- `story-steps-reveal.tsx`: Scene 2 (Xland Story Steps)
- `story-image-reveal.tsx`: Scene 2 (Xland Story Media Mask)
- `nft-story-motion.tsx`: Scene 3 (NFT Story Media + Parallax + Flow)
- `advisors-reveal.tsx`: Scene 4 (Chuyên viên Grid)

**Cách tắt tạm thời để chẩn đoán (nếu cần gỡ lỗi):**
Các component trên đều bọc các phần tử con dưới dạng `children`. Nếu cần tắt một scene nào đó để cô lập lỗi, chỉ cần gỡ thẻ bọc ngoài hoặc truyền cờ nội bộ (không tạo cờ UI công khai làm người dùng bối rối). Toàn bộ nội dung bên trong vẫn render là Server Component với `opacity: 1` hoàn chỉnh.
