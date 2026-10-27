"use client";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { safeUrl } from "./wire";
import { parseMap, type AreaMap } from "./map-wire";
import { ErrorNotice, Loading, request } from "./client";

export function AreaMapPanel({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    open ? `/properties/${propertyId}/area-map` : null,
    async (p) => parseMap(await request(p), propertyId),
  );
  return (
    <section className="user-panel">
      <h2>Bản đồ khu vực</h2>
      <p>
        Bản đồ tham khảo cấp khu vực; không thể hiện vị trí hoặc ranh giới lô
        đất.
      </p>
      {!open && (
        <button className="button secondary" onClick={() => setOpen(true)}>
          Xem bản đồ khu vực
        </button>
      )}
      {isLoading && <Loading />}
      <ErrorNotice error={error} retry={() => void mutate()} />
      {data && (
        <>
          <p>{data.notice}</p>
          {data.availability === "ready" &&
          data.publicArea &&
          data.tilePathTemplate === "/maps/tiles/{z}/{x}/{y}.png" ? (
            <TileMap map={data} />
          ) : data.availability === "ready" && safeUrl(data.embedPageUrl) ? (
            <iframe
              className="user-map"
              src={safeUrl(data.embedPageUrl)!}
              title="Bản đồ khu vực"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          ) : (
            <p className="user-notice">Bản đồ hiện chưa sẵn sàng.</p>
          )}
          <div className="user-actions">
            {safeUrl(data.externalAreaMapUrl) && (
              <a
                className="text-link"
                href={safeUrl(data.externalAreaMapUrl)!}
                target="_blank"
                rel="noreferrer"
              >
                Mở bản đồ khu vực ↗
              </a>
            )}
            {safeUrl(data.externalDirectionsUrl) && (
              <a
                className="text-link"
                href={safeUrl(data.externalDirectionsUrl)!}
                target="_blank"
                rel="noreferrer"
              >
                Hướng đi tới khu vực ↗
              </a>
            )}
          </div>
          {data.attribution.map((a) => (
            <p key={a.url}>
              <a href={safeUrl(a.url)!} target="_blank" rel="noreferrer">
                {a.label}
              </a>
            </p>
          ))}
        </>
      )}
    </section>
  );
}
function TileMap({ map }: { map: AreaMap }) {
  const area = map.publicArea!,
    [zoom, setZoom] = useState(Math.min(16, Math.max(4, area.initialZoom))),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [failed, setFailed] = useState(false),
    [planning, setPlanning] = useState(false);
  const scale = 2 ** zoom,
    lat = (area.centerLatitude * Math.PI) / 180;
  const cx = Math.floor(((area.centerLongitude + 180) / 360) * scale) + pan.x,
    cy =
      Math.floor(((1 - Math.asinh(Math.tan(lat)) / Math.PI) / 2) * scale) +
      pan.y;
  const overlay =
    map.planning?.availability === "ready" ? map.planning.source : null;
  const template = overlay?.tilePathTemplate;
  const overlayAllowed =
    template &&
    /^\/maps\/planning\/[a-z0-9_-]{1,64}\/[a-zA-Z0-9._-]{1,80}\/\{z\}\/\{x\}\/\{y\}\.png$/.test(
      template,
    );
  const tile = (base: string, x: number, y: number) =>
    "/api/xland-map/" +
    base
      .replace(/^\/maps\//, "")
      .replace("{z}", String(zoom))
      .replace("{x}", String((x + scale) % scale))
      .replace("{y}", String(y));
  return (
    <>
      <div className="user-actions">
        <button
          className="button secondary small"
          onClick={() => {
            setZoom((z) => Math.min(16, z + 1));
            setPan({ x: 0, y: 0 });
          }}
        >
          Phóng to
        </button>
        <button
          className="button secondary small"
          onClick={() => {
            setZoom((z) => Math.max(4, z - 1));
            setPan({ x: 0, y: 0 });
          }}
        >
          Thu nhỏ
        </button>
        {[
          ["Tây", -1, 0],
          ["Đông", 1, 0],
          ["Bắc", 0, -1],
          ["Nam", 0, 1],
        ].map(([label, x, y]) => (
          <button
            key={label}
            className="button secondary small"
            onClick={() =>
              setPan((p) => ({ x: p.x + Number(x), y: p.y + Number(y) }))
            }
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="user-map-tiles"
        role="img"
        aria-label={"Bản đồ khu vực " + area.label}
      >
        {Array.from({ length: 9 }, (_, i) => {
          const x = cx + (i % 3) - 1,
            y = cy + Math.floor(i / 3) - 1;
          if (y < 0 || y >= scale) return null;
          const style = {
            left: `${((i % 3) * 100) / 3}%`,
            top: `${(Math.floor(i / 3) * 100) / 3}%`,
          };
          return (
            <span key={i}>
              <Image
                unoptimized
                width={900}
                height={600}
                alt=""
                style={style}
                src={tile(map.tilePathTemplate!, x, y)}
                onError={() => setFailed(true)}
              />
              {planning &&
                overlayAllowed &&
                zoom >= overlay!.minZoom &&
                zoom <= overlay!.maxNativeZoom && (
                  <Image
                    unoptimized
                    width={900}
                    height={600}
                    alt=""
                    style={{ ...style, opacity: 0.65 }}
                    src={tile(template!, x, y)}
                    onError={() => setFailed(true)}
                  />
                )}
            </span>
          );
        })}
        <span className="user-map-label">
          {area.label}
          <br />
          <small>Phạm vi tham khảo · Không phải vị trí thửa đất</small>
        </span>
      </div>
      {failed && (
        <p className="user-notice">
          Một phần bản đồ chưa tải được. Bạn có thể mở liên kết bản đồ bên dưới.
        </p>
      )}
      {map.planning && (
        <div>
          <p>{map.planning.notice}</p>
          {overlayAllowed && overlay && (
            <>
              <button
                className="button secondary"
                aria-pressed={planning}
                onClick={() => setPlanning((p) => !p)}
              >
                Lớp quy hoạch tham khảo
              </button>
              <p>
                {overlay.label} · {overlay.revision}
              </p>
              {safeUrl(overlay.sourceUrl) && (
                <a
                  className="text-link"
                  href={safeUrl(overlay.sourceUrl)!}
                  target="_blank"
                  rel="noreferrer"
                >
                  Nguồn quy hoạch ↗
                </a>
              )}
              {planning &&
                (zoom < overlay.minZoom || zoom > overlay.maxNativeZoom) && (
                  <p>
                    Điều chỉnh mức phóng trong khoảng {overlay.minZoom}–
                    {overlay.maxNativeZoom} để xem lớp này.
                  </p>
                )}
            </>
          )}
        </div>
      )}
    </>
  );
}
