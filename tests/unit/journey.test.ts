import { describe, expect, it } from "vitest";
import { properties } from "../../src/data/properties";
import { catalogResults, catalogUrl, parseCatalogQuery } from "../../src/features/properties/query";
import { canRequestVisit, dispatchVisit, emptyJourney, restoreJourney, scheduleErrors, toggleFavorite, visitsFor, type VisitCommand } from "../../src/features/journey/model";

const schedule = { date: "2026-10-05", slot: "09:00", people: 2 };
const create: VisitCommand = { id: "VISIT-first", kind: "create", propertyId: "XL-001", schedule };

describe("URL catalog", () => {
  it("round trips Vietnamese filters and sort through a shareable URL", () => {
    const query = parseCatalogQuery({ region: "Hà Nội", category: "Vùng ven đô thị", setting: "Nhà vườn", price: "from3", sort: "price-desc" });
    const url = new URL(catalogUrl(query.filters, query.sort), "https://xland.test");
    expect(parseCatalogQuery(Object.fromEntries(url.searchParams))).toEqual(query);
    expect(catalogResults(query).map(p => p.id)).toEqual(["XL-008", "XL-006"]);
  });
  it("ignores invalid and repeated parameters without changing the source order", () => {
    const query = parseCatalogQuery({ region: ["Hà Nội", "Hưng Yên"], price: "0", category: "unknown", sort: "javascript:bad" });
    expect(catalogUrl(query.filters, query.sort)).toBe("/lo-dat");
    expect(catalogResults(query)).toEqual(properties);
    catalogResults({ ...query, sort: "price-asc" });
    expect(properties[0]?.id).toBe("XL-004");
  });
});

describe("saved properties and visit requests", () => {
  it("saves once, removes and refuses unknown properties", () => {
    const saved = toggleFavorite(emptyJourney, "XL-001");
    expect(saved.favorites).toEqual(["XL-001"]);
    expect(toggleFavorite(saved, "XL-001")).toEqual(emptyJourney);
    expect(() => toggleFavorite(saved, "missing")).toThrow();
  });
  it("creates a pending request once, never confirms it automatically", () => {
    const journey = dispatchVisit(emptyJourney, create);
    expect(visitsFor(journey)[0]).toMatchObject({ id: create.id, status: "submitted", ...schedule });
    expect(dispatchVisit(journey, create)).toBe(journey);
    expect(() => dispatchVisit(journey, { ...create, propertyId: "XL-004" })).toThrow();
    expect(() => dispatchVisit(journey, { ...create, id: "VISIT-repeat" })).toThrow(/đã có lịch/);
  });
  it("blocks paused, sold and missing properties", () => {
    expect(canRequestVisit("sold")).toBe(false);
    expect(canRequestVisit("paused")).toBe(false);
    expect(() => dispatchVisit(emptyJourney, { ...create, propertyId: "XL-003" })).toThrow();
    expect(() => dispatchVisit(emptyJourney, { ...create, propertyId: "missing" })).toThrow();
  });
  it.each([
    { ...schedule, date: "2026-09-30" }, { ...schedule, date: "2026-11-01" },
    { ...schedule, date: "2026-02-30" }, { ...schedule, date: "" },
    { ...schedule, slot: "03:00" }, { ...schedule, people: 1.5 },
    { ...schedule, people: 0 }, { ...schedule, people: 9 },
  ])("rejects invalid appointment %j", invalid => {
    expect(Object.keys(scheduleErrors(invalid)).length).toBeGreaterThan(0);
    expect(() => dispatchVisit(emptyJourney, { ...create, schedule: invalid })).toThrow();
  });
  it("keeps the original schedule, logs a change request and prevents unchanged resubmission", () => {
    const changed = dispatchVisit(emptyJourney, { id: "VISIT-change", kind: "reschedule", visitId: "VISIT-SEED-2", schedule });
    const visit = visitsFor(changed).find(item => item.id === "VISIT-SEED-2")!;
    expect(visit).toMatchObject({ status: "change_requested", date: "2026-10-04", slot: "14:00", requestedSchedule: schedule });
    expect(visit.history).toHaveLength(2);
    expect(() => dispatchVisit(changed, { id: "VISIT-change2", kind: "reschedule", visitId: visit.id, schedule })).toThrow(/chưa thay đổi/);
  });
  it("cancellation stays pending, rejects further changes and does not allow a duplicate booking", () => {
    const cancelled = dispatchVisit(dispatchVisit(emptyJourney, create), { id: "VISIT-cancel", kind: "cancel", visitId: create.id });
    expect(visitsFor(cancelled)[0]?.status).toBe("cancel_requested");
    expect(() => dispatchVisit(cancelled, { id: "VISIT-again", kind: "cancel", visitId: create.id })).toThrow();
    expect(() => dispatchVisit(cancelled, { ...create, id: "VISIT-new" })).toThrow();
    expect(() => dispatchVisit(emptyJourney, { id: "VISIT-closed", kind: "cancel", visitId: "VISIT-SEED-3" })).toThrow();
  });
  it("replays persisted commands and reset restores seed history", () => {
    const journey = toggleFavorite(dispatchVisit(emptyJourney, create), "XL-001");
    expect(restoreJourney(JSON.stringify(journey))).toEqual(journey);
    expect(restoreJourney(null)).toEqual(emptyJourney);
    expect(visitsFor(emptyJourney)).toHaveLength(3);
    expect(emptyJourney.commands).toHaveLength(0);
  });
  it.each(["{", "null", '{"version":2}', JSON.stringify({ ...emptyJourney, favorites: ["missing"] }), JSON.stringify({ ...emptyJourney, commands: [null] }), JSON.stringify({ ...emptyJourney, commands: [{ ...create, schedule: null }] })])("rejects incompatible or malformed stored data", raw => {
    expect(() => restoreJourney(raw)).toThrow();
  });
});
