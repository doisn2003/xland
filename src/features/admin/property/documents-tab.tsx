"use client";
import {useState, type FormEvent} from "react";
import {api, errorText} from "../api";
import type {PropertyAggregate, PropertyDocumentItem} from "./types";

interface DocumentsTabProps {
  property: PropertyAggregate;
  onUpdated: (updated: PropertyAggregate) => void;
}

function formatBytes(bytesStr: string) {
  const bytes = Number(bytesStr);
  if (isNaN(bytes) || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function DocumentsTab({property, onUpdated}: DocumentsTabProps) {
  const [items, setItems] = useState<PropertyDocumentItem[]>(
    [...(property.documents ?? [])].sort(
      (a, b) => new Date(b.uploaded_date).getTime() - new Date(a.uploaded_date).getTime()
    )
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  // Upload modal / form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [accessLevel, setAccessLevel] = useState<"public_redacted" | "authenticated" | "granted">("granted");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  function updateItems(newItems: PropertyDocumentItem[]) {
    setItems(newItems);
    onUpdated({...property, documents: newItems});
  }

  async function handleUploadDocument(e: FormEvent) {
    e.preventDefault();
    if (!selectedFile || !docTitle.trim()) return;

    setBusy(true);
    setError("");
    setUploadProgress(0);

    const isPrivate = accessLevel !== "public_redacted";
    const mimeType = selectedFile.type || "application/pdf";

    try {
      // 1. Authorize upload
      const uploadAuth = await api<{signedUrl: string; uploadId: string}>("uploads", "POST", {
        mimeType,
        size: selectedFile.size,
        privateDocument: isPrivate,
      });

      // 2. PUT file to Supabase Storage
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadAuth.signedUrl);
        xhr.timeout = 300000;
        xhr.setRequestHeader("Content-Type", mimeType);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = ev => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Supabase từ chối tệp.")));
        xhr.onerror = () => reject(new Error("Lỗi kết nối khi tải tệp lên kho lưu trữ."));
        xhr.ontimeout = () => reject(new Error("Hết thời gian tải tệp."));
        xhr.send(selectedFile);
      });

      // 3. Finalize upload
      setUploadProgress(100);
      const verified = await api<{storageKey: string; publicUrl: string | null}>("uploads/finalize", "POST", {
        uploadId: uploadAuth.uploadId,
      });

      // 4. Create document record
      const extension = selectedFile.name.split(".").pop()?.toUpperCase() ?? "PDF";
      const created = await api<PropertyDocumentItem>("documents", "POST", {
        property_id: property.id,
        title: docTitle.trim(),
        file_type: extension,
        mime_type: mimeType,
        size_bytes: String(selectedFile.size),
        uploaded_date: new Date().toISOString().slice(0, 10),
        storage_key: verified.storageKey,
        access_level: accessLevel,
        public_preview_url: verified.publicUrl,
        is_illustrative: false,
      });

      const nextItems = [created, ...items];
      updateItems(nextItems);

      // Reset form
      setDocTitle("");
      setSelectedFile(null);
      setUploadProgress(null);
      setShowUploadForm(false);
      setSuccess("Đã lưu tài liệu thành công.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
      setUploadProgress(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    setBusy(true);
    setError("");

    try {
      await api(`documents/${id}`, "DELETE");
      const nextItems = items.filter(i => i.id !== id);
      updateItems(nextItems);
      setSuccess("Đã xóa tài liệu.");
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
          <h2>Tài liệu & Hồ sơ kỹ thuật ({items.length})</h2>
          <p>
            Quản lý các tài liệu mật, trích lục bản đồ, quy hoạch và phân quyền truy cập theo từng cấp độ.
          </p>
        </div>
        {!showUploadForm && (
          <button
            type="button"
            className="admin-button"
            onClick={() => setShowUploadForm(true)}
            disabled={busy}
          >
            + Tải lên tài liệu mới
          </button>
        )}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      {/* Upload Document Form */}
      {showUploadForm && (
        <form className="admin-quick-form" onSubmit={handleUploadDocument}>
          <h3>Tải tài liệu vào kho lưu trữ</h3>
          <div className="admin-form-grid">
            <label>
              Tên tài liệu *
              <input
                required
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder="VD: Trích lục địa chính tỷ lệ 1/500"
              />
            </label>
            <label>
              Cấp độ bảo mật truy cập *
              <select
                value={accessLevel}
                onChange={e =>
                  setAccessLevel(e.target.value as "public_redacted" | "authenticated" | "granted")
                }
              >
                <option value="granted">Cần cấp quyền riêng (Granted - An toàn nhất)</option>
                <option value="authenticated">Người dùng đã đăng nhập (Authenticated)</option>
                <option value="public_redacted">Công khai che số liệu nhạy cảm (Public Redacted)</option>
              </select>
            </label>
            <label className="wide">
              Chọn tệp (PDF hoặc hình ảnh) *
              <input
                type="file"
                required
                accept="application/pdf,image/jpeg,image/png"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setSelectedFile(f);
                    if (!docTitle) setDocTitle(f.name.replace(/\.[^/.]+$/, ""));
                  }
                }}
              />
              {selectedFile && (
                <small>
                  Đã chọn: {selectedFile.name} ({formatBytes(String(selectedFile.size))})
                </small>
              )}
            </label>
          </div>

          {uploadProgress !== null && (
            <div className="admin-task-bar" style={{margin: "16px 0"}}>
              <div className="admin-task-fill" style={{width: `${uploadProgress}%`}} />
            </div>
          )}

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-button secondary"
              onClick={() => {
                setShowUploadForm(false);
                setSelectedFile(null);
                setUploadProgress(null);
              }}
              disabled={busy}
            >
              Hủy
            </button>
            <button type="submit" className="admin-button" disabled={busy || !selectedFile}>
              {busy ? "Đang tải lên & thẩm định…" : "Bắt đầu tải lên"}
            </button>
          </div>
        </form>
      )}

      {/* Documents List */}
      {items.length === 0 ? (
        <div className="admin-empty">
          <h2>Chưa có tài liệu nào</h2>
          <p>Bấm &quot;Tải lên tài liệu mới&quot; để lưu trữ trích lục, bản đồ hoặc hợp đồng mẫu.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên tài liệu</th>
                <th>Định dạng</th>
                <th>Dung lượng</th>
                <th>Cấp độ truy cập</th>
                <th>Ngày tải lên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.title}</strong>
                  </td>
                  <td>
                    <span className="admin-filetype-tag">{doc.file_type || "PDF"}</span>
                  </td>
                  <td>{formatBytes(doc.size_bytes)}</td>
                  <td>
                    <span className={`admin-badge ${doc.access_level}`}>
                      {doc.access_level === "granted"
                        ? "Cần cấp quyền"
                        : doc.access_level === "authenticated"
                        ? "Đăng nhập"
                        : "Công khai"}
                    </span>
                  </td>
                  <td>{doc.uploaded_date}</td>
                  <td>
                    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                      {doc.public_preview_url && (
                        <a
                          href={doc.public_preview_url}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-text-link"
                          style={{fontSize: "12px"}}
                        >
                          Xem ↗
                        </a>
                      )}
                      <button
                        type="button"
                        className="admin-text-btn admin-delete-text"
                        onClick={() => void handleDelete(doc.id)}
                        disabled={busy}
                      >
                        Xóa
                      </button>
                    </div>
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
