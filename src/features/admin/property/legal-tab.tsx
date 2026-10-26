"use client";
import {useState, type FormEvent} from "react";
import {api, errorText} from "../api";
import type {PropertyAggregate, PropertyLegalItem} from "./types";

interface LegalTabProps {
  property: PropertyAggregate;
  onUpdated: (updated: PropertyAggregate) => void;
}

export function LegalTab({property, onUpdated}: LegalTabProps) {
  const [items, setItems] = useState<PropertyLegalItem[]>(
    [...(property.legal_items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  // New item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newCheckedDate, setNewCheckedDate] = useState(new Date().toISOString().slice(0, 10));
  const [newStatus, setNewStatus] = useState<"pending" | "verified">("verified");

  function updateItems(newItems: PropertyLegalItem[]) {
    setItems(newItems);
    onUpdated({...property, legal_items: newItems});
  }

  async function handleToggleStatus(item: PropertyLegalItem) {
    const nextStatus = item.status === "verified" ? "pending" : "verified";
    setBusy(true);
    setError("");

    try {
      const updated = await api<PropertyLegalItem>(`legal/${item.id}`, "PATCH", {
        _version: item._version,
        status: nextStatus,
      });

      const nextItems = items.map(i => (i.id === item.id ? {...i, ...updated} : i));
      updateItems(nextItems);
      setSuccess(`Đã chuyển trạng thái sang: ${nextStatus === "verified" ? "Đã xác minh" : "Đang xử lý"}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleAddItem(e: FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setBusy(true);
    setError("");

    try {
      const maxSort = items.length ? Math.max(...items.map(i => i.sort_order)) : -1;
      const created = await api<PropertyLegalItem>("legal", "POST", {
        property_id: property.id,
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || null,
        checked_date: newCheckedDate,
        status: newStatus,
        sort_order: maxSort + 1,
      });

      const nextItems = [...items, created].sort((a, b) => a.sort_order - b.sort_order);
      updateItems(nextItems);
      setNewTitle("");
      setNewSubtitle("");
      setShowAddForm(false);
      setSuccess("Đã thêm mục pháp lý mới.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục pháp lý này?")) return;
    setBusy(true);
    setError("");

    try {
      await api(`legal/${id}`, "DELETE");
      const nextItems = items.filter(i => i.id !== id);
      updateItems(nextItems);
      setSuccess("Đã xóa mục pháp lý.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-section-title">
        <div>
          <h2>Hồ sơ pháp lý ({items.length})</h2>
          <p>
            Danh mục các giấy tờ, chứng nhận pháp lý đã được thẩm định cho lô đất này.
          </p>
        </div>
        {!showAddForm && (
          <button
            type="button"
            className="admin-button"
            onClick={() => setShowAddForm(true)}
            disabled={busy}
          >
            + Thêm giấy tờ pháp lý
          </button>
        )}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      {/* Add new legal item form */}
      {showAddForm && (
        <form className="admin-quick-form" onSubmit={handleAddItem}>
          <h3>Thêm giấy tờ / chứng nhận mới</h3>
          <div className="admin-form-grid">
            <label>
              Tên giấy tờ / chứng nhận *
              <input
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="VD: Giấy chứng nhận QSDĐ số AB 123456"
              />
            </label>
            <label>
              Chi tiết / Ghi chú bổ sung
              <input
                value={newSubtitle}
                onChange={e => setNewSubtitle(e.target.value)}
                placeholder="VD: Cấp bởi Sở TN&MT ngày 15/05/2023"
              />
            </label>
            <label>
              Ngày thẩm định *
              <input
                type="date"
                required
                value={newCheckedDate}
                onChange={e => setNewCheckedDate(e.target.value)}
              />
            </label>
            <label>
              Trạng thái *
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as "pending" | "verified")}
              >
                <option value="verified">Đã xác minh (Verified)</option>
                <option value="pending">Đang chờ xử lý (Pending)</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button secondary"
              onClick={() => setShowAddForm(false)}
              disabled={busy}
            >
              Hủy
            </button>
            <button type="submit" className="admin-button" disabled={busy}>
              {busy ? "Đang thêm…" : "Lưu mục pháp lý"}
            </button>
          </div>
        </form>
      )}

      {/* Legal Items Table */}
      {items.length === 0 ? (
        <div className="admin-empty">
          <h2>Chưa có thông tin pháp lý</h2>
          <p>Bấm &quot;Thêm giấy tờ pháp lý&quot; để bổ sung chứng nhận quyền sử dụng đất hoặc quy hoạch.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên giấy tờ</th>
                <th>Chi tiết</th>
                <th>Ngày thẩm định</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>{item.subtitle || <span className="admin-placeholder-text">—</span>}</td>
                  <td>{item.checked_date || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-badge-btn admin-badge ${item.status}`}
                      onClick={() => void handleToggleStatus(item)}
                      disabled={busy}
                      title="Bấm để chuyển trạng thái"
                    >
                      {item.status === "verified" ? "✓ Đã xác minh" : "Chờ xác minh"}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-text-btn admin-delete-text"
                      onClick={() => void handleDelete(item.id)}
                      disabled={busy}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
