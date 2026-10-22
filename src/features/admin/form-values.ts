import type {Field,Row} from "./api";
import {label} from "./labels";

export function initial(fields:Field[],data:Row={}):Row{
  return Object.fromEntries(fields.map(f=>{
    let value=data[f.name]??f.defaultValue;
    if(value==null)value=f.type==="boolean"?false:"";
    if(f.name==="is_illustrative"&&data[f.name]===undefined)value=false;
    if(["numeric","bigint"].includes(f.type)&&value!=="")value=String(value);
    if(f.type==="timestamp with time zone"&&value)value=new Date(Date.parse(String(value))+7*3600000).toISOString().slice(0,23);
    if(f.type==="date"&&value)value=String(value).slice(0,10);
    if(f.type==="jsonb")value=JSON.stringify(value||[],null,2);
    return [f.name,value];
  }));
}

export function serialize(fields:Field[],draft:Row,original?:Row):Row{
  const before=original?initial(fields,original):undefined;
  // Do not write an untouched timestamp back. PostgreSQL may hold precision
  // beyond the browser's milliseconds, and an unrelated edit must preserve it.
  return Object.fromEntries(fields.filter(f=>!f.readonly&&!(original&&f.type==="timestamp with time zone"&&before?.[f.name]===draft[f.name])).map(f=>{
    let value=draft[f.name];
    if(value===""||value===undefined)value=null;
    if(f.type==="timestamp with time zone"&&value){
      if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(String(value)))throw new Error(`${label(f.name)}: Ngày giờ chưa hợp lệ`);
      value=new Date(String(value)+"+07:00").toISOString();
    }
    if(f.type==="jsonb"){try{value=JSON.parse(String(value??"[]"));}catch{throw new Error(`${label(f.name)}: JSON chưa hợp lệ`);}}
    return [f.name,value];
  }));
}
