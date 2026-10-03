import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { XlandStory } from "@/components/home/xland-story";
import { NftStory } from "@/components/home/nft-story";
import { PropertyExplorer } from "@/components/property-explorer";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { featuredSupportProperties } from "@/data/properties";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <PropertyExplorer />
      <XlandStory />
      <NftStory />
      <section className="advisors-section section" id="nguoi-dong-hanh"><div className="container"><div className="section-heading"><div><p className="eyebrow">NGƯỜI ĐỒNG HÀNH</p><h2>Thêm góc nhìn.<br />Gần hơn với lựa chọn.</h2></div><p>Hiểu khu vực, hiểu nhu cầu.<br />Cùng bạn tìm một nơi phù hợp.</p></div><div className="advisors-grid">{featuredSupportProperties.map((property) => <article className="advisor-card" key={property.id}><Avatar advisor={property.advisor} size="md" /><div><h3>{property.advisor.name}</h3><p>{property.advisor.role}</p></div><Link className="text-link" href={`/lo-dat/${property.slug}#ho-tro`}>Xem hồ sơ hỗ trợ <Icon name="arrow" /></Link></article>)}</div></div></section>
      <section className="container final-cta"><div><p className="eyebrow">HÀNH TRÌNH CỦA BẠN BẮT ĐẦU TỪ ĐÂY</p><h2>Miền đất tiếp theo<br />đang chờ bạn khám phá.</h2></div><Link href="#kham-pha" className="button">Khám phá các lô đất <Icon name="arrow" /></Link></section>
    </main>
  );
}
