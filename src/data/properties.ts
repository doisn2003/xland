export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: "Khánh Hòa" | "Đồng bằng Bắc Bộ";
  setting: "Ven sông" | "Nhà vườn" | "Đồng quê";
  price: number;
  area: number;
  frontage: number;
  road: number;
  status: "available" | "paused";
  description: string;
  images: { src: string; alt: string; caption: string }[];
  advisor: { name: string; initials: string; role: string };
  nft?: { supply: number; price: number };
};

const camRanh = { src: "/images/cam-ranh.webp", alt: "Cảnh quan đồng ruộng, dòng sông và khu dân cư tại Cam Ranh", caption: "Bối cảnh khu vực Cam Ranh · Ảnh Hữu Thịnh 79" };
const camLam = { src: "/images/cam-lam.webp", alt: "Đồng lúa và dòng sông tại Cam Lâm nhìn từ trên cao", caption: "Bối cảnh khu vực Cam Lâm · Ảnh Hữu Thịnh 79" };

// Fictional listing data; photographs illustrate regional context, not sale boundaries.
export const properties: Property[] = [
  {
    id: "XL-001", slug: "mien-xanh-ven-song", name: "Miền xanh ven sông",
    location: "Cam Lâm · Khánh Hòa", region: "Khánh Hòa", setting: "Ven sông",
    price: 2800000000, area: 1250, frontage: 25, road: 6, status: "available",
    description: "Một khoảng xanh bên dòng nước, mở ra hình dung về nhịp sống gần thiên nhiên. Hồ sơ mẫu được xây dựng để bạn khám phá cách Xland kết nối cảnh quan, thông tin lô đất và người hỗ trợ trong một hành trình.",
    images: [camLam, camRanh], advisor: { name: "Nguyễn Minh Anh", initials: "MA", role: "Chuyên viên khu vực Khánh Hòa" },
    nft: { supply: 1000, price: 2800000 },
  },
  {
    id: "XL-002", slug: "vuon-nang-cam-ranh", name: "Vườn nắng Cam Ranh",
    location: "Cam Ranh · Khánh Hòa", region: "Khánh Hòa", setting: "Nhà vườn",
    price: 4200000000, area: 1800, frontage: 30, road: 5, status: "available",
    description: "Cảm hứng từ những khu vườn và cảnh quan rộng mở của Cam Ranh. Khám phá hồ sơ mẫu với thông tin diện tích, lối tiếp cận và phương án tìm hiểu tài sản trước khi đề nghị một buổi xem thực địa.",
    images: [camRanh, camLam], advisor: { name: "Trần Hoàng Nam", initials: "HN", role: "Chuyên viên trải nghiệm nhà vườn" },
  },
  {
    id: "XL-003", slug: "khoang-xanh-dong-que", name: "Khoảng xanh đồng quê",
    location: "Đồng bằng Bắc Bộ", region: "Đồng bằng Bắc Bộ", setting: "Đồng quê",
    price: 1900000000, area: 950, frontage: 20, road: 4, status: "paused",
    description: "Những ô ruộng đan xen dòng nước và nếp sống làng quê tạo nên một góc nhìn khác về không gian xanh. Hồ sơ mẫu này đang tạm dừng giới thiệu, để minh họa cách Xland cập nhật trạng thái tài sản.",
    images: [{ src: "/images/dong-bang.webp", alt: "Cánh đồng và sông ở vùng nông thôn Việt Nam nhìn từ trên cao", caption: "Cảnh quan đồng quê Việt Nam · Ảnh HONG SON" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
];

export type Filters = { region: string; price: string; setting: string };
export const emptyFilters: Filters = { region: "", price: "", setting: "" };

export function filterProperties(filters: Filters) {
  return properties.filter((property) =>
    (!filters.region || property.region === filters.region) &&
    (!filters.setting || property.setting === filters.setting) &&
    (!filters.price || (filters.price === "under3" ? property.price < 3e9 : property.price >= 3e9)),
  );
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(value / 1e9)} tỷ ₫`;
}

export function formatArea(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} m²`;
}
