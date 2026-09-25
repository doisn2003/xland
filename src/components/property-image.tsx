"use client";

import Image from "next/image";
import { useState } from "react";

export function PropertyImage({ src, alt, sizes, preload = false, className = "" }: { src: string; alt: string; sizes: string; preload?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="media-fallback" role="img" aria-label={alt}>Ảnh đang cập nhật</div> : <Image className={className} src={src} alt={alt} fill sizes={sizes} preload={preload} onError={() => setFailed(true)} />;
}
