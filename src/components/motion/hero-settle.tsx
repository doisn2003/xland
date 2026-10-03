"use client";

import { useRef, type ReactNode } from "react";
import { getGsap, useGSAP } from "./gsap-core";

interface HeroSettleProps {
  children: ReactNode;
}

/**
 * Scene 1: Hero Image Settle
 * - Chữ và CTA hiển thị tĩnh ngay từ đầu (không chạm vào text LCP).
 * - Chỉ ảnh nền settle scale nhẹ từ 1.04 (desktop) hoặc 1.025 (mobile) về 1 trong 750-850ms.
 * - Nếu người dùng đã cuộn qua hoặc bật reduced motion: giữ tĩnh hoàn toàn.
 * - Tự dọn dẹp bằng clearProps khi hoàn tất; không lặp tween khi điều hướng Back.
 */
export function HeroSettle({ children }: HeroSettleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const photo = photoRef.current;
      if (!container || !photo) return;

      // Nếu người dùng đã cuộn xuống khỏi hero, hoặc mở trang ở vị trí cuộn khác 0
      if (typeof window !== "undefined" && window.scrollY > 80) {
        return;
      }

      const { gsap } = getGsap();
      const mm = gsap.matchMedia();

      // Desktop: ≥1024px và không có reduced-motion
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            photo,
            { scale: 1.04 },
            {
              scale: 1,
              duration: 0.85,
              ease: "power2.out",
              clearProps: "scale",
            }
          );
        }
      );

      // Mobile: <1024px và không có reduced-motion
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            photo,
            { scale: 1.025 },
            {
              scale: 1,
              duration: 0.75,
              ease: "power2.out",
              clearProps: "scale",
            }
          );
        }
      );

      // Reduced motion: tĩnh hoàn chỉnh
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(photo, { clearProps: "all" });
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
      className="hero-motion-container"
      data-motion-scene="hero"
    >
      <div ref={photoRef} className="hero-motion-photo">
        {children}
      </div>
    </div>
  );
}
