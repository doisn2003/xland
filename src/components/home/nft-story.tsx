import React from "react";
import Link from "next/link";
import { PropertyImage } from "@/components/property-image";
import { Icon } from "@/components/icon";
import { getFeaturedOfferingPresentation } from "@/features/nft/presentation";
import { NftStoryMotion } from "@/components/motion/nft-story-motion";

export function NftStory() {
  const presentation = getFeaturedOfferingPresentation();
  const propertyName = presentation?.property.name ?? "Miền xanh ven sông";
  const propertyLocation = presentation?.property.location ?? "Cam Lâm · Khánh Hòa";
  const offeringSlug = presentation?.offering.slug ?? "mien-xanh-ven-song";
  const formattedPrice = presentation?.formattedPrice ?? "2.800.000 ₫";
  const supplyFormatted = presentation?.supplyFormatted ?? "1.000";
  const sampleShare1 = presentation?.sampleShare1 ?? "0,1%";
  const sampleShare10 = presentation?.sampleShare10 ?? "1%";

  return (
    <section className="nft-story" id="nft" aria-labelledby="nft-heading" data-nft-story>
      <div className="container">
        <NftStoryMotion>
          <div className="nft-story-inner">
          {/* Media: Large Property Visual (Column 1 on Desktop) */}
          <div className="nft-story-media" data-nft-media>
            <div className="nft-media-frame">
              <PropertyImage
                src="/images/garden-retreat.webp"
                alt="Không gian nhà vườn nhiệt đới mở ra đồng xanh và đồi núi sương sớm"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
              />
              <span className="nft-media-caption">Không gian cho những khởi đầu mới</span>
            </div>
          </div>

          {/* Main Content: Header, Workflow and Offering Panel (Column 2 on Desktop) */}
          <div className="nft-story-content" data-nft-content>
            {/* Header & Copy */}
            <div className="nft-story-header" data-nft-header>
              <p className="nft-eyebrow">BẤT ĐỘNG SẢN NFT</p>
              <h2 id="nft-heading" className="nft-title">
                Một tài sản.
                <br />
                <em>Một phương án rõ ràng.</em>
              </h2>
              <p className="nft-lead">
                Khám phá cách phân đoạn bằng NFT, đọc số lượng và tỷ lệ trong phương án trước khi lựa chọn.
              </p>
            </div>
            {/* 3-Step Process Workflow */}
            <div className="nft-flow" role="region" aria-label="Quy trình tìm hiểu phương án NFT" data-nft-flow>
              <div className="nft-flow-step" data-nft-step>
                <div className="nft-step-badge" aria-hidden="true">01</div>
                <div className="nft-step-text">
                  <h3 className="nft-step-title">Hồ sơ tài sản</h3>
                  <p className="nft-step-desc">Khảo sát vị trí, pháp lý và tiềm năng sử dụng của miền đất thực tế.</p>
                </div>
              </div>

              <div className="nft-flow-arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12H19" />
                  <path d="M13 6L19 12L13 18" />
                </svg>
              </div>

              <div className="nft-flow-step" data-nft-step>
                <div className="nft-step-badge" aria-hidden="true">02</div>
                <div className="nft-step-text">
                  <h3 className="nft-step-title">Phương án NFT</h3>
                  <p className="nft-step-desc">Xem tổng cung 1.000 NFT (ERC-1155), đơn giá và tỷ lệ phân đoạn minh bạch.</p>
                </div>
              </div>

              <div className="nft-flow-arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12H19" />
                  <path d="M13 6L19 12L13 18" />
                </svg>
              </div>

              <div className="nft-flow-step" data-nft-step>
                <div className="nft-step-badge" aria-hidden="true">03</div>
                <div className="nft-step-text">
                  <h3 className="nft-step-title">Danh mục của bạn</h3>
                  <p className="nft-step-desc">Theo dõi số lượng NFT đã chọn và quyền lợi đồng hành trong danh mục cá nhân.</p>
                </div>
              </div>
            </div>

            {/* Quantitative Offering Specification Panel */}
            <div className="nft-panel" data-nft-panel>
              <div className="nft-panel-head">
                <div className="nft-panel-badge">Phương án mở bán minh họa</div>
                <h3 className="nft-panel-property">
                  {propertyName}
                  <span className="nft-panel-location"> · {propertyLocation}</span>
                </h3>
              </div>

              <div className="nft-specs-grid">
                <div className="nft-spec-item">
                  <span className="nft-spec-label">Tổng cung phương án</span>
                  <span className="nft-spec-value">{supplyFormatted} NFT</span>
                  <span className="nft-spec-note">Chuẩn hợp đồng ERC-1155</span>
                </div>

                <div className="nft-spec-item">
                  <span className="nft-spec-label">Đơn giá mỗi phần</span>
                  <span className="nft-spec-value">{formattedPrice}</span>
                  <span className="nft-spec-note">Cố định theo phương án</span>
                </div>

                <div className="nft-spec-item">
                  <span className="nft-spec-label">Tỷ lệ tương ứng</span>
                  <span className="nft-spec-value">{sampleShare1} <small>/ 1 NFT</small></span>
                  <span className="nft-spec-note">{sampleShare10} khi nắm giữ 10 NFT</span>
                </div>
              </div>

              {/* Visual Fractional Representation */}
              <div className="nft-visual-matrix" aria-hidden="true">
                <div className="nft-matrix-header">
                  <span>Mô hình phân đoạn trực quan</span>
                  <span>1 ô đại diện 10 NFT (1%)</span>
                </div>
                <div className="nft-matrix-grid">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`nft-matrix-cell ${i === 0 ? "is-sample" : ""}`}
                      title={i === 0 ? "10 NFT tương ứng 1% theo phương án" : undefined}
                    />
                  ))}
                </div>
                <p className="nft-matrix-caption">
                  Biểu diễn trực quan số lượng NFT theo phương án, không phải chia ranh giới vật lý hay m² đất.
                </p>
              </div>

              <p className="nft-disclaimer">
                Tỷ lệ thể hiện số lượng NFT theo phương án phân đoạn, không thay thế giấy chứng nhận quyền sử dụng đất hoặc quyền sở hữu vật lý riêng biệt.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="nft-actions" data-nft-actions>
              <Link className="button nft-cta-primary" href="/nft">
                Tìm hiểu phương án NFT <Icon name="arrow" />
              </Link>
              <Link className="nft-link-sub" href={`/nft/${offeringSlug}`}>
                Xem chi tiết phương án mẫu ({propertyName}) <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </NftStoryMotion>
    </div>
  </section>
  );
}
