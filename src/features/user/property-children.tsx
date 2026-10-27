"use client";
import {useState} from "react";
import {usePage, ErrorNotice, Loading} from "./client";
import {PropertyCard} from "./ui";

export function PropertyChildren({propertyId}: {propertyId:string}) {
  const [cursors,setCursors] = useState<(string|null)[]>([null]);
  const [index,setIndex] = useState(0);
  const cursor = cursors[index];
  const {data,error,mutate} = usePage(`/properties/${propertyId}/children?limit=4${cursor?'&cursor='+encodeURIComponent(cursor):''}`,"Property");
  return <section className="user-panel user-subplots" aria-labelledby="child-plots-title">
    <p className="eyebrow">CÙNG MỘT HỒ SƠ</p>
    <h2 id="child-plots-title">Các lô đất con{data?.meta.total!=null?` (${data.meta.total})`:''}</h2>
    <p>Khám phá giá, diện tích và hồ sơ riêng của từng lô.</p>
    {error ? <ErrorNotice error={error} retry={()=>void mutate()}/> : !data ? <Loading/> : <>
      {!data.data.length ? <p>Chưa có lô con được công bố.</p> : <div className="user-child-grid">{data.data.map(property=><PropertyCard key={property.id} property={property}/>)}</div>}
      {(index>0||data.meta.hasMore) && <nav className="user-child-pagination" aria-label="Trang lô đất con">
        <button className="button secondary small" disabled={index===0} onClick={()=>setIndex(index-1)}>Trang trước</button>
        <span aria-live="polite">Trang {index+1}</span>
        <button className="button secondary small" disabled={!data.meta.hasMore} onClick={()=>{setCursors([...cursors.slice(0,index+1),data.meta.nextCursor]);setIndex(index+1);}}>Trang sau</button>
      </nav>}
    </>}
  </section>;
}
