"use client";

import Image from "next/image";
import { useState } from "react";

export function PropertyImage({ src, alt, sizes, preload = false, className = "" }: { src: string; alt: string; sizes: string; preload?: boolean; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isFailed = failedSrc === src;

  return isFailed ? (
    <div className={`media-fallback ${className}`} role="img" aria-label={alt}>
      Ảnh đang cập nhật
    </div>
  ) : (
    <Image
      className={className}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={preload}
      onError={() => setFailedSrc(src)}
    />
  );
}
