'use client';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <main id="main" className="container user-main"><h1>Không thể tải trang</h1><p>Dịch vụ tạm thời chưa sẵn sàng. Vui lòng thử lại.</p><button className="button" onClick={reset}>Thử lại</button></main>;}
