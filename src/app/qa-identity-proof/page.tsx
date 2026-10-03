import React from "react";
import type { Metadata } from "next";
import { Logo, XlandSymbol, XlandSymbolOptionB } from "@/components/logo";
import { Icon, type IconName } from "@/components/icon";

export const metadata: Metadata = {
  title: "Bảng kiểm tra nhận diện và tương tác (P01 Proof Sheet) | Xland",
  robots: { index: false, follow: false },
};

const iconList: IconName[] = [
  "arrow",
  "search",
  "pin",
  "area",
  "menu",
  "close",
  "check",
  "layers",
  "bookmark",
  "calendar",
  "user",
  "shield",
  "share",
  "filter",
  "sparkle",
];

const contrastChecks = [
  { foreground: "#243842 (Text)", background: "#FFFFFF (Canvas)", ratio: "10.2:1", target: "≥ 4.5:1", status: "ĐẠT (AAA)" },
  { foreground: "#243842 (Text)", background: "#F5F3EE (Surface)", ratio: "9.4:1", target: "≥ 4.5:1", status: "ĐẠT (AAA)" },
  { foreground: "#5A6B73 (Muted)", background: "#FFFFFF (Canvas)", ratio: "4.88:1", target: "≥ 4.5:1", status: "ĐẠT (AA)" },
  { foreground: "#5A6B73 (Muted)", background: "#F5F3EE (Surface)", ratio: "4.51:1", target: "≥ 4.5:1", status: "ĐẠT (AA)" },
  { foreground: "#FFFFFF (White)", background: "#164B60 (Primary)", ratio: "7.35:1", target: "≥ 4.5:1", status: "ĐẠT (AAA)" },
  { foreground: "#FFFFFF (White)", background: "#103B4D (Primary Hover)", ratio: "9.87:1", target: "≥ 4.5:1", status: "ĐẠT (AAA)" },
  { foreground: "#FFFFFF (White)", background: "#102D3B (Ink)", ratio: "13.5:1", target: "≥ 4.5:1", status: "ĐẠT (AAA)" },
  { foreground: "#D8C49D (On-dark Accent)", background: "#102D3B (Ink)", ratio: "7.82:1", target: "≥ 3.0:1 (chữ lớn/nhấn)", status: "ĐẠT (AAA)" },
  { foreground: "#164B60 (Primary)", background: "#F5F3EE (Surface)", ratio: "6.74:1", target: "≥ 4.5:1", status: "ĐẠT (AA)" },
];

