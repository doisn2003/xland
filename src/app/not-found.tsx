import Link from "next/link";
export default function NotFound() {
  return <main id="main" className="container error-page"><p className="eyebrow">XLAND · 404</p><h1>Không tìm thấy trang.</h1><p>Đường dẫn này không tồn tại. Hãy trở về để khám phá những miền đất khác.</p><Link className="button" href="/">Về trang chủ</Link></main>;
}
