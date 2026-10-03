import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top"><div><Link href="/" className="brand footer-brand" aria-label="Xland — Trang chủ"><Logo variant="inverse" size="md" /></Link><p>Khám phá miền đất.<br />Kết nối giá trị dài lâu.</p></div><nav aria-label="Điều hướng cuối trang"><Link href="/lo-dat">Khám phá lô đất</Link><Link href="/nft">Bất động sản NFT</Link><Link href="/#cach-hoat-dong">Cách Xland hoạt động</Link><Link href="/da-luu">Lô đất đã lưu</Link><Link href="/lich-hen">Lịch xem thực địa</Link><Link href="/danh-muc-nft">Danh mục NFT</Link><Link href="/trai-nghiem">Cài đặt trải nghiệm</Link></nav><div className="footer-note"><strong>Mỗi lựa chọn bắt đầu từ sự thấu hiểu.</strong><p>Từ không gian sống đến bất động sản NFT, Xland cùng bạn khám phá thông tin và tìm hướng đi phù hợp.</p></div></div>
      <div className="container footer-bottom"><span>© 2026 Xland</span><span>Được xây dựng cho những kết nối bền vững.</span></div>
    </footer>
  );
}
