import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let pluginsRegistered = false;

/**
 * Đảm bảo ScrollTrigger và useGSAP được đăng ký an toàn trên môi trường client một lần duy nhất.
 * Tuyệt đối không gọi document-wide selectors hay ScrollTrigger.killAll() tại đây.
 */
export function getGsap() {
  if (typeof window !== "undefined" && !pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    pluginsRegistered = true;
  }
  return { gsap, ScrollTrigger };
}

export { useGSAP, gsap, ScrollTrigger };
