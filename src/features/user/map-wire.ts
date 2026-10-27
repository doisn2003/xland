import { decode, record, safeUrl } from "./wire";

export interface AreaMap {
  propertyId: string;
  availability: "ready" | "unconfigured" | "invalid_area" | "unavailable";
  notice: string;
  provider: string;
  areaLabel: string | null;
  publicArea: {
    id: string;
    label: string;
    centerLatitude: number;
    centerLongitude: number;
    initialZoom: number;
    radiusM: number;
    checkedAt: string | null;
    sourceUpdatedAt: string | null;
  } | null;
  tilePathTemplate: string | null;
  embedPageUrl: null;
  externalAreaMapUrl: string | null;
  externalDirectionsUrl: string | null;
  attribution: { label: string; url: string }[];
  planning: Planning | null;
}
interface Planning {
  availability: "ready" | "unconfigured" | "unavailable";
  region: string;
  notice: string;
  source: {
    label: string;
    sourceUrl: string;
    legendUrl: string | null;
    revision: string;
    tilePathTemplate: string;
    minZoom: number;
    maxNativeZoom: number;
    publishedAt: string | null;
    coverageBounds: number[] | null;
  } | null;
}
const invalid = (): never => {
  throw new Error("Thông tin bản đồ không hợp lệ.");
};
const text = (v: unknown) =>
  typeof v === "string" && v.trim() ? v : invalid();
const number = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : invalid();
const integer = (v: unknown) =>
  Number.isInteger(number(v)) ? (v as number) : invalid();
const date = (v: unknown) =>
  v == null ? null : (decode(v, "DateTime") as string);
function https(v: unknown) {
  const url = safeUrl(text(v));
  if (!url || new URL(url).hash) invalid();
  return url!;
}
const credits = [
  "https://www.openstreetmap.org/copyright",
  "https://www.geoapify.com/",
];
// Mirrors mobile's mapAreaPresentation: coordinates are named public areas only.
export function parseMap(raw: unknown, propertyId: string): AreaMap {
  const data = record(record(raw).data);
  for (const field of [
    "propertyId",
    "availability",
    "publicArea",
    "areaLabel",
    "provider",
    "poiMode",
    "attribution",
    "notice",
    "externalAreaMapUrl",
    "externalDirectionsUrl",
    "tilePathTemplate",
  ]) {
    if (!(field in data)) invalid();
  }
  if (
    data.propertyId !== propertyId ||
    !["ready", "unconfigured", "invalid_area", "unavailable"].includes(
      String(data.availability),
    )
  )
    invalid();
  const label = data.areaLabel === null ? null : text(data.areaLabel);
  let area: AreaMap["publicArea"] = null;
  if (data.publicArea !== null) {
    const a = record(data.publicArea),
      id = text(a.id),
      lat = number(a.centerLatitude),
      lng = number(a.centerLongitude),
      radius = integer(a.radiusM),
      zoom = integer(a.initialZoom);
    if (
      !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(id) ||
      a.precision !== "administrative_area" ||
      lat < 8 ||
      lat > 24 ||
      lng < 102 ||
      lng > 110 ||
      radius <= 0 ||
      radius > 100000 ||
      zoom < 6 ||
      zoom > 16 ||
      a.label !== label
    )
      invalid();
    area = {
      id,
      label: text(a.label),
      centerLatitude: lat,
      centerLongitude: lng,
      radiusM: radius,
      initialZoom: zoom,
      checkedAt: date(a.checkedAt),
      sourceUpdatedAt: date(a.sourceUpdatedAt),
    };
  }
  function googleLink(value: unknown, directions: boolean) {
    if (value === null) return null;
    const valueUrl = https(value),
      url = new URL(valueUrl),
      field = directions ? "destination" : "query";
    if (
      !label ||
      url.hostname !== "www.google.com" ||
      url.port ||
      url.pathname !== (directions ? "/maps/dir/" : "/maps/search/") ||
      url.searchParams.get("api") !== "1" ||
      url.searchParams.get(field) !== label ||
      [...url.searchParams.keys()].some(
        (k) =>
          !["api", field].includes(k) ||
          url.searchParams.getAll(k).length !== 1,
      )
    )
      invalid();
    return valueUrl;
  }
  if (!Array.isArray(data.attribution)) invalid();
  const attribution = (data.attribution as unknown[]).map((value) => {
    const a = record(value),
      url = https(a.url);
    if (!credits.includes(url)) invalid();
    return { label: text(a.label), url };
  });
  if (data.availability === "ready") {
    if (
      !area ||
      data.provider !== "geoapify" ||
      data.poiMode !== "none" ||
      data.tilePathTemplate !== "/maps/tiles/{z}/{x}/{y}.png" ||
      data.embedPageUrl != null ||
      !credits.every((url) => attribution.some((a) => a.url === url))
    )
      invalid();
  } else if (
    data.provider !== "none" ||
    data.poiMode !== "none" ||
    data.tilePathTemplate !== null ||
    data.embedPageUrl != null
  )
    invalid();
  return {
    propertyId,
    availability: data.availability as AreaMap["availability"],
    provider: text(data.provider),
    notice: text(data.notice),
    areaLabel: label,
    publicArea: area,
    tilePathTemplate: data.tilePathTemplate as string | null,
    embedPageUrl: null,
    externalAreaMapUrl: googleLink(data.externalAreaMapUrl, false),
    externalDirectionsUrl: googleLink(data.externalDirectionsUrl, true),
    attribution,
    planning: parsePlanning(data.planning, data.availability === "ready"),
  };
}

