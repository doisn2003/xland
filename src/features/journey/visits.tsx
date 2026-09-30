"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { properties, type Property } from "@/data/properties";
import { visitStatusLabels, visitor, type Visit } from "@/data/journey";
import { canChangeVisit, formatVisitDate, visitsFor } from "./model";
import { sendVisit, useJourney } from "./store";
import { VisitForm } from "./visit-form";

function VisitCard({ visit }: { visit: Visit }) {
  const property = properties.find(item => item.id === visit.propertyId)!;
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const wasEditing = useRef(false);
  useEffect(() => {
    if (!editing && wasEditing.current) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);
  async function cancel() {
    if (pending.current) return;
    pending.current = true; setBusy(true);
    try { await sendVisit({ id: `VISIT-${crypto.randomUUID()}`, kind: "cancel", visitId: visit.id }); setConfirm(false); heading.current?.focus(); }
    catch (problem) { setError(problem instanceof Error ? problem.message : "Chưa gửi được đề nghị hủy."); }
    finally { pending.current = false; setBusy(false); }
  }
  return <article className="visit-card" data-visit-id={visit.id}>
    <div className="visit-card-heading"><p className="eyebrow">{property.location}</p><span className="visit-status">{visitStatusLabels[visit.status]}</span></div>
    <h2 ref={heading} tabIndex={-1}><Link href={`/lo-dat/${property.slug}`}>{property.name}</Link></h2>
    <p className="visit-date">{formatVisitDate(visit.date)} · {visit.slot}</p><p className="fine-print">Giờ Việt Nam · {visit.people} người · Đầu mối: {property.advisor.name}</p>
    {visit.requestedSchedule && <p className="journey-notice">Đề nghị mới: {formatVisitDate(visit.requestedSchedule.date)} · {visit.requestedSchedule.slot} · {visit.requestedSchedule.people} người. Chưa thay thế lịch trước đó.</p>}
    <details className="visit-history"><summary>Chi tiết và lịch sử yêu cầu</summary><p>Người đề nghị: {visitor.name} · {visitor.channel}</p><p className="fine-print">Mã yêu cầu: {visit.id}</p><ol>{visit.history.map((item, index) => <li key={index}><strong>{visitStatusLabels[item.status]}</strong><p>{item.description}</p></li>)}</ol></details>
    {error && <p className="form-error" role="alert">{error}</p>}
    {editing ? <VisitForm property={property} visit={visit} onClose={() => { setEditing(false); editButton.current?.focus(); }} /> : canChangeVisit(visit) && <div className="journey-actions"><button ref={editButton} className="text-button" onClick={() => { setEditing(true); setConfirm(false); }}>Đề nghị đổi lịch</button><button className="text-button" onClick={() => setConfirm(true)}>Đề nghị hủy</button></div>}
    {confirm && <div className="cancel-confirm" role="group" aria-label="Xác nhận đề nghị hủy"><p>Gửi đề nghị hủy buổi xem {property.name}?</p><p className="fine-print">Yêu cầu được chuyển sang chờ xử lý hủy.</p><div className="journey-actions"><button className="button" disabled={busy} onClick={cancel}>{busy ? "Đang gửi…" : "Gửi đề nghị hủy"}</button><button className="text-button" onClick={() => setConfirm(false)}>Giữ lịch</button></div></div>}
  </article>;
}

export function Visits({ property }: { property?: Property }) {
  const { journey, ready, notice, revision } = useJourney();
  const [filter, setFilter] = useState("all");
  const visits = visitsFor(journey);
  const active = visits.filter(visit => canChangeVisit(visit) || visit.status === "cancel_requested");
  const results = filter === "active" ? active : visits;
  return <div key={revision}>
    {notice && <p className="journey-notice" role="status">{notice}</p>}
    {property && <VisitForm property={property} />}
    <section className="visit-list" aria-labelledby="visit-list-title"><div className="section-heading"><div><p className="eyebrow">TIẾP NỐI HÀNH TRÌNH</p><h2 id="visit-list-title">Lịch hẹn của bạn</h2></div><Link className="text-link" href="/lo-dat">Tìm lô đất để đặt lịch →</Link></div>
      <div className="category-filters" role="group" aria-label="Lọc lịch hẹn"><button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>Tất cả</button><button aria-pressed={filter === "active"} onClick={() => setFilter("active")}>Đang xử lý</button></div>
      {!ready ? <p role="status">Đang tải lịch hẹn…</p> : results.length ? <div className="visit-grid">{results.map(visit => <VisitCard key={visit.id} visit={visit} />)}</div> : <div className="empty-state"><h3>Chưa có lịch hẹn phù hợp</h3><p>Chọn một lô đất và đề nghị thời gian bạn muốn xem.</p><Link className="button" href="/lo-dat">Khám phá lô đất</Link></div>}
    </section>
  </div>;
}
