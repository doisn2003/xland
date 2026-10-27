"use client";
import {useEffect, useRef} from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Xác nhận xóa",
  cancelLabel = "Hủy bỏ",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button or dialog for accessibility
      const button = dialogRef.current?.querySelector<HTMLButtonElement>("button");
      button?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={e => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        className="admin-modal-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        ref={dialogRef}
      >
        <div className="admin-modal-header">
          {isDanger && (
            <div className="admin-modal-icon danger" aria-hidden="true">
              !
            </div>
          )}
          <div>
            <h2 id="confirm-modal-title" className="admin-modal-title">
              {title}
            </h2>
          </div>
        </div>
        <p id="confirm-modal-desc" className="admin-modal-body">
          {message}
        </p>
        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-button secondary small"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-button small ${isDanger ? "danger admin-delete-btn" : ""}`}
            onClick={() => void onConfirm()}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
