"use client";

import { useRef, useState, type ReactNode } from "react";
import { getGsap, useGSAP } from "./gsap-core";

interface StoryImageRevealProps {
  children: ReactNode;
}

/**
 * Client island bọc khung ảnh trong section Xland story (#cach-hoat-dong).
 * Thực hiện hiệu ứng reveal nhẹ nhàng theo hợp đồng BRIEF E khi cuộn tới:
 * - Desktop (≥1024px): mask inset 8% -> 0% và scale 1.04 -> 1 trong 850ms.
 * - Mobile (<1024px): opacity 0.2 -> 1 và translateY 12px -> 0px trong 600ms.
 * - Reduced motion: giữ nguyên trạng thái tĩnh hoàn chỉnh.
 * - Deep link #cach-hoat-dong hoặc phần tử đã trong viewport: hiển thị ngay không làm trễ.
 */
export function StoryImageReveal({ children }: StoryImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [motionState, setMotionState] = useState<"initial" | "ready" | "completed">("initial");

  useGSAP(
    () => {
      const container = containerRef.current;
      const visual = visualRef.current;
      if (!container || !visual) return;

      const { gsap } = getGsap();

      // Kiểm tra xem trang có đang deep-link tới #cach-hoat-dong không
      const isDeepLink =
        typeof window !== "undefined" &&
        (window.location.hash === "#cach-hoat-dong" ||
          window.location.hash.includes("story"));

      // Kiểm tra nếu phần tử đã lọt vào viewport khi vừa mount
      const rect = container.getBoundingClientRect();
      const isAlreadyInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (isDeepLink || isAlreadyInViewport) {
        // Giữ trạng thái hiển thị ngay lập tức, không chạy lại animation từ ẩn
        gsap.set(visual, {
          clearProps: "all",
        });
        setMotionState("completed");
        return;
      }

      setMotionState("ready");

      const mm = gsap.matchMedia();

      // Desktop: ≥1024px và không có yêu cầu reduced-motion
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            visual,
            {
              clipPath: "inset(8% 8% 8% 8%)",
              scale: 1.04,
              opacity: 0.8,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              opacity: 1,
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
              onComplete: () => {
                setMotionState("completed");
                gsap.set(visual, { clearProps: "clipPath,scale,opacity" });
              },
            }
          );
        }
      );

      // Mobile: <1024px và không có yêu cầu reduced-motion
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            visual,
            {
              opacity: 0.2,
              y: 12,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
              onComplete: () => {
                setMotionState("completed");
                gsap.set(visual, { clearProps: "y,opacity" });
              },
            }
          );
        }
      );

      // Nhánh prefers-reduced-motion: reduce
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(visual, { clearProps: "all" });
        setMotionState("completed");
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="story-reveal-container"
      data-motion-island="story-image"
      data-motion-state={motionState}
    >
      <div ref={visualRef} className="story-reveal-visual">
        {children}
      </div>
    </div>
  );
}
