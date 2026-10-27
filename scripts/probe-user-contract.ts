import { entity, page, record } from "../src/features/user/wire";
import type { WireTypes } from "../src/features/user/contract";

// Public, read-only contract probe. No login, mutations, maps/quota or database access.
async function main() {
  const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3311/api/v1");
  if (origin.protocol !== "https:" && origin.hostname !== "127.0.0.1")
    throw new Error("Use HTTPS or the isolated loopback server");
  let checks = 0;
  async function get(path: string) {
    const response = await fetch(origin.href.replace(/\/$/, "") + path, {
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error(
        path.replace(/[0-9a-f-]{36}/gi, ":id") + ": HTTP " + response.status,
      );
    checks++;
    return (await response.json()) as unknown;
  }
  async function one<K extends keyof WireTypes>(path: string, type: K) {
    return entity(record(await get(path)).data, type);
  }
  async function many<K extends keyof WireTypes>(path: string, type: K) {
    return page(await get(path), type);
  }
  const [properties, feed] = await Promise.all([
    many("/properties?limit=3", "Property"),
    many("/feed?limit=3", "FeedVideo"),
  ]);
  const p = properties.data[0],
    v = feed.data[0];
  if (!p || !v) throw new Error("Public catalog/feed empty");
  const results = await Promise.allSettled([
    one("/properties/" + p.id, "Property"),
    one("/properties/" + p.id + "/legal", "LegalSummary"),
    one("/properties/" + p.id + "/area", "AreaInfo"),
    one("/catalog/locations", "FilterCatalog"),
    one("/booking-deposit-policy", "DepositPolicy"),
    one("/authors/" + v.author.id, "AuthorProfile"),
    many("/authors/" + v.author.id + "/videos?limit=2", "FeedVideo"),
    one("/consultants/" + p.consultantId, "Consultant"),
    many(
      "/consultants/" + p.consultantId + "/reviews?limit=2",
      "ConsultantReview",
    ),
    many("/events?limit=3", "XlandEvent"),
    many("/clubs?limit=3", "Club"),
    one("/videos/" + v.id, "FeedVideo"),
    many("/videos/" + v.id + "/comments?limit=2", "VideoComment"),
    one("/properties/" + p.id + "/share", "ShareLink"),
  ]);
  const failures = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) =>
      r.reason instanceof Error ? r.reason.message : "Contract failure",
    );
  console.log(
    JSON.stringify(
      {
        checks,
        totalProperties: properties.meta.total,
        publicOnly: true,
        mutations: 0,
        failures,
      },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
}
void main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Probe failed");
  process.exitCode = 1;
});
