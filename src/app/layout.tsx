import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
const heading = localFont({ src: "./fonts/noto-serif.woff2", variable: "--font-heading", display: "swap", weight: "500 600" });
const body = localFont({ src: [
  { path: "./fonts/be-vietnam-400.woff2", weight: "400", style: "normal" },
  { path: "./fonts/be-vietnam-500.woff2", weight: "500", style: "normal" },
  { path: "./fonts/be-vietnam-600.woff2", weight: "600", style: "normal" },
], variable: "--font-body", display: "swap" });
export const metadata: Metadata = {
  title: "Xland | Bất động sản & NFT",
  description: "Khám phá bất động sản và trải nghiệm đầu tư NFT cùng Xland.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className={`${heading.variable} ${body.variable}`}><body><a href="#main" className="skip-link">Đến nội dung chính</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
