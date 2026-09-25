"use client";

import { useState } from "react";
import type { Property } from "@/data/properties";
import { PropertyImage } from "./property-image";

export function PropertyGallery({ images, architecture = false }: { images: Property["images"]; architecture?: boolean }) {
  const [index, setIndex] = useState(0);
  const image = images[index]!;
  return <figure className="gallery"><div className={architecture ? "gallery-main gallery-main-architecture" : "gallery-main"}><PropertyImage key={image.src} src={image.src} alt={image.alt} sizes="(max-width: 1023px) 100vw, 1200px" preload />{images.length > 1 && <div className="gallery-controls"><button aria-label="Ảnh trước" onClick={() => setIndex((index + images.length - 1) % images.length)}>←</button><span aria-live="polite">{index + 1} / {images.length}</span><button aria-label="Ảnh tiếp theo" onClick={() => setIndex((index + 1) % images.length)}>→</button></div>}</div><figcaption>{image.caption}</figcaption>{images.length > 1 && <div className="gallery-thumbnails">{images.map((item, i) => <button key={item.src} aria-label={`Xem ảnh ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)}><PropertyImage src={item.src} alt="" sizes="110px" /></button>)}</div>}</figure>;
}
