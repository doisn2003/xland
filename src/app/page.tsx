import Link from "next/link";
import { PropertyImage } from "@/components/property-image";
import { PropertyExplorer } from "@/components/property-explorer";
import { Icon } from "@/components/icon";
import { featuredSupportProperties } from "@/data/properties";

export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <PropertyImage src="/images/hero.webp" alt="Cảnh quan ven biển nhìn từ trên cao" sizes="100vw" preload className="hero-photo" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="hero-tag"><span /> KHÁM PHÁ GIÁ TRỊ TỪ ĐẤT</p>
          <h1 id="hero-title">Một miền đất.<br /><em>Vạn khởi đầu.</em></h1>
          <p className="hero-description">Tìm không gian cho ước muốn của bạn.<br className="desktop-break" /> Khám phá đất nền và những cách kết nối giá trị mới cùng Xland.</p>
          <Link className="hero-link" href="#kham-pha">Bắt đầu hành trình <Icon name="arrow" /></Link>
          <div className="hero-bottom"><span>ĐẤT NỀN · KHÔNG GIAN SỐNG · NFT</span><span className="hero-location"><Icon name="pin" /> Cam Ranh, Việt Nam</span></div>
        </div>
      </section>
      <PropertyExplorer />
      <section className="why-section section" id="cach-hoat-dong">
        <div className="container"><div className="section-heading centered"><p className="eyebrow">CÙNG BẠN NHÌN XA HƠN</p><h2>Một hành trình. Nhiều giá trị.</h2><p>Từ cảm hứng đầu tiên đến hiểu rõ một miền đất,<br className="desktop-break" /> Xland kết nối từng bước trong cùng một trải nghiệm.</p></div>
          <div className="values-grid">
            <article><span className="feature-icon"><Icon name="search" /></span><h3>Khám phá có chọn lọc</h3><p>Tìm theo khu vực, ngân sách và không gian sống. Những thông tin quan trọng nằm ngay trong tầm mắt.</p></article>
            <article><span className="feature-icon"><Icon name="area" /></span><h3>Hiểu rõ trước khi chọn</h3><p>Cảnh quan, diện tích, lối tiếp cận và hồ sơ được đặt cạnh nhau để bạn có thêm cơ sở tìm hiểu.</p></article>
            <article><span className="feature-icon"><Icon name="layers" /></span><h3>Kết nối cùng NFT</h3><p>Khám phá mô hình nhiều người tham gia một tài sản với số lượng NFT và tỷ lệ phân đoạn rõ ràng.</p></article>
          </div>
        </div>
      </section>
      <section className="container section nft-section" id="nft">
        <div className="nft-photo"><PropertyImage src="/images/garden-retreat.webp" alt="Không gian nhà vườn mở ra đồng xanh và đồi núi" sizes="(max-width: 767px) 100vw, 600px" /><span className="photo-caption">Không gian cho những khởi đầu mới</span></div>
        <div className="nft-copy"><p className="eyebrow">BẤT ĐỘNG SẢN NFT</p><h2>Cùng một miền đất.<br /><em>Thêm nhiều cơ hội.</em></h2><p>Một cách tiếp cận mới với bất động sản: tìm hiểu phương án phân đoạn, số lượng NFT và quyền lợi gắn với từng tài sản.</p><ul><li><Icon name="check" /> Hồ sơ tài sản và phương án đi cùng nhau</li><li><Icon name="check" /> Giá mỗi NFT và tỷ lệ được thể hiện rõ</li><li><Icon name="check" /> Bắt đầu bằng một trải nghiệm dễ hiểu</li></ul><Link className="button" href="/lo-dat/mien-xanh-ven-song#phuong-an-nft">Tìm hiểu phương án NFT <Icon name="arrow" /></Link></div>
      </section>
      <section className="advisors-section section" id="nguoi-dong-hanh"><div className="container"><div className="section-heading"><div><p className="eyebrow">NGƯỜI ĐỒNG HÀNH</p><h2>Thêm góc nhìn.<br />Gần hơn với lựa chọn.</h2></div><p>Hiểu khu vực, hiểu nhu cầu.<br />Cùng bạn tìm một nơi phù hợp.</p></div><div className="advisors-grid">{featuredSupportProperties.map((property, index) => <article className="advisor-card" key={property.id}><div className={`avatar avatar-${index}`}>{property.advisor.initials}</div><div><h3>{property.advisor.name}</h3><p>{property.advisor.role}</p></div><Link className="text-link" href={`/lo-dat/${property.slug}#ho-tro`}>Xem hồ sơ hỗ trợ <Icon name="arrow" /></Link></article>)}</div></div></section>
      <section className="container final-cta"><div><p className="eyebrow">HÀNH TRÌNH CỦA BẠN BẮT ĐẦU TỪ ĐÂY</p><h2>Miền đất tiếp theo<br />đang chờ bạn khám phá.</h2></div><Link href="#kham-pha" className="button">Khám phá các lô đất <Icon name="arrow" /></Link></section>
    </main>
  );
}
