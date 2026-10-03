"use client";

import Image from "next/image";
import { useState } from "react";
import { type Advisor, getAdvisorById, getAdvisorByName } from "@/data/advisors";

export type AvatarSize = "sm" | "md" | "lg" | "portrait";

export interface AvatarProps {
  advisor?: Partial<Advisor> | { name: string; initials: string; role?: string; id?: string; avatar?: string };
  advisorId?: string;
  src?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
  /**
   * Nếu true, avatar nằm cạnh tên text hiển thị, ẩn khỏi screen reader để tránh đọc lặp tên
   * Mặc định là true khi dùng trong card hoặc summary
   */
  decorative?: boolean;
}

const sizePixels: Record<AvatarSize, { width: number; height: number; imgSize: number }> = {
  sm: { width: 44, height: 44, imgSize: 44 },
  md: { width: 64, height: 64, imgSize: 64 },
  lg: { width: 80, height: 80, imgSize: 80 },
  portrait: { width: 140, height: 175, imgSize: 175 },
};

// Mapping theme màu fallback theo initials hoặc id cố định (không dùng array index)
const fallbackThemes: Record<string, string> = {
  "MA": "avatar-theme-teal",
  "HN": "avatar-theme-sage",
  "TH": "avatar-theme-navy",
  "NL": "avatar-theme-sand",
};

export function Avatar({
  advisor,
  advisorId,
  src,
  name,
  initials,
  size = "md",
  className = "",
  decorative = true,
}: AvatarProps) {
  // Tìm thông tin advisor nếu có id hoặc name
  const resolvedAdvisor = advisorId
    ? getAdvisorById(advisorId)
    : advisor?.name
    ? getAdvisorByName(advisor?.name)
    : undefined;

  const finalName = name ?? advisor?.name ?? resolvedAdvisor?.name ?? "";
  const finalInitials = initials ?? advisor?.initials ?? resolvedAdvisor?.initials ?? (finalName ? finalName.slice(0, 2).toUpperCase() : "XL");
  const finalSrc = src ?? advisor?.avatar ?? (size === "sm" ? resolvedAdvisor?.avatarThumb : resolvedAdvisor?.avatar);

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isFailed = Boolean(finalSrc && failedSrc === finalSrc);

  const { width, height } = sizePixels[size];
  const themeClass = fallbackThemes[finalInitials] ?? "avatar-theme-teal";

  // Khi không có ảnh hoặc ảnh tải thất bại -> render initials fallback
  if (!finalSrc || isFailed) {
    return (
      <div
        className={`avatar avatar-${size} ${themeClass} ${className}`}
        style={{ width, height }}
        aria-hidden={decorative ? "true" : undefined}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : `Ảnh đại diện ${finalName}`}
      >
        <span className="avatar-initials">{finalInitials}</span>
      </div>
    );
  }

  return (
    <div
      className={`avatar avatar-image-wrap avatar-${size} ${className}`}
      style={{ width, height }}
      aria-hidden={decorative ? "true" : undefined}
    >
      <Image
        src={finalSrc}
        alt={decorative ? "" : `Chân dung ${finalName}`}
        width={width}
        height={height}
        className="avatar-photo"
        onError={() => setFailedSrc(finalSrc)}
      />
    </div>
  );
}
