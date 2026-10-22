import {redirect} from "next/navigation";
import {adminSession} from "@/features/admin/server";
import {AdminWorkspace} from "@/features/admin/workspace";
export default async function AdminPage({params}:{params:Promise<{segments?:string[]}>}){
  const session=await adminSession();if(!session)redirect("/admin/login");
  const {segments=[]}=await params;
  return <AdminWorkspace key={segments.join("/")} segments={segments} displayName={session.profile.displayName}/>;
}
