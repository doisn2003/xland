"use client";

import { useSyncExternalStore } from "react";
import { dispatchVisit, emptyJourney, restoreJourney, toggleFavorite, type Journey, type VisitCommand } from "./model";

export const journeyKey = "xland.demo.journey.v1";
type Snapshot = { journey: Journey; ready: boolean; notice: string; revision: number };
const initial: Snapshot = { journey: emptyJourney, ready: false, notice: "", revision: 0 };
let snapshot = initial;
let cached: string | null | undefined;
let memoryOnly = false;
const listeners = new Set<() => void>();

function read() {
  if (memoryOnly) return snapshot;
  try {
    const raw = localStorage.getItem(journeyKey);
    if (raw !== cached || !snapshot.ready) {
      cached = raw;
      try { snapshot = { ...snapshot, journey: restoreJourney(raw), ready: true, notice: "" }; }
      catch { snapshot = { ...snapshot, journey: emptyJourney, ready: true, notice: "Không đọc được dữ liệu đã lưu. Đã khôi phục trạng thái ban đầu." }; }
    }
  } catch {
    memoryOnly = true;
    snapshot = { ...snapshot, ready: true, notice: "Trình duyệt không cho lưu dữ liệu. Thay đổi chỉ giữ trong phiên này, tải lại sẽ mất." };
  }
  return snapshot;
}

function notify() { listeners.forEach(listener => listener()); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === journeyKey || event.key === null) { read(); notify(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
function write(journey: Journey, reset = false) {
  let notice = snapshot.notice;
  if (!memoryOnly) {
    try { const raw = JSON.stringify(journey); localStorage.setItem(journeyKey, raw); cached = raw; notice = ""; }
    catch { memoryOnly = true; notice = "Không lưu được dữ liệu. Thay đổi chỉ giữ trong phiên này, tải lại sẽ mất."; }
  }
  snapshot = { journey, ready: true, notice, revision: snapshot.revision + (reset ? 1 : 0) };
  notify();
}
async function mutate(action: (journey: Journey) => Journey, reset = false) {
  const run = () => write(action(read().journey), reset);
  if (navigator.locks) await navigator.locks.request(journeyKey, run);
  else run();
}

export const useJourney = () => useSyncExternalStore(subscribe, read, () => initial);
export const saveProperty = (id: string) => mutate(journey => toggleFavorite(journey, id));
export const sendVisit = (command: VisitCommand) => mutate(journey => dispatchVisit(journey, command));
export const resetJourney = () => mutate(() => emptyJourney, true);
