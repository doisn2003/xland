"use client";

import { useSyncExternalStore } from "react";
import { emptyLedger, placeOrder, restoreLedger, type Ledger, type Order } from "./model";

const key = "xland.demo.nft.v1";
type Snapshot = { ledger: Ledger; ready: boolean; notice: string };
const serverSnapshot: Snapshot = { ledger: emptyLedger, ready: false, notice: "" };
let snapshot = serverSnapshot;
let cachedRaw: string | null | undefined;
let memoryOnly = false;
const listeners = new Set<() => void>();
function read() {
  if (memoryOnly) return snapshot;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw || !snapshot.ready) {
      cachedRaw = raw;
      try { snapshot = { ledger: restoreLedger(raw), ready: true, notice: "" }; }
      catch { snapshot = { ledger: emptyLedger, ready: true, notice: "Không đọc được danh mục đã lưu. Đã mở phiên trống; hãy đặt lại danh mục để tiếp tục." }; }
    }
  } catch {
    memoryOnly = true;
    snapshot = { ...snapshot, ready: true, notice: "Trình duyệt không cho lưu dữ liệu. Danh mục chỉ giữ trong phiên này và sẽ mất khi tải lại." };
  }
  return snapshot;
}
function notify() { listeners.forEach(listener => listener()); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) { read(); notify(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
function write(ledger: Ledger) {
  let notice = snapshot.notice;
  if (!memoryOnly) {
    try { const raw = JSON.stringify(ledger); localStorage.setItem(key, raw); cachedRaw = raw; notice = ""; }
    catch { memoryOnly = true; notice = "Không lưu được dữ liệu. Kết quả chỉ giữ trong phiên này và sẽ mất khi tải lại."; }
  }
  snapshot = { ledger, ready: true, notice };
  notify();
}
async function locked<T>(action: () => T): Promise<T> {
  // Serializes purchases and reset across tabs where Web Locks is available.
  if (navigator.locks) return navigator.locks.request(key, action);
  return action();
}
export const useNftDemo = () => useSyncExternalStore(subscribe, read, () => serverSnapshot);
export async function purchase(input: Pick<Order, "id" | "offeringId" | "quantity" | "outcome">) {
  return locked(() => { const ledger = placeOrder(read().ledger, input); write(ledger); return ledger.orders.find(order => order.id === input.id)!; });
}
export async function resetDemo() { return locked(() => write(emptyLedger)); }
