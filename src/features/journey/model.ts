import { properties } from "../../data/properties";
import { visitSeeds, visitSlots, visitWindow, type Schedule, type Visit } from "../../data/journey";

export type VisitCommand = { id: string } & (
  { kind: "create"; propertyId: string; schedule: Schedule } |
  { kind: "reschedule"; visitId: string; schedule: Schedule } |
  { kind: "cancel"; visitId: string }
);
export type Journey = { version: 1; favorites: string[]; commands: VisitCommand[] };
export const emptyJourney: Journey = { version: 1, favorites: [], commands: [] };
export const canRequestVisit = (status: string) => status === "available" || status === "negotiating";
export const canChangeVisit = (visit: Visit) => ["submitted", "arranging", "proposed", "confirmed", "change_requested"].includes(visit.status);

export function scheduleErrors(schedule: Schedule) {
  const errors: Partial<Record<keyof Schedule, string>> = {};
  const date = new Date(`${schedule.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(schedule.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== schedule.date || schedule.date < visitWindow.from || schedule.date > visitWindow.to) {
    errors.date = "Chọn ngày hợp lệ từ 01/10 đến 31/10/2026.";
  }
  if (!(visitSlots as readonly string[]).includes(schedule.slot)) errors.slot = "Chọn khung giờ 09:00 hoặc 14:00.";
  if (!Number.isSafeInteger(schedule.people) || schedule.people < 1 || schedule.people > 8) errors.people = "Số người tham dự phải là số nguyên từ 1 đến 8.";
  return errors;
}

function apply(visits: Visit[], command: VisitCommand): Visit[] {
  if (command.kind === "create") {
    const property = properties.find(item => item.id === command.propertyId);
    if (!property || !canRequestVisit(property.status)) throw new Error("Lô đất hiện không nhận đề nghị xem thực địa.");
    if (visits.some(visit => visit.propertyId === command.propertyId && (canChangeVisit(visit) || visit.status === "cancel_requested"))) throw new Error("Bạn đã có lịch đang xử lý cho lô đất này. Hãy xem hoặc đề nghị đổi lịch hiện tại.");
    if (Object.keys(scheduleErrors(command.schedule)).length) throw new Error("Kiểm tra lại ngày, khung giờ và số người tham dự.");
    return [{ id: command.id, propertyId: command.propertyId, ...command.schedule, status: "submitted", history: [{ status: "submitted", description: "Đã nhận đề nghị. Lịch chưa được xác nhận." }] }, ...visits];
  }
  const visit = visits.find(item => item.id === command.visitId);
  if (!visit || !canChangeVisit(visit)) throw new Error("Lịch này không còn nhận yêu cầu thay đổi.");
  if (command.kind === "cancel") return visits.map(item => item.id === visit.id ? {
    ...item, status: "cancel_requested", history: [...item.history, { status: "cancel_requested", description: "Đã nhận đề nghị hủy, chờ đầu mối xử lý." }],
  } : item);
  const property = properties.find(item => item.id === visit.propertyId);
  if (!property || !canRequestVisit(property.status)) throw new Error("Lô đất hiện không nhận đề nghị đổi lịch.");
  if (Object.keys(scheduleErrors(command.schedule)).length) throw new Error("Kiểm tra lại lịch mong muốn.");
  const current = visit.requestedSchedule ?? visit;
  if (current.date === command.schedule.date && current.slot === command.schedule.slot && current.people === command.schedule.people) throw new Error("Lịch mong muốn chưa thay đổi.");
  return visits.map(item => item.id === visit.id ? {
    ...item, requestedSchedule: command.schedule, status: "change_requested",
    history: [...item.history, { status: "change_requested", description: `Đề nghị chuyển sang ${formatVisitDate(command.schedule.date)}, ${command.schedule.slot}, ${command.schedule.people} người. Chờ điều phối xác nhận.` }],
  } : item);
}

export function visitsFor(journey: Journey) {
  return journey.commands.reduce(apply, visitSeeds);
}

export function dispatchVisit(journey: Journey, command: VisitCommand): Journey {
  const previous = journey.commands.find(item => item.id === command.id);
  if (previous) {
    if (JSON.stringify(previous) !== JSON.stringify(command)) throw new Error("Mã yêu cầu đã được sử dụng.");
    return journey;
  }
  if (journey.commands.length >= 200) throw new Error("Lịch sử đã đầy. Hãy đặt lại trải nghiệm để tiếp tục.");
  apply(visitsFor(journey), command);
  return { ...journey, commands: [...journey.commands, command] };
}

export function toggleFavorite(journey: Journey, propertyId: string): Journey {
  if (!properties.some(item => item.id === propertyId)) throw new Error("Không tìm thấy lô đất.");
  return { ...journey, favorites: journey.favorites.includes(propertyId) ? journey.favorites.filter(id => id !== propertyId) : [...journey.favorites, propertyId] };
}

export function restoreJourney(raw: string | null): Journey {
  if (!raw) return emptyJourney;
  const parsed = JSON.parse(raw);
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.favorites) || !Array.isArray(parsed.commands) || parsed.commands.length > 200 || parsed.favorites.length > properties.length) throw new Error("Invalid journey");
  let journey: Journey = { ...emptyJourney, favorites: [] };
  for (const id of parsed.favorites) {
    if (typeof id !== "string" || journey.favorites.includes(id)) throw new Error("Invalid favorite");
    journey = toggleFavorite(journey, id);
  }
  for (const value of parsed.commands) {
    if (!value || typeof value.id !== "string" || !/^VISIT-[a-zA-Z0-9-]{1,80}$/.test(value.id) || !["create", "reschedule", "cancel"].includes(value.kind)) throw new Error("Invalid visit command");
    const { id, kind } = value;
    if (kind === "cancel") {
      if (typeof value.visitId !== "string") throw new Error("Invalid visit ID");
      journey = dispatchVisit(journey, { id, kind, visitId: value.visitId });
    } else {
      const schedule = value.schedule;
      if (!schedule || typeof schedule.date !== "string" || typeof schedule.slot !== "string" || typeof schedule.people !== "number") throw new Error("Invalid schedule");
      const clean = { date: schedule.date, slot: schedule.slot, people: schedule.people };
      journey = dispatchVisit(journey, kind === "create" ? { id, kind, propertyId: value.propertyId, schedule: clean } : { id, kind, visitId: value.visitId, schedule: clean });
    }
  }
  return journey;
}

export function formatVisitDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(`${date}T00:00:00Z`));
}
