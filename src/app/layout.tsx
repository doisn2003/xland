import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xland | Bất động sản & NFT",
  description: "Khám phá bất động sản và trải nghiệm đầu tư NFT cùng Xland.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
