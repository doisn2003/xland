import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Avatar } from "@/components/avatar";
import { PropertyImage } from "@/components/property-image";
import { advisorList } from "@/data/advisors";

export const metadata: Metadata = {
  title: "Bảng kiểm định Media & Chân dung người đồng hành (P02 Contact Sheet) | Xland",
  robots: { index: false, follow: false },
};

const assetSlots = [
  {
    slot: "hero",
    title: "Hero Trang chủ",
    file: "/images/hero.webp",
    aspect: "Responsive / Đa tỷ lệ",
    dimensions: "1376 × 768",
    size: "212.2 KB",
    type: "Ảnh chụp thật (Chủ dự án cung cấp)",
    source: "Tài nguyên ban đầu do chủ dự án cung cấp; crop responsive kèm overlay tối bảo đảm tương phản chữ.",
  },
  {
    slot: "xland-story",
    title: "Về Xland (Story)",
    file: "/images/xland-story.webp",
    aspect: "3:4 (Dọc có chiều sâu)",
    dimensions: "1080 × 1440",
    size: "211.8 KB",
    type: "Phối cảnh cảnh quan tự nhiên Việt Nam (P02)",
    source: "Tạo riêng bằng image_gen; cảnh quan sông núi đồng bằng Việt Nam có tiền/trung/hậu cảnh sâu.",
  },
  {
    slot: "nft-story",
    title: "Bất động sản NFT (Story)",
    file: "/images/garden-retreat.webp",
    aspect: "3:2 (Ngang kiến trúc)",
    dimensions: "1536 × 1024",
    size: "458.9 KB",
    type: "Phối cảnh nhà vườn sinh thái (Nội bộ)",
    source: "Phối cảnh gắn với phương án XL-001; phân loại rõ ràng trong ASSETS, không dùng stock giả xác minh.",
  },
];

