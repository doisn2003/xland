"use client";

import Link from "next/link";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/property-card";
import { useJourney } from "./store";

export function SavedProperties() {
  const { journey, ready, notice } = useJourney();
  const results = properties.filter(property => journey.favorites.includes(property.id));
  return <>{notice && <p role="status" className="journey-notice">{notice}</p>}{!ready ? <p role="status">Đang tải các lô đất đã lưu…</p> : results.length ? <><p className="saved-count" aria-live="polite">{results.length} lô đất đã lưu</p><div className="property-grid">{results.map(property => <PropertyCard key={property.id} property={property} />)}</div></> : <div className="empty-state"><h2>Chưa có lô đất đã lưu</h2><p>Lưu những nơi bạn quan tâm để dễ dàng tìm lại và sắp xếp buổi xem thực địa.</p><Link className="button" href="/lo-dat">Khám phá lô đất</Link></div>}</>;
}
