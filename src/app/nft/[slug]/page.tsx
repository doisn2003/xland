import Link from "next/link";
import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { PropertyImage } from "@/components/property-image";
import { offerings, money, percent } from "@/features/nft/model";
import { PurchasePanel } from "@/features/nft/purchase-panel";
export function generateStaticParams() { return offerings.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${properties.find(p => p.slug === slug)?.name ?? "Không tìm thấy"} · NFT | Xland` };
}
export default async function OfferingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offering = offerings.find(item => item.slug === slug);
  if (!offering) notFound();
  const property = properties.find(item => item.id === offering.propertyId)!;
  return <main id="main" className="container nft-page"><nav className="breadcrumb" aria-label="Đường dẫn"><Link href="/nft">Bất động sản NFT</Link><span>/</span><Link href="/danh-muc-nft">Danh mục NFT</Link></nav><p className="eyebrow">PHƯƠNG ÁN MẪU · {property.location}</p><h1>{property.name}</h1>
    <div className="nft-layout"><div className="nft-information"><div className="nft-detail-image"><PropertyImage src={property.images[0]!.src} alt={property.images[0]!.alt} sizes="(max-width: 1023px) 100vw, 60vw" /></div><p className="fine-print">{property.images[0]!.caption} · Ảnh minh họa bối cảnh.</p>
      <section><h2>Một tài sản, nhiều người cùng tham gia</h2><p>{property.description}</p><dl className="info-table"><div><dt>Tổng NFT cố định</dt><dd>{offering.supply.toLocaleString("vi-VN")}</dd></div><div><dt>Tỷ lệ mỗi NFT</dt><dd>{percent(1, offering.supply)}</dd></div><div><dt>Giá mỗi NFT mẫu</dt><dd>{money(offering.price)}</dd></div><div><dt>Đã bán / giữ chỗ ban đầu</dt><dd>{offering.sold} / {offering.reserved} NFT mẫu</dd></div></dl><Link className="text-link" href={`/lo-dat/${property.slug}`}>Xem hồ sơ lô đất gốc →</Link></section>
      <section id="dieu-kien"><h2>Hiểu rõ phương án trước khi mua</h2><p>Tỷ lệ NFT thể hiện phần tham gia theo phương án mẫu, không tự xác nhận quyền trên giấy chứng nhận đất.</p><ul className="nft-terms"><li><strong>Quyền lợi mẫu:</strong> theo dõi hồ sơ và ghi nhận số NFT, tỷ lệ tham gia trong danh mục trải nghiệm. Chưa có quyền tài sản thật hay cam kết lợi nhuận.</li><li><strong>Đứng tên và quản lý:</strong> chưa chỉ định đơn vị pháp lý trong demo; cần xác lập hồ sơ, trách nhiệm và hợp đồng trước khi vận hành thật.</li><li><strong>Chuyển nhượng và thoái vốn:</strong> chưa mở trong demo. Điều kiện và thanh khoản chưa được cam kết.</li><li><strong>Phí mẫu:</strong> 0% cho kịch bản trải nghiệm; không phải biểu phí vận hành.</li></ul><p className="context-note">Chuẩn dự kiến: ERC-1155, token ID {offering.tokenId}. Chưa triển khai chain hoặc smart contract. Không cần ví thật, chữ ký hay chuyển tiền.</p></section>
    </div><PurchasePanel offering={offering} /></div></main>;
}
