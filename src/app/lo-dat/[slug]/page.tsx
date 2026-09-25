import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { properties, formatPrice, formatArea } from "@/data/properties";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertyCard } from "@/components/property-card";
import { Icon } from "@/components/icon";

export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  return { title: property ? `${property.name} | Xland` : "Không tìm thấy lô đất | Xland" };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  return <main id="main" className="detail-page">
    <div className="container">
      <nav className="breadcrumb" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span>/</span><Link href="/#kham-pha">Khám phá</Link><span>/</span><span aria-current="page">{property.name}</span></nav>
      <div className="detail-heading"><div><p className="eyebrow">{property.id} · HỒ SƠ MẪU</p><h1>{property.name}</h1><p className="location"><Icon name="pin" />{property.location}</p></div><span className={`status-badge inline ${property.status === "paused" ? "paused" : ""}`}>{property.status === "paused" ? "Tạm dừng giới thiệu" : "Đang giới thiệu"}</span></div>
      <PropertyGallery images={property.images} />
      <div className="detail-columns"><div className="detail-content"><section><p className="eyebrow">KHÔNG GIAN & CẢM HỨNG</p><h2>Một góc nhìn về miền đất</h2><p>{property.description}</p><div className="detail-facts"><div><span>Diện tích</span><strong>{formatArea(property.area)}</strong></div><div><span>Mặt tiền</span><strong>{property.frontage} m</strong></div><div><span>Đường tiếp cận</span><strong>{property.road} m</strong></div><div><span>Không gian</span><strong>{property.setting}</strong></div></div></section>
        <section className="info-section"><h2>Thông tin hồ sơ</h2><dl className="info-table"><div><dt>Mã hồ sơ</dt><dd>{property.id}</dd></div><div><dt>Mục đích sử dụng</dt><dd>Thông tin giả định, cần kiểm tra hồ sơ gốc</dd></div><div><dt>Giấy tờ & quy hoạch</dt><dd>Chưa có tài liệu xác minh trong demo</dd></div><div><dt>Cập nhật dữ liệu mẫu</dt><dd>25/09/2026</dd></div></dl><p className="context-note">Ảnh chụp minh họa cảnh quan khu vực, không phải xác nhận ranh giới hoặc ảnh thực địa của lô đang chào bán. Giá, diện tích và người hỗ trợ là dữ liệu mẫu.</p></section>
        {property.nft && <section className="nft-detail" id="phuong-an-nft"><p className="eyebrow">PHƯƠNG ÁN NFT MẪU</p><h2>Nhiều người. Một tài sản.</h2><p>Khám phá cách trình bày một tài sản được chia thành NFT. Các thông số dưới đây chỉ phục vụ trải nghiệm sản phẩm.</p><div className="detail-facts"><div><span>Tổng số NFT</span><strong>{new Intl.NumberFormat("vi-VN").format(property.nft.supply)}</strong></div><div><span>Giá / NFT mẫu</span><strong>{new Intl.NumberFormat("vi-VN").format(property.nft.price)} ₫</strong></div><div><span>Tỷ lệ / NFT mẫu</span><strong>{new Intl.NumberFormat("vi-VN").format(100 / property.nft.supply)}%</strong></div></div><p className="fine-print">Luồng mua mô phỏng và danh mục NFT đang được phát triển. Quyền lợi, điều kiện chuyển nhượng và phương án vận hành sẽ được trình bày trong bước tiếp theo.</p></section>}
        <section className="support-section" id="ho-tro"><p className="eyebrow">NGƯỜI ĐỒNG HÀNH</p><h2>Hiểu thêm trước khi quyết định</h2><div className="support-person"><div className="avatar">{property.advisor.initials}</div><div><h3>{property.advisor.name}</h3><p>{property.advisor.role} · Nhân vật mẫu</p></div></div><p>{property.status === "paused" ? "Hồ sơ đang tạm dừng giới thiệu. Bạn có thể tiếp tục khám phá các lô đất khác." : "Tại bước tiếp theo, bạn có thể đề nghị xem thực địa và trao đổi với người hỗ trợ ngay trong hành trình khám phá."}</p><Link className="text-link" href="/#kham-pha">Tiếp tục khám phá <Icon name="arrow" /></Link></section>
      </div><aside className="property-summary" aria-label="Tóm tắt lô đất"><span className="small-label">GIÁ CHÀO MẪU</span><p className="summary-price">{formatPrice(property.price)}</p><p>{formatArea(property.area)} · {property.setting}</p><hr /><div className="summary-person"><span className="avatar small">{property.advisor.initials}</span><div><strong>{property.advisor.name}</strong><span>Người hỗ trợ mẫu</span></div></div>{property.status === "available" ? <a className="button" href="#ho-tro">Xem thông tin hỗ trợ <Icon name="arrow" /></a> : <><button className="button" disabled>Tạm dừng giới thiệu</button><p className="fine-print">Chưa nhận đề nghị xem thực địa.</p></>}<p className="fine-print">Bản demo · Chưa nhận yêu cầu hoặc giao dịch thật.</p></aside></div>
      <section className="section related-section"><div className="section-heading"><div><p className="eyebrow">TIẾP TỤC HÀNH TRÌNH</p><h2>Những miền đất khác</h2></div></div><div className="property-grid">{properties.filter((item) => item.id !== property.id).map((item) => <PropertyCard key={item.id} property={item} />)}</div></section>
    </div>
  </main>;
}
