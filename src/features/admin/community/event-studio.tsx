"use client";
import Link from "next/link";
import {useState, type FormEvent} from "react";
import useSWR from "swr";
import {api, errorText, type Catalog, type Row} from "../api";
import {FormField} from "../controls";
import type {EventAggregate} from "./types";

interface EventStudioProps {
  eventId: string;
  catalog: Catalog;
}

export function EventStudio({eventId, catalog}: EventStudioProps) {
  const [tab, setTab] = useState<"registrations" | "details">("registrations");
  const [draft, setDraft] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const {
    data: event,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<EventAggregate>(
    `events/${eventId}/aggregate`,
    () => api<EventAggregate>(`events/${eventId}/aggregate`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      onSuccess: data => {
        if (!draft) setDraft({...data});
      },
    }
  );

  async function handleExportCsv() {
    setDownloadingCsv(true);
    setError("");
    try {
      const response = await fetch(`/admin/api/events/${eventId}/export-csv`);
      if (!response.ok) throw new Error("Không thể tải danh sách CSV");

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition");
      let filename = `danh-sach-khach-${eventId.slice(0, 8)}.csv`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccess("Đã xuất file CSV thành công.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setDownloadingCsv(false);
    }
  }

  async function handleSaveDetails(e: FormEvent) {
    e.preventDefault();
    if (!draft || !event) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const fields = catalog["events"]?.fields ?? [];
      const payload: Row = {_version: draft._version};
      for (const f of fields) {
        if (!f.readonly && f.name in draft && f.name !== "registrations") {
          payload[f.name] = draft[f.name];
        }
      }

      const updated = await api<EventAggregate>(`events/${eventId}`, "PATCH", payload);
      setDraft(prev => (prev ? {...prev, ...updated, _version: updated._version} : updated));
      await mutate({...event, ...updated, _version: updated._version}, false);
      setSuccess("Đã cập nhật thông tin sự kiện thành công.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  if (isLoading && !event) {
    return <div className="admin-panel" role="status">Đang tải thông tin Sự kiện…</div>;
  }

  if (loadError || !event) {
    return (
      <div className="admin-panel">
        <p className="admin-error" role="alert">
          {errorText(loadError ?? new Error("Không thể tải dữ liệu sự kiện"))}
        </p>
        <Link href="/admin/events" className="admin-text-link">
          ← Quay lại danh sách sự kiện
        </Link>
      </div>
    );
  }

  const registrations = event.registrations ?? [];
  const percentFilled = Math.min(
    100,
    Math.round(((event.registered_attendees || 0) / (event.max_slots || 1)) * 100)
  );

  return (
    <div className="admin-studio">
      {/* Event Header */}
      <div className="admin-studio-header">
        <div className="admin-studio-top">
          <Link href="/admin/events" className="admin-studio-back">
            ← Danh sách sự kiện
          </Link>
          <div className="admin-studio-quick-actions">
            <button
              type="button"
              className="admin-button secondary small"
              onClick={handleExportCsv}
              disabled={downloadingCsv}
            >
              {downloadingCsv ? "Đang xuất CSV…" : "Xuất danh sách khách (CSV) ⤓"}
            </button>
          </div>
        </div>

        <div className="admin-studio-title-row">
          <div>
            <div className="admin-studio-badges">
              <span className={`admin-badge ${event.status}`}>
                {event.status === "open"
                  ? "Đang mở đăng ký"
                  : event.status === "sold_out"
                  ? "Đã hết chỗ"
                  : event.status === "closed"
                  ? "Đã kết thúc"
                  : "Đã hủy"}
              </span>
              <span className="admin-badge">
                {new Date(event.starts_at).toLocaleString("vi-VN", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <h1 className="admin-studio-title">{event.title}</h1>
            <p className="admin-studio-sub">
              📍 {event.venue_name} — {event.address}
            </p>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="admin-event-capacity">
          <div className="admin-capacity-meta">
            <span>
              <strong>{event.registered_attendees}</strong> / {event.max_slots} khách đăng ký ({percentFilled}%)
            </span>
            {event.pending_attendees > 0 && (
              <small className="admin-pending-count">
                +{event.pending_attendees} khách đang chờ xác nhận
              </small>
            )}
          </div>
          <div className="admin-task-bar">
            <div className="admin-task-fill" style={{width: `${percentFilled}%`}} />
          </div>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}
        {success && <p className="admin-success" role="status">{success}</p>}

        {/* Tabs */}
        <nav className="admin-studio-tabs" aria-label="Nội dung sự kiện">
          <button
            type="button"
            className={`admin-studio-tab ${tab === "registrations" ? "is-active" : ""}`}
            onClick={() => setTab("registrations")}
          >
            👥 Khách đăng ký tham gia
            <span className="admin-tab-count">{registrations.length}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${tab === "details" ? "is-active" : ""}`}
            onClick={() => {
              if (!draft) setDraft({...event});
              setTab("details");
            }}
          >
            📋 Thông tin & Lịch trình sự kiện
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="admin-studio-content">
        {tab === "registrations" ? (
          <div className="admin-panel">
            <div className="admin-section-title">
              <div>
                <h2>Danh sách đăng ký ({registrations.length})</h2>
                <p>Khách hàng đã đăng ký tham dự trực tuyến qua website hoặc ứng dụng.</p>
              </div>
              <button
                type="button"
                className="admin-button small secondary"
                onClick={handleExportCsv}
                disabled={downloadingCsv}
              >
                {downloadingCsv ? "Đang chuẩn bị…" : "Xuất file Excel/CSV ⤓"}
              </button>
            </div>

            {registrations.length === 0 ? (
              <div className="admin-empty">
                <h2>Chưa có lượt đăng ký nào</h2>
                <p>Khách đăng ký sẽ xuất hiện tự động tại đây khi sự kiện được mở bán/quảng bá.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Họ tên khách</th>
                      <th>Số điện thoại</th>
                      <th>Số vé</th>
                      <th>Trạng thái</th>
                      <th>Thời gian đăng ký</th>
                      <th>Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(r => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.contact_name}</strong>
                        </td>
                        <td>{r.contact_phone}</td>
                        <td>{r.attendee_count} vé</td>
                        <td>
                          <span className={`admin-badge ${r.status}`}>
                            {r.status === "registered"
                              ? "Đã xác nhận"
                              : r.status === "pending"
                              ? "Chờ duyệt"
                              : "Đã hủy"}
                          </span>
                        </td>
                        <td>
                          {new Date(r.created_at).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td>{r.payment_mode === "disabled" ? "Miễn phí" : r.payment_mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <form className="admin-panel" onSubmit={handleSaveDetails}>
            <div className="admin-section-title">
              <div>
                <h2>Thông tin chi tiết sự kiện</h2>
                <p>Địa điểm, thời gian bắt đầu, diễn giả và quyền lợi người tham dự.</p>
              </div>
              <button type="submit" className="admin-button" disabled={saving}>
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </button>
            </div>

            {draft && (
              <div className="admin-form-grid">
                {(catalog["events"]?.fields ?? [])
                  .filter(f => !f.readonly && f.name !== "registrations")
                  .map(f => (
                    <FormField
                      key={f.name}
                      field={f}
                      draft={draft}
                      setDraft={setDraft as (fn: (v: Row) => Row) => void}
                    />
                  ))}
              </div>
            )}

            <div className="admin-form-actions">
              <button type="submit" className="admin-button" disabled={saving}>
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
