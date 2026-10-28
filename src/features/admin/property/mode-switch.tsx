"use client";
import {useId} from "react";

export function PropertyMode({multiple,onChange,busy=false,disabledReason}:{multiple:boolean;onChange:(value:boolean)=>void;busy?:boolean;disabledReason?:string}){
  const description=useId();
  return <section className={`admin-property-mode ${multiple?"is-multiple":""}`} aria-label="Kiểu hồ sơ">
    <div className="admin-mode-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="5"/>{multiple&&<path d="M16 4v24M4 16h24"/>}</svg></div>
    <div className="admin-mode-copy"><span className="admin-eyebrow">KIỂU HỒ SƠ</span><h2>{multiple?"Một khu đất · nhiều lô con":"Một lô đất"}</h2><p id={description}>{disabledReason??(multiple?"Tạo hồ sơ khu đất, sau đó quản lý diện tích, giá và nội dung riêng cho từng lô.":"Quản lý diện tích, giá và hồ sơ của một lô đất độc lập.")}</p></div>
    <div className="admin-mode-control"><span>Nhiều lô đất con</span><button type="button" role="switch" aria-label="Nhiều lô đất con" aria-checked={multiple} aria-describedby={description} aria-busy={busy} disabled={busy||!!disabledReason} className="admin-estate-switch" onClick={()=>onChange(!multiple)}><span className="admin-switch-thumb"/></button><small aria-live="polite">{busy?"Đang lưu…":multiple?"Đang bật":"Đang tắt"}</small></div>
  </section>;
}
