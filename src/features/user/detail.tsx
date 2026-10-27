"use client";
import Link from "next/link";
import useSWR from "swr";
import {useState} from "react";
import {PropertyChildren} from "./property-children";
import type { Property } from "./contract";
import { dateTime, decimal, money, safeUrl } from "./wire";
import {
  ErrorNotice,
  Loading,
  Toggle,
  getEntity,
  useEntity,
  useSession,
} from "./client";
import { Gallery, UserShell } from "./ui";
import { categories, propertyStatuses, regions } from "./labels";
import { FinanceCalculator } from "./finance";
import { AreaMapPanel } from "./maps";
import { Portrait, Share } from "./social";

export function PropertyDetail({ initial }: { initial: Property }) {
  const [tab,setTab] = useState("overview");
  const { data: property = initial, error } = useSWR(
    "/properties/" + initial.id,
    (p) => getEntity(p, "Property"),
    { fallbackData: initial },
  );
  const { session } = useSession();
  return (
    <UserShell
      title={property.title}
      intro={`${property.districtName} · ${property.provinceName} · ${regions[property.region]}`}
    >
      <ErrorNotice error={error} />
      {property.parentPropertyId && <Link className="text-link" href={`/lo-dat/${property.parentPropertyId}`}>↑ Xem mảnh đất cha</Link>}
      <div className="user-actions">
        {property.hasSubplots && <span className="subplot-badge">Nhiều lô đất con</span>}
        {property.isCorner && <span className="subplot-badge corner">Lô góc</span>}
        <span className="user-notice">{propertyStatuses[property.status]}</span>
        <Toggle
          path={`/properties/${property.id}/saved`}
          active={!!session && property.isSaved}
          label="Lưu lô đất"
        />
        <Share path={"/properties/" + property.id} />
      </div>
      <Gallery media={property.media} title={property.title} />
      <nav className="user-tabs property-detail-tabs" aria-label="Thông tin lô đất">{[["overview","Tổng quan"],["legal","Pháp lý"],["area","Khu vực"],["finance","Tài chính"]].map(([key,label])=><button key={key} type="button" aria-pressed={tab===key} onClick={()=>setTab(key!)}>{label}</button>)}</nav>
      <div className="user-detail-grid">
        <div>
          {tab === "overview" && <>
          <section className="user-panel">
            <h2>Thông tin lô đất</h2>
            <dl className="user-facts">
              {[
                ["Mã hồ sơ", property.code],
                ["Giá chào", money(property.priceTotal)],
                ["Giá / m²", money(property.pricePerM2)],
                ["Diện tích", decimal(property.areaM2, "m²")],
                ["Mặt tiền", decimal(property.frontageM, "m")],
                ["Chiều sâu", decimal(property.depthM, "m")],
                ["Đường tiếp cận", decimal(property.roadWidthM, "m")],
                ["Hướng", property.direction ?? "Chưa có thông tin"],
                ["Loại đất", categories[property.category]],
                ["Mục đích sử dụng", categories[property.landType]],
                ["Cập nhật", dateTime(property.updatedAt)],
              ].map(([name, value]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {property.highlights.length > 0 && (
              <ul className="user-list">
                {property.highlights.map((h, i) => (
                  <li key={i}>
                    <h3>{h.title}</h3>
                    <p>{h.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {property.hasSubplots && <PropertyChildren key={property.id} propertyId={property.id}/>}
          </>}
          {tab === "legal" && <Legal propertyId={property.id} />}
          {tab === "area" && <>
          <Area propertyId={property.id} />
          <AreaMapPanel propertyId={property.id} />
          </>}
          {tab === "finance" && <FinanceCalculator key={property.priceTotal} property={property} />}
        </div>
        <aside>
          <section className="user-panel">
            <h2>Khám phá tại thực địa</h2>
            <p>Xem khung giờ có sẵn và gửi nhu cầu của bạn.</p>
            <div className="user-actions">
              {property.status === "listed" ? (
                <Link
                  className="button"
                  href={`/lich-hen?propertyId=${property.id}`}
                >
                  Xem lịch thực địa
                </Link>
              ) : (
                <button className="button" disabled>
                  Lô đất hiện không nhận lịch
                </button>
              )}
              <Link
                className="button secondary"
                href={`/ho-tro?propertyId=${property.id}`}
              >
                Gửi yêu cầu hỗ trợ
              </Link>
            </div>
          </section>
          <ConsultantSummary
            id={property.consultantId}
            propertyId={property.id}
          />
        </aside>
      </div>
    </UserShell>
  );
}
function Legal({ propertyId }: { propertyId: string }) {
  const { data, error, mutate } = useEntity(
    `/properties/${propertyId}/legal`,
    "LegalSummary",
  );
  return (
    <section className="user-panel">
      <h2>Hồ sơ và pháp lý</h2>
      {error ? (
        <ErrorNotice error={error} retry={() => void mutate()} />
      ) : !data ? (
        <Loading />
      ) : (
        <>
          <p>
            {data.verifiedCount}/{data.totalCount} mục đã đối chiếu
          </p>
          <p>{data.scopeNotice}</p>
          <ul className="user-list">
            {data.items.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> ·{" "}
                {item.status === "verified" ? "Đã đối chiếu" : "Đang chờ"}
                <p>
                  {item.subtitle}
                  {item.checkedDate ? " · " + item.checkedDate : ""}
                </p>
              </li>
            ))}
          </ul>
          <h3>Tài liệu</h3>
          {!data.documents.length && <p>Chưa có tài liệu.</p>}
          <ul className="user-list">
            {data.documents.map((doc) => (
              <li key={doc.id}>
                <strong>{doc.title}</strong>
                <p>
                  {doc.mimeType} · {Math.ceil(doc.sizeBytes / 1024)} KB ·{" "}
                  {doc.uploadedDate}
                </p>
                <p>
                  {doc.access === "public_redacted"
                    ? "Bản công khai đã lược thông tin"
                    : doc.access === "authenticated"
                      ? "Cần đăng nhập"
                      : "Cần quyền truy cập"}
                </p>
                {safeUrl(doc.previewUrl) && (
                  <a
                    className="text-link"
                    href={safeUrl(doc.previewUrl)!}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem bản xem trước ↗
                  </a>
                )}
                <button
                  className="button secondary small"
                  disabled
                  title="Nguồn tải tài liệu chưa được cấu hình"
                >
                  Tải tài liệu chưa khả dụng
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
function Area({ propertyId }: { propertyId: string }) {
  const { data, error } = useEntity(
    `/properties/${propertyId}/area`,
    "AreaInfo",
  );
  return (
    <section className="user-panel">
      <h2>Khu vực xung quanh</h2>
      {error ? (
        <ErrorNotice error={error} />
      ) : !data ? (
        <Loading />
      ) : (
        <>
          <ul className="user-list">
            {data.amenities.map((a) => (
              <li key={a.id}>
                {a.name} · {a.distanceText}
              </li>
            ))}
          </ul>
          {data.photos.length > 0 && (
            <Gallery media={data.photos} title="Hình ảnh khu vực" />
          )}
          <p>{data.providerAttribution}</p>
        </>
      )}
    </section>
  );
}
export function ConsultantSummary({
  id,
  propertyId,
}: {
  id: string;
  propertyId?: string;
}) {
  const { data, error } = useEntity("/consultants/" + id, "Consultant");
  return (
    <article className="user-panel">
      <h2>Người đồng hành</h2>
      {error ? (
        <ErrorNotice error={error} />
      ) : !data ? (
        <Loading />
      ) : (
        <>
          <Portrait url={data.avatarUrl} name={data.name} />
          <h3>{data.name}</h3>
          <p>
            {data.role} · {data.location}
          </p>
          <div className="user-actions">
            <Link className="text-link" href={"/chuyen-gia/" + id}>
              Xem hồ sơ →
            </Link>
            {propertyId && (
              <Link
                className="button secondary"
                href={`/ho-tro?propertyId=${propertyId}&consultantId=${id}`}
              >
                Gửi nhu cầu
              </Link>
            )}
          </div>
        </>
      )}
    </article>
  );
}
