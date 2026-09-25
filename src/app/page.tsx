import Link from "next/link";

export default function Home() {
  return (
    <div className="shell">
      <header><Link className="brand" href="/" aria-label="Xland — Trang chủ">X<span>land</span></Link><span className="badge">Bản trải nghiệm</span></header>
      <main id="main">
        <p className="eyebrow">BẤT ĐỘNG SẢN · NFT</p>
        <h1>Mở lối cho những <em>cơ hội mới.</em></h1>
        <p className="intro">Một không gian khám phá bất động sản, kết nối giá trị và trải nghiệm đầu tư NFT cùng Xland.</p>
        <aside className="notice" aria-label="Trạng thái trải nghiệm">
          <span className="dot" aria-hidden="true" />
          <p>Trải nghiệm đang được xây dựng. Bản demo sẽ sử dụng dữ liệu mẫu và giao dịch mô phỏng.</p>
        </aside>
      </main>
      <footer>Xland · Không gian cho tầm nhìn dài hạn</footer>
    </div>
  );
}
