import Link from "next/link";

export default function NotFound() {
  return <main className="shell error"><p className="eyebrow">XLAND · 404</p><h1>Không tìm thấy trang.</h1><p>Đường dẫn này không tồn tại.</p><Link href="/">Về trang chủ</Link></main>;
}
