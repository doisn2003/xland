"use client";
import {useEffect,useState} from "react";
import {api,errorText,type Field,type Row} from "./api";
import {hints,label,values} from "./labels";

export function ReferenceInput({field,value,onChange}:{field:Field;value:string;onChange:(v:string)=>void}){
  const [query,setQuery]=useState(""),[items,setItems]=useState<{id:string;label:string}[]>([]),[error,setError]=useState("");
  useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>{api<{id:string;label:string}[]>(`lookups/${field.reference}?q=${encodeURIComponent(query)}${value?`&id=${value}`:""}`,"GET",undefined,controller.signal).then(data=>{setItems(data);setError("");}).catch(e=>{if(!controller.signal.aborted)setError(errorText(e));});},200);return ()=>{clearTimeout(timer);controller.abort();};},[field.reference,query,value]);
  return <div className="admin-reference"><input aria-label={`Tìm ${label(field.name).toLowerCase()}`} placeholder="Tìm theo tên hoặc ID…" value={query} onChange={e=>setQuery(e.target.value)}/><select id={field.name} value={value} required={field.required} onChange={e=>onChange(e.target.value)}><option value="">Chọn {label(field.name).toLowerCase()}</option>{value&&!items.some(i=>i.id===value)&&<option value={value}>{value}</option>}{items.map(i=><option key={i.id} value={i.id}>{i.label} · {i.id.slice(0,8)}</option>)}</select>{error&&<small role="alert">{error}</small>}<small>Tối đa 50 kết quả; nhập tên để tìm thêm.</small></div>;
}
interface UploadResult {storageKey:string;publicUrl:string|null}
export function Uploader({privateDocument=false,onUploaded,accept="image/jpeg,image/png,image/webp,video/mp4,video/webm",onBusy}:{privateDocument?:boolean;onUploaded:(data:UploadResult,file:File)=>void;accept?:string;onBusy?:(busy:boolean)=>void}){
  const [progress,setProgress]=useState<number|null>(null),[error,setError]=useState(""),[working,setWorking]=useState(false);
  async function upload(file:File){setProgress(0);setError("");setWorking(true);onBusy?.(true);
    try{
      const result=await api<{signedUrl:string;uploadId:string}>("uploads","POST",{mimeType:file.type,size:file.size,privateDocument});
      await new Promise<void>((resolve,reject)=>{
        const xhr=new XMLHttpRequest();xhr.open("PUT",result.signedUrl);xhr.timeout=300000;
        xhr.setRequestHeader("Content-Type",file.type);xhr.setRequestHeader("x-upsert","false");
        xhr.upload.onprogress=e=>{if(e.lengthComputable)setProgress(Math.round(e.loaded/e.total*100));};
        xhr.onload=()=>xhr.status>=200&&xhr.status<300?resolve():reject(new Error("Supabase từ chối tệp. Kiểm tra loại và dung lượng rồi thử lại."));
        xhr.onerror=()=>reject(new Error("Mất kết nối khi tải tệp. Vui lòng thử lại."));xhr.ontimeout=()=>reject(new Error("Hết thời gian tải tệp."));xhr.send(file);
      });
      const verified=await api<UploadResult>("uploads/finalize","POST",{uploadId:result.uploadId});
      onUploaded(verified,file);setProgress(100);
    }catch(e){setError(errorText(e));setProgress(null);}finally{setWorking(false);onBusy?.(false);}
  }
  return <div className="admin-upload"><input type="file" aria-label="Tải tệp lên Supabase" accept={accept} disabled={working} onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file);e.target.value="";}}/>{progress!==null&&<small role="status">{progress===100?(working?"Đang xác minh nội dung tệp":"Đã tải lên Supabase và xác minh"):"Đang tải lên"} · {progress}%</small>}{error&&<small className="admin-error" role="alert">{error}</small>}</div>;
}
export function FormField({field,draft,setDraft,locations=[],uploadBusy}:{field:Field;draft:Row;setDraft:(fn:(v:Row)=>Row)=>void;locations?:Row[];uploadBusy?:(b:boolean)=>void}){
  const value=draft[field.name];const change=(v:unknown)=>setDraft(prev=>({...prev,[field.name]:v}));
  const text=typeof value==="object"&&value!==null?JSON.stringify(value):String(value??"");const f=field;
  const locationField=f.name==="province_code"||f.name==="district_code";
  const upload=f.name.endsWith("_url")||(f.name==="storage_key"&&"access_level" in draft);
  return <div className={`admin-field ${f.type==="jsonb"||["caption","message","description","note","highlights"].includes(f.name)?"wide":""}`}><label htmlFor={f.name}>{label(f.name)}{f.required&&f.type!=="boolean"&&<span className="admin-required"> *</span>}</label>
    {f.type==="boolean"?<label className="admin-checkbox"><input id={f.name} type="checkbox" checked={value===true} onChange={e=>change(e.target.checked)}/>{value?"Có":"Không"}</label>:
    f.reference?<ReferenceInput field={f} value={text} onChange={change}/>:
    locationField?<select id={f.name} value={text} required={f.required} onChange={e=>{const selected=locations.find(l=>l.code===e.target.value&&(f.name==="province_code"?l.kind==="province":l.kind==="district"&&l.catalog_version===draft.catalog_version));setDraft(prev=>f.name==="province_code"?{...prev,province_code:e.target.value,province:selected?.name??"",catalog_version:selected?.catalog_version??"",district_code:"",district:""}:{...prev,district_code:e.target.value,district:selected?.name??""});}}><option value="">Chọn {label(f.name).toLowerCase()}</option>{locations.filter(l=>f.name==="province_code"?l.kind==="province":l.kind==="district"&&l.parent_code===draft.province_code&&l.catalog_version===draft.catalog_version).map(l=><option key={String(l.code)+String(l.catalog_version)} value={String(l.code)}>{String(l.name)} · {String(l.code)}</option>)}</select>:
    f.options?<select id={f.name} value={text} required={f.required} onChange={e=>change(e.target.value)}><option value="">Chọn {label(f.name).toLowerCase()}</option>{f.options.map(o=><option key={o} value={o}>{values[o]??o}</option>)}</select>:
    ["highlights","benefits","agenda","speakers","media","tags","activities"].includes(f.name)?<StructuredList name={f.name} value={value} onChange={change} onBusy={uploadBusy}/>:
    f.type==="jsonb"||["caption","message","description","note","summary"].includes(f.name)?<textarea id={f.name} value={text} rows={f.type==="jsonb"?5:3} required={f.required} onChange={e=>change(e.target.value)} maxLength={20000}/>:
    <input id={f.name} value={text} type={f.type==="timestamp with time zone"?"datetime-local":f.type==="date"?"date":f.name.endsWith("_url")?"url":"text"} step={f.type==="timestamp with time zone"?"0.001":undefined} inputMode={["numeric","bigint","integer"].includes(f.type)?"decimal":undefined} required={f.required} readOnly={["province","district","catalog_version"].includes(f.name)} onChange={e=>change(e.target.value)} maxLength={10000}/>}
    {hints[f.name]&&<small>{hints[f.name]}</small>}{f.type==="timestamp with time zone"&&<small>Giờ Việt Nam (UTC+7).</small>}
    {upload&&<Uploader privateDocument={f.name==="storage_key"&&"access_level" in draft} accept={f.name==="storage_key"&&"access_level" in draft?"application/pdf,image/jpeg,image/png":f.name.includes("thumbnail")||f.name.includes("avatar")||f.name.includes("cover")||f.name.includes("preview")?"image/jpeg,image/png,image/webp":draft.kind==="video"?"video/mp4,video/webm":undefined} onBusy={uploadBusy} onUploaded={(data,file)=>setDraft(prev=>{
      const next={...prev,[f.name]:f.name==="storage_key"?data.storageKey:data.publicUrl};
      const keys:Record<string,string>={public_url:"storage_key",thumbnail_url:"thumbnail_key",public_preview_url:"public_preview_key",avatar_url:"avatar_storage_key"};
      const key=keys[f.name];if(key&&key in prev)next[key]=data.storageKey;
      if(f.name==="storage_key"&&"size_bytes" in prev){next.size_bytes=String(file.size);next.mime_type=file.type;next.file_type=file.name.split(".").pop()?.toUpperCase()??"PDF";next.uploaded_date=new Date().toISOString().slice(0,10);}
      return next;
    })}/>}
    {text&&f.name.endsWith("_url")&&/^https:\/\//.test(text)&&<a className="admin-text-link" href={text} target="_blank" rel="noreferrer">Mở tệp đã lưu ↗</a>}
  </div>;
}

function StructuredList({name,value,onChange,onBusy}:{name:string;value:unknown;onChange:(v:string)=>void;onBusy?:((b:boolean)=>void)}){
  let rows: Row[] = [];
  if (Array.isArray(value)) {
    rows = value as Row[];
  } else if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value || "[]");
      if (Array.isArray(parsed)) rows = parsed as Row[];
      else if (parsed && typeof parsed === "object") rows = [parsed as Row];
    } catch {
      rows = [];
    }
  }
  if(["tags","activities"].includes(name)){
    const lines = rows.map(r => typeof r === "string" ? r : (typeof r === "object" && r !== null ? ((r as Row).title ?? (r as Row).name ?? JSON.stringify(r)) : String(r ?? "")));
    return <textarea id={name} value={lines.join("\n")} onChange={e=>onChange(JSON.stringify(e.target.value.split("\n")))} rows={4} placeholder="Mỗi dòng là một mục"/>;
  }
  const defs:Record<string,string[]>={highlights:["title","description"],benefits:["title","description"],agenda:["startsAt","title","description"],speakers:["name","role","description","avatarUrl"],media:["kind","url","thumbnailUrl","durationSeconds","altText","isIllustrative"]};
  const names:Record<string,string>={startsAt:"Thời gian (UTC+7)",avatarUrl:"Ảnh đại diện",url:"Ảnh / video",thumbnailUrl:"Ảnh bìa",durationSeconds:"Thời lượng (giây)",altText:"Mô tả",isIllustrative:"Nội dung minh họa"};
  function update(index:number,key:string,v:unknown){onChange(JSON.stringify(rows.map((r,i)=>i===index?{...r,[key]:v}:r)));}
  function add(){const row:Row={};for(const k of defs[name]??[])row[k]=["avatarUrl","url","thumbnailUrl","durationSeconds"].includes(k)?null:k==="isIllustrative"?false:k==="kind"?"image":k==="startsAt"?new Date().toISOString():"";if(name==="media")row.id=crypto.randomUUID();onChange(JSON.stringify([...rows,row]));}
  return <div id={name} className="admin-highlights">{rows.map((r,i)=><div className="admin-highlight-row" key={i}>
    {(defs[name]??[]).map(k=>{const title=`${names[k]??label(k)} ${name==="highlights"?"điểm nổi bật ":""}${i+1}`,current=r[k];return <div key={k}>
      <label>{title}{k==="description"?<textarea value={String(current??"")} onChange={e=>update(i,k,e.target.value)} rows={2}/>:
        k==="kind"?<select value={String(current)} onChange={e=>update(i,k,e.target.value)}><option value="image">Ảnh</option><option value="video">Video</option></select>:
        k==="isIllustrative"?<input type="checkbox" checked={current===true} onChange={e=>update(i,k,e.target.checked)}/>:
        <input type={k==="startsAt"?"datetime-local":k==="durationSeconds"?"number":/Url$|^url$/.test(k)?"url":"text"} value={k==="startsAt"&&current?new Date(Date.parse(String(current))+7*3600000).toISOString().slice(0,16):String(current??"")} min={k==="durationSeconds"?0:undefined} required={["title","name","role","altText","startsAt"].includes(k)} onChange={e=>update(i,k,k==="startsAt"?(e.target.value?new Date(e.target.value+":00+07:00").toISOString():null):k==="durationSeconds"?(e.target.value===""?null:Number(e.target.value)):/Url$|^url$/.test(k)?e.target.value||null:e.target.value)}/>}</label>
      {/Url$|^url$/.test(k)&&<Uploader accept={k==="url"&&r.kind==="video"?"video/mp4,video/webm":"image/jpeg,image/png,image/webp"} onBusy={onBusy} onUploaded={data=>update(i,k,data.publicUrl)}/>}</div>;})}
    <button type="button" className="admin-button secondary small" onClick={()=>onChange(JSON.stringify(rows.filter((_,j)=>i!==j)))}>Xóa mục {i+1}</button></div>)}<button type="button" className="admin-button secondary small" onClick={add}>+ Thêm {name==="highlights"?"điểm nổi bật":"mục"}</button></div>;
}
