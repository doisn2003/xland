export type Row=Record<string,unknown>;
export interface Field {name:string;type:string;required:boolean;readonly:boolean;defaultValue:unknown;options?:string[];reference?:string;precision:number|null;scale:number|null}
export interface Entity {title:string;columns:string[];fields:Field[];filter?:string[];create?:boolean;edit?:string[]}
export type Catalog=Record<string,Entity>;
export class AdminError extends Error {constructor(message:string,public status:number,public field?:string){super(message);}}
export async function api<T>(path:string,method="GET",body?:unknown,signal?:AbortSignal):Promise<T>{
  const response=await fetch("/admin/api/"+path,{method,headers:{"Content-Type":"application/json"},body:body===undefined?undefined:JSON.stringify(body),cache:"no-store",signal});
  const result=await response.json();
  if(!response.ok)throw new AdminError(result.error?.message??"Không thể thực hiện yêu cầu",response.status,result.error?.details?.[0]?.field);
  return result.data as T;
}
export function errorText(error:unknown){return error instanceof Error?error.message:"Có lỗi xảy ra. Vui lòng thử lại.";}
