import { NextRequest, NextResponse } from "next/server";
import { ApiError, entity, record } from "@/features/user/wire";
import { routeFor, validQuery } from "@/features/user/routes";
import {
  features,
  developmentSessionCookie,
  readUpstream,
  sessionCookie,
  upstream,
} from "@/features/user/server";

export const runtime = "nodejs";
async function handle(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const headers = {
    "Cache-Control": "no-store, private",
    Vary: "Cookie",
    "X-Content-Type-Options": "nosniff",
  };
  const origin = process.env.XLAND_WEB_ORIGIN ?? req.nextUrl.origin;
  const secure = origin.startsWith("https://");
  const cookieName = secure ? sessionCookie : developmentSessionCookie;
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
  };
  let path = "";
  try {
    path = "/" + (await context.params).path.join("/");
    if (path === "/capabilities" && req.method === "GET" && !req.nextUrl.search)
      return NextResponse.json({ data: features() }, { headers });
    const rule = routeFor(req.method, path);
    if (!rule)
      throw new ApiError(404, "NOT_FOUND", "Chức năng không khả dụng.");
    if (!validQuery(rule, req.nextUrl.searchParams, req.method))
      throw new ApiError(400, "INVALID_INPUT", "Bộ lọc không hợp lệ.");
    if (req.method !== "GET") {
      if (
        req.headers.get("origin") !== origin ||
        req.headers.get("sec-fetch-site") === "cross-site"
      )
        throw new ApiError(403, "FORBIDDEN", "Nguồn yêu cầu không hợp lệ.");
      if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
        throw new ApiError(415, "INVALID_INPUT", "Yêu cầu phải ở dạng JSON.");
    }
    if (rule.gate && !features()[rule.gate])
      throw new ApiError(
        409,
        "POLICY_NOT_CONFIGURED",
        rule.gate === "booking"
          ? "Đặt lịch đang chờ hoàn thiện chính sách tiếp nhận. Bạn có thể gửi yêu cầu hỗ trợ."
          : "Sự kiện chưa mở tiếp nhận đăng ký trên website.",
      );
    const key = req.headers.get("idempotency-key") ?? undefined;
    if (rule.idempotent && (!key || !/^[\x21-\x7e]{16,128}$/.test(key)))
      throw new ApiError(400, "INVALID_INPUT", "Thiếu mã yêu cầu.");
    let body: string | undefined;
    if (req.method !== "GET") {
      if (Number(req.headers.get("content-length")) > 65536)
        throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Yêu cầu quá lớn.");
      const reader = req.body?.getReader();
      let size = 0;
      const chunks: Uint8Array[] = [];
      if (reader) {
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > 65536) {
            await reader.cancel();
            throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Yêu cầu quá lớn.");
          }
          chunks.push(part.value);
        }
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      body = new TextDecoder().decode(bytes) || "{}";
      try {
        record(JSON.parse(body));
      } catch {
        throw new ApiError(
          400,
          "INVALID_INPUT",
          "Nội dung yêu cầu không hợp lệ.",
        );
      }
    }
    const login =
      req.method === "POST" &&
      /^\/auth\/(?:sessions|google\/sessions|phone\/sessions)$/.test(path);
    const token =
      path.startsWith("/auth/") &&
      path !== "/auth/session" &&
      path !== "/auth/sessions/current"
        ? undefined
        : req.cookies.get(cookieName)?.value;
    const result =
      req.method === "GET"
        ? await readUpstream(path + req.nextUrl.search, token)
        : await upstream(path + req.nextUrl.search, {
            method: req.method,
            body,
            token,
            key,
          });
    if (result.requestId)
      Object.assign(headers, { "X-Request-Id": result.requestId });
    if (login) {
      const data = record(result.payload.data),
        session = entity(data.session, "Session");
      if (
        typeof data.accessToken !== "string" ||
        !/^[A-Za-z0-9_-]{43}$/.test(data.accessToken)
      )
        throw new ApiError(
          502,
          "INVALID_RESPONSE",
          "Phiên đăng nhập không hợp lệ.",
        );
      const maxAge = Math.min(
        86400,
        Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000),
      );
      if (maxAge <= 0)
        throw new ApiError(
          502,
          "INVALID_RESPONSE",
          "Phiên đăng nhập đã hết hạn.",
        );
      const response = NextResponse.json(
        { data: session },
        { status: result.status, headers },
      );
      response.cookies.set(cookieName, data.accessToken, {
        ...cookieOptions,
        maxAge,
      });
      return response;
    }
    const response = NextResponse.json(result.payload, {
      status: result.status,
      headers,
    });
    if (path === "/auth/sessions/current")
      response.cookies.set(cookieName, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch (caught) {
    const error =
      caught instanceof ApiError
        ? caught
        : new ApiError(500, "INTERNAL_ERROR", "Không thể xử lý yêu cầu.");
    if (
      req.method === "DELETE" &&
      path === "/auth/sessions/current" &&
      error.status === 401
    ) {
      const response = NextResponse.json({ data: null }, { headers });
      response.cookies.set(cookieName, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    const response = NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
        requestId: error.requestId,
      },
      { status: error.status, headers },
    );
    if (error.retryAfter) response.headers.set("Retry-After", error.retryAfter);
    if (error.requestId) response.headers.set("X-Request-Id", error.requestId);
    // Do not expire a cookie from a stale 401: another tab may already have
    // replaced it with a newer session. Cookie expiry and explicit logout own
    // deletion; the client clears its private view on an unauthenticated read.
    return response;
  }
}
export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
