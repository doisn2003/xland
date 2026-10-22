"use client";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {api,errorText} from "./api";
export function LoginForm(){
  const router=useRouter();
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError("");const data=new FormData(event.currentTarget);
    try{await api("session","POST",{username:data.get("username"),password:data.get("password")});router.replace("/admin");router.refresh();}catch(e){setError(errorText(e));setBusy(false);}}
  return <main id="main" className="admin-login"><div className="admin-login-brand"><span className="admin-wordmark">XLAND<span>ADMIN</span></span><p>Không gian quản trị hệ thống</p></div><form className="admin-panel" onSubmit={submit}><span className="admin-eyebrow">CHÀO MỪNG TRỞ LẠI</span><h1>Đăng nhập quản trị</h1><p>Quản lý nội dung và hoạt động Xland.</p><label>Tên đăng nhập<input name="username" autoComplete="username" required autoFocus maxLength={64}/></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required maxLength={128}/></label>{error&&<p className="admin-error" role="alert">{error}</p>}<button className="admin-button" disabled={busy}>{busy?"Đang đăng nhập…":"Đăng nhập"}</button></form></main>;
}
