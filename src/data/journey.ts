// Reproducible presentation scenario. No real contact details are collected.
export const visitWindow = { from: "2026-10-01", to: "2026-10-31" };
export const visitSlots = ["09:00", "14:00"] as const;
export const visitor = { id: "visitor-01", name: "Minh An", channel: "Hộp thư Xland" };
export const visitStatusLabels = {
  submitted: "Chờ sắp xếp", arranging: "Đang điều phối", proposed: "Đã đề xuất lịch",
  confirmed: "Đã xác nhận", completed: "Đã xem thực địa", cancelled: "Đã hủy",
  unavailable: "Không thể sắp xếp", no_show: "Chưa tham dự",
  change_requested: "Chờ duyệt đổi lịch", cancel_requested: "Chờ xử lý hủy",
};
export type VisitStatus = keyof typeof visitStatusLabels;
export type Schedule = { date: string; slot: string; people: number };
export type Visit = Schedule & {
  id: string; propertyId: string; status: VisitStatus; requestedSchedule?: Schedule;
  history: { status: VisitStatus; description: string }[];
};
export const visitSeeds: Visit[] = [
  { id: "VISIT-SEED-1", propertyId: "XL-005", date: "2026-10-03", slot: "09:00", people: 2, status: "arranging", history: [{ status: "submitted", description: "Đã nhận đề nghị xem thực địa." }, { status: "arranging", description: "Đầu mối khu vực đang sắp xếp người dẫn." }] },
  { id: "VISIT-SEED-2", propertyId: "XL-009", date: "2026-10-04", slot: "14:00", people: 2, status: "confirmed", history: [{ status: "confirmed", description: "Đã thống nhất lịch. Người hỗ trợ: Phạm Ngọc Lan." }] },
  { id: "VISIT-SEED-3", propertyId: "XL-002", date: "2026-09-28", slot: "09:00", people: 1, status: "completed", history: [{ status: "completed", description: "Đã kết thúc buổi xem thực địa." }] },
];
