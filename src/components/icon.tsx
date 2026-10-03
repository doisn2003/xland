import React from "react";

export type IconName =
  | "arrow"
  | "search"
  | "pin"
  | "area"
  | "menu"
  | "close"
  | "check"
  | "layers"
  | "bookmark"
  | "calendar"
  | "user"
  | "shield"
  | "share"
  | "filter"
  | "sparkle";

const paths: Record<IconName, (props: { filled?: boolean }) => React.ReactNode> = {
  arrow: () => (
    <>
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </>
  ),
  search: () => (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.2 16.2" />
    </>
  ),
  pin: () => (
    <>
      <path d="M19.5 10C19.5 15.5 12 21.5 12 21.5S4.5 15.5 4.5 10A7.5 7.5 0 0 1 19.5 10Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  area: () => (
    <>
      <path d="M3.5 8.5V4.5H7.5" />
      <path d="M16.5 4.5H20.5V8.5" />
      <path d="M20.5 15.5V19.5H16.5" />
      <path d="M7.5 19.5H3.5V15.5" />
      <path d="M7.5 16.5L16.5 7.5" />
    </>
  ),
  menu: () => (
    <>
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </>
  ),
  close: () => (
    <>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </>
  ),
  check: () => <path d="M5 12.5L9.5 17L19 7.5" />,
  layers: () => (
    <>
      <path d="M12 3L21 8L12 13L3 8L12 3Z" />
      <path d="M3 13L12 18L21 13" />
      <path d="M3 17L12 22L21 17" />
    </>
  ),
  bookmark: ({ filled }) => (
    <path
      d="M6 3.5H18C18.5523 3.5 19 3.94772 19 4.5V20.5L12 16.5L5 20.5V4.5C5 3.94772 5.44772 3.5 6 3.5Z"
      fill={filled ? "currentColor" : "none"}
    />
  ),
  calendar: () => (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M16 2.5V6.5" />
      <path d="M8 2.5V6.5" />
      <path d="M3.5 9.5H20.5" />
    </>
  ),
  user: () => (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5C4.5 16.5 8 15 12 15C16 15 19.5 16.5 19.5 20.5" />
    </>
  ),
  shield: () => (
    <path d="M12 3L20 6.5V12C20 16.8 16.6 20.7 12 21.8C7.4 20.7 4 16.8 4 12V6.5L12 3Z" />
  ),
  share: () => (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5L15.4 17.5" />
      <path d="M15.4 6.5L8.6 10.5" />
    </>
  ),
  filter: () => (
    <>
      <path d="M4 6H20" />
      <path d="M7 12H17" />
      <path d="M10 18H14" />
    </>
  ),
  sparkle: () => (
    <>
      <path d="M12 3V21M3 12H21" />
      <path d="M6 6L18 18M6 18L18 6" strokeWidth="1.2" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, className = "", size = 20, filled = false }: IconProps) {
  const renderPath = paths[name];
  if (!renderPath) return null;

  return (
    <svg
      className={`icon icon-${name} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {renderPath({ filled })}
    </svg>
  );
}
