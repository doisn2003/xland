import Link from "next/link";
import { PropertyImage } from "@/components/property-image";
import { Icon } from "@/components/icon";
import { HeroSettle } from "@/components/motion/hero-settle";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-hero-section>
      <div className="hero-media-wrap" data-hero-media>
        <HeroSettle>
          <PropertyImage
            src="/images/hero.webp"
            alt="Không gian đô thị và cảnh quan trên trang chủ Xland"
            sizes="100vw"
            preload
            className="hero-photo"
          />
        </HeroSettle>
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
          <span className="hero-pillars">ĐẤT NỀN · KHÔNG GIAN SỐNG · CỘNG ĐỒNG</span>
          <span className="hero-location">
            <Icon name="pin" /> Khám phá miền đất Việt
          </span>
        </div>
      </div>
    </section>
  );
}
