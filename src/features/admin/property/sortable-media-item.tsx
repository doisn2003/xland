"use client";
import React, {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import type {PropertyMediaItem} from "./types";

interface SortableMediaItemProps {
  item: PropertyMediaItem;
  isCover: boolean;
  onSetCover: (id: string) => void;
  onUpdateAlt: (id: string, alt: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function SortableMediaItem({
  item,
  isCover,
  onSetCover,
  onUpdateAlt,
  onDelete,
  disabled = false,
}: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: item.id, disabled});

  const [altText, setAltText] = useState(item.alt_text ?? "");
  const [editingAlt, setEditingAlt] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleSaveAlt() {
    setEditingAlt(false);
    if (altText !== (item.alt_text ?? "")) {
      onUpdateAlt(item.id, altText);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`admin-media-card ${isCover ? "is-cover" : ""} ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="admin-media-thumb">
        {item.kind === "video" ? (
          <video
            src={item.public_url ?? undefined}
            preload="metadata"
            muted
            className="admin-media-img"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.public_url ?? item.thumbnail_url ?? "/placeholder.png"}
            alt={item.alt_text ?? "Media"}
            className="admin-media-img"
            loading="lazy"
          />
        )}

        <div className="admin-media-drag-handle" {...attributes} {...listeners} title="Kéo thả để sắp xếp">
          ⋮⋮
        </div>

        <div className="admin-media-badges">
          {isCover && <span className="admin-cover-badge">★ Ảnh bìa</span>}
          <span className="admin-kind-badge">{item.kind === "video" ? "Video" : "Ảnh"}</span>
          <span className="admin-usage-badge">{item.usage}</span>
        </div>
      </div>

      <div className="admin-media-body">
        <div className="admin-media-alt-section">
          {editingAlt ? (
            <div className="admin-media-alt-edit">
              <input
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Nhập mô tả hình ảnh…"
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") handleSaveAlt();
                  if (e.key === "Escape") setEditingAlt(false);
                }}
              />
              <button
                type="button"
                className="admin-button small"
                onClick={handleSaveAlt}
              >
                Lưu
              </button>
            </div>
          ) : (
            <div
              className="admin-media-alt-preview"
              onClick={() => setEditingAlt(true)}
              title="Nhấn để sửa mô tả"
            >
              <span className="admin-media-alt-text">
                {item.alt_text || <em className="admin-placeholder-text">Chưa có mô tả (nhấn để thêm)</em>}
              </span>
              <span className="admin-edit-icon">✎</span>
            </div>
          )}
        </div>

        <div className="admin-media-actions">
          {!isCover && (
            <button
              type="button"
              className="admin-button secondary small"
              onClick={() => onSetCover(item.id)}
              disabled={disabled}
            >
              Đặt làm ảnh bìa
            </button>
          )}
          <button
            type="button"
            className="admin-button secondary small admin-delete-btn"
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa tệp này?")) {
                onDelete(item.id);
              }
            }}
            disabled={disabled}
            title="Xóa tệp"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
