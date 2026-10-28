"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState, useEffect, useCallback} from "react";
import useSWR from "swr";
import {api, errorText, type Catalog, type Row} from "../api";
import {ConfirmModal} from "../confirm-modal";
import type {PropertyAggregate, StudioTab} from "./types";
import {PropertyMode} from "./mode-switch";
import {ChildrenTab} from "./children-tab";
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
  canDelete?: boolean;
}

export function PropertyStudio({
  propertyId,
  catalog,
  locations,
  initialTab = "children",
  canDelete = true,
}: PropertyStudioProps) {
  const router = useRouter();
  const [tab, setTab] = useState<StudioTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab") as StudioTab;
      if (p && ["basic", "media", "legal", "documents", "amenities", "children"].includes(p)) return p;
    }
    return initialTab;
  });
  const [actionError, setActionError] = useState("");
  const [statusBusy, setStatusBusy] = useState(false);
  const [basicDirty,setBasicDirty]=useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    if(basicDirty&&newTab!=="basic"){setActionError("Lưu thông tin đang chỉnh sửa trước khi chuyển phần quản lý.");return;}
    setActionError("");setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.replaceState({}, "", url.toString());
  }, [basicDirty]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    function onPopState() {
      const p = new URLSearchParams(window.location.search).get("tab") as StudioTab;
      if (p && ["basic", "media", "legal", "documents", "amenities", "children"].includes(p)) {
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

  async function handleDeleteProperty() {
    setDeleting(true);
    setActionError("");
    try {
      await api(`properties/${propertyId}`, "DELETE");
      router.push("/admin/properties?deleted=1");
    } catch (err) {
      setActionError(errorText(err));
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
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

  const activeTab = tab === "children" && !aggregate.has_subplots ? "basic" : tab;
  const mediaCount = aggregate.media?.length ?? 0;
  const legalCount = aggregate.legal_items?.length ?? 0;
  const docCount = aggregate.documents?.length ?? 0;
  const amenityCount = aggregate.amenities?.length ?? 0;

  return (
    <div className="admin-studio">
      <PropertyMode multiple={!!aggregate.has_subplots} busy={statusBusy} disabledReason={basicDirty?"Lưu thông tin đang chỉnh sửa trước khi đổi kiểu hồ sơ.":aggregate.has_subplots&&(aggregate.subdivision?.total??0)>0?"Chuyển các lô con sang hồ sơ khác trước khi tắt chế độ nhiều lô.":undefined} onChange={async value=>{
        setStatusBusy(true);setActionError("");
        try{await api(`properties/${aggregate.id}`,"PATCH",{_version:aggregate._version,has_subplots:value});await mutate();handleSelectTab(value?"children":"basic");}
        catch(e){setActionError(errorText(e));}finally{setStatusBusy(false);}
      }}/>
      {/* Studio Header Bar */}
      <div className="admin-studio-header">
        <div className="admin-studio-top">
          <Link href="/admin/properties" className="admin-studio-back">
            ← Danh sách lô đất
          </Link>
          <div className="admin-studio-quick-actions">
            {aggregate.approval_status === "approved" && aggregate.status === "listed" && (
              <a
                href={`/lo-dat/${aggregate.id}`}
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
            {canDelete && (
              <button
                type="button"
                className="admin-button secondary small admin-delete-btn"
                onClick={() => setShowDeleteModal(true)}
                disabled={statusBusy || deleting}
              >
                Xóa lô đất
              </button>
            )}
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
              {BigInt(aggregate.price_total).toLocaleString("vi-VN")} đ
              {aggregate.consultant_name && ` · Phụ trách: ${aggregate.consultant_name}`}
            </p>
          </div>
        </div>

        {actionError && <p className="admin-error" role="alert">{actionError}</p>}

        {aggregate.parent && <Link className="admin-text-link" href={`/admin/properties/${aggregate.parent.id}?tab=children`}>↑ {aggregate.parent.code} · {aggregate.parent.title}</Link>}
        {/* Tab Navigation (0ms instant tab change) */}
        <nav className="admin-studio-tabs" aria-label="Các phần quản lý lô đất">
          {aggregate.has_subplots && <button type="button" className={`admin-studio-tab ${activeTab === "children" ? "is-active" : ""}`} onClick={()=>handleSelectTab("children")}>Các lô đất con <span className="admin-tab-count">{aggregate.subdivision?.total??0}</span></button>}
          <button
            type="button"
            className={`admin-studio-tab ${activeTab === "basic" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("basic")}
          >
            📋 Thông tin cơ bản
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${activeTab === "media" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("media")}
          >
            🖼 Thư viện ảnh & video
            <span className="admin-tab-count">{mediaCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${activeTab === "legal" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("legal")}
          >
            ⚖ Hồ sơ pháp lý
            <span className="admin-tab-count">{legalCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${activeTab === "documents" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("documents")}
          >
            📁 Tài liệu kỹ thuật
            <span className="admin-tab-count">{docCount}</span>
          </button>
          <button
            type="button"
            className={`admin-studio-tab ${activeTab === "amenities" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("amenities")}
          >
            📍 Tiện ích & Lịch hẹn
            <span className="admin-tab-count">{amenityCount}</span>
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="admin-studio-content">
        {activeTab === "children" && <ChildrenTab key={aggregate.id} property={aggregate} onUpdated={updated=>void mutate(updated,false)}/>}
        {activeTab === "basic" && (
          <BasicTab onDirtyChange={setBasicDirty}
            key={aggregate.id}
            property={aggregate}
            catalog={catalog}
            locations={locations}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {activeTab === "media" && (
          <MediaTab
            property={aggregate}
            canDelete={canDelete}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {activeTab === "legal" && (
          <LegalTab
            property={aggregate}
            canDelete={canDelete}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            property={aggregate}
            canDelete={canDelete}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
        {activeTab === "amenities" && (
          <AmenitiesTab
            property={aggregate}
            canDelete={canDelete}
            onUpdated={updated => void mutate(updated, false)}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa lô đất"
        message={`Bạn có chắc chắn muốn xóa lô đất "${aggregate.code} - ${aggregate.title}"? Thao tác này sẽ xóa vĩnh viễn toàn bộ dữ liệu kèm theo (ảnh, pháp lý, tài liệu, tiện ích...) và không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa vĩnh viễn"
        isLoading={deleting}
        onConfirm={handleDeleteProperty}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
