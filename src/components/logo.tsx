import React from "react";

export type LogoVariant = "default" | "inverse";
export type LogoSize = "sm" | "md" | "lg";

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Symbol chính thức của Xland (Phương án A - Horizon & Parcels):
 * - Hai nét chéo đan tạo hình chữ X thanh thoát, đồng thời phân bổ 4 thửa đất (parcels) tiếp giáp.
 * - Nét ngang chân trời (horizon) kết nối các miền đất.
 * - Điểm nhấn hình thoi vàng champagne tại tâm điểm tượng trưng cho giá trị cốt lõi từ đất.
 */
export function XlandSymbol({
  variant = "default",
  size = 32,
  className = "",
}: {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}) {
  const primaryStroke = variant === "inverse" ? "#FFFFFF" : "var(--color-primary, #164B60)";
  const accentFill = variant === "inverse" ? "var(--color-on-dark-accent, #D8C49D)" : "var(--color-accent, #B89962)";
  const frameStroke = variant === "inverse" ? "rgba(255, 255, 255, 0.25)" : "var(--color-border, #D7DEDF)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-symbol ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Khung viền hình thoi bo góc định hình thửa đất */}
      <rect
        x="16"
        y="2.5"
        width="19"
        height="19"
        rx="3"
        transform="rotate(45 16 2.5)"
        stroke={frameStroke}
        strokeWidth="1.25"
      />
      {/* Đường chân trời ngang */}
      <path
        d="M5 16H27"
        stroke={primaryStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Nét chéo thứ nhất chữ X */}
      <path
        d="M8.5 8.5L23.5 23.5"
        stroke={primaryStroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Nét chéo thứ hai chữ X */}
      <path
        d="M23.5 8.5L8.5 23.5"
        stroke={primaryStroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Điểm nhấn hạt vàng champagne tại trung tâm kết nối */}
      <rect
        x="16"
        y="13.2"
        width="3.9"
        height="3.9"
        rx="0.8"
        transform="rotate(45 16 13.2)"
        fill={accentFill}
      />
    </svg>
  );
}

/**
 * Phương án B (Tham chiếu khảo sát / Đối chiếu):
 * Nét chữ X cách điệu dạng cánh buồm & đường đồng mức địa hình.
 */
export function XlandSymbolOptionB({
  variant = "default",
  size = 32,
  className = "",
}: {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}) {
  const strokeColor = variant === "inverse" ? "#FFFFFF" : "var(--color-primary, #164B60)";
  const accentColor = variant === "inverse" ? "var(--color-on-dark-accent, #D8C49D)" : "var(--color-accent, #B89962)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-symbol-option-b ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="16" r="13" stroke="var(--color-border, #D7DEDF)" strokeWidth="1.2" />
      <path d="M10 23L22 9M10 9L22 23" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3" fill={accentColor} />
    </svg>
  );
}

/**
 * Component Logo đầy đủ kết hợp Biểu tượng và Wordmark
 */
export function Logo({
  variant = "default",
  size = "md",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const pixelSizes = { sm: 24, md: 30, lg: 36 };
  const symbolSize = pixelSizes[size];

  return (
    <span
      className={`logo-lockup logo-${variant} logo-${size} ${className}`}
      aria-hidden="true"
    >
      <XlandSymbol variant={variant} size={symbolSize} />
      {showWordmark && (
        <span className="logo-wordmark">
          <span className="logo-wordmark-bold">X</span>
          <span className="logo-wordmark-light">LAND</span>
        </span>
      )}
    </span>
  );
}
