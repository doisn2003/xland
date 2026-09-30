import Link from "next/link";
import { Portfolio } from "@/features/nft/portfolio";
export const metadata = { title: "Danh mục NFT | Xland" };
export default function PortfolioPage() {
  return <main id="main" className="container nft-page"><p className="eyebrow">PHẦN THAM GIA CỦA BẠN</p><h1>Danh mục NFT</h1><p className="nft-intro">Theo dõi số lượng NFT, tỷ lệ tham gia và lịch sử yêu cầu theo từng tài sản.</p><Link className="text-link" href="/nft">← Khám phá bất động sản NFT</Link><Portfolio /></main>;
}
