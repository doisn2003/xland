"use client";
import Link from "next/link";
import { properties } from "@/data/properties";
import { PropertyImage } from "@/components/property-image";
import { money, offerings, remaining, statusLabel } from "./model";
import { useNftDemo } from "./store";

export function NftCatalog() {
  const { ledger, ready, notice } = useNftDemo();
  return <>{notice && <p className="context-note" role="status">{notice}</p>}<div className="property-grid nft-catalog">{offerings.map(offering => {
    const property = properties.find(p => p.id === offering.propertyId)!;
    const available = remaining(ledger, offering);
    return <article className="property-card" key={offering.id}>
      <div className="card-cover"><PropertyImage src={property.images[0]!.src} alt={property.images[0]!.alt} sizes="(max-width: 767px) 100vw, 33vw" /></div>
      <div className="nft-card-body"><span className="eyebrow">{property.location}</span><h2><Link href={`/nft/${offering.slug}`}>{property.name}</Link></h2>
        <p className="nft-unit-price">{money(offering.price)} <small>/ NFT</small></p>
        <p>{statusLabel[offering.status === "open" && available === 0 ? "sold_out" : offering.status]} · {ready ? available.toLocaleString("vi-VN") : "…"} NFT còn lại</p>
        <p className="fine-print">Tổng phương án: {offering.supply.toLocaleString("vi-VN")} NFT</p>
        <Link className="text-link" href={`/nft/${offering.slug}`}>Xem phương án NFT →</Link>
      </div></article>;
  })}</div></>;
}
