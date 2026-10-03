"use client";

import { useRef, type ReactNode } from "react";
import { getGsap, useGSAP } from "./gsap-core";

interface NftStoryMotionProps {
  children: ReactNode;
}

/**
 * Scene 3: NFT Story Motion
 * - Nền / heading tĩnh; media reveal một lần duy nhất.
 * - Sơ đồ 3 bước (data-nft-step) xuất hiện theo nhóm với stagger ngắn (≤80ms).
 * - Desktop: parallax nhẹ (≤24px) trên lớp ảnh riêng trong khung overflow: hidden.
 * - Mobile / Reduced motion: KHÔNG scrub, KHÔNG parallax.
 * - Con số / specs grid / button CTA luôn tĩnh, không count-up hay delay.
 * - Tự dọn dẹp bằng clearProps khi hoàn tất.
 */
export function NftStoryMotion({ children }: NftStoryMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mediaFrame = container.querySelector<HTMLElement>(".nft-media-frame");
      const mediaImg = container.querySelector<HTMLElement>(".nft-media-frame img");
      const flow = container.querySelector<HTMLElement>("[data-nft-flow]");
      const steps = container.querySelectorAll<HTMLElement>("[data-nft-step]");

      const { gsap } = getGsap();

      // Kiểm tra deep link hoặc phần tử đã qua viewport
      const isDeepLink =
        typeof window !== "undefined" &&
        (window.location.hash === "#nft" || window.location.hash.includes("nft"));

      const rect = container.getBoundingClientRect();
      const isAlreadyInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (isDeepLink || isAlreadyInViewport) {
        if (mediaImg) gsap.set(mediaImg, { clearProps: "all" });
        if (steps.length) gsap.set(steps, { clearProps: "all" });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop: ≥1024px và không bật reduced motion
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const { ScrollTrigger } = getGsap();

          // 1. Media reveal một lần khi frame vào tầm nhìn
          if (mediaFrame && mediaImg) {
            ScrollTrigger.create({
              trigger: mediaFrame,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.fromTo(
                  mediaImg,
                  { scale: 1.05, opacity: 0.7 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.out",
                  }
                );
              },
            });

            // 2. Parallax nhẹ trên desktop (biên độ ≤20px, scrub mượt)
            gsap.fromTo(
              mediaImg,
              { y: -10 },
              {
                y: 10,
                ease: "none",
                scrollTrigger: {
                  trigger: container,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              }
            );
          }

          // 3. Flow 3 bước stagger nhẹ
          if (flow && steps.length) {
            ScrollTrigger.create({
              trigger: flow,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.fromTo(
                  steps,
                  { opacity: 0.35, y: 14 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.set(steps, { clearProps: "all" });
                    },
                  }
                );
              },
            });
          }
        }
      );

      // Mobile: <1024px
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const { ScrollTrigger } = getGsap();

          // 1. Media reveal gọn, không parallax
          if (mediaFrame && mediaImg) {
            ScrollTrigger.create({
              trigger: mediaFrame,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.fromTo(
                  mediaImg,
                  { scale: 1.025, opacity: 0.8 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.set(mediaImg, { clearProps: "all" });
                    },
                  }
                );
              },
            });
          }

          // 2. Flow 3 bước stagger gọn
          if (flow && steps.length) {
            ScrollTrigger.create({
              trigger: flow,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.fromTo(
                  steps,
                  { opacity: 0.45, y: 10 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.set(steps, { clearProps: "all" });
                    },
                  }
                );
              },
            });
          }
        }
      );

      // Reduced motion: giữ nguyên trạng thái tĩnh hoàn toàn
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (mediaImg) gsap.set(mediaImg, { clearProps: "all" });
        if (steps.length) gsap.set(steps, { clearProps: "all" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="nft-story-motion-root">
      {children}
    </div>
  );
}
