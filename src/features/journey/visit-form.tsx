"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { visitor, visitSlots, visitWindow, type Schedule, type Visit } from "@/data/journey";
import { type Property } from "@/data/properties";
import { canRequestVisit, formatVisitDate, scheduleErrors } from "./model";
import { sendVisit, useJourney } from "./store";

export function VisitForm({ property, visit, onClose }: { property: Property; visit?: Visit; onClose?: () => void }) {
  const { ready } = useJourney();
  const [schedule, setSchedule] = useState<Schedule>(visit?.requestedSchedule ?? (visit ? { date: visit.date, slot: visit.slot, people: visit.people } : { date: "", slot: "", people: 1 }));
  const [errors, setErrors] = useState<ReturnType<typeof scheduleErrors>>({});
  const [review, setReview] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const formId = useId();
  useEffect(() => {
    if (review || done || visit) heading.current?.focus();
  }, [review, done, visit]);

  function next(event: FormEvent) {
    event.preventDefault();
    const validation = scheduleErrors(schedule);
    setErrors(validation); setError("");
    const first = Object.keys(validation)[0];
    if (first) { (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus(); return; }
    setReview(`VISIT-${crypto.randomUUID()}`);
  }

  async function submit() {
    if (!review || pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      await sendVisit(visit ? { id: review, kind: "reschedule", visitId: visit.id, schedule } : { id: review, kind: "create", propertyId: property.id, schedule });
      setDone(true);
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Chưa gửi được yêu cầu. Vui lòng thử lại."); }
    finally { pending.current = false; setBusy(false); }
  }

  if (!canRequestVisit(property.status)) return <section className="journey-panel"><h2>Chưa nhận đề nghị xem thực địa</h2><p>Hồ sơ này đang tạm dừng hoặc đã giao dịch. Bạn có thể khám phá lô đất khác.</p><Link className="button" href="/lo-dat">Tìm lô đất khác</Link></section>;

  return <section className="journey-panel visit-form" aria-label={visit ? "Đề nghị đổi lịch" : "Đề nghị xem thực địa"}>
    <p className="eyebrow">{property.location}</p><h2 ref={heading} tabIndex={-1}>{done ? (visit ? "Đã gửi đề nghị đổi lịch" : "Đã nhận đề nghị xem thực địa") : review ? "Xem lại lịch mong muốn" : visit ? "Đề nghị đổi lịch" : "Hẹn một buổi xem đất"}</h2>
    <Link className="text-link" href={`/lo-dat/${property.slug}`}>{property.name} →</Link>
    {done ? <div className="visit-success"><p>{visit ? "Lịch cũ được giữ để đối chiếu. Thời gian mới đang chờ điều phối xác nhận." : "Yêu cầu đang chờ sắp xếp. Người hỗ trợ sẽ cần thống nhất thời gian và người dẫn trước khi xác nhận lịch."}</p><Link className="button" href="/lich-hen">Xem lịch hẹn của tôi</Link>{onClose && <button className="text-button" onClick={onClose}>Đóng yêu cầu</button>}</div> : review ? <div>
      <dl className="info-table"><div><dt>Ngày mong muốn</dt><dd>{formatVisitDate(schedule.date)}</dd></div><div><dt>Khung giờ</dt><dd>{schedule.slot} · Giờ Việt Nam</dd></div><div><dt>Tham dự</dt><dd>{schedule.people} người</dd></div><div><dt>Người đề nghị</dt><dd>{visitor.name} · {visitor.channel}</dd></div><div><dt>Đầu mối</dt><dd>{property.advisor.name}</dd></div><div><dt>Phí tiếp nhận</dt><dd>0 ₫</dd></div></dl>
      <p className="journey-notice">Đây là thời gian bạn mong muốn. Chỉ lên đường khi lịch và người dẫn đã được xác nhận.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="journey-actions"><button className="button" disabled={busy || !ready} onClick={submit}>{busy ? "Đang gửi…" : visit ? "Gửi đề nghị đổi lịch" : "Gửi đề nghị xem thực địa"}</button><button className="text-button" disabled={busy} onClick={() => { setReview(null); setError(""); }}>Chỉnh sửa</button></div>
    </div> : <form ref={form} onSubmit={next} noValidate>
      <p className="form-intro">Chọn thời gian thuận tiện. {property.advisor.name} là đầu mối hỗ trợ cho hồ sơ này.</p>
      <div className="journey-fields">
        <label htmlFor={`${formId}-date`}>Ngày mong muốn<input aria-label="Ngày mong muốn" name="date" id={`${formId}-date`} type="date" min={visitWindow.from} max={visitWindow.to} value={schedule.date} onChange={event => setSchedule({ ...schedule, date: event.target.value })} aria-invalid={!!errors.date} aria-describedby={`${formId}-date-hint ${formId}-date-error`} /><span className="fine-print" id={`${formId}-date-hint`}>Lịch tiếp nhận: 01–31/10/2026.</span><span id={`${formId}-date-error`} className="form-error">{errors.date}</span></label>
        <label htmlFor={`${formId}-slot`}>Khung giờ<select aria-label="Khung giờ" name="slot" id={`${formId}-slot`} value={schedule.slot} onChange={event => setSchedule({ ...schedule, slot: event.target.value })} aria-invalid={!!errors.slot} aria-describedby={`${formId}-slot-error`}><option value="">Chọn khung giờ</option>{visitSlots.map(slot => <option key={slot} value={slot}>{slot} · Giờ Việt Nam</option>)}</select><span id={`${formId}-slot-error`} className="form-error">{errors.slot}</span></label>
        <label htmlFor={`${formId}-people`}>Số người tham dự<input aria-label="Số người tham dự" name="people" id={`${formId}-people`} type="number" min="1" max="8" step="1" inputMode="numeric" value={schedule.people || ""} onChange={event => setSchedule({ ...schedule, people: Number(event.target.value) })} aria-invalid={!!errors.people} aria-describedby={`${formId}-people-error`} /><span id={`${formId}-people-error`} className="form-error">{errors.people}</span></label>
      </div>
      <div className="journey-notice"><strong>Người đề nghị: {visitor.name}</strong><p>Nhận trao đổi qua {visitor.channel}. Không cần nhập số điện thoại hoặc email.</p></div>
      <div className="journey-actions"><button className="button" disabled={!ready} type="submit">Xem lại đề nghị</button>{onClose && <button type="button" className="text-button" onClick={onClose}>Giữ lịch hiện tại</button>}</div>
    </form>}
  </section>;
}
