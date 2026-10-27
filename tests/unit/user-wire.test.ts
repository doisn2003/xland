import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  decode,
  entity,
  decimal,
  money,
  page,
  returnTo,
  safeUrl,
} from "../../src/features/user/wire";
import { routeFor, validQuery } from "../../src/features/user/routes";

describe("mobile wire boundaries", () => {
  it("rejects impossible dates and offsets just like the mobile mapper", () => {
    for (const value of [
      "2026-02-30T00:00:00Z",
      "0000-01-01T00:00:00Z",
      "2026-10-26T24:00:00Z",
      "2026-10-26T12:00:00+24:00",
      "2026-10-26",
    ])
      expect(() => decode(value, "DateTime")).toThrow();
    expect(decode("2026-10-26T17:00:00.123456+07:00", "DateTime")).toBe(
      "2026-10-26T17:00:00.123456+07:00",
    );
  });
  it("preserves 20-digit VND and all six area decimals without Number conversion", () => {
    expect(money("99999999999999999999")).toBe("99.999.999.999.999.999.999 ₫");
    expect(decimal("9007199254740993.123456", "m²")).toBe(
      "9.007.199.254.740.993,123456 m²",
    );
    expect(money("0")).toBe("0 ₫");
    expect(decimal(null)).toBe("Chưa có thông tin");
    for (const invalid of [
      9007199254740992,
      "-1",
      "01",
      "1e5",
      "1.2",
      "100000000000000000000",
    ])
      expect(() => decode(invalid, "Vnd")).toThrow();
    expect(() => decode("1.1234567", "DecimalValue")).toThrow();
  });
  it("maps flattened author transport to the mobile AuthorProfile domain", () => {
    const author = entity(
      {
        id: "author",
        displayName: "Người đăng",
        role: null,
        avatarUrl: null,
        isVerified: false,
        isFollowing: false,
        videoCount: 1,
        followerCount: 0,
        consultantId: null,
        isIllustrative: true,
        additive: "allowed",
      },
      "AuthorProfile",
    );
    expect(author.author.displayName).toBe("Người đăng");
    expect(author.consultantId).toBeNull();
    expect("additive" in author).toBe(false);
  });
  it("rejects unknown enums, missing required fields, invalid URLs and broken cursors", () => {
    expect(() => decode("submitted", "BookingStatus")).toThrow();
    expect(() => entity({ active: true }, "MutationResult")).toThrow();
    expect(() => decode("javascript:alert(1)", "Uri")).toThrow();
    expect(() =>
      page(
        { data: [], meta: { hasMore: true, nextCursor: null, total: null } },
        "Property",
      ),
    ).toThrow();
    expect(
      page(
        { data: [], meta: { hasMore: false, nextCursor: null, total: 0 } },
        "Property",
      ).data,
    ).toEqual([]);
    expect(entity({ active: false, count: null }, "MutationResult")).toEqual({
      active: false,
      count: null,
    });
  });
  it("accepts historical null finance result without inventing a calculation", () => {
    const plan = entity(
      {
        id: "plan",
        propertyId: "property",
        label: "Kế hoạch cũ",
        input: {
          propertyId: "property",
          equityVnd: "1",
          loanVnd: "2",
          termMonths: 60,
          annualRatePercent: "0",
          method: "declining_balance",
        },
        result: null,
        createdAt: "2026-10-26T00:00:00Z",
      },
      "SavedFinancePlan",
    );
    expect(plan.result).toBeNull();
  });
  it("only permits safe local return destinations", () => {
    for (const value of [
      "//evil.example",
      "/\\evil.example",
      "https://evil.example",
      "/%2f/evil",
      "/admin",
      "/dang-nhap",
      "/\n/evil",
    ])
      expect(returnTo(value)).toBe("/tai-khoan");
    expect(returnTo("/lo-dat/id?source=video#tai-chinh")).toBe(
      "/lo-dat/id?source=video#tai-chinh",
    );
    expect(safeUrl("https://name:secret@example.com/image")).toBeNull();
  });
});
describe("BFF allowlist", () => {
  it("excludes admin, simulation, arbitrary URLs, uploads and unsupported financial writes", () => {
    for (const path of [
      "/admin/properties",
      "/http://evil",
      "/auth/../admin",
      "/payments/simulate",
      "/bookings/00000000-0000-0000-0000-000000000001/payment-intents",
    ])
      expect(routeFor("POST", path)).toBeUndefined();
    expect(
      routeFor("DELETE", "/properties/00000000-0000-0000-0000-000000000001"),
    ).toBeUndefined();
  });
  it("rejects duplicate and unexpected queries and never number-coerces money", () => {
    const r = routeFor("GET", "/properties")!;
    expect(validQuery(r, new URLSearchParams("limit=10&limit=20"))).toBe(false);
    expect(validQuery(r, new URLSearchParams("url=https://evil.example"))).toBe(
      false,
    );
    expect(
      validQuery(r, new URLSearchParams("minPriceVnd=99999999999999999999")),
    ).toBe(true);
    expect(validQuery(r, new URLSearchParams("limit=1"), "POST")).toBe(false);
  });
  it("keeps write policy flags and idempotency on all create operations", () => {
    expect(routeFor("POST", "/bookings")).toMatchObject({
      gate: "booking",
      idempotent: true,
    });
    expect(
      routeFor(
        "POST",
        "/events/00000000-0000-0000-0000-000000000001/registrations",
      ),
    ).toMatchObject({ gate: "events", idempotent: true });
    for (const path of [
      "/support-requests",
      "/me/finance-plans",
      "/auth/phone/challenges",
    ])
      expect(routeFor("POST", path)?.idempotent).toBe(true);
  });
});
it("production user source has no fixture imports or local mock ledgers", () => {
  const scan = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? scan(resolve(dir, e.name))
        : /\.tsx?$/.test(e.name)
          ? [readFileSync(resolve(dir, e.name), "utf8")]
          : [],
    );
  const source = scan(resolve("src")).join("\n");
  expect(source).not.toMatch(
    /@\/data\/(properties|journey|advisors)|features\/(journey|nft)|localStorage/,
  );
});
