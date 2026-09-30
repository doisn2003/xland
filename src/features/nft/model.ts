import { properties } from "../../data/properties";

const offeringSeeds = [
  { propertyId: "XL-001", tokenId: "1", sold: 240, reserved: 10, status: "open" as const },
  { propertyId: "XL-002", tokenId: "2", sold: 1000, reserved: 0, status: "sold_out" as const },
  { propertyId: "XL-003", tokenId: "3", sold: 0, reserved: 0, status: "paused" as const },
];
export const offerings = offeringSeeds.map(seed => {
  const property = properties.find(item => item.id === seed.propertyId)!;
  return {
  ...seed, id: `NFT-${property.id}`, slug: property.slug,
  standard: "ERC-1155" as const,
  supply: property.nft?.supply ?? 1000, price: property.nft?.price ?? property.price / 1000,
  feeBps: 0,
}; });
export type Offering = typeof offerings[number];
export type Outcome = "success" | "failed" | "cancelled";
export type Order = { id: string; offeringId: string; quantity: number; outcome: Outcome; total: number; fee: number; createdAt: string };
export type Ledger = { version: 1; orders: Order[] };
export const emptyLedger: Ledger = { version: 1, orders: [] };
export const money = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
export const percent = (quantity: number, supply: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(quantity / supply * 100)}%`;
export const statusLabel = { open: "Đang mở bán", sold_out: "Hết NFT", paused: "Tạm dừng" };
export const outcomeLabel = { success: "Đã ghi nhận mua NFT", failed: "Yêu cầu chưa hoàn tất", cancelled: "Đã hủy yêu cầu" };

export function holding(ledger: Ledger, id: string) {
  return ledger.orders.filter(o => o.offeringId === id && o.outcome === "success")
    .reduce((sum, order) => ({ quantity: sum.quantity + order.quantity, cost: sum.cost + order.total }), { quantity: 0, cost: 0 });
}
export function remaining(ledger: Ledger, offering: Offering) {
  return offering.supply - offering.sold - offering.reserved - holding(ledger, offering.id).quantity;
}
export function quantityError(ledger: Ledger, offering: Offering, quantity: number) {
  if (offering.status !== "open") return "Phương án này hiện không nhận mua NFT.";
  if (!Number.isSafeInteger(quantity) || quantity < 1) return "Nhập số lượng NFT nguyên dương.";
  if (quantity > remaining(ledger, offering)) return "Số lượng vượt quá số NFT còn lại.";
  return "";
}
export function quote(offering: Offering, quantity: number) {
  const subtotal = offering.price * quantity;
  const fee = Math.round(subtotal * offering.feeBps / 10000);
  return { subtotal, fee, total: subtotal + fee };
}
export function placeOrder(ledger: Ledger, input: Pick<Order, "id" | "offeringId" | "quantity" | "outcome">): Ledger {
  const previous = ledger.orders.find(order => order.id === input.id);
  if (previous) {
    if (previous.offeringId !== input.offeringId || previous.quantity !== input.quantity || previous.outcome !== input.outcome) throw new Error("Mã thao tác đã được dùng cho yêu cầu khác.");
    return ledger;
  }
  if (ledger.orders.length >= 1000) throw new Error("Lịch sử đã đầy. Hãy đặt lại trải nghiệm để tiếp tục.");
  const offering = offerings.find(item => item.id === input.offeringId);
  if (!offering) throw new Error("Không tìm thấy phương án NFT.");
  const error = quantityError(ledger, offering, input.quantity);
  if (error) throw new Error(error);
  const price = quote(offering, input.quantity);
  const createdAt = new Date(Date.UTC(2026, 8, 29, 2) + ledger.orders.length * 60000).toISOString();
  return { version: 1, orders: [...ledger.orders, { ...input, total: price.total, fee: price.fee, createdAt }] };
}

// Replay validated operations rather than trusting stored balances or totals.
export function restoreLedger(raw: string | null): Ledger {
  if (!raw) return emptyLedger;
  const parsed = JSON.parse(raw);
  if (parsed.version !== 1 || !Array.isArray(parsed.orders) || parsed.orders.length > 1000) throw new Error("Dữ liệu demo không tương thích.");
  let ledger = emptyLedger;
  for (const order of parsed.orders) {
    if (!order || typeof order.id !== "string" || !/^DEMO-[a-zA-Z0-9-]{1,80}$/.test(order.id) || !["success", "failed", "cancelled"].includes(order.outcome)) throw new Error("Dữ liệu demo không hợp lệ.");
    ledger = placeOrder(ledger, order);
  }
  return ledger;
}
