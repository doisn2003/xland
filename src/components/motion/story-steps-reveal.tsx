"use client";

import { useRef, type ReactNode } from "react";
import { getGsap, useGSAP } from "./gsap-core";

interface StoryStepsRevealProps {
  children: ReactNode;
}

/**
 * Scene 2: Xland Story Steps Reveal
 * - Ba bước (01, 02, 03) xuất hiện theo nhóm với stagger nhỏ (≤60ms mobile, ≤80ms desktop).
 * - Tổng thời gian ngắn (≤600ms), không làm trễ thao tác của người dùng.
 * - Nút CTA bên dưới không bị delay.
 * - Tự dọn dẹp bằng clearProps khi hoàn tất; không ảnh hưởng tab-stop hay focus ring.
 */
export function StoryStepsReveal({ children }: StoryStepsRevealProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;

      const items = list.querySelectorAll<HTMLElement>("[data-story-step]");
      if (!items.length) return;

      const { gsap } = getGsap();

      // Kiểm tra deep-link hoặc element đã trong viewport
      const isDeepLink =
        typeof window !== "undefined" &&
        (window.location.hash === "#cach-hoat-dong" ||
          window.location.hash.includes("story"));

      const rect = list.getBoundingClientRect();
      const isAlreadyInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (isDeepLink || isAlreadyInViewport) {
        gsap.set(items, { clearProps: "all" });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: ≥1024px
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const { ScrollTrigger } = getGsap();
          ScrollTrigger.create({
            trigger: list,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                items,
                { opacity: 0.35, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.set(items, { clearProps: "all" });
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
            trigger: list,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                items,
                { opacity: 0.45, y: 12 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.45,
                  stagger: 0.05,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.set(items, { clearProps: "all" });
                  },
                }
              );
            },
          });
        }
      );

      // Reduced motion: hiển thị đầy đủ ngay
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(items, { clearProps: "all" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: listRef }
  );

  return (
    <ol ref={listRef} className="story-steps" data-story-steps>
      {children}
    </ol>
  );
}
