"use client";
import {usePathname} from "next/navigation";
import {SiteHeader} from "./site-header";
import {SiteFooter} from "./site-footer";
export function SiteChrome({children}:{children:React.ReactNode}){
  const admin=usePathname().split("/")[1]==="admin";
  return <>{!admin&&<SiteHeader/>}{children}{!admin&&<SiteFooter/>}</>;
}
