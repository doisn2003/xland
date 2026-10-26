"use client";
import Link from "next/link";
import {useState, useEffect, useCallback} from "react";
import useSWR from "swr";
import {api, errorText, type Catalog, type Row} from "../api";
import type {PropertyAggregate, StudioTab} from "./types";
import {BasicTab} from "./basic-tab";
import {MediaTab} from "./media-tab";
import {LegalTab} from "./legal-tab";
import {DocumentsTab} from "./documents-tab";
import {AmenitiesTab} from "./amenities-tab";

interface PropertyStudioProps {
  propertyId: string;
  catalog: Catalog;
  locations: Row[];
  initialTab?: StudioTab;
}

export function PropertyStudio({
  propertyId,
  catalog,
  locations,
  initialTab = "basic",
}: PropertyStudioProps) {
  const [tab, setTab] = useState<StudioTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab") as StudioTab;
      if (p && ["basic", "media", "legal", "documents", "amenities"].includes(p)) return p;
    }
    return initialTab;
  });
  const [actionError, setActionError] = useState("");
  const [statusBusy, setStatusBusy] = useState(false);

  const {
    data: aggregate,
    error,
    isLoading,
    mutate,
  } = useSWR<PropertyAggregate>(
    `properties/${propertyId}/aggregate`,
    () => api<PropertyAggregate>(`properties/${propertyId}/aggregate`),
    {revalidateOnFocus: false, dedupingInterval: 5000}
  );

  // Sync tab with URL search parameter without full Next.js page transition
  const handleSelectTab = useCallback((newTab: StudioTab) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Listen to browser back/forward navigation
  useEffect(() => {
    function onPopState() {
      const p = new URLSearchParams(window.location.search).get("tab") as StudioTab;
      if (p && ["basic", "media", "legal", "documents", "amenities"].includes(p)) {
        setTab(p);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  async function handleToggleStatus() {
    if (!aggregate) return;
    const nextStatus = aggregate.status === "listed" ? "paused" : "listed";
    setStatusBusy(true);
    setActionError("");

    try {
      const updated = await api<PropertyAggregate>(`properties/${aggregate.id}`, "PATCH", {
        _version: aggregate._version,
        status: nextStatus,
      });
      await mutate({...aggregate, ...updated, status: nextStatus, _version: updated._version}, false);
    } catch (err) {
      setActionError(errorText(err));
    } finally {
      setStatusBusy(false);
    }
  }

  if (isLoading && !aggregate) {
    return <div className="admin-panel" role="status">Đang tải toàn bộ dữ liệu Property Studio…</div>;
  }

  if (error || !aggregate) {
    return (
      <div className="admin-panel">
        <p className="admin-error" role="alert">
          {errorText(error ?? new Error("Không thể tải thông tin lô đất"))}
        </p>
        <Link href="/admin/properties" className="admin-text-link">
          ← Quay lại danh sách lô đất
        </Link>
      </div>
    );
  }

  const mediaCount = aggregate.media?.length ?? 0;
  const legalCount = aggregate.legal_items?.length ?? 0;
  const docCount = aggregate.documents?.length ?? 0;
  const amenityCount = aggregate.amenities?.length ?? 0;

  return (
    <div className="admin-studio">
      {/* Studio Header Bar */}
      <div className="admin-studio-header">
        <div className="admin-studio-top">
          <Link href="/admin/properties" className="admin-studio-back">
            ← Danh sách lô đất
          </Link>
          <div className="admin-studio-quick-actions">
            {aggregate.approval_status === "approved" && aggregate.status === "listed" && (
              <a
                href={`/properties/${aggregate.id}`}
                target="_blank"
                rel="noreferrer"
                className="admin-button secondary small"
              >
                Xem trên website ↗
              </a>
            )}
            <button
              type="button"
              className={`admin-button small ${
                aggregate.status === "listed" ? "secondary" : ""
              }`}
              onClick={handleToggleStatus}
              disabled={statusBusy}
            >
              {statusBusy
                ? "Đang cập nhật…"
                : aggregate.status === "listed"
                ? "Tạm dừng hiển thị"
                : "Mở bán (Listed)"}
            </button>
          </div>
        </div>

        <div className="admin-studio-title-row">
          <div>
            <div className="admin-studio-badges">
              <span className="admin-code-tag">{aggregate.code}</span>
              <span className={`admin-badge ${aggregate.status}`}>
                {aggregate.status === "listed"
                  ? "Đang mở bán"
                  : aggregate.status === "paused"
                  ? "Tạm dừng"
                  : "Đã giao dịch"}
              </span>
              <span className={`admin-badge ${aggregate.approval_status}`}>
                {aggregate.approval_status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
              </span>
            </div>
            <h1 className="admin-studio-title">{aggregate.title}</h1>
            <p className="admin-studio-sub">
              {aggregate.province} · {aggregate.area_m2} m² ·{" "}
              {Number(aggregate.price_total).toLocaleString("vi-VN")} đ
              {aggregate.consultant_name && ` · Phụ trách: ${aggregate.consultant_name}`}
            </p>
          </div>
        </div>

        {actionError && <p className="admin-error" role="alert">{actionError}</p>}

        {/* Tab Navigation (0ms instant tab change) */}
        <nav className="admin-studio-tabs" aria-label="Các phần quản lý lô đất">
          <button
            type="button"
            className={`admin-studio-tab ${tab === "basic" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("basic")}
          >
            📋 Thông tin cơ bản
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${tab === "media" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("media")}
          >
            🖼 Thư viện ảnh & video
            <span className="admin-tab-count">{mediaCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${tab === "legal" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("legal")}
          >
            ⚖ Hồ sơ pháp lý
            <span className="admin-tab-count">{legalCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${tab === "documents" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("documents")}
          >
            📁 Tài liệu kỹ thuật
            <span className="admin-tab-count">{docCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${tab === "amenities" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("amenities")}
          >
            📍 Tiện ích & Lịch hẹn
            <span className="admin-tab-count">{amenityCount}</span>
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="admin-studio-content">
        {tab === "basic" && (
          <BasicTab
            property={aggregate}
            catalog={catalog}
            locations={locations}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {tab === "media" && (
          <MediaTab
            property={aggregate}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {tab === "legal" && (
          <LegalTab
            property={aggregate}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {tab === "documents" && (
          <DocumentsTab
            property={aggregate}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {tab === "amenities" && (
          <AmenitiesTab
            property={aggregate}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
      </div>
    </div>
  );
}
