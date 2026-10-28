import { wireEnums, wireSchemas, type WireTypes } from "./contract";

export interface Page<T> {
  data: T[];
  meta: {
    total: number | null;
    hasMore: boolean;
    nextCursor: string | null;
    selectedCriteriaCount?: number;
  };
}
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId?: string,
    public details?: { field: string; code: string }[],
    public retryAfter?: string,
  ) {
    super(message);
  }
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ApiError(
      502,
      "INVALID_RESPONSE",
      "Dữ liệu máy chủ không đúng định dạng.",
    );
  return value as Record<string, unknown>;
}
function invalid(): never {
  throw new ApiError(
    502,
    "INVALID_RESPONSE",
    "Dữ liệu máy chủ không tương thích. Vui lòng thử lại.",
  );
}
function validDate(value: string): boolean {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || value.startsWith("0000"))
    return false;
  const date = new Date(value + "T00:00:00Z");
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
function validInstant(value: string): boolean {
  const parts =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?(Z|([+-])(\d{2}):(\d{2}))$/.exec(
      value,
    );
  return (
    !!parts &&
    validDate(parts[1]!) &&
    Number(parts[2]) <= 23 &&
    Number(parts[3]) <= 59 &&
    Number(parts[4]) <= 59 &&
    (!parts[7] || (Number(parts[7]) <= 23 && Number(parts[8]) <= 59)) &&
    Number.isFinite(Date.parse(value))
  );
}
// Validate the same enum/null/decimal boundaries as Flutter; ignore additive fields.
export function decode(value: unknown, type: string): unknown {
  if (type.endsWith("?"))
    return value === null ? null : decode(value, type.slice(0, -1));
  if (type.startsWith("List<"))
    return Array.isArray(value)
      ? value.map((v) => decode(v, type.slice(5, -1)))
      : invalid();
  if (wireEnums[type])
    return typeof value === "string" && wireEnums[type].includes(value)
      ? value
      : invalid();
  if (["String", "Uri", "DateTime", "Vnd", "DecimalValue"].includes(type)) {
    if (typeof value !== "string") return invalid();
    if (type === "Vnd" && !/^(0|[1-9][0-9]{0,19})$/.test(value))
      return invalid();
    if (
      type === "DecimalValue" &&
      !/^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(value)
    )
      return invalid();
    if (type === "DateTime" && !validInstant(value)) return invalid();
    if (type === "Uri" && !safeUrl(value)) return invalid();
    return value;
  }
  if (type === "int")
    return typeof value === "number" &&
      Number.isSafeInteger(value) &&
      value >= 0
      ? value
      : invalid();
  if (type === "double")
    return typeof value === "number" && Number.isFinite(value)
      ? value
      : invalid();
  if (type === "Uint8List") return Array.isArray(value) && value.every(v => Number.isInteger(v) && v >= 0 && v <= 255) ? value : invalid();
  if (type === "bool") return typeof value === "boolean" ? value : invalid();
  const schema = wireSchemas[type];
  if (!schema) return invalid();
  const raw = record(value),
    result: Record<string, unknown> = {};
  for (const [key, fieldType] of Object.entries(schema)) {
    const field = raw[key] === undefined && ((type === "Property" && ["communeCode","communeName","addressDetail","oldAddress"].includes(key)) || (type === "PropertyFilter" && key === "communeCode")) ? null :
      type === "FilterCatalog" && key === "communes" && raw[key] === undefined ? [] :
      type === "Property" && raw[key] === undefined && ["parentPropertyId", "hasSubplots", "isCorner"].includes(key)
      ? (key === "parentPropertyId" ? null : false) :
      type === "UserProfile" && key === "address" && raw[key] === undefined ? null :
      type === "AuthorProfile" && key === "author"
        ? raw
        : raw[key] === undefined &&
            key === "description" &&
            ["AgendaItem", "Speaker"].includes(type)
          ? null
          : raw[key];
    result[key] = decode(field, fieldType);
    if (
      ["checkedDate", "uploadedDate"].includes(key) &&
      result[key] !== null &&
      !validDate(String(result[key]))
    )
      invalid();
  }
  return result;
}
export function entity<K extends keyof WireTypes>(
  value: unknown,
  type: K,
): WireTypes[K] {
  return decode(value, type) as WireTypes[K];
}
export function page<K extends keyof WireTypes>(
  value: unknown,
  type: K,
): Page<WireTypes[K]> {
  const raw = record(value),
    meta = record(raw.meta);
  const data = decode(raw.data, `List<${type}>`) as WireTypes[K][];
  const hasMore = decode(meta.hasMore, "bool") as boolean,
    nextCursor = decode(meta.nextCursor, "String?") as string | null;
  if (hasMore !== (nextCursor !== null) || nextCursor === "") invalid();
  return {
    data,
    meta: {
      hasMore,
      nextCursor,
      total: decode(meta.total, "int?") as number | null,
      ...(meta.selectedCriteriaCount === undefined
        ? {}
        : {
            selectedCriteriaCount: decode(
              meta.selectedCriteriaCount,
              "int",
            ) as number,
          }),
    },
  };
}
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function money(value: string | null | undefined): string {
  return value == null
    ? "Chưa có thông tin"
    : `${BigInt(value).toLocaleString("vi-VN")} ₫`;
}
export function decimal(value: string | null | undefined, unit = ""): string {
  if (value == null) return "Chưa có thông tin";
  const [whole, fraction] = value.split("."),
    tail = fraction?.replace(/0+$/, "");
  return `${BigInt(whole!).toLocaleString("vi-VN")}${tail ? "," + tail : ""}${unit ? " " + unit : ""}`;
}
export function dateTime(value: string, timeZone = "Asia/Ho_Chi_Minh") {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(new Date(value));
}
export function localDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function returnTo(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value) ||
    /%[0-9a-f]{2}/i.test(value.split("?")[0]!)
  )
    return "/tai-khoan";
  const u = new URL(value, "https://xland.invalid");
  return u.origin === "https://xland.invalid" &&
    !u.pathname.startsWith("/admin") &&
    !u.pathname.startsWith("/dang-nhap")
    ? u.pathname + u.search + u.hash
    : "/tai-khoan";
}
