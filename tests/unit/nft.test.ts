import { describe, expect, it } from "vitest";
import { emptyLedger, holding, offerings, percent, placeOrder, quote, remaining, restoreLedger } from "../../src/features/nft/model";
const offering = offerings[0]!;
const input = { id: "DEMO-first", offeringId: offering.id, quantity: 10, outcome: "success" as const };
describe("NFT demo ledger", () => {
  it("uses fixed supply for share and includes reserved stock", () => {
    expect(remaining(emptyLedger, offering)).toBe(750);
    expect(percent(10, offering.supply)).toBe("1%");
    expect(quote(offering, 10)).toEqual({ subtotal: 28000000, fee: 0, total: 28000000 });
  });
  it.each([0, -1, 1.5, NaN, Infinity, 751])("rejects invalid quantity %s", quantity => {
    expect(() => placeOrder(emptyLedger, { ...input, quantity })).toThrow();
  });
  it("credits once and rejects conflicting id reuse", () => {
    const ledger = placeOrder(emptyLedger, input);
    expect(placeOrder(ledger, input)).toBe(ledger);
    expect(holding(ledger, offering.id)).toEqual({ quantity: 10, cost: 28000000 });
    expect(remaining(ledger, offering)).toBe(740);
    expect(() => placeOrder(ledger, { ...input, quantity: 11 })).toThrow();
  });
  it.each(["failed", "cancelled"] as const)("does not credit %s orders", outcome => {
    const ledger = placeOrder(emptyLedger, { ...input, outcome });
    expect(holding(ledger, offering.id).quantity).toBe(0);
    expect(remaining(ledger, offering)).toBe(750);
    expect(ledger.orders).toHaveLength(1);
  });
  it("rejects paused, sold-out and depleted offerings", () => {
    for (const closed of offerings.slice(1)) expect(() => placeOrder(emptyLedger, { ...input, offeringId: closed.id })).toThrow();
    const ledger = placeOrder(emptyLedger, { ...input, quantity: 750 });
    expect(() => placeOrder(ledger, { ...input, id: "DEMO-next", quantity: 1 })).toThrow();
  });
  it("restores by replay and refuses corrupt or incompatible data", () => {
    const ledger = placeOrder(emptyLedger, input);
    expect(restoreLedger(JSON.stringify(ledger))).toEqual(ledger);
    expect(restoreLedger(JSON.stringify({ ...ledger, orders: ledger.orders.map(o => ({ ...o, total: 1 })) }))).toEqual(ledger);
    for (const raw of ["{", '{"version":0,"orders":[]}', '{"version":1,"orders":[null]}']) expect(() => restoreLedger(raw)).toThrow();
  });
});
