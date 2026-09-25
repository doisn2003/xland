type IconName = "arrow" | "search" | "pin" | "area" | "menu" | "close" | "check" | "layers";
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  area: <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M8 16l8-8" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  layers: <><path d="m12 3 10 6-10 6L2 9 12 3Zm-9 11 9 5 9-5M3 18l9 5 9-5" /></>,
};
export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
