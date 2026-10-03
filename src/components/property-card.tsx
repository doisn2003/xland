import Link from "next/link";
import { type Property, formatArea, formatPrice } from "@/data/properties";
import { PropertyImage } from "./property-image";
import { SaveButton } from "@/features/journey/save-button";
import { Icon } from "./icon";

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0]!;

  return (
    <article className="property-card" data-category={property.category}>
      <div className="card-cover">
        <PropertyImage
          src={cover.src}
          alt={cover.alt}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
        />
        <span className={`status-badge ${property.status === "paused" ? "paused" : ""}`}>
          {property.status === "paused" ? "Tạm dừng giới thiệu" : "Đang giới thiệu"}
        </span>
        {property.nft && <span className="nft-badge">NFT</span>}
      </div>

      <div className="card-content">
        <div className="card-meta-top">
          <p className="card-category">{property.category} · {property.kind}</p>
          <div className="card-save-wrap">
            <SaveButton property={property} />
          </div>
        </div>

        <p className="location">
          <Icon name="pin" />
          <span>{property.location}</span>
        </p>

        <h3 className="card-title">
          <Link href={`/lo-dat/${property.slug}`}>{property.name}</Link>
        </h3>

        <div className="card-facts">
          <span>
            <Icon name="area" />
            {formatArea(property.area)}
          </span>
          <span>{property.setting}</span>
        </div>

        <div className="card-bottom">
          <div className="card-price-wrap">
            <span className="small-label">Giá chào</span>
            <strong>{formatPrice(property.price)}</strong>
          </div>
          <Link
            className="round-link"
            href={`/lo-dat/${property.slug}`}
            aria-label={`Xem ${property.name}`}
          >
            <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
