"use client";
import Link from "next/link";
import {useRef, useState, type FormEvent} from "react";
import useSWR from "swr";
import {api, errorText, type Row} from "../api";
import {formatted} from "../labels";
import type {PropertyAggregate} from "./types";

export function ChildrenTab({property, onUpdated}: {property: PropertyAggregate; onUpdated: (p: PropertyAggregate) => void}) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({code:"",title:"",area_m2:"",price_total:"",frontage_m:"",depth_m:"",is_corner:false});
  const [saving, setSaving] = useState(false), [error, setError] = useState(""), [created, setCreated] = useState<Row | null>(null);
  const busy = useRef(false);
  const path = `properties?filter=parent_property_id&value=${property.id}&limit=12&page=${page}&q=${encodeURIComponent(query)}`;
  const {data, error: loadError, mutate} = useSWR<{items:Row[];total:number}>(path, () => api<{items:Row[];total:number}>(path));
  const stats = property.subdivision;
  async function create(e: FormEvent) {
    e.preventDefault();
    if(busy.current) return;
    busy.current=true;setSaving(true);setError("");setCreated(null);
    try {
      const result = await api<Row>(`properties/${property.id}/children`, "POST", {
        ...draft, frontage_m:draft.frontage_m||null, depth_m:draft.depth_m||null, _version:property._version,
      });
      setCreated(result);
      setDraft({code:"",title:"",area_m2:"",price_total:"",frontage_m:"",depth_m:"",is_corner:false});
      await mutate();
      onUpdated(await api<PropertyAggregate>(`properties/${property.id}/aggregate`));
    } catch(e) {setError(errorText(e));}
    finally {busy.current=false;setSaving(false);}
  }
  return <div className="admin-subdivision">
    <section className="admin-subdivision-hero">
      <div><p className="admin-subdivision-eyebrow">STUDIO PHÂN LÔ</p><h2>Một hồ sơ, nhiều lô đất</h2><p>Quản lý diện tích, giá chào và tiến độ của từng lô trong {property.code}.</p></div>
      <div className="admin-subdivision-stats">
        <div><span>Tổng diện tích</span><strong>{formatted(property.area_m2,"area_m2")} m²</strong></div>
        <div><span>Đã phân bổ · {stats?.total ?? 0} lô</span><strong>{formatted(stats?.allocated_area_m2??"0","area_m2")} m²</strong></div>
        <div><span>Còn lại</span><strong>{formatted(stats?.remaining_area_m2??property.area_m2,"area_m2")} m²</strong></div>
        <div><span>Đang bán / Đã bán / Chờ duyệt</span><strong>{stats?.listed??0} / {stats?.sold??0} / {stats?.pending??0}</strong></div>
      </div>
    </section>
    <form className="admin-panel" onSubmit={create}>
      <div className="admin-section-title"><div><h2>Thêm lô con</h2><p>Thông tin, hình ảnh, tài liệu và tiện ích được sao chép từ hồ sơ cha. Lô mới tạm dừng và chờ duyệt; các mục pháp lý cần được đối chiếu lại.</p></div></div>
      <div className="admin-form-grid">
        {([['code','Mã lô con'],['title','Tên lô con'],['area_m2','Diện tích lô con (m²)'],['price_total','Giá lô con (VNĐ)'],['frontage_m','Mặt tiền lô con (m)'],['depth_m','Chiều sâu lô con (m)']] as const).map(([key,label]) => <label className="admin-field" key={key}>{label}<input value={draft[key]} required={!["frontage_m","depth_m"].includes(key)} maxLength={key==='code'?80:200} inputMode={['code','title'].includes(key)?'text':'decimal'} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}
        <label className="admin-checkbox"><input type="checkbox" checked={draft.is_corner} onChange={e=>setDraft({...draft,is_corner:e.target.checked})}/>Lô góc</label>
      </div>
      {error && <div className="admin-error" role="alert">{error} <button type="button" className="admin-text-link" onClick={async()=>{onUpdated(await api<PropertyAggregate>(`properties/${property.id}/aggregate`));}}>Tải lại số liệu</button></div>}
      {created && <p className="admin-success" role="status">Đã tạo {String(created.code)}. <Link href={`/admin/properties/${created.id}`}>Mở hồ sơ để chỉnh sửa và duyệt →</Link></p>}
      <div className="admin-form-actions"><button className="admin-button" disabled={saving}>{saving?'Đang tạo…':'Tạo lô con'}</button></div>
    </form>
    <section className="admin-panel">
      <div className="admin-section-title"><div><h2>Danh sách lô con</h2><p>Mở hồ sơ từng lô để quản lý đầy đủ media, pháp lý, giá và trạng thái hoặc tiếp tục chia thành các lô nhỏ.</p></div>
        <label className="admin-field">Tìm lô con<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Mã hoặc tên lô"/></label></div>
      {loadError ? <p role="alert" className="admin-error">{errorText(loadError)} <button className="admin-button secondary" onClick={()=>void mutate()}>Thử lại</button></p> : !data ? <p role="status">Đang tải lô con…</p> : <>
        {!data.items.length ? <p>Chưa có lô con phù hợp.</p> : <div className="admin-child-grid">{data.items.map(child=><article key={String(child.id)} className="admin-child-card">
          <div className="admin-studio-badges"><span className="admin-code-tag">{String(child.code)}</span>{child.has_subplots===true&&<span className="admin-badge">Nhiều lô đất con</span>}{child.is_corner===true&&<span className="admin-badge">Lô góc</span>}</div>
          <h3><Link href={`/admin/properties/${child.id}`}>{String(child.title)}</Link></h3>
          <strong>{formatted(child.price_total,'price_total')} đ</strong>
          <p>{formatted(child.area_m2,'area_m2')} m² · Mặt tiền {child.frontage_m==null?'chưa có':formatted(child.frontage_m,'area_m2')+' m'}</p>
          <p>{formatted(child.status,'status')} · {formatted(child.approval_status,'approval_status')}</p>
          <Link className="admin-button secondary small" href={`/admin/properties/${child.id}`}>Quản lý lô →</Link>
        </article>)}</div>}
        <div className="admin-child-pagination"><button className="admin-button secondary" disabled={page===1} onClick={()=>setPage(page-1)}>Trang trước</button><span>Trang {page} · {data.total} lô</span><button className="admin-button secondary" disabled={page*12>=data.total} onClick={()=>setPage(page+1)}>Trang sau</button></div>
      </>}
    </section>
  </div>;
}
