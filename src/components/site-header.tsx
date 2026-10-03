"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { Logo } from "./logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Xland — Trang chủ" onClick={close}>
          <Logo variant="default" size="md" />
        </Link>
        <button ref={trigger} className="menu-toggle" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
        <nav id="site-navigation" className={open ? "navigation is-open" : "navigation"} aria-label="Điều hướng chính">
          <Link href="/lo-dat" onClick={close}>Khám phá</Link>
          <Link href="/da-luu" onClick={close}>Đã lưu</Link>
          <Link href="/nft" onClick={close}>Bất động sản NFT</Link>
          <Link href="/lich-hen" onClick={close}>Lịch hẹn</Link>
          <Link className="button header-cta" href="/lo-dat" onClick={close}>Tìm lô đất phù hợp <Icon name="arrow" /></Link>
        </nav>
      </div>
    </header>
  );
}
