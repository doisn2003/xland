import Link from "next/link";
import { Portfolio } from "@/features/nft/portfolio";
export const metadata = { title: "Danh mục NFT | Xland" };
export default function PortfolioPage() {
  return <main id="main" className="container nft-page"><p className="eyebrow">VÍ TRẢI NGHIỆM · DỮ LIỆU MẪU</p><h1>Danh mục NFT</h1><p className="nft-intro">Nhìn lại phần tham gia của bạn trong từng phương án. Số liệu chỉ thuộc trải nghiệm mô phỏng trên trình duyệt này.</p><Link className="text-link" href="/nft">← Khám phá bất động sản NFT</Link><Portfolio /></main>;
}
