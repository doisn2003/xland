"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { money, percent, quantityError, quote, remaining, statusLabel, outcomeLabel, type Offering, type Order, type Outcome } from "./model";
import { purchase, useNftDemo } from "./store";

export function PurchasePanel({ offering }: { offering: Offering }) {
  const { ledger, ready, notice } = useNftDemo();
  const [quantity, setQuantity] = useState("1");
  const [accepted, setAccepted] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [result, setResult] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (review || result) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start" });
    }
  }, [review, result]);
  const amount = Number(quantity);
  const invalid = quantityError(ledger, offering, amount);
  const validAmount = Number.isSafeInteger(amount) && amount > 0 && amount <= offering.supply;
  const price = quote(offering, validAmount ? amount : 0);
  const available = remaining(ledger, offering);
  const unavailable = offering.status !== "open" || available === 0;

  async function finish(outcome: Outcome) {
    if (!review || pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try { setResult(await purchase({ id: review, offeringId: offering.id, quantity: amount, outcome })); setReview(null); }
    catch (problem) { setError(problem instanceof Error ? problem.message : "Chưa hoàn tất thao tác. Vui lòng thử lại."); }
    finally { pending.current = false; setBusy(false); }
  }
  return <aside className="nft-purchase" aria-label="Mua NFT mô phỏng">
    <p className="eyebrow">VÍ TRẢI NGHIỆM · KHÔNG CẦN KẾT NỐI</p>
    <p className="nft-unit-price">{money(offering.price)} <small>/ NFT</small></p>
    <p>{ready ? available.toLocaleString("vi-VN") : "…"} NFT còn lại / {offering.supply.toLocaleString("vi-VN")}</p>
    {notice && <p className="context-note" role="status">{notice}</p>}
    {result ? <div className="purchase-result">
      <h2 ref={heading} tabIndex={-1}>{outcomeLabel[result.outcome]}</h2>
      <p>{result.outcome === "success" ? `Đã thêm ${result.quantity} NFT vào danh mục mẫu.` : "Danh mục và số NFT còn lại không thay đổi."}</p>
      <p className="fine-print">Mã tham chiếu: {result.id}</p>
      <Link className="button" href="/danh-muc-nft">Xem danh mục NFT</Link>
      <button className="text-button" onClick={() => { setResult(null); setAccepted(false); }}>Tạo yêu cầu mới</button>
    </div> : <form noValidate onSubmit={event => {
      event.preventDefault();
      if (!ready || invalid) { setError(invalid || "Đang tải dữ liệu demo."); return; }
      if (!accepted) { setError("Hãy xác nhận đã đọc điều kiện mẫu trước khi tiếp tục."); return; }
      setError(""); setReview(`DEMO-${crypto.randomUUID()}`);
    }}>
      <h2 ref={heading} tabIndex={-1}>{review ? "Xem lại yêu cầu" : "Chọn số lượng NFT"}</h2>
      {review ? <p><strong>{amount} NFT</strong> · {percent(amount, offering.supply)} tổng phương án</p> : <>
        <label className="nft-field" htmlFor="nft-quantity">Số lượng NFT<input id="nft-quantity" type="number" inputMode="numeric" min="1" max={available} step="1" value={quantity} disabled={unavailable || !ready} onChange={e => { setQuantity(e.target.value); setError(""); }} aria-describedby="quantity-hint purchase-error" aria-invalid={!!error && !!invalid} /></label>
        <p id="quantity-hint" className="fine-print">{validAmount ? percent(amount, offering.supply) : "—"} tổng phương án. Tỷ lệ tính trên {offering.supply.toLocaleString("vi-VN")} NFT cố định.</p>
      </>}
      <dl className="nft-totals"><div><dt>Tiền mua mẫu</dt><dd>{money(price.subtotal)}</dd></div><div><dt>Phí mẫu (0%)</dt><dd>{money(price.fee)}</dd></div><div><dt>Tổng tiền mẫu</dt><dd>{money(price.total)}</dd></div></dl>
      {!review && <label className="nft-consent"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} disabled={unavailable || !ready} /><span>Tôi đã đọc <a href="#dieu-kien">điều kiện mẫu</a> và hiểu đây là mua NFT mô phỏng, không chuyển tiền.</span></label>}
      <p id="purchase-error" role="alert" className="nft-error">{error}</p>
      {review ? <div className="nft-actions">
        <button className="button" type="button" disabled={busy} onClick={() => finish("success")}>{busy ? "Đang xử lý…" : "Xác nhận mua NFT mô phỏng"}</button>
        <button className="text-button" type="button" disabled={busy} onClick={() => finish("cancelled")}>Hủy yêu cầu</button>
        <details><summary>Thử tình huống lỗi</summary><p className="fine-print">Minh họa giao dịch thất bại, không tăng số NFT.</p><button className="text-button" type="button" disabled={busy} onClick={() => finish("failed")}>Mô phỏng thất bại</button></details>
      </div> : <button className="button" type="submit" disabled={unavailable || !ready}>{!ready ? "Đang tải demo…" : unavailable ? statusLabel[offering.status === "open" ? "sold_out" : offering.status] : "Xem lại trước khi mua"}</button>}
    </form>}
    <p className="fine-print">Chỉ ghi nhận trên trình duyệt này. Không thu tiền, không mint NFT hoặc gửi giao dịch Blockchain.</p>
  </aside>;
}
