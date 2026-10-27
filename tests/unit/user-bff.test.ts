import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("server-only", () => ({}));
import {
  GET,
  POST,
  PATCH,
  DELETE,
} from "../../src/app/api/xland/[...path]/route";
const id = "00000000-0000-0000-0000-000000000001";
const token = "a".repeat(43);
const session = {
  profile: {
    id,
    displayName: "Kiểm thử",
    avatarUrl: null,
    contactPhone: null,
    address: null,
    contactVerified: false,
    updatedAt: new Date().toISOString(),
  },
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};
const ctx = (path: string) => ({
  params: Promise.resolve({
    path: path.split("?")[0]!.split("/").filter(Boolean),
  }),
});
function req(
  path: string,
  method = "GET",
  body?: unknown,
  headers: Record<string, string> = {},
) {
  return new NextRequest("https://web.example/api/xland" + path, {
    method,
    headers: {
      ...(method === "GET"
        ? {}
        : {
            "content-type": "application/json",
            origin: "https://web.example",
          }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
beforeEach(() => {
  vi.stubEnv("XLAND_API_BASE_URL", "https://api.example/api/v1");
  vi.stubEnv("XLAND_WEB_ORIGIN", "https://web.example");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("session and CSRF boundary", () => {
  it("stores opaque bearer only in a secure HttpOnly host cookie, never response JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ data: { accessToken: token, session } }),
        ),
    );
    const response = await POST(
      req("/auth/sessions", "POST", {
        username: "test",
        password: "secret-test",
      }),
      ctx("/auth/sessions"),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: session });
    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=lax");
    expect(cookie).not.toContain("Domain=");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("blocks login CSRF, missing origin, cross-site metadata, duplicate filters and routes outside allowlist before upstream", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const attempts: Record<string, string>[] = [
      { origin: "https://evil.example" },
      { origin: "" },
      { "sec-fetch-site": "cross-site" },
    ];
    for (const h of attempts)
      expect(
        (
          await POST(
            req("/auth/sessions", "POST", {}, h),
            ctx("/auth/sessions"),
          )
        ).status,
      ).toBe(403);
    expect(
      (await GET(req("/properties?limit=1&limit=2"), ctx("/properties")))
        .status,
    ).toBe(400);
    expect((await GET(req("/admin/users"), ctx("/admin/users"))).status).toBe(
      404,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("forwards only its user cookie and the idempotency key, preserving PATCH null versus omission", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ data: {} }));
    vi.stubGlobal("fetch", fetch);
    await PATCH(
      req(
        "/me/profile",
        "PATCH",
        { contactPhone: null },
        {
          cookie: `__Host-xland_session=${token}; xland_admin_session=wrong`,
          authorization: "Bearer attacker",
          "x-forwarded-for": "evil",
        },
      ),
      ctx("/me/profile"),
    );
    const [, options] = fetch.mock.calls[0]!;
    expect(options.headers.Authorization).toBe("Bearer " + token);
    expect(options.headers["x-forwarded-for"]).toBeUndefined();
    expect(options.body).toBe('{"contactPhone":null}');
    expect(options.cache).toBe("no-store");
    expect(options.redirect).toBe("error");
  });
  it("fails closed on timeout and keeps the current session after unsuccessful logout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network details with secret")),
    );
    const response = await DELETE(
      req(
        "/auth/sessions/current",
        "DELETE",
        {},
        { cookie: "__Host-xland_session=" + token },
      ),
      ctx("/auth/sessions/current"),
    );
    expect(response.status).toBe(504);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.text()).not.toContain("secret");
  });
  it("never lets a late 401 erase a newer cookie and preserves requestId", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json(
            { error: { code: "UNAUTHENTICATED", message: "Hết phiên" } },
            { status: 401, headers: { "X-Request-Id": "request-1" } },
          ),
        ),
    );
    const response = await GET(req("/auth/session"), ctx("/auth/session"));
    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("x-request-id")).toBe("request-1");
  });
  it("requires a stable key and blocks operational writes while policy flags are off", async () => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("XLAND_ENABLE_BOOKING_WRITE", "false");
    expect(
      (await POST(req("/bookings", "POST", {}), ctx("/bookings"))).status,
    ).toBe(409);
    expect(
      (
        await POST(
          req("/support-requests", "POST", {}),
          ctx("/support-requests"),
        )
      ).status,
    ).toBe(400);
  });
  it("lets an expired session browse public resources without retrying private reads", async () => {
    const unauthorized = () =>
      Response.json(
        { error: { code: "UNAUTHENTICATED", message: "Hết phiên" } },
        { status: 401 },
      );
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(unauthorized())
      .mockResolvedValueOnce(Response.json({ data: [] }))
      .mockImplementation(async () => unauthorized());
    vi.stubGlobal("fetch", fetch);
    const headers = { cookie: "__Host-xland_session=" + token };
    expect(
      (
        await GET(
          req("/properties", "GET", undefined, headers),
          ctx("/properties"),
        )
      ).status,
    ).toBe(200);
    expect(fetch.mock.calls[0]![1].headers.Authorization).toBe(
      "Bearer " + token,
    );
    expect(fetch.mock.calls[1]![1].headers.Authorization).toBeUndefined();
    expect(
      (
        await GET(
          req("/properties?savedOnly=true", "GET", undefined, headers),
          ctx("/properties"),
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await GET(
          req("/feed?feedScope=following", "GET", undefined, headers),
          ctx("/feed"),
        )
      ).status,
    ).toBe(401);
    expect(fetch).toHaveBeenCalledTimes(4);
  });
  it("clears the cookie when explicitly logging out an already revoked session", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json(
            { error: { code: "UNAUTHENTICATED", message: "Hết phiên" } },
            { status: 401 },
          ),
        ),
    );
    const response = await DELETE(
      req(
        "/auth/sessions/current",
        "DELETE",
        {},
        { cookie: "__Host-xland_session=" + token },
      ),
      ctx("/auth/sessions/current"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
