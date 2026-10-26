import {cookies} from "next/headers";
import {NextResponse,type NextRequest} from "next/server";
import {adminBase,adminCookie} from "@/features/admin/server";

export const dynamic="force-dynamic";
async function proxy(request:NextRequest,context:{params:Promise<{path:string[]}>}){
  const {path}=await context.params;
  if(!path.length||path.length>3||path.some(p=>! /^[a-z0-9-]+$/.test(p)))return NextResponse.json({error:{message:"Đường dẫn không hợp lệ"}},{status:400});
  const mutation=request.method!=="GET";
  const origin=request.headers.get("origin");
  // Next can normalize 127.0.0.1 to localhost internally. Compare the browser origin
  // with the actual Host header, or a pinned public origin behind a reverse proxy.
  let sameOrigin=false;
  try{const incoming=new URL(origin??"");sameOrigin=process.env.XLAND_ADMIN_WEB_ORIGIN?incoming.origin===process.env.XLAND_ADMIN_WEB_ORIGIN:incoming.host===request.headers.get("host")&&["https:","http:"].includes(incoming.protocol);}catch{/* Missing or malformed Origin is rejected. */}
  if(mutation&&(!sameOrigin||request.headers.get("sec-fetch-site")==="cross-site"))return NextResponse.json({error:{message:"Yêu cầu không cùng nguồn"}},{status:403});
  const jar=await cookies(),token=jar.get(adminCookie)?.value;
  const login=path.join("/")==="session"&&request.method==="POST";
  if(!token&&!login)return NextResponse.json({error:{message:"Vui lòng đăng nhập"}},{status:401});
  try{
    let body:string|undefined;
    if(["POST","PATCH"].includes(request.method)){
      if(!request.headers.get("content-type")?.startsWith("application/json"))return NextResponse.json({error:{message:"Chỉ nhận JSON"}},{status:415});
      body=await request.text();if(Buffer.byteLength(body)>65536)return NextResponse.json({error:{message:"Nội dung quá lớn"}},{status:413});
    }
    const response=await fetch(adminBase()+"/"+path.join("/")+request.nextUrl.search,{
      method:request.method,headers:{"Content-Type":"application/json",...(!login&&token?{Authorization:`Bearer ${token}`}:{})},body,cache:"no-store",redirect:"error",signal:AbortSignal.timeout(45000),
    });
    const contentType=response.headers.get("content-type")??"";
    if(contentType.includes("text/csv")){
      const csvText=await response.text();
      const headers=new Headers({
        "Content-Type":contentType,
        "Cache-Control":"no-store",
      });
      const disposition=response.headers.get("content-disposition");
      if(disposition)headers.set("Content-Disposition",disposition);
      return new NextResponse(csvText,{status:response.status,headers});
    }
    const data=await response.json();
    const secure=request.nextUrl.protocol==="https:";
    if(login&&response.ok){
      jar.set(adminCookie,data.data.accessToken,{httpOnly:true,secure,sameSite:"strict",path:"/admin",expires:new Date(data.data.session.expiresAt)});
      delete data.data.accessToken;
    }
    if(response.status===401||(path.join("/")==="session"&&request.method==="DELETE"&&response.ok))jar.set(adminCookie,"",{httpOnly:true,secure,sameSite:"strict",path:"/admin",maxAge:0});
    const result=NextResponse.json(data,{status:response.status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
    if(response.headers.has("retry-after"))result.headers.set("Retry-After",response.headers.get("retry-after")!);
    return result;
  }catch{return NextResponse.json({error:{message:"Không thể kết nối máy chủ quản trị. Kiểm tra cấu hình hoặc thử lại."}},{status:502});}
}
export {proxy as GET,proxy as POST,proxy as PATCH,proxy as DELETE};