// A broken optional planning capability must not break a valid base map.
function parsePlanning(raw: unknown, baseReady: boolean): Planning | null {
  if (raw == null) return null;
  let region: string | null = null;
  try {
    const p = record(raw);
    if (
      p.availability === "not_supported" ||
      !["ha-noi", "hai-phong"].includes(String(p.region))
    )
      return null;
    region = String(p.region);
    const notice = text(p.notice);
    if (
      !["ready", "unconfigured", "unavailable"].includes(String(p.availability))
    )
      invalid();
    if (p.availability !== "ready") {
      if (p.source !== null) invalid();
      return {
        region,
        notice,
        availability: p.availability as Planning["availability"],
        source: null,
      };
    }
    const s = record(p.source),
      revision = text(s.revision),
      min = integer(s.minZoom),
      max = integer(s.maxNativeZoom),
      path = `/maps/planning/${region}/${revision}/{z}/{x}/{y}.png`;
    if (
      !baseReady ||
      !/^[a-z0-9][a-z0-9-]{0,63}$/.test(revision) ||
      s.tilePathTemplate !== path ||
      min < 6 ||
      max > 19 ||
      min > max
    )
      invalid();
    let bounds: number[] | null = null;
    if (s.coverageBounds != null) {
      if (!Array.isArray(s.coverageBounds) || s.coverageBounds.length !== 4)
        invalid();
      bounds = (s.coverageBounds as unknown[]).map(number);
      const [south, west, north, east] = bounds as [
        number,
        number,
        number,
        number,
      ];
      if (
        south < 8 ||
        north > 24 ||
        west < 102 ||
        east > 110 ||
        south >= north ||
        west >= east
      )
        invalid();
    }
    return {
      region,
      notice,
      availability: "ready",
      source: {
        label: text(s.label),
        sourceUrl: https(s.sourceUrl),
        legendUrl: s.legendUrl == null ? null : https(s.legendUrl),
        revision,
        tilePathTemplate: path,
        minZoom: min,
        maxNativeZoom: max,
        publishedAt: date(s.publishedAt),
        coverageBounds: bounds,
      },
    };
  } catch {
    return region
      ? {
          region,
          availability: "unavailable",
          notice:
            "Chưa tải được cấu hình lớp quy hoạch. Bản đồ nền vẫn sử dụng được.",
          source: null,
        }
      : null;
  }
}
