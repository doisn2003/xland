"use client";
import Link from "next/link";
import {useState, type FormEvent} from "react";
import {api, errorText} from "../api";
import type {PropertyAggregate, PropertyAmenityItem} from "./types";

interface AmenitiesTabProps {
  property: PropertyAggregate;
  onUpdated: (updated: PropertyAggregate) => void;
  canDelete?: boolean;
}

export function AmenitiesTab({property, onUpdated, canDelete = true}: AmenitiesTabProps) {
  const [amenities, setAmenities] = useState<PropertyAmenityItem[]>(
    [...(property.amenities ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  // New amenity form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"utility" | "traffic" | "living">("utility");
  const [distanceText, setDistanceText] = useState("");

  function updateAmenities(newItems: PropertyAmenityItem[]) {
    setAmenities(newItems);
    onUpdated({...property, amenities: newItems});
  }

  async function handleAddAmenity(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !distanceText.trim()) return;

    setBusy(true);
    setError("");

    try {
      const maxSort = amenities.length ? Math.max(...amenities.map(a => a.sort_order)) : -1;
      const created = await api<PropertyAmenityItem>("amenities", "POST", {
        property_id: property.id,
        name: name.trim(),
        category,
        distance_text: distanceText.trim(),
        icon_type: category === "traffic" ? "road" : category === "utility" ? "market" : "school",
        sort_order: maxSort + 1,
      });

      const nextList = [...amenities, created].sort((a, b) => a.sort_order - b.sort_order);
      updateAmenities(nextList);
      setName("");
      setDistanceText("");
      setShowAddForm(false);
      setSuccess("Đã thêm tiện ích mới.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tiện ích này?")) return;
    setBusy(true);
    setError("");

    try {
      await api(`amenities/${id}`, "DELETE");
      const nextList = amenities.filter(a => a.id !== id);
      updateAmenities(nextList);
      setSuccess("Đã xóa tiện ích.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const slots = property.slots ?? [];
  const bookings = property.bookings ?? [];

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
      {/* Nearby Amenities Section */}
      <section className="admin-panel">
        <div className="admin-section-title">
          <div>
            <h2>Tiện ích khu vực ({amenities.length})</h2>
            <p>
              Các điểm giao thông, chợ, trường học, bệnh viện xung quanh lô đất hỗ trợ khách hàng ra quyết định.
            </p>
          </div>
          {!showAddForm && (
            <button
              type="button"
              className="admin-button"
              onClick={() => setShowAddForm(true)}
              disabled={busy}
            >
              + Thêm tiện ích
            </button>
          )}
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}
        {success && <p className="admin-success" role="status">{success}</p>}

        {showAddForm && (
          <form className="admin-quick-form" onSubmit={handleAddAmenity}>
            <h3>Thêm tiện ích xung quanh</h3>
            <div className="admin-form-grid">
              <label>
                Tên tiện ích *
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="VD: Chợ Trung tâm, Trường THPT Hòa Bình"
                />
              </label>
              <label>
                Phân loại *
                <select
                  value={category}
                  onChange={e =>
                    setCategory(e.target.value as "utility" | "traffic" | "living")
                  }
                >
                  <option value="utility">Tiện ích thiết yếu (Utility)</option>
                  <option value="traffic">Giao thông kết nối (Traffic)</option>
                  <option value="living">Môi trường sống / Dịch vụ (Living)</option>
                </select>
              </label>
              <label className="wide">
                Khoảng cách hiển thị *
                <input
                  required
                  value={distanceText}
                  onChange={e => setDistanceText(e.target.value)}
                  placeholder="VD: Cách 500m (khoảng 3 phút đi bộ)"
                />
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
                {busy ? "Đang thêm…" : "Lưu tiện ích"}
              </button>
            </div>
          </form>
        )}

        {amenities.length === 0 ? (
          <div className="admin-empty">
            <h2>Chưa có tiện ích nào</h2>
            <p>Bấm &quot;Thêm tiện ích&quot; để tạo điểm nhấn giá trị cho bất động sản.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tên địa điểm</th>
                  <th>Phân loại</th>
                  <th>Khoảng cách</th>
                  {canDelete && <th>Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {amenities.map(a => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.name}</strong>
                    </td>
                    <td>
                      <span className="admin-badge">
                        {a.category === "traffic"
                          ? "Giao thông"
                          : a.category === "utility"
                          ? "Tiện ích"
                          : "Đời sống"}
                      </span>
                    </td>
                    <td>{a.distance_text}</td>
                    {canDelete && (
                      <td>
                        <button
                          type="button"
                          className="admin-text-btn admin-delete-text"
                          onClick={() => void handleDelete(a.id)}
                          disabled={busy}
                        >
                          Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Operational Summary Cards */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px"}}>
        {/* Site Visit Slots Summary */}
        <section className="admin-panel" style={{margin: 0}}>
          <div className="admin-section-title">
            <div>
              <h2>Khung giờ thực địa ({slots.length})</h2>
              <p>Các khung giờ mở tiếp khách xem đất.</p>
            </div>
            <Link
              href={`/admin/slots?filter=property_id&value=${property.id}`}
              className="admin-text-link"
              style={{fontSize: "12px"}}
            >
              Quản lý khung giờ →
            </Link>
          </div>

          {slots.length === 0 ? (
            <p style={{color: "var(--color-muted)", fontSize: "13px"}}>
              Chưa mở khung giờ nào cho lô đất này.
            </p>
          ) : (
            <ul className="admin-activity">
              {slots.slice(0, 5).map(s => (
                <li key={s.id} style={{padding: "10px 0"}}>
                  <div>
                    <strong>{s.label}</strong>
                    <div style={{fontSize: "11px", color: "var(--color-muted)"}}>
                      {new Date(s.starts_at).toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}{" "}
                      · Tối đa {s.max_bookings} lượt
                    </div>
                  </div>
                  <span className={`admin-badge ${s.status}`}>{s.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent Site Visit Bookings */}
        <section className="admin-panel" style={{margin: 0}}>
          <div className="admin-section-title">
            <div>
              <h2>Lịch xem gần đây ({bookings.length})</h2>
              <p>Khách hàng đã đặt lịch xem thực địa lô đất này.</p>
            </div>
            <Link
              href={`/admin/bookings?filter=property_id&value=${property.id}`}
              className="admin-text-link"
              style={{fontSize: "12px"}}
            >
              Xem tất cả lịch hẹn →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p style={{color: "var(--color-muted)", fontSize: "13px"}}>
              Chưa có lượt đặt lịch nào được ghi nhận.
            </p>
          ) : (
            <ul className="admin-activity">
              {bookings.slice(0, 5).map(b => (
                <li key={b.id} style={{padding: "10px 0"}}>
                  <div>
                    <strong>{b.customer_name}</strong>
                    <div style={{fontSize: "11px", color: "var(--color-muted)"}}>
                      {b.customer_phone} · {b.attendee_count} khách
                    </div>
                  </div>
                  <span className={`admin-badge ${b.status}`}>{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
