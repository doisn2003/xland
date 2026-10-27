import "server-only";
import { cookies } from "next/headers";
import { ApiError, record } from "./wire";
import { publicRead } from "./routes";

export const sessionCookie = "__Host-xland_session";
export const developmentSessionCookie = "xland_user_session";
export function apiBase() {
  const value = process.env.XLAND_API_BASE_URL;
  if (!value)
    throw new ApiError(
      503,
      "NOT_CONFIGURED",
      "Kết nối Xland chưa được cấu hình.",
    );
  const url = new URL(value);
  if (
    (url.protocol !== "https:" &&
      !(
        url.protocol === "http:" &&
        ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
      )) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/api\/v1\/?$/.test(url.pathname)
  )
    throw new ApiError(
      503,
      "NOT_CONFIGURED",
      "Cấu hình kết nối Xland không hợp lệ.",
    );
  return url.href.replace(/\/$/, "");
}
export function features() {
  return {
    booking: process.env.XLAND_ENABLE_BOOKING_WRITE === "true",
    events: process.env.XLAND_ENABLE_EVENT_REGISTRATION === "true",
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  };
}
export async function upstream(
  path: string,
  options: {
    method?: string;
    body?: string;
    token?: string;
    key?: string;
  } = {},
) {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.key) headers["Idempotency-Key"] = options.key;
  let response: Response;
  try {
    response = await fetch(apiBase() + path, {
      method: options.method ?? "GET",
      headers,
      body: options.body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      504,
      "UPSTREAM_UNAVAILABLE",
      "Không thể kết nối Xland. Vui lòng thử lại.",
    );
  }
  let payload: Record<string, unknown>;
  try {
    payload = record(await response.json());
  } catch {
    throw new ApiError(
      502,
      "INVALID_RESPONSE",
      "Máy chủ trả về dữ liệu không hợp lệ.",
    );
  }
  const requestId = response.headers.get("x-request-id") ?? undefined;
  if (!response.ok) {
    const error = record(payload.error);
    const details = Array.isArray(error.details)
      ? error.details.filter(
          (d): d is { field: string; code: string } =>
            !!d && typeof d.field === "string" && typeof d.code === "string",
        )
      : undefined;
    throw new ApiError(
      response.status,
      typeof error.code === "string" ? error.code : "UPSTREAM_ERROR",
      response.status >= 500
        ? "Dịch vụ tạm thời chưa sẵn sàng. Vui lòng thử lại."
        : String(error.message ?? "Yêu cầu không thành công."),
      requestId,
      details,
      response.headers.get("retry-after") ?? undefined,
    );
  }
  return { payload, requestId, status: response.status };
}
export async function serverRead(path: string) {
  const jar = await cookies();
  const token =
    jar.get(sessionCookie)?.value ??
    (process.env.XLAND_WEB_ORIGIN?.startsWith("https://")
      ? undefined
      : jar.get(developmentSessionCookie)?.value);
  return (await readUpstream(path, token)).payload;
}
export async function readUpstream(path: string, token?: string) {
  try {
    return await upstream(path, { token });
  } catch (error) {
    // Retry public reads anonymously after revocation. Private lists and all
    // mutations remain authenticated; never retry uncertain writes.
    if (
      token &&
      error instanceof ApiError &&
      error.status === 401 &&
      publicRead(path)
    )
      return upstream(path);
    throw error;
  }
}
