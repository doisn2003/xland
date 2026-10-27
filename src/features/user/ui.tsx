"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { MediaAsset, Property } from "./contract";
import { money, decimal, safeUrl } from "./wire";
import { categories, propertyStatuses } from "./labels";
import { Toggle, useSession } from "./client";

export function UserShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="container user-main">
      <div className="user-heading">
        <p className="eyebrow">XLAND · KẾT NỐI GIÁ TRỊ</p>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </main>
  );
}
export function AccountNav() {
  const path = usePathname();
  return (
    <nav className="user-tabs" aria-label="Tài khoản">
      {(
        [
          ["/tai-khoan", "Hồ sơ"],
          ["/da-luu", "Đã lưu"],
          ["/lich-hen", "Lịch xem"],
          ["/ho-tro", "Hỗ trợ"],
          ["/tai-chinh", "Tài chính"],
          ["/dang-ky-su-kien", "Đăng ký sự kiện"],
          ["/dang-theo-doi", "Đang theo dõi"],
          ["/tai-khoan/cai-dat", "Cài đặt"],
        ] as const
      ).map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function Media({
  asset,
  title,
  controls = true,
  autoplay = false,
  muted = true,
}: {
  asset?: MediaAsset;
  title?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
}) {
  const [failed, setFailed] = useState(false),
    src = safeUrl(asset?.url);
  if (!src || failed)
    return (
      <div
        className="user-media-fallback"
        role="img"
        aria-label={title ?? asset?.altText ?? "Media chưa có"}
      >
        Hình ảnh đang cập nhật
      </div>
    );
  // Remote public media stays on its original storage host; never proxy arbitrary URLs.
  return asset?.kind === "video" ? (
    <video
      className="user-media"
      src={src}
      poster={safeUrl(asset.thumbnailUrl) ?? undefined}
      controls={controls}
      playsInline
      preload="metadata"
      autoPlay={autoplay}
      muted={muted}
      onError={() => setFailed(true)}
      aria-label={asset.altText || title}
    />
  ) : (
    <Image
      unoptimized
      width={900}
      height={600}
      className="user-media"
      src={src}
      alt={asset?.altText || title || ""}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
export function PropertyCard({ property }: { property: Property }) {
  const { session } = useSession();
  return (
    <article className="property-card" data-category={property.category}>
      <div className="card-cover">
        <Media
          asset={
            property.media.find((m) => m.kind === "image") ?? property.media[0]
          }
          title={property.title}
        />
        <span className="status-badge">
          {propertyStatuses[property.status]}
        </span>
      </div>
      <div className="card-content">
        {property.hasSubplots && <span className="subplot-badge">Nhiều lô đất con</span>}
        {property.isCorner && <span className="subplot-badge corner">Lô góc</span>}
        <div className="card-meta-top">
          <p className="card-category">
            {categories[property.category]} · {property.code}
          </p>
          <Toggle
            path={`/properties/${property.id}/saved`}
            active={!!session && property.isSaved}
            label="Lưu"
          />
        </div>
        <p className="location">
          {property.districtName} · {property.provinceName}
        </p>
        <h3 className="card-title">
          <Link href={`/lo-dat/${property.id}`}>{property.title}</Link>
        </h3>
        <div className="card-facts">
          <span>{decimal(property.areaM2, "m²")}</span>
          <span>
            {property.roadWidthM !== null
              ? "Đường " + decimal(property.roadWidthM, "m")
              : categories[property.landType]}
          </span>
        </div>
        <div className="card-bottom">
          <div>
            <span className="small-label">Giá chào</span>
            <strong>{money(property.priceTotal)}</strong>
          </div>
          <Link
            className="text-link"
            href={`/lo-dat/${property.id}`}
            aria-label={`Xem ${property.title}`}
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </article>
  );
}
export function PropertyGrid({ items }: { items: Property[] }) {
  return (
    <div className="user-grid">
      {items.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
export function ContactFields({
  name = "",
  phone = "",
}: {
  name?: string;
  phone?: string;
}) {
  return (
    <div className="user-fields">
      <label>
        Họ và tên
        <input
          required
          name="contactName"
          maxLength={100}
          autoComplete="name"
          defaultValue={name}
        />
      </label>
      <label>
        Số điện thoại
        <input
          required
          type="tel"
          name="contactPhone"
          autoComplete="tel"
          pattern="(0[0-9]{9}|\+[1-9][0-9]{8,14})"
          title="Số điện thoại Việt Nam 10 số hoặc định dạng +84"
          defaultValue={phone}
        />
      </label>
    </div>
  );
}
export const formText = (form: FormData, name: string) =>
  String(form.get(name) ?? "").trim();
export function Gallery({
  media,
  title,
}: {
  media: MediaAsset[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  return (
    <div className="user-gallery">
      <div className="user-gallery-main">
        <Media
          key={media[index]?.id ?? "empty"}
          asset={media[index]}
          title={title}
        />
      </div>
      {media.length > 1 && (
        <div className="user-actions" aria-label="Thư viện hình ảnh">
          {media.map((m, i) => (
            <button
              className="button secondary small"
              type="button"
              key={m.id}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {m.kind === "video" ? "Video" : "Ảnh"} {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
