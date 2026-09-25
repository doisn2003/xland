import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top"><div><Link href="/" className="brand">X<span>LAND</span><i /></Link><p>Khám phá miền đất.<br />Kết nối giá trị dài lâu.</p></div><nav aria-label="Điều hướng cuối trang"><Link href="/#kham-pha">Khám phá lô đất</Link><Link href="/#nft">Bất động sản NFT</Link><Link href="/#cach-hoat-dong">Cách Xland hoạt động</Link></nav><div className="footer-note"><strong>Mỗi lựa chọn bắt đầu từ sự thấu hiểu.</strong><p>Từ không gian sống đến bất động sản NFT, Xland cùng bạn khám phá thông tin và tìm hướng đi phù hợp.</p></div></div>
      <div className="container footer-bottom"><span>© 2026 Xland</span><span>Được xây dựng cho những kết nối bền vững.</span></div>
    </footer>
  );
}