export default function QaMediaProofPage() {
  return (
    <main id="main" className="container" style={{ paddingBlock: "48px 96px" }}>
      <p className="eyebrow">XLAND QA · GIAI ĐOẠN P02</p>
      <h1>Bảng kiểm định Media & Chân dung người đồng hành</h1>
      <p style={{ maxWidth: 760, marginBlock: "16px 36px", color: "var(--color-muted)", fontSize: "16px", lineHeight: "1.7" }}>
        Trang nghiệm thu kỹ thuật và thị giác cho P02: 4 chân dung persona hư cấu đồng bộ phong cách, bảng asset-slot (Hero, Xland Story, NFT Story), cùng cơ chế fallback khi ảnh lỗi của Avatar và PropertyImage.
      </p>

      {/* 1. CONTACT SHEET 4 PERSONA ADVISORS */}
      <section style={{ marginBottom: "64px" }}>
        <h2>1. Chân dung 4 Persona Người đồng hành (Contact Sheet)</h2>
        <p style={{ color: "var(--color-muted)", marginBlock: "8px 24px", fontSize: "14px" }}>
          Đồng bộ: Ánh sáng ban ngày tự nhiên, nền kiến trúc làm mờ sâu (bokeh), trang phục lịch thiệp, nụ cười chuyên nghiệp gần gũi, không logo/chữ lạ.
        </p>

        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {advisorList.map((adv) => (
            <div
              key={adv.id}
              style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span className="status-badge inline" style={{ fontSize: "11px", marginBottom: "6px" }}>{adv.id}</span>
                  <h3 style={{ fontSize: "18px", margin: "4px 0" }}>{adv.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--color-muted)", margin: 0 }}>{adv.role}</p>
                </div>
              </div>

              {/* Các kích thước avatar của persona */}
              <div style={{ background: "var(--color-surface)", padding: "16px", borderRadius: "var(--radius-control)" }}>
                <span className="small-label" style={{ marginBottom: "12px" }}>CÁC KÍCH THƯỚC HIỂN THỊ</span>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  {/* Portrait */}
                  <div style={{ textAlign: "center" }}>
                    <Avatar advisor={adv} size="portrait" />
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", display: "block", marginTop: "4px" }}>140×175</span>
                  </div>
                  {/* MD */}
                  <div style={{ textAlign: "center" }}>
                    <Avatar advisor={adv} size="md" />
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", display: "block", marginTop: "4px" }}>64×64</span>
                  </div>
                  {/* SM Thumb */}
                  <div style={{ textAlign: "center" }}>
                    <Avatar advisor={adv} size="sm" />
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", display: "block", marginTop: "4px" }}>44×44</span>
                  </div>
                  {/* Fallback Initials */}
                  <div style={{ textAlign: "center", borderLeft: "1px solid var(--color-border)", paddingLeft: "16px" }}>
                    <Avatar name={adv.name} initials={adv.initials} size="md" src="/images/broken-link.webp" />
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", display: "block", marginTop: "4px" }}>Fallback</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div style={{ fontSize: "12px", color: "var(--color-muted)", lineHeight: "1.6" }}>
                <div><strong>File WebP:</strong> <code>{adv.avatar}</code></div>
                <div><strong>Thumbnail:</strong> <code>{adv.avatarThumb}</code></div>
                <div><strong>Initials:</strong> <code>{adv.initials}</code> · <strong>Theme:</strong> <code>{adv.themeClass}</code></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. BẢNG ASSET SLOTS CHỦ LỰC */}
      <section style={{ marginBottom: "64px" }}>
        <h2>2. Bảng Asset-Slot Chủ Lực (Hero · Xland Story · NFT Story)</h2>
        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", marginTop: "24px" }}>
          {assetSlots.map((item) => (
            <div
              key={item.slot}
              style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "240px", background: "var(--color-surface)" }}>
                <Image src={item.file} alt={item.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <span className="small-label">{item.slot.toUpperCase()} SLOT</span>
                <h3 style={{ fontSize: "17px", margin: 0 }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--color-muted)", margin: 0 }}>{item.source}</p>
                <hr style={{ border: 0, borderTop: "1px solid var(--color-border)", marginBlock: "8px" }} />
                <div style={{ fontSize: "12px", color: "var(--color-muted)", display: "grid", gap: "4px" }}>
                  <div><strong>Định dạng / Cỡ:</strong> {item.dimensions} ({item.size})</div>
                  <div><strong>Tỷ lệ:</strong> {item.aspect}</div>
                  <div><strong>Phân loại:</strong> {item.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. KIỂM THỬ KHẢ NĂNG HỒI PHỤC VÀ FALLBACK KHI ẢNH LỖI */}
      <section style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", padding: "28px" }}>
        <h2>3. Kiểm định Fallback & Hồi phục khi thay đổi Source ảnh</h2>
        <p style={{ color: "var(--color-muted)", marginBlock: "8px 20px", fontSize: "14px" }}>
          Đảm bảo component PropertyImage và Avatar không sập layout khi đường dẫn bị lỗi, và tự động hồi phục khi nhận source mới.
        </p>
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ padding: "16px", background: "var(--color-surface)", borderRadius: "var(--radius-control)" }}>
            <span className="small-label" style={{ marginBottom: "8px" }}>PROPERTY IMAGE (ẢNH HỎNG)</span>
            <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "8px", overflow: "hidden" }}>
              <PropertyImage src="/images/non-existent-plot.webp" alt="Thử nghiệm ảnh không tồn tại" sizes="300px" />
            </div>
            <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "8px", margin: 0 }}>
              Hiển thị fallback &quot;Ảnh đang cập nhật&quot; thanh lịch, không sập khung hình.
            </p>
          </div>
          <div style={{ padding: "16px", background: "var(--color-surface)", borderRadius: "var(--radius-control)" }}>
            <span className="small-label" style={{ marginBottom: "8px" }}>AVATAR INITIALS THEMES (4 PERSONAS)</span>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", height: "140px" }}>
              <div className="avatar avatar-md avatar-theme-teal">MA</div>
              <div className="avatar avatar-md avatar-theme-sage">HN</div>
              <div className="avatar avatar-md avatar-theme-navy">TH</div>
              <div className="avatar avatar-md avatar-theme-sand">NL</div>
            </div>
            <p style={{ fontSize: "12px", color: "var(--color-muted)", margin: 0 }}>
              4 theme màu tương phản cao gắn với từng persona, độc lập với index mảng.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
