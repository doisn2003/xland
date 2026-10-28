"use client";
import {useState} from "react";
import type {Field,Row} from "../api";
import {FormField} from "../controls";
import {initial,serialize} from "../form-values";

const derived=new Set(["land_type","province","district","commune_name","region"]);
const geography=new Set([...derived,"province_code","district_code","commune_code","catalog_version","address_detail","old_address"]);
const advanced=new Set(["parent_property_id","lat","lng","approximate_lat","approximate_lng","approximate_radius_m","is_illustrative"]);
export function propertyDraft(fields:Field[],record:Row|null,locations:Row[]):Row{
  const draft=initial(fields,record??{});
  if(!record)Object.assign(draft,{catalog_version:locations.find(l=>l.current===true)?.catalog_version??"",category:"residential",approval_status:"pending",status:"paused",status_badge:"standard"});
  return draft;
}
export function propertyPayload(fields:Field[],draft:Row,original?:Row):Row{
  const data=serialize(fields,draft,original);
  for(const name of derived)delete data[name];
  return data;
}
const searchable=(text:unknown)=>String(text??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase();

function LocationFields({draft,setDraft,locations}:{draft:Row;setDraft:(fn:(v:Row)=>Row)=>void;locations:Row[]}){
  const [provinceSearch,setProvinceSearch]=useState(""),[communeSearch,setCommuneSearch]=useState("");
  const current=locations.filter(l=>l.current===true),version=current[0]?.catalog_version;
  const legacy=!!draft.catalog_version&&draft.catalog_version!==version;
  const provinces=current.filter(l=>l.kind==="province"&&(l.code===draft.province_code||searchable(l.name).includes(searchable(provinceSearch))));
  const communes=current.filter(l=>l.kind==="commune"&&l.parent_code===draft.province_code&&(l.code===draft.commune_code||searchable(l.name).includes(searchable(communeSearch))));
  return <section className="admin-property-address"><div className="admin-section-title"><div><h3>Địa chỉ lô đất</h3><p>Chọn tỉnh/thành phố và xã/phường theo địa giới hiện hành.</p></div></div>
    {legacy?<div className="admin-legacy-address"><strong>Địa chỉ đang lưu</strong><p>{[draft.commune_name,draft.district,draft.province].filter(Boolean).join(", ")}</p><p>Hồ sơ dùng địa giới cũ. Bạn có thể giữ nguyên khi sửa các thông tin khác.</p><button className="admin-button secondary small" type="button" disabled={!version} onClick={()=>setDraft(v=>({...v,catalog_version:version,province_code:"",commune_code:"",commune_name:"",district:null,district_code:null,old_address:v.old_address||[v.commune_name,v.district,v.province].filter(Boolean).join(", ")}))}>Cập nhật địa giới hiện hành</button></div>:<div className="admin-form-grid">
      <div className="admin-field"><label htmlFor="province_code">Tỉnh / thành phố <span className="admin-required">*</span></label><input type="search" aria-label="Tìm tỉnh / thành phố" placeholder="Tìm tỉnh/thành phố…" value={provinceSearch} onChange={e=>setProvinceSearch(e.target.value)}/><select id="province_code" required value={String(draft.province_code??"")} onChange={e=>{const code=e.target.value,p=current.find(l=>l.kind==="province"&&l.code===code);setCommuneSearch("");setDraft(v=>({...v,province_code:code,province:p?.name??"",catalog_version:version,commune_code:"",commune_name:"",district_code:null,district:null,region:p?.region??""}));}}><option value="">Chọn tỉnh / thành phố</option>{provinces.map(p=><option key={String(p.code)} value={String(p.code)}>{String(p.name)}</option>)}</select></div>
      <div className="admin-field"><label htmlFor="commune_code">Xã / phường / đặc khu <span className="admin-required">*</span></label><input type="search" aria-label="Tìm xã / phường / đặc khu" placeholder="Tìm xã/phường…" disabled={!draft.province_code} value={communeSearch} onChange={e=>setCommuneSearch(e.target.value)}/><select id="commune_code" required disabled={!draft.province_code} value={String(draft.commune_code??"")} onChange={e=>{const code=e.target.value,commune=current.find(l=>l.kind==="commune"&&l.code===code&&l.parent_code===draft.province_code);setDraft(v=>({...v,commune_code:code,commune_name:commune?.name??""}));}}><option value="">{draft.province_code?"Chọn xã / phường / đặc khu":"Chọn tỉnh / thành phố trước"}</option>{communes.map(c=><option key={String(c.code)} value={String(c.code)}>{String(c.name)}</option>)}</select></div>
    </div>}
    {!version&&<p role="alert" className="admin-error">Máy chủ chưa nạp danh mục địa giới hiện hành. Vui lòng cập nhật migration.</p>}
    <div className="admin-form-grid"><div className="admin-field"><label htmlFor="address_detail">Địa chỉ chi tiết</label><input id="address_detail" maxLength={500} placeholder="Số nhà, đường, thôn hoặc khu phố…" value={String(draft.address_detail??"")} onChange={e=>setDraft(v=>({...v,address_detail:e.target.value}))}/></div><div className="admin-field"><label htmlFor="old_address">Địa chỉ cũ <span className="admin-optional">(không bắt buộc)</span></label><textarea id="old_address" rows={2} maxLength={1000} placeholder="Địa chỉ trước sắp xếp hoặc địa chỉ trên giấy tờ…" value={String(draft.old_address??"")} onChange={e=>setDraft(v=>({...v,old_address:e.target.value}))}/><small>Hiển thị trên website và ứng dụng để người xem đối chiếu.</small></div></div>
  </section>;
}
export function PropertyFields({fields,draft,setDraft,locations,uploadBusy}:{fields:Field[];draft:Row;setDraft:(fn:(v:Row)=>Row)=>void;locations:Row[];uploadBusy?:(busy:boolean)=>void}){
  const editable=fields.filter(f=>!f.readonly&&f.name!=="has_subplots"&&!geography.has(f.name));
  const render=(f:Field)=><FormField key={f.name} field={f} labelOverride={f.name==="category"?"Loại đất":undefined} draft={draft} setDraft={setDraft} locations={locations} uploadBusy={uploadBusy}/>;
  return <><div className="admin-form-grid">{editable.filter(f=>["code","title"].includes(f.name)).map(render)}</div><LocationFields draft={draft} setDraft={setDraft} locations={locations}/><div className="admin-form-grid">{editable.filter(f=>!["code","title"].includes(f.name)&&!advanced.has(f.name)).map(render)}</div><details className="admin-system"><summary>Thông tin bổ sung và tọa độ</summary><div className="admin-form-grid">{editable.filter(f=>advanced.has(f.name)).map(render)}</div></details></>;
}
