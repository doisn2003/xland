import Link from "next/link";
import { NftCatalog } from "@/features/nft/catalog";
export const metadata = { title: "Bất động sản NFT | Xland" };
export default function NftPage() {
  return <main id="main" className="container nft-page"><p className="eyebrow">BẤT ĐỘNG SẢN NFT</p><h1>Cùng một miền đất.<br />Cùng mở giá trị.</h1><p className="nft-intro">Khám phá tài sản, hiểu phương án phân đoạn và trải nghiệm mua NFT theo số lượng bạn chọn.</p><Link className="text-link" href="/danh-muc-nft">Danh mục NFT của bạn →</Link><NftCatalog /></main>;
}
