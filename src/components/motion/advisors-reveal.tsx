"use client";

import { useRef, type ReactNode } from "react";
import { getGsap, useGSAP } from "./gsap-core";

interface AdvisorsRevealProps {
  children: ReactNode;
}

/**
 * Scene 4: Chuyên viên đồng hành (Advisors Reveal)
 * - Chân dung và thẻ xuất hiện nhẹ cùng nhau, stagger ngắn (≤70ms desktop, ≤50ms mobile).
 * - Tên và CTA luôn có thể focus được, không vô hình hay bị che khuất.
 * - Không làm phóng to mạnh, không flip card.
 * - Sau khi reveal hoàn tất, lập tức gọi clearProps("all") để trả lại quyền
 *   điều khiển transform & shadow cho CSS :hover và :focus-visible.
 */
export function AdvisorsReveal({ children }: AdvisorsRevealProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>("[data-advisor-card]");
      if (!cards.length) return;

      const { gsap } = getGsap();

      // Kiểm tra deep link hoặc phần tử đã qua viewport
      const isDeepLink =
        typeof window !== "undefined" &&
        (window.location.hash === "#nguoi-dong-hanh" ||
          window.location.hash.includes("advisor") ||
          window.location.hash.includes("dong-hanh"));

      const rect = grid.getBoundingClientRect();
      const isAlreadyInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (isDeepLink || isAlreadyInViewport) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: ≥1024px
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const { ScrollTrigger } = getGsap();
          ScrollTrigger.create({
            trigger: grid,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                cards,
                { opacity: 0.4, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.07,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.set(cards, { clearProps: "all" });
                  },
                }
              );
            },
          });
        }
      );

      // Mobile: <1024px
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const { ScrollTrigger } = getGsap();
          ScrollTrigger.create({
            trigger: grid,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                cards,
                { opacity: 0.5, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.05,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.set(cards, { clearProps: "all" });
                  },
                }
              );
            },
          });
        }
      );

      // Reduced motion: hiển thị nguyên bản lập tức
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { clearProps: "all" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: gridRef }
  );

  return (
    <div ref={gridRef} className="advisors-grid" data-advisors-grid>
      {children}
    </div>
  );
}
