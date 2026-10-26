import {cookies} from "next/headers";

export const adminCookie="xland_admin_session";
export function adminBase(){
  const value=process.env.XLAND_ADMIN_API_URL;
  if(!value)throw new Error("Chưa cấu hình XLAND_ADMIN_API_URL");
  const url=new URL(value);
  if(!["https:","http:"].includes(url.protocol))throw new Error("Địa chỉ API không hợp lệ");
  return value.replace(/\/$/,"");
}
export interface AdminSession {
  profile: {displayName: string};
  role: string;
  roles?: string[];
}

export async function adminSession(): Promise<AdminSession | null>{
  const token=(await cookies()).get(adminCookie)?.value;
  if(!token)return null;
  const response=await fetch(adminBase()+"/session",{headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(15000)});
  if([401,403].includes(response.status))return null;
  if(!response.ok)throw new Error("Không thể kết nối máy chủ quản trị");
  return (await response.json()).data as AdminSession;
}
