"use client";
import {usePathname} from "next/navigation";
import {SiteHeader} from "./site-header";
import {SiteFooter} from "./site-footer";
import {UserProvider} from "@/features/user/client";
export function SiteChrome({children}:{children:React.ReactNode}){
  const admin=usePathname().split("/")[1]==="admin";
  return admin ? children : <UserProvider><SiteHeader/>{children}<SiteFooter/></UserProvider>;
}
