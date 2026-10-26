"use client";
import {useState, useCallback} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {api, errorText} from "../api";
import {SortableMediaItem} from "./sortable-media-item";
import type {PropertyAggregate, PropertyMediaItem} from "./types";

interface MediaTabProps {
  property: PropertyAggregate;
  onUpdated: (updated: PropertyAggregate) => void;
  canDelete?: boolean;
}

interface UploadTask {
  id: string;
  name: string;
  progress: number;
  status: "pending" | "uploading" | "verifying" | "done" | "error";
  error?: string;
}

export function MediaTab({property, onUpdated, canDelete = true}: MediaTabProps) {
  const [items, setItems] = useState<PropertyMediaItem[]>(
    [...(property.media ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 8},
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateItemsAndNotify = useCallback(
    (newItems: PropertyMediaItem[]) => {
      setItems(newItems);
      onUpdated({...property, media: newItems});
    },
    [property, onUpdated]
  );

  async function uploadSingleFile(file: File, taskId: string, sortOrder: number) {
    try {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? {...t, status: "uploading", progress: 0} : t))
      );

      const mimeType = file.type || "application/octet-stream";
      const uploadAuth = await api<{signedUrl: string; uploadId: string}>("uploads", "POST", {
        mimeType,
        size: file.size,
        privateDocument: false,
      });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadAuth.signedUrl);
        xhr.timeout = 300000;
        xhr.setRequestHeader("Content-Type", mimeType);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            const p = Math.round((e.loaded / e.total) * 100);
            setTasks(prev => prev.map(t => (t.id === taskId ? {...t, progress: p} : t)));
          }
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error("Supabase từ chối tệp."));
        xhr.onerror = () => reject(new Error("Lỗi kết nối khi tải tệp."));
        xhr.ontimeout = () => reject(new Error("Hết thời gian tải tệp."));
        xhr.send(file);
      });

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? {...t, status: "verifying", progress: 100} : t))
      );

      const verified = await api<{storageKey: string; publicUrl: string | null}>(
        "uploads/finalize",
        "POST",
        {uploadId: uploadAuth.uploadId}
      );

      const kind = mimeType.startsWith("video/") ? "video" : "image";
      const cleanAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const created = await api<PropertyMediaItem>("media", "POST", {
        property_id: property.id,
        kind,
        usage: "gallery",
        sort_order: sortOrder,
        storage_key: verified.storageKey,
        public_url: verified.publicUrl,
        alt_text: cleanAlt,
        is_illustrative: false,
      });

      setTasks(prev => prev.map(t => (t.id === taskId ? {...t, status: "done"} : t)));
      return created;
    } catch (err) {
      const msg = errorText(err);
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? {...t, status: "error", error: msg} : t))
      );
      throw err;
    }
  }

  async function handleBatchUpload(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setError("");
    const newTasks: UploadTask[] = fileArray.map((f, i) => ({
      id: `${Date.now()}-${i}-${f.name}`,
      name: f.name,
      progress: 0,
      status: "pending",
    }));

    setTasks(prev => [...prev, ...newTasks]);

    // Concurrency limit: 3 parallel uploads
    const maxSort = items.length
      ? Math.max(...items.map(m => m.sort_order))
      : -1;

    const results: PropertyMediaItem[] = [];
    const queue = fileArray.map((file, idx) => ({
      file,
      taskId: newTasks[idx]!.id,
      sortOrder: maxSort + 1 + idx,
    }));

    const CONCURRENCY = 3;
    let index = 0;

    async function worker() {
      while (index < queue.length) {
        const current = queue[index++];
        if (!current) break;
        try {
          const created = await uploadSingleFile(
            current.file,
            current.taskId,
            current.sortOrder
          );
          results.push(created);
        } catch {
          // Continue with next file
        }
      }
    }

    const workers = Array.from({length: Math.min(CONCURRENCY, queue.length)}, () =>
      worker()
    );
    await Promise.all(workers);

    if (results.length > 0) {
      const merged = [...items, ...results].sort((a, b) => a.sort_order - b.sort_order);
      updateItemsAndNotify(merged);
      setSuccess(`Đã tải lên và xác minh thành công ${results.length} tệp.`);
      setTimeout(() => setSuccess(""), 4000);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    // Assign consecutive 0-indexed sort_orders
    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));

    updateItemsAndNotify(updatedWithOrder);
    setBusy(true);

    try {
      await api(`properties/${property.id}/media-order`, "PATCH", {
        items: updatedWithOrder.map(item => ({
          id: item.id,
          sort_order: item.sort_order,
        })),
      });
      setSuccess("Đã lưu thứ tự hiển thị.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
      // Revert to prior order
      setItems(items);
    } finally {
      setBusy(false);
    }
  }

  async function handleSetCover(id: string) {
    const target = items.find(i => i.id === id);
    if (!target) return;

    // Move target to index 0 and shift others
    const rest = items.filter(i => i.id !== id);
    const newItems = [target, ...rest].map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));

    updateItemsAndNotify(newItems);
    setBusy(true);

    try {
      await api(`properties/${property.id}/media-order`, "PATCH", {
        items: newItems.map(item => ({
          id: item.id,
          sort_order: item.sort_order,
        })),
      });
      setSuccess("Đã chọn ảnh đại diện mới.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(errorText(err));
      setItems(items);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateAlt(id: string, alt: string) {
    const target = items.find(i => i.id === id);
    if (!target) return;

    try {
      await api(`media/${id}`, "PATCH", {
        _version: target._version,
        alt_text: alt,
      });

      const updated = items.map(i => (i.id === id ? {...i, alt_text: alt} : i));
      updateItemsAndNotify(updated);
      setSuccess("Đã cập nhật mô tả.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await api(`media/${id}`, "DELETE");
      const filtered = items.filter(i => i.id !== id);
      updateItemsAndNotify(filtered);
      setSuccess("Đã xóa tệp media.");
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
          <h2>Thư viện ảnh & media ({items.length})</h2>
          <p>
            Kéo thả để sắp xếp thứ tự hiển thị. Ảnh đầu tiên được dùng làm ảnh bìa chính trên website.
          </p>
        </div>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      {/* Multi-file Dropzone */}
      <div
        className={`admin-dropzone ${isDraggingOver ? "is-drag-over" : ""}`}
        onDragOver={e => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDraggingOver(false);
          if (e.dataTransfer.files) void handleBatchUpload(e.dataTransfer.files);
        }}
      >
        <div className="admin-dropzone-content">
          <span className="admin-dropzone-icon">⇪</span>
          <p>
            <strong>Kéo thả nhiều ảnh/video vào đây</strong> hoặc bấm để chọn tệp từ máy
          </p>
          <small>Hỗ trợ JPEG, PNG, WebP, MP4. Tải lên đồng thời tối đa 3 tệp.</small>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4"
            className="admin-dropzone-input"
            onChange={e => {
              if (e.target.files) void handleBatchUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Upload Tasks Progress */}
      {tasks.length > 0 && (
        <div className="admin-upload-tasks">
          {tasks.map(t => (
            <div key={t.id} className={`admin-upload-task status-${t.status}`}>
              <div className="admin-task-info">
                <span>{t.name}</span>
                <small>
                  {t.status === "uploading" && `Đang tải… ${t.progress}%`}
                  {t.status === "verifying" && "Đang xác minh SHA-256…"}
                  {t.status === "done" && "✓ Hoàn thành"}
                  {t.status === "error" && `✕ Lỗi: ${t.error}`}
                </small>
              </div>
              <div className="admin-task-bar">
                <div
                  className="admin-task-fill"
                  style={{
                    width: `${t.status === "done" ? 100 : t.progress}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sortable Media Grid */}
      {items.length === 0 ? (
        <div className="admin-empty">
          <h2>Chưa có ảnh hoặc video nào</h2>
          <p>Tải ảnh lên vùng kéo thả ở trên để bắt đầu hoàn thiện thư viện.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="admin-media-grid">
              {items.map((item, index) => (
                <SortableMediaItem
                  key={item.id}
                  item={item}
                  isCover={index === 0}
                  onSetCover={handleSetCover}
                  onUpdateAlt={handleUpdateAlt}
                  onDelete={handleDelete}
                  disabled={busy}
                  canDelete={canDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
