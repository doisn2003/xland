"use client";
import Link from "next/link";
export default function AdminError({reset}:{reset:()=>void}){return <main id="main" className="admin-login"><div className="admin-panel"><h1>Chưa kết nối được máy chủ</h1><p>Kiểm tra dịch vụ backend và cấu hình XLAND_ADMIN_API_URL rồi thử lại.</p><button className="admin-button" onClick={reset}>Thử lại</button><Link href="/admin/login">Về đăng nhập</Link></div></main>;}
