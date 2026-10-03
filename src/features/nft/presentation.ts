import { properties, type Property } from "../../data/properties";
import { money, offerings, percent, type Offering } from "./model";

export type NftStoryPresentation = {
  offering: Offering;
  property: Property;
  formattedPrice: string;
  supplyFormatted: string;
  sampleShare1: string;
  sampleShare10: string;
};

/**
 * Format tỷ lệ sở hữu theo số lượng NFT và tổng cung của phương án.
 * Đảm bảo xử lý an toàn cho các trường hợp biên.
 */
export function formatNftShare(quantity: number, supply: number): string {
  if (!Number.isFinite(quantity) || !Number.isFinite(supply) || supply <= 0 || quantity <= 0) {
    return "0%";
  }
  return percent(quantity, supply);
}

/**
 * Lấy phương án NFT đang mở bán đại diện cho chương marketing trên trang chủ.
 * Trả về thông tin trình bày đồng nhất từ nguồn dữ liệu thật, không hardcode.
 */
export function getFeaturedOfferingPresentation(): NftStoryPresentation | null {
  const openOffering = offerings.find(item => item.status === "open") ?? offerings[0];
  if (!openOffering) return null;

  const property = properties.find(item => item.id === openOffering.propertyId);
  if (!property) return null;

  return {
    offering: openOffering,
    property,
    formattedPrice: money(openOffering.price),
    supplyFormatted: openOffering.supply.toLocaleString("vi-VN"),
    sampleShare1: formatNftShare(1, openOffering.supply),
    sampleShare10: formatNftShare(10, openOffering.supply),
  };
}
