"use client";

import { useRef, useState } from "react";
import { resetDemo } from "@/features/nft/store";
import { resetJourney, useJourney } from "./store";

export function ResetExperience() {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const pending = useRef(false);
  const { ready, notice } = useJourney();
  return <section className="journey-panel"><h2>Bắt đầu lại hành trình</h2><p>Xóa danh sách đã lưu, khôi phục lịch hẹn ban đầu và đặt lại danh mục, lịch sử mua, tồn NFT trên trình duyệt này.</p>{notice && <p className="journey-notice">{notice}</p>}<p role="status">{message}</p>{confirm ? <><p className="journey-notice">Các lựa chọn hiện tại sẽ được xóa. Bạn muốn tiếp tục?</p><div className="journey-actions"><button className="button" disabled={busy} onClick={async () => {
    if (pending.current) return;
    pending.current = true; setBusy(true);
    try { await resetDemo(); await resetJourney(); setMessage("Đã đặt lại trải nghiệm."); setConfirm(false); }
    catch { setMessage("Chưa đặt lại đầy đủ. Hãy thử lại."); }
    finally { pending.current = false; setBusy(false); }
  }}>{busy ? "Đang đặt lại…" : "Xác nhận đặt lại toàn bộ"}</button><button className="text-button" disabled={busy} onClick={() => setConfirm(false)}>Giữ trải nghiệm</button></div></> : <button className="button" disabled={!ready} onClick={() => { setConfirm(true); setMessage(""); }}>Đặt lại trải nghiệm</button>}</section>;
}
