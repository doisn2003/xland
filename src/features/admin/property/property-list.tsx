"use client";
import Link from "next/link";
import {useState} from "react";
import {api, errorText, type Row} from "../api";
import {formatted} from "../labels";
import {ConfirmModal} from "../confirm-modal";

interface PropertyListProps {
  items: Row[];
  onItemUpdated?: (updated: Row) => void;
  canDelete?: boolean;
}

export function PropertyList({items: initialItems, onItemUpdated, canDelete = true}: PropertyListProps) {
  const [items, setItems] = useState<Row[]>(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    const id = String(deleteTarget.id);
    setBusyId(id);
    setError("");
    try {
      await api(`properties/${id}`, "DELETE");
      setItems(items.filter(r => r.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleStatus(row: Row) {
    const id = String(row.id);
    const nextStatus = row.status === "listed" ? "paused" : "listed";
    setBusyId(id);
    setError("");

    try {
      const updated = await api<Row>(`properties/${id}`, "PATCH", {
        _version: row._version,
        status: nextStatus,
      });

      const nextItems = items.map(r => (r.id === id ? {...r, ...updated, status: nextStatus} : r));
      setItems(nextItems);
      onItemUpdated?.({...row, ...updated, status: nextStatus});
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-table-wrap">
      {error && <p className="admin-error" role="alert">{error}</p>}
      <table className="admin-property-table">
        <caption className="admin-sr-only">Danh sách lô đất</caption>
        <thead>
          <tr>
            <th>Mã & Tên lô đất</th>
            <th>Khu vực</th>
            <th>Diện tích</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th>Kiểm duyệt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map(row => {
            const id = String(row.id);
            const isBusy = busyId === id;
            return (
              <tr key={id}>
                <td>
                  <div className="admin-prop-cell">
                    <div>
                      <span className="admin-code-tag">{String(row.code ?? "—")}</span>
                      {row.has_subplots===true && <span className="admin-badge">Nhiều lô đất con</span>}{!!row.parent_property_id && <span className="admin-badge">Lô con</span>}
                      <strong className="admin-prop-title">{String(row.title ?? "—")}</strong>
                    </div>
                  </div>
                </td>
                <td>{String(row.province ?? "—")}</td>
                <td>{formatted(row.area_m2, "area_m2")}</td>
                <td>{formatted(row.price_total, "price_total")}</td>
                <td>
                  <button
                    type="button"
                    className={`admin-badge-btn admin-badge ${String(row.status)}`}
                    onClick={() => void handleToggleStatus(row)}
                    disabled={isBusy}
                    title="Bấm để chuyển trạng thái Mở bán / Tạm dừng"
                  >
                    {row.status === "listed"
                      ? "Mở bán"
                      : row.status === "paused"
                      ? "Tạm dừng"
                      : "Đã bán"}
                  </button>
                </td>
                <td>
                  <span className={`admin-badge ${String(row.approval_status)}`}>
                    {row.approval_status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                </td>
                <td>
                  <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                    <Link
                      className="admin-button secondary small"
                      href={`/admin/properties/${id}`}
                      style={{textDecoration: "none"}}
                    >
                      Mở Studio →
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        className="admin-button secondary small admin-delete-btn"
                        onClick={() => setDeleteTarget(row)}
                        disabled={isBusy}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa lô đất"
        message={deleteTarget ? `Bạn có chắc chắn muốn xóa lô đất "${deleteTarget.code ?? ""} - ${deleteTarget.title ?? ""}"? Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác.` : ""}
        confirmLabel="Xác nhận xóa"
        isLoading={busyId === deleteTarget?.id}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
