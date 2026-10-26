"use client";
import Link from "next/link";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {api,AdminError,errorText,type Catalog,type Row} from "./api";
import {FormField} from "./controls";
import {initial,serialize} from "./form-values";
import {formatted,label} from "./labels";

export function Editor({entity,catalog,record,locations,property,isSuperAdmin}:{entity:string;catalog:Catalog;record:Row|null;locations:Row[];property?:string;isSuperAdmin?:boolean}){
  const config=catalog[entity]!;const router=useRouter();
  const mediaFields=catalog.media!.fields.filter(f=>!["property_id","kind","usage"].includes(f.name));
  const [draft,setDraft]=useState(()=>initial(config.fields,record??(property?{property_id:property}:{})));
  const [media,setMedia]=useState(()=>initial(mediaFields,(record?.media as Row)??{sort_order:"0",is_illustrative:false}));
  const [contact,setContact]=useState<Row>((record?.contact as Row)??{phone:"",email_contact:""});
  const [reason,setReason]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false),[uploads,setUploads]=useState(0);
  const [userRoles, setUserRoles]=useState<string[]>(()=>{
    if (entity==="users"&&record?.roles&&Array.isArray(record.roles)){
      return (record.roles as {role:string}[]).map(r=>r.role);
    }
    return [];
  });
  const [roleBusy, setRoleBusy]=useState(false);
  const [roleError, setRoleError]=useState("");
  const [roleSuccess, setRoleSuccess]=useState("");
  const readonly=config.edit?.length===0;
  const active=config.fields.filter(f=>!f.readonly&&!(entity==="videos"&&f.name==="media_id"));
  function uploadBusy(b:boolean){setUploads(n=>Math.max(0,n+(b?1:-1)));}
  async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError("");
    try{
      const data=serialize(config.fields,draft,record??undefined);
      if(entity==="videos"){
        delete data.media_id;
        data.media={...serialize(mediaFields,media,record?.media as Row|undefined),...(record?{_version:(record.media as Row)._version}:{})};
        if(!media.public_url||!media.storage_key)throw new Error("Vui lòng tải video lên và điền mô tả media.");
      }
      if(entity==="consultants")data.contact={phone:contact.phone||null,email_contact:contact.email_contact||null};
      if(entity==="bookings")data.reason=reason;
      if(record)data._version=record._version;
      const saved=await api<Row>(entity+(record?`/${record.id}`:""),record?"PATCH":"POST",data);
      router.push(`/admin/${entity}/${saved.id}?saved=${saved._version}`);router.refresh();
    }catch(e){setError(errorText(e)+(e instanceof AdminError&&e.field?` (${label(e.field)})`:""));setBusy(false);}
  }
  async function handleSaveRoles(){
    setRoleBusy(true);setRoleError("");setRoleSuccess("");
    try{
      const res=await api<{userId:string;roles:string[]}>(`users/${record!.id}/roles`,"PATCH",{
        roles:userRoles.filter(r=>["admin","moderator"].includes(r)),
      });
      setUserRoles(res.roles);
      setRoleSuccess("Đã cập nhật vai trò người dùng thành công.");
    }catch(err){setRoleError(errorText(err));}
    finally{setRoleBusy(false);}
  }
  return <>
    <div className="admin-page-heading"><div><Link className="admin-text-link" href={`/admin/${entity}`}>← {config.title}</Link><h1>{record?(readonly?"Chi tiết hồ sơ":"Chỉnh sửa hồ sơ"):"Thêm "+config.title.toLowerCase()}</h1><p>Trường có dấu <span className="admin-required">*</span> là bắt buộc. Thời gian hiển thị theo giờ Việt Nam.</p></div></div>
    {entity==="properties"&&record&&<nav className="admin-related" aria-label="Hồ sơ liên quan">{["media","legal","documents","amenities","slots","videos","bookings"].map(key=><Link key={key} href={`/admin/${key}?filter=property_id&value=${record.id}`}>{catalog[key]!.title}</Link>)}</nav>}
    <form onSubmit={submit} className="admin-panel admin-editor">
      {!readonly&&<><div className="admin-section-title"><h2>Thông tin {config.title.toLowerCase()}</h2><p>{entity==="bookings"?"Chuyển trạng thái cần lý do. Xác nhận và hoàn tất cần tiền cọc được xác minh.":"Thông tin được lưu vào hệ thống Xland."}</p></div>
      <div className="admin-form-grid">{active.map(f=><FormField key={f.name} field={f} draft={draft} setDraft={setDraft} locations={locations} uploadBusy={uploadBusy}/>)}</div></>}
      {entity==="videos"&&<section className="admin-form-section"><h2>Tệp video & ảnh bìa</h2><p>Chọn video của lô đất đang đăng. Upload xong, điền mô tả và thời lượng trước khi lưu.</p><div className="admin-form-grid">{mediaFields.filter(f=>!f.readonly).map(f=><FormField key={f.name} field={f} draft={{...media,kind:"video"}} setDraft={setMedia} uploadBusy={uploadBusy}/>)}</div>{!!media.public_url&&<video className="admin-video" src={String(media.public_url)} controls preload="metadata" aria-label="Xem trước video"/>}</section>}
      {entity==="consultants"&&<section className="admin-form-section"><h2>Thông tin liên hệ</h2><div className="admin-form-grid"><label>Điện thoại<input type="tel" value={String(contact.phone??"")} onChange={e=>setContact({...contact,phone:e.target.value})}/></label><label>Email<input type="email" value={String(contact.email_contact??"")} onChange={e=>setContact({...contact,email_contact:e.target.value})}/></label></div></section>}
      {entity==="bookings"&&<section className="admin-form-section"><label htmlFor="reason">Lý do cập nhật lịch hẹn{draft.status!==record?.status&&<span className="admin-required"> *</span>}</label><textarea id="reason" value={reason} required={draft.status!==record?.status} onChange={e=>setReason(e.target.value)} rows={3} maxLength={2000}/></section>}
      {record&&<details className="admin-system" open={readonly}><summary>{readonly?"Toàn bộ thông tin":"Thông tin hệ thống & trường chỉ đọc"}</summary><dl>{config.fields.filter(f=>f.readonly).map(f=><div key={f.name}><dt>{label(f.name)}</dt><dd>{formatted(record[f.name],f.name)}</dd></div>)}</dl></details>}
      {entity==="users"&&record&&isSuperAdmin&&(
        <section className="admin-form-section" style={{marginTop:"20px",paddingTop:"20px",borderTop:"1px solid var(--admin-border,#e5e7eb)"}}>
          <h2>Phân quyền quản trị hệ thống</h2>
          <p>Chỉ Super Admin mới có quyền gán hoặc thu hồi vai trò quản trị cho tài khoản này.</p>
          {roleError&&<p role="alert" className="admin-error">{roleError}</p>}
          {roleSuccess&&<p role="status" className="admin-success">{roleSuccess}</p>}
          <div style={{display:"flex",flexDirection:"column",gap:"10px",margin:"14px 0"}}>
            <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}}>
              <input
                type="checkbox"
                checked={userRoles.includes("admin")}
                onChange={e=>{
                  if(e.target.checked)setUserRoles([...userRoles,"admin"]);
                  else setUserRoles(userRoles.filter(r=>r!=="admin"));
                }}
                disabled={roleBusy}
              />
              <span><strong>Super Admin (admin)</strong>: Toàn quyền quản trị, xóa dữ liệu và phân quyền.</span>
            </label>
            <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer"}}>
              <input
                type="checkbox"
                checked={userRoles.includes("moderator")}
                onChange={e=>{
                  if(e.target.checked)setUserRoles([...userRoles,"moderator"]);
                  else setUserRoles(userRoles.filter(r=>r!=="moderator"));
                }}
                disabled={roleBusy}
              />
              <span><strong>Kiểm duyệt viên (moderator)</strong>: Kiểm duyệt nội dung, video, pháp lý (không có quyền xóa).</span>
            </label>
          </div>
          <button
            type="button"
            className="admin-button small"
            onClick={()=>void handleSaveRoles()}
            disabled={roleBusy}
          >
            {roleBusy?"Đang lưu…":"Lưu phân quyền"}
          </button>
        </section>
      )}
      {entity==="bookings"&&record&&<section className="admin-form-section"><h2>Lịch sử & tiền cọc</h2><div className="admin-history">{((record.history as Row[])??[]).map(h=><p key={String(h.id)}><strong>{formatted(h.to_status)}</strong> · {formatted(h.occurred_at,"occurred_at")}<br/>{String(h.public_note??h.internal_note??"")}</p>)}</div>{((record.payments as Row[])??[]).map(p=><p key={String(p.id)}>Thanh toán: {formatted(p.status)} · {formatted(p.mode)} · {formatted(p.amount_vnd,"price")}</p>)}</section>}
      {error&&<p role="alert" className="admin-error">{error}</p>}
      {!readonly&&<div className="admin-form-actions"><Link href={`/admin/${entity}`} className="admin-button secondary">Quay lại danh sách</Link><button className="admin-button" disabled={busy||uploads>0}>{uploads>0?"Đang tải tệp…":busy?"Đang lưu…":"Lưu hồ sơ"}</button></div>}
    </form>
  </>;
}
