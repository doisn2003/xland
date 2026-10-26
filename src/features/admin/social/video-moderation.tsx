"use client";
import Link from "next/link";
import {useState, useEffect, useRef, useCallback} from "react";
import useSWR from "swr";
import {api, errorText} from "../api";
import type {ModerationVideo} from "./types";

export function VideoModerationWorkspace() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectPromptId, setRejectPromptId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const queryParam = filter === "all" ? "" : `?status=${filter}`;
  const {
    data: videos,
    mutate,
    isLoading,
  } = useSWR<ModerationVideo[]>(
    `videos/moderation${queryParam}`,
    () => api<ModerationVideo[]>(`videos/moderation${queryParam}`),
    {revalidateOnFocus: false, dedupingInterval: 3000}
  );

  const list = videos ?? [];
  const activeVideo = list[selectedIndex] ?? null;

  const handleReview = useCallback(
    async (id: string, status: "approved" | "rejected", reason?: string) => {
      setBusy(true);
      setError("");
      try {
        await api<ModerationVideo>(`videos/${id}/review`, "PATCH", {
          approval_status: status,
          reason,
        });

        // Optimistic update
        await mutate(
          prev =>
            prev?.map(v => (v.id === id ? {...v, approval_status: status} : v)),
          false
        );

        setSuccess(`Đã ${status === "approved" ? "phê duyệt" : "từ chối"} video thành công.`);
        setRejectPromptId(null);
        setRejectReason("");
        setTimeout(() => setSuccess(""), 3000);

        // Move to next video if available
        if (selectedIndex < list.length - 1) {
          setSelectedIndex(prev => prev + 1);
        }
      } catch (err) {
        setError(errorText(err));
      } finally {
        setBusy(false);
      }
    },
    [list.length, mutate, selectedIndex]
  );

  // Global Hotkey handler for fast moderation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (!activeVideo) return;

      if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        void handleReview(activeVideo.id, "approved");
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setRejectPromptId(activeVideo.id);
      } else if (e.key === " ") {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            void videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      } else if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        if (selectedIndex < list.length - 1) {
          setSelectedIndex(prev => prev + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        if (selectedIndex > 0) {
          setSelectedIndex(prev => prev - 1);
        }
      } else if (e.key === "Escape") {
        if (rejectPromptId) {
          setRejectPromptId(null);
        } else if (drawerOpen) {
          setDrawerOpen(false);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo, drawerOpen, handleReview, list.length, rejectPromptId, selectedIndex]);

  return (
    <div className="admin-moderation-shell">
      {/* Page Header */}
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">MẠNG XÃ HỘI</span>
          <h1>Video feeds & Kiểm duyệt nhanh</h1>
          <p>
            Duyệt nội dung video cộng đồng với phím tắt tốc độ cao: <strong>A</strong> để Duyệt,{" "}
            <strong>R</strong> để Từ chối, <strong>Phím cách</strong> để Phát/Dừng.
          </p>
        </div>
        <Link href="/admin/videos/new" className="admin-button">
          + Đăng video mới
        </Link>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      {/* Filter Tabs & Hotkeys Bar */}
      <div className="admin-moderation-controls">
        <div className="admin-filter-pills" role="tablist">
          <button
            type="button"
            className={`admin-pill ${filter === "pending" ? "is-active" : ""}`}
            onClick={() => {
              setFilter("pending");
              setSelectedIndex(0);
            }}
          >
            Chờ duyệt (Pending)
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "all" ? "is-active" : ""}`}
            onClick={() => {
              setFilter("all");
              setSelectedIndex(0);
            }}
          >
            Tất cả video
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "approved" ? "is-active" : ""}`}
            onClick={() => {
              setFilter("approved");
              setSelectedIndex(0);
            }}
          >
            Đã duyệt (Approved)
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "rejected" ? "is-active" : ""}`}
            onClick={() => {
              setFilter("rejected");
              setSelectedIndex(0);
            }}
          >
            Bị từ chối (Rejected)
          </button>
        </div>

        <div className="admin-hotkeys-legend">
          <span className="admin-hotkey">
            <kbd>A</kbd> Duyệt
          </span>
          <span className="admin-hotkey">
            <kbd>R</kbd> Từ chối
          </span>
          <span className="admin-hotkey">
            <kbd>Space</kbd> Play/Pause
          </span>
          <span className="admin-hotkey">
            <kbd>↓</kbd> / <kbd>↑</kbd> Chuyển video
          </span>
        </div>
      </div>

      {/* Moderation Main Layout: List + Player Drawer */}
      <div className="admin-moderation-layout">
        {/* Left: Video Cards Grid / Table */}
        <div className="admin-moderation-list">
          {isLoading && !videos ? (
            <div className="admin-panel">Đang tải danh sách video…</div>
          ) : list.length === 0 ? (
            <div className="admin-panel admin-empty">
              <h2>Không có video nào trong mục này</h2>
              <p>Tất cả video đã được xử lý hoặc chưa có nội dung tương ứng.</p>
            </div>
          ) : (
            <div className="admin-video-cards">
              {list.map((v, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={v.id}
                    className={`admin-video-card ${isSelected ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedIndex(idx);
                      setDrawerOpen(true);
                    }}
                  >
                    <div className="admin-video-card-thumb">
                      {v.media.public_url ? (
                        <video
                          src={v.media.public_url}
                          preload="metadata"
                          muted
                          className="admin-video-thumb-img"
                        />
                      ) : (
                        <div className="admin-video-thumb-placeholder">Video</div>
                      )}
                      {v.media.duration_seconds && (
                        <span className="admin-video-duration">
                          {Math.floor(v.media.duration_seconds / 60)}:
                          {String(v.media.duration_seconds % 60).padStart(2, "0")}
                        </span>
                      )}
                      <span className={`admin-badge ${v.approval_status}`}>
                        {v.approval_status === "approved"
                          ? "Đã duyệt"
                          : v.approval_status === "rejected"
                          ? "Từ chối"
                          : "Chờ duyệt"}
                      </span>
                    </div>

                    <div className="admin-video-card-body">
                      <p className="admin-video-card-caption">
                        {v.caption || <em>(Không có chú thích)</em>}
                      </p>

                      <div className="admin-video-card-meta">
                        <span>👤 {v.author?.display_name ?? "Tư vấn viên"}</span>
                        <span>🏷 {v.property?.code ?? "Lô đất"}</span>
                      </div>

                      <div className="admin-video-card-metrics">
                        <span>👁 {Number(v.view_count).toLocaleString("vi-VN")}</span>
                        <span>♥ {v.likes_count}</span>
                        <span>💬 {v.comments_count}</span>
                        <time>{new Date(v.published_at).toLocaleDateString("vi-VN")}</time>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right / Sticky: Video Player & Moderation Station */}
        {activeVideo && (
          <aside className={`admin-moderation-station ${drawerOpen ? "is-open" : ""}`}>
            <div className="admin-station-header">
              <h3>Kiểm duyệt chi tiết</h3>
              <button
                type="button"
                className="admin-station-close"
                onClick={() => setDrawerOpen(false)}
                title="Đóng (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="admin-station-player">
              {activeVideo.media.public_url ? (
                <video
                  ref={videoRef}
                  key={activeVideo.id}
                  src={activeVideo.media.public_url}
                  controls
                  autoPlay
                  playsInline
                  className="admin-moderation-video"
                />
              ) : (
                <div className="admin-video-placeholder">Không có nguồn phát video</div>
              )}
            </div>

            <div className="admin-station-details">
              <h4>{activeVideo.caption || "Video không có tiêu đề"}</h4>
              <dl className="admin-station-dl">
                <div>
                  <dt>Tác giả</dt>
                  <dd>{activeVideo.author?.display_name ?? "—"}</dd>
                </div>
                <div>
                  <dt>Lô đất gắn kèm</dt>
                  <dd>
                    <Link
                      href={`/admin/properties/${activeVideo.property_id}`}
                      className="admin-text-link"
                    >
                      {activeVideo.property?.code} · {activeVideo.property?.title} →
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>Thời lượng</dt>
                  <dd>{activeVideo.media?.duration_seconds ? `${activeVideo.media.duration_seconds} giây` : "—"}</dd>
                </div>
                <div>
                  <dt>Trạng thái</dt>
                  <dd>
                    <span className={`admin-badge ${activeVideo.approval_status}`}>
                      {activeVideo.approval_status === "approved"
                        ? "Đã duyệt"
                        : activeVideo.approval_status === "rejected"
                        ? "Đã từ chối"
                        : "Đang chờ duyệt"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Fast Action Buttons */}
            <div className="admin-station-actions">
              <button
                type="button"
                className="admin-button approve-btn"
                onClick={() => void handleReview(activeVideo.id, "approved")}
                disabled={busy}
              >
                ✓ Duyệt video (A)
              </button>
              <button
                type="button"
                className="admin-button reject-btn"
                onClick={() => setRejectPromptId(activeVideo.id)}
                disabled={busy}
              >
                ✕ Từ chối (R)
              </button>
            </div>

            {/* Reject Reason Form Modal/Inline */}
            {rejectPromptId === activeVideo.id && (
              <div className="admin-reject-box">
                <label>
                  Lý do từ chối:
                  <textarea
                    autoFocus
                    rows={3}
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="VD: Vi phạm tiêu chuẩn hình ảnh, âm thanh nhiễu…"
                  />
                </label>
                <div style={{display: "flex", gap: "8px", justifyContent: "flex-end"}}>
                  <button
                    type="button"
                    className="admin-button secondary small"
                    onClick={() => setRejectPromptId(null)}
                    disabled={busy}
                  >
                    Hủy (Esc)
                  </button>
                  <button
                    type="button"
                    className="admin-button small reject-btn"
                    onClick={() => void handleReview(activeVideo.id, "rejected", rejectReason)}
                    disabled={busy}
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