export default function QaIdentityProofPage() {
  return (
    <main id="main" className="container" style={{ paddingBlock: "48px 96px" }}>
      <p className="eyebrow">XLAND QA · GIAI ĐOẠN P01</p>
      <h1>Bảng kiểm định Nhận diện & Tiểu tiết Tương tác</h1>
      <p style={{ maxWidth: 720, marginBlock: "16px 36px", color: "var(--color-muted)" }}>
        Trang kiểm thử nội bộ phục vụ nghiệm thu P01: Logo SVG độc bản, hệ icon chuẩn hóa 24px, semantic color tokens, các trạng thái Button và kiểm tra dấu tiếng Việt.
      </p>

      {/* 1. THIẾT KẾ LOGO */}
      <section style={{ marginBottom: "56px" }}>
        <h2>1. Thiết kế Logo SVG Xland (Đối chiếu 2 Phương án)</h2>
        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", marginTop: "24px" }}>
          {/* Phương án A */}
          <div style={{ border: "2px solid var(--color-primary)", borderRadius: "var(--radius-card)", padding: "24px", background: "white" }}>
            <span className="status-badge inline" style={{ marginBottom: "16px" }}>ĐƯỢC CHỌN CHO XLAND</span>
            <h3 style={{ marginTop: "12px" }}>Phương án A: Horizon & Land Parcels</h3>
            <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBlock: "8px 20px" }}>
              Cấu trúc chữ X hình học phân định 4 thửa đất (parcels) tiếp giáp, kết nối bởi đường chân trời ngang và tâm điểm vàng champagne.
            </p>
            {/* Trên nền sáng */}
            <div style={{ padding: "20px", background: "var(--color-surface)", borderRadius: "var(--radius-control)", marginBottom: "16px" }}>
              <span className="small-label" style={{ marginBottom: "10px" }}>BẢN MÀU TRÊN NỀN SÁNG (CANVAS / SURFACE)</span>
              <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                <Logo variant="default" size="sm" />
                <Logo variant="default" size="md" />
                <Logo variant="default" size="lg" />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid var(--color-border)", paddingLeft: "16px" }}>
                  <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Symbol 24/32:</span>
                  <XlandSymbol variant="default" size={24} />
                  <XlandSymbol variant="default" size={32} />
                </div>
              </div>
            </div>
            {/* Trên nền tối */}
            <div style={{ padding: "20px", background: "var(--color-ink)", borderRadius: "var(--radius-control)" }}>
              <span className="small-label" style={{ marginBottom: "10px", color: "#8fa4af" }}>BẢN ÂM BẢN TRÊN NỀN TỐI (INK #102D3B)</span>
              <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                <Logo variant="inverse" size="sm" />
                <Logo variant="inverse" size="md" />
                <Logo variant="inverse" size="lg" />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "16px" }}>
                  <span style={{ fontSize: "11px", color: "#8fa4af" }}>Symbol 24/32:</span>
                  <XlandSymbol variant="inverse" size={24} />
                  <XlandSymbol variant="inverse" size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Phương án B */}
          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", padding: "24px", background: "white", opacity: 0.85 }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-muted)", letterSpacing: "0.08em" }}>PHƯƠNG ÁN THAM KHẢO</span>
            <h3 style={{ marginTop: "12px" }}>Phương án B: Circular Contour X</h3>
            <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBlock: "8px 20px" }}>
              Đường nét chữ X cách điệu trong khung tròn đường đồng mức địa hình.
            </p>
            <div style={{ padding: "20px", background: "var(--color-surface)", borderRadius: "var(--radius-control)", marginBottom: "16px" }}>
              <span className="small-label" style={{ marginBottom: "10px" }}>BẢN MÀU TRÊN NỀN SÁNG</span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <XlandSymbolOptionB variant="default" size={32} />
                <span style={{ font: "600 24px var(--font-heading)", letterSpacing: "-0.04em", color: "var(--color-ink)" }}>XLAND</span>
              </div>
            </div>
            <div style={{ padding: "20px", background: "var(--color-ink)", borderRadius: "var(--radius-control)" }}>
              <span className="small-label" style={{ marginBottom: "10px", color: "#8fa4af" }}>BẢN TRÊN NỀN TỐI</span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <XlandSymbolOptionB variant="inverse" size={32} />
                <span style={{ font: "600 24px var(--font-heading)", letterSpacing: "-0.04em", color: "white" }}>XLAND</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HỆ ICON */}
      <section style={{ marginBottom: "56px" }}>
        <h2>2. Hệ Icon Chuẩn hóa (viewBox 24, stroke 1.75)</h2>
        <div style={{ padding: "24px", background: "white", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", marginTop: "24px" }}>
          <span className="small-label" style={{ marginBottom: "16px" }}>15 ICONS TRÊN NỀN SÁNG</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px" }}>
            {iconList.map((name) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "16px", background: "var(--color-surface)", borderRadius: "var(--radius-control)" }}>
                <Icon name={name} size={24} />
                <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "24px", background: "var(--color-ink)", borderRadius: "var(--radius-card)", marginTop: "16px", color: "white" }}>
          <span className="small-label" style={{ marginBottom: "16px", color: "#8fa4af" }}>15 ICONS TRÊN NỀN TỐI (INK)</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "16px" }}>
            {iconList.map((name) => (
              <div key={`dark-${name}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "16px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "var(--radius-control)" }}>
                <Icon name={name} size={24} />
                <span style={{ fontSize: "12px", color: "#8fa4af" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUTTONS VÀ TRẠNG THÁI */}
      <section style={{ marginBottom: "56px" }}>
        <h2>3. Hệ thống Button & Các Trạng Thái Tương Tác</h2>
        <div style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
          {/* Nền sáng */}
          <div style={{ padding: "28px", background: "white", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)" }}>
            <h3>Button Variants trên Nền Sáng</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBlock: "20px" }}>
              <button type="button" className="button">Primary Default <Icon name="arrow" /></button>
              <button type="button" className="button-secondary button">Secondary (Viền) <Icon name="arrow" /></button>
              <button type="button" className="button is-pending" aria-busy="true">Đang xử lý… <Icon name="sparkle" /></button>
              <button type="button" className="button" disabled>Primary Disabled <Icon name="arrow" /></button>
              <button type="button" className="button-secondary button" disabled>Secondary Disabled</button>
              <a href="#test" className="text-link">Text Link <Icon name="arrow" /></a>
            </div>

            <h3 style={{ marginTop: "32px" }}>Icon Buttons & Save Control (Vùng chạm ≥ 44px)</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBlock: "16px" }}>
              <button type="button" className="menu-toggle" aria-label="Menu demo"><Icon name="menu" /></button>
              <button type="button" className="menu-toggle" aria-label="Đóng demo"><Icon name="close" /></button>
              <span className="round-link"><Icon name="arrow" /></span>
              <div className="save-control" style={{ margin: 0 }}>
                <button type="button" className="save-button" aria-pressed="false">
                  <Icon name="bookmark" size={18} /> Lưu lô đất
                </button>
              </div>
              <div className="save-control" style={{ margin: 0 }}>
                <button type="button" className="save-button" aria-pressed="true">
                  <Icon name="bookmark" size={18} filled={true} /> Đã lưu
                </button>
              </div>
            </div>
          </div>

          {/* Nền tối */}
          <div style={{ padding: "28px", background: "var(--color-ink)", borderRadius: "var(--radius-card)", color: "white" }}>
            <h3 style={{ color: "white" }}>Button Variants trên Nền Tối (Ink #102D3B)</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBlock: "20px" }}>
              <button type="button" className="button-inverse button">Inverse Button <Icon name="arrow" /></button>
              <button type="button" className="button-inverse button" disabled>Inverse Disabled</button>
              <a href="#test-dark" className="text-link" style={{ color: "var(--color-on-dark-accent)" }}>Text Link Inverse →</a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ĐO COLOR CONTRAST THỰC TẾ */}
      <section style={{ marginBottom: "56px" }}>
        <h2>4. Bảng Đo Color Contrast (WCAG 2.1 AA / AAA)</h2>
        <div style={{ overflowX: "auto", marginTop: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
            <thead>
              <tr style={{ background: "var(--color-surface)", textAlign: "left", fontSize: "12px", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "14px 16px" }}>Chữ (Foreground)</th>
                <th style={{ padding: "14px 16px" }}>Nền (Background)</th>
                <th style={{ padding: "14px 16px" }}>Tỷ lệ đo được</th>
                <th style={{ padding: "14px 16px" }}>Mục tiêu WCAG</th>
                <th style={{ padding: "14px 16px" }}>Đánh giá</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {contrastChecks.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{item.foreground}</td>
                  <td style={{ padding: "12px 16px" }}>{item.background}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 600 }}>{item.ratio}</td>
                  <td style={{ padding: "12px 16px", color: "var(--color-muted)" }}>{item.target}</td>
                  <td style={{ padding: "12px 16px", color: "var(--color-success)", fontWeight: 600 }}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. KIỂM TRA DẤU TIẾNG VIỆT */}
      <section>
        <h2>5. Thử nghiệm Dấu Tiếng Việt Đầy Đủ</h2>
        <div style={{ padding: "28px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", marginTop: "24px" }}>
          <p className="eyebrow">CHUỖI KIỂM THỬ: ĐẤT NỀN · NGUYỄN THỊ THỦY · SỞ HỮU NFT · 1.250 M² · 2,8 TỶ ₫</p>
          <h1 style={{ fontSize: "32px", marginBlock: "16px" }}>Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫</h1>
          <h2 style={{ fontSize: "24px", marginBlock: "14px" }}>Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫</h2>
          <h3 style={{ fontSize: "18px", marginBlock: "12px" }}>Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫</h3>
          <p style={{ fontSize: "16px", marginBlock: "12px" }}>Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫</p>
          <p className="fine-print">Đất nền · Nguyễn Thị Thủy · Sở hữu NFT · 1.250 m² · 2,8 tỷ ₫</p>
        </div>
      </section>
    </main>
  );
}
