import {api,type Catalog,type Row} from "./api";

interface ListData {items:Row[];total:number;page:number;limit:number}
export interface Loaded {catalog:Catalog;locations:Row[];list?:ListData;record?:Row|null;overview?:{counts:Record<string,number>;recent:Row[]}}

export async function loadWorkspace(segments:string[],query:string,signal:AbortSignal):Promise<Loaded>{
  if(segments.length>2)throw new Error("Đường dẫn không tồn tại");
  const entity=segments[0]??"overview",id=segments[1];
  const search=new URLSearchParams(query);search.delete("saved");
  const isRecord=!!id,isOverview=entity==="overview";
  // These reads are independent; forms must not wait for each network trip in turn.
  // Keep records uncached so a completed save/revocation is visible immediately.
  const [catalog,payload,locations]=await Promise.all([
    api<Catalog>("schema","GET",undefined,signal),
    isOverview?api<NonNullable<Loaded["overview"]>>("overview","GET",undefined,signal)
      :isRecord?(id==="new"?Promise.resolve(null):api<Row>(`${entity}/${id}`,"GET",undefined,signal))
      :api<ListData>(`${entity}?${search}`,"GET",undefined,signal),
    entity==="properties"&&isRecord?api<Row[]>("locations","GET",undefined,signal):Promise.resolve([]),
  ]);
  if(!isOverview&&!catalog[entity])throw new Error("Module không tồn tại");
  if(id==="new"&&!catalog[entity]!.create)throw new Error("Module không hỗ trợ tạo mới");
  if(isOverview)return {catalog,locations,overview:payload as NonNullable<Loaded["overview"]>};
  if(isRecord)return {catalog,locations,record:payload as Row|null};
  return {catalog,locations,list:payload as ListData};
}
