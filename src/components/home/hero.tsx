import Link from "next/link";
import { PropertyImage } from "@/components/property-image";
import { Icon } from "@/components/icon";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-hero-section>
      <div className="hero-media-wrap" data-hero-media>
        <PropertyImage
          src="/images/hero.webp"
          alt="Cảnh quan ven biển nhìn từ trên cao tại Cam Ranh, Việt Nam"
          sizes="100vw"
          preload
          className="hero-photo"
        />
        <div className="hero-shade" aria-hidden="true" />
      </div>

      <div className="container hero-content" data-hero-content>
        <p className="hero-tag" data-hero-tag>
          <span className="hero-tag-dot" aria-hidden="true" />
          <span>KHÁM PHÁ GIÁ TRỊ TỪ ĐẤT</span>
        </p>

        <h1 id="hero-title" className="hero-title" data-hero-title>
          Một miền đất.
          <br />
          <em>Vạn khởi đầu.</em>
        </h1>

        <p className="hero-description" data-hero-description>
          Tìm không gian cho ước muốn của bạn.
          <br className="desktop-break" /> Khám phá đất nền và những cách kết nối giá trị mới cùng Xland.
        </p>

        <div className="hero-actions" data-hero-actions>
          <Link className="button hero-cta" href="#kham-pha" data-hero-cta>
            Khám phá các lô đất <Icon name="arrow" />
          </Link>
        </div>

        <div className="hero-bottom" data-hero-bottom>
          <span className="hero-pillars">ĐẤT NỀN · KHÔNG GIAN SỐNG · NFT</span>
          <span className="hero-location">
            <Icon name="pin" /> Cam Ranh, Việt Nam
          </span>
        </div>
      </div>
    </section>
  );
}
