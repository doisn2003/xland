"use client";
import {useState, type FormEvent} from "react";
import {api, errorText, type Catalog, type Row} from "../api";
import {PropertyFields,propertyPayload} from "./fields";
import {initial} from "../form-values";
import type {PropertyAggregate} from "./types";

interface BasicTabProps {
  property: PropertyAggregate;
  catalog: Catalog;
  locations: Row[];
  onUpdated: (updated: PropertyAggregate) => void;
  onDirtyChange?:(dirty:boolean)=>void;
}

export function BasicTab({property, catalog, locations, onUpdated,onDirtyChange}: BasicTabProps) {
  const entityConfig = catalog["properties"];
  const fields = entityConfig?.fields ?? [];

  const [draft, setDraft] = useState<Row>(() => ({
    ...initial(fields, property),
    _version: property._version,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const serialized = propertyPayload(fields, draft, property);
      // Exclude nested arrays and readonly fields from root property update
      const currentVersion = draft._version ?? property._version;
      const rootPayload: Row = {_version: currentVersion};
      for (const [k, v] of Object.entries(serialized)) {
        if (!["has_subplots", "media", "legal_items", "documents", "amenities", "slots", "bookings"].includes(k)) {
          rootPayload[k] = v;
        }
      }

      const updated = await api<PropertyAggregate>(`properties/${property.id}`, "PATCH", rootPayload);
      const nextAggregate = {...property, ...updated, _version: updated._version};
      setDraft({...initial(fields, nextAggregate), _version: updated._version});
      onUpdated(nextAggregate);
      setSuccess(true);onDirtyChange?.(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-panel" onSubmit={handleSave}>
      <div className="admin-section-title">
        <div>
          <h2>Thông tin cơ bản</h2>
          <p>Cập nhật vị trí, diện tích, giá và thông số kỹ thuật của lô đất.</p>
        </div>
        <button type="submit" className="admin-button" disabled={saving || uploadBusy}>
          {saving ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">Đã lưu thông tin lô đất thành công.</p>}

      <PropertyFields fields={fields} draft={draft} setDraft={fn=>{setDraft(fn);onDirtyChange?.(true);}} locations={locations} uploadBusy={setUploadBusy}/>

      <div className="admin-form-actions">
        <button type="submit" className="admin-button" disabled={saving || uploadBusy}>
          {saving ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
