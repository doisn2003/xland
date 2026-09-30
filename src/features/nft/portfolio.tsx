"use client";
import Link from "next/link";
import { useState } from "react";
import { properties } from "@/data/properties";
import { holding, money, offerings, outcomeLabel, percent } from "./model";
import { resetDemo, useNftDemo } from "./store";

export function Portfolio() {
  const { ledger, ready, notice } = useNftDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("");
  const owned = offerings.map(offering => ({ offering, ...holding(ledger, offering.id) })).filter(item => item.quantity > 0);
  return <>
    {notice && <p className="context-note" role="status">{notice}</p>}
    <p role="status">{message}</p>
    <section className="nft-portfolio-summary"><div><span>Vốn mua mẫu, gồm phí</span><strong>{money(owned.reduce((sum, item) => sum + item.cost, 0))}</strong></div><div><span>Tài sản đang nắm giữ</span><strong>{owned.length}</strong></div></section>
    {!ready ? <p>Đang tải danh mục…</p> : owned.length === 0 ? <div className="nft-empty"><h2>Chưa có NFT trong danh mục</h2><p>Khám phá một phương án và trải nghiệm lần mua NFT đầu tiên.</p><Link className="button" href="/nft">Khám phá NFT</Link></div> : <div className="nft-holdings">{owned.map(({ offering, quantity, cost }) => {
      const property = properties.find(p => p.id === offering.propertyId)!;
      return <article key={offering.id} className="nft-holding"><p className="eyebrow">{property.location}</p><h2><Link href={`/nft/${offering.slug}`}>{property.name}</Link></h2><dl className="nft-totals"><div><dt>NFT nắm giữ</dt><dd>{quantity}</dd></div><div><dt>Tỷ lệ phương án</dt><dd>{percent(quantity, offering.supply)}</dd></div><div><dt>Vốn mua mẫu</dt><dd>{money(cost)}</dd></div></dl><Link className="text-link" href={`/nft/${offering.slug}`}>Xem phương án →</Link></article>;
    })}</div>}
    <section className="nft-history"><h2>Lịch sử mô phỏng</h2><p className="fine-print">Thời gian kịch bản mẫu · Giờ Việt Nam. Mã DEMO là tham chiếu nội bộ, không phải transaction hash.</p>
      {ready && ledger.orders.length === 0 && <p>Chưa có giao dịch.</p>}
      <ol>{[...ledger.orders].reverse().map(order => {
        const offering = offerings.find(item => item.id === order.offeringId)!;
        const property = properties.find(item => item.id === offering.propertyId)!;
        return <li key={order.id}><strong>{property.name} · {order.quantity} NFT</strong><span>{outcomeLabel[order.outcome]}</span><span>{money(order.total)} · Tổng tiền yêu cầu mẫu</span><time dateTime={order.createdAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(order.createdAt))}</time><small>{order.id}</small></li>;
      })}</ol>
    </section>
    <section className="nft-reset"><h2>Bắt đầu lại trải nghiệm</h2><p>Đặt lại danh mục, lịch sử và tồn NFT mẫu trên trình duyệt này.</p>{confirmReset ? <><p>Đặt lại toàn bộ trải nghiệm NFT mẫu?</p><button className="button" onClick={async () => { await resetDemo(); setConfirmReset(false); setMessage("Đã đặt lại demo NFT."); }}>Xác nhận đặt lại</button><button className="text-button" onClick={() => setConfirmReset(false)}>Giữ danh mục</button></> : <button className="text-button" disabled={!ready} onClick={() => setConfirmReset(true)}>Đặt lại demo NFT</button>}</section>
  </>;
}
