const id =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const paging = ["limit", "cursor"];
export const propertyKeys = [
  "query",
  "regions",
  "category",
  "provinceCode",
  "districtCode",
  "minPriceVnd",
  "maxPriceVnd",
  "areaBands",
  "landTypes",
  "minRoadWidthM",
  "hasDocuments",
  "savedOnly",
  "sort",
];
export interface RouteRule {
  methods: string[];
  pattern: RegExp;
  query: string[];
  gate?: "booking" | "events";
  idempotent?: boolean;
}
const rule = (
  methods: string,
  path: string,
  query: string[] = [],
  extras: Partial<RouteRule> = {},
): RouteRule => ({
  methods: methods.split(","),
  pattern: new RegExp("^" + path.replaceAll(":id", id) + "$"),
  query,
  ...extras,
});
export const userRoutes = [
  rule("GET", "/auth/capabilities"),
  rule("GET", "/auth/session"),
  rule("POST", "/auth/sessions"),
  rule("POST", "/auth/google/sessions"),
  rule("POST", "/auth/phone/challenges", [], { idempotent: true }),
  rule("POST", "/auth/phone/sessions"),
  rule("DELETE", "/auth/sessions/current"),
  rule("GET,PATCH", "/me/profile"),
  rule("GET,PATCH", "/me/settings"),
  rule("GET", "/properties", [...propertyKeys, ...paging]),
  rule("GET", "/properties/count", propertyKeys),
  rule("GET", "/catalog/locations", ["provinceCode"]),
  rule("GET", "/properties/:id"),
  rule("GET", "/properties/:id/children", paging),
  rule("PUT,DELETE", "/properties/:id/saved"),
  rule("GET", "/properties/:id/(legal|share|area-map)"),
  rule("GET", "/properties/:id/area", ["category"]),
  rule("GET", "/(properties|consultants)/:id/availability", [
    "fromDate",
    "toDate",
  ]),
  rule("GET", "/booking-deposit-policy"),
  rule("POST", "/bookings", [], { gate: "booking", idempotent: true }),
  rule("GET", "/me/bookings", [...paging, "status"]),
  rule("GET", "/bookings/:id"),
  rule("GET", "/bookings/:id/payments", paging),
  rule("GET", "/payments/:id"),
  rule("POST", "/payments/:id/refresh"),
  rule("GET", "/feed", [...paging, "feedScope", "region", "category"]),
  rule("GET", "/videos/:id"),
  rule("GET", "/videos/:id/share"),
  rule("PUT,DELETE", "/videos/:id/(like|saved)"),
  rule("GET", "/videos/:id/comments", paging),
  rule("POST", "/videos/:id/comments", [], { idempotent: true }),
  rule("DELETE", "/videos/:id/comments/:id"),
  rule("GET", "/authors/:id"),
  rule("GET", "/authors/:id/videos", paging),
  rule("PUT,DELETE", "/authors/:id/follow"),
  rule("GET", "/consultants/:id"),
  rule("GET", "/consultants/:id/(videos|properties|reviews)", paging),
  rule("GET", "/events", [...paging, "status"]),
  rule("GET", "/events/:id"),
  rule("GET", "/events/:id/share"),
  rule("PUT,DELETE", "/events/:id/saved"),
  rule("POST", "/events/:id/registrations", [], {
    gate: "events",
    idempotent: true,
  }),
  rule("GET", "/clubs", paging),
  rule("GET", "/clubs/:id"),
  rule(
    "GET",
    "/me/(saved-videos|following|event-registrations|saved-events|support-requests|finance-plans)",
    paging,
  ),
  rule("POST", "/support-requests", [], { idempotent: true }),
  rule("POST", "/finance/estimates"),
  rule("POST", "/me/finance-plans", [], { idempotent: true }),
  rule("DELETE", "/me/finance-plans/:id"),
];
export function routeFor(method: string, path: string) {
  return userRoutes.find(
    (r) => r.methods.includes(method) && r.pattern.test(path),
  );
}
export function publicRead(path: string): boolean {
  const url = new URL(path, "https://xland.invalid");
  return (
    !!routeFor("GET", url.pathname) &&
    /^\/(properties|catalog|feed|videos|authors|consultants|events|clubs|booking-deposit-policy)(\/|$)/.test(
      url.pathname,
    ) &&
    url.searchParams.get("savedOnly") !== "true" &&
    url.searchParams.get("feedScope") !== "following"
  );
}
export function validQuery(
  rule: RouteRule,
  query: URLSearchParams,
  method = "GET",
) {
  const seen = new Set<string>();
  for (const [key, value] of query) {
    if (
      method !== "GET" ||
      seen.has(key) ||
      !rule.query.includes(key) ||
      value.length > (key === "cursor" ? 4096 : 256)
    )
      return false;
    seen.add(key);
  }
  return true;
}
