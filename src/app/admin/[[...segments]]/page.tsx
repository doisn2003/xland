import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {adminCookie} from "@/features/admin/server";
import {AdminWorkspace} from "@/features/admin/workspace";

export default async function AdminPage({params}:{params:Promise<{segments?:string[]}>}){
  const jar=await cookies();
  if(!jar.get(adminCookie)?.value)redirect("/admin/login");
  const {segments=[]}=await params;
  return <AdminWorkspace segments={segments}/>;
}
