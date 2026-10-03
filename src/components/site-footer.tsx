import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer" data-site-footer>
      <div className="container footer-top">
        <div className="footer-brand-wrap" data-footer-brand>
          <Link href="/" className="brand footer-brand" aria-label="Xland — Trang chủ">
            <Logo variant="inverse" size="md" />
          </Link>
          <p className="footer-tagline">
            Khám phá miền đất.
            <br />
            Kết nối giá trị dài lâu.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Điều hướng cuối trang" data-footer-nav>
          <div className="footer-nav-col">
            <span className="footer-nav-title">Bất động sản</span>
            <Link href="/lo-dat">Khám phá lô đất</Link>
            <Link href="/nft">Bất động sản NFT</Link>
            <Link href="/#cach-hoat-dong">Cách Xland hoạt động</Link>
          </div>
          <div className="footer-nav-col">
            <span className="footer-nav-title">Tác vụ & Dịch vụ</span>
            <Link href="/da-luu">Lô đất đã lưu</Link>
            <Link href="/lich-hen">Lịch xem thực địa</Link>
            <Link href="/danh-muc-nft">Danh mục NFT</Link>
            <Link href="/trai-nghiem">Cài đặt trải nghiệm</Link>
          </div>
        </nav>

        <div className="footer-note" data-footer-note>
          <strong>Mỗi lựa chọn bắt đầu từ sự thấu hiểu.</strong>
          <p>
            Từ không gian sống đến bất động sản NFT, Xland cùng bạn khám phá thông tin và tìm hướng đi phù hợp.
          </p>
        </div>
      </div>

      <div className="container footer-bottom" data-footer-bottom>
        <span>© 2026 Xland</span>
        <span>Được xây dựng cho những kết nối bền vững.</span>
      </div>
    </footer>
  );
}
