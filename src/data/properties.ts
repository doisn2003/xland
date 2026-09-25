// The order is a product requirement, shared by discovery and related listings.
export const propertyCategories = ["Đô thị", "Vùng ven đô thị", "Ocean Park", "Vùng quê"] as const;
export type PropertyCategory = typeof propertyCategories[number];

export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: "Hà Nội" | "Hưng Yên" | "Khánh Hòa" | "Đồng bằng Bắc Bộ";
  category: PropertyCategory;
  kind: "Đất nền" | "Nhà phố" | "Biệt thự";
  setting: "Ven sông" | "Nhà vườn" | "Đồng quê" | "Phố xanh" | "Khu dân cư" | "Gần công viên";
  price: number;
  area: number;
  frontage: number;
  road: number;
  landUse: string;
  updatedAt: string;
  status: "available" | "paused";
  description: string;
  images: { src: string; alt: string; caption: string }[];
  advisor: { name: string; initials: string; role: string };
  nft?: { supply: number; price: number };
};

const camRanh = { src: "/images/cam-ranh.webp", alt: "Cảnh quan đồng ruộng, dòng sông và khu dân cư tại Cam Ranh", caption: "Bối cảnh khu vực Cam Ranh · Ảnh Hữu Thịnh 79" };
const camLam = { src: "/images/cam-lam.webp", alt: "Đồng lúa và dòng sông tại Cam Lâm nhìn từ trên cao", caption: "Bối cảnh khu vực Cam Lâm · Ảnh Hữu Thịnh 79" };

// Fictional listing data; photographs illustrate regional context, not sale boundaries.
const propertyFixtures: Property[] = [
  {
    id: "XL-001", slug: "mien-xanh-ven-song", name: "Miền xanh ven sông",
    location: "Cam Lâm · Khánh Hòa", region: "Khánh Hòa", setting: "Ven sông",
    category: "Vùng quê", kind: "Đất nền",
    price: 2800000000, area: 1250, frontage: 25, road: 6, status: "available",
    landUse: "Đất trồng cây lâu năm", updatedAt: "25/09/2026",
    description: "Một khoảng xanh bên dòng nước, mở ra nhịp sống gần thiên nhiên. Diện tích 1.250 m², mặt tiền 25 m và đường tiếp cận 6 m tạo nên một không gian rộng mở để tìm hiểu những dự định dài lâu tại Cam Lâm.",
    images: [camLam, camRanh], advisor: { name: "Nguyễn Minh Anh", initials: "MA", role: "Chuyên viên khu vực Khánh Hòa" },
    nft: { supply: 1000, price: 2800000 },
  },
  {
    id: "XL-002", slug: "vuon-nang-cam-ranh", name: "Vườn nắng Cam Ranh",
    location: "Cam Ranh · Khánh Hòa", region: "Khánh Hòa", setting: "Nhà vườn",
    category: "Vùng quê", kind: "Đất nền",
    price: 4200000000, area: 1800, frontage: 30, road: 5, status: "available",
    landUse: "Đất trồng cây lâu năm", updatedAt: "25/09/2026",
    description: "Nắng sớm, những khu vườn và cảnh quan rộng mở của Cam Ranh. Không gian 1.800 m² dành cho người yêu sự yên tĩnh, muốn tìm về nhịp sống xanh và kết nối với thiên nhiên.",
    images: [camRanh, camLam], advisor: { name: "Trần Hoàng Nam", initials: "HN", role: "Chuyên viên trải nghiệm nhà vườn" },
  },
  {
    id: "XL-003", slug: "khoang-xanh-dong-que", name: "Khoảng xanh đồng quê",
    location: "Đồng bằng Bắc Bộ", region: "Đồng bằng Bắc Bộ", setting: "Đồng quê",
    category: "Vùng quê", kind: "Đất nền",
    price: 1900000000, area: 950, frontage: 20, road: 4, status: "paused",
    landUse: "Đất nông nghiệp", updatedAt: "25/09/2026",
    description: "Những ô ruộng đan xen dòng nước và nếp sống làng quê tạo nên một góc nhìn khác về không gian xanh. Một miền đất bình yên, gắn với cảnh quan đồng bằng và những giá trị mộc mạc của cuộc sống nông thôn.",
    images: [{ src: "/images/dong-bang.webp", alt: "Cánh đồng và sông ở vùng nông thôn Việt Nam nhìn từ trên cao", caption: "Cảnh quan đồng quê Việt Nam · Ảnh HONG SON" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-004", slug: "goc-pho-long-bien", name: "Góc phố Long Biên",
    location: "Long Biên · Hà Nội", region: "Hà Nội", category: "Đô thị", kind: "Đất nền", setting: "Phố xanh",
    price: 12800000000, area: 100, frontage: 5, road: 12, status: "available",
    landUse: "Đất ở đô thị", updatedAt: "25/09/2026",
    description: "Lô góc 100 m² trong không gian phố xanh Long Biên, mặt tiền 5 m và đường tiếp cận 12 m. Nhịp sống đô thị hiện hữu, những hàng cây và dãy nhà thấp tầng tạo nên một nơi chốn gần gũi cho kế hoạch an cư lâu dài.",
    images: [{ src: "/images/long-bien.webp", alt: "Lô góc giữa dãy nhà phố và hàng cây xanh", caption: "Không gian phố xanh · Long Biên" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-005", slug: "hien-xanh-dong-anh", name: "Hiên xanh Đông Anh",
    location: "Đông Anh · Hà Nội", region: "Hà Nội", category: "Vùng ven đô thị", kind: "Đất nền", setting: "Khu dân cư",
    price: 3600000000, area: 120, frontage: 6, road: 7, status: "available",
    landUse: "Đất ở", updatedAt: "25/09/2026",
    description: "Khoảng đất 120 m² giữa khu dân cư thấp tầng phía Bắc Hà Nội. Mặt tiền 6 m, đường tiếp cận 7 m và những khoảng xanh đan xen mang đến cảm giác thoáng đãng, cân bằng giữa sự yên tĩnh và nhịp sống ven đô.",
    images: [{ src: "/images/dong-anh.webp", alt: "Khoảng đất xanh bên đường và khu nhà thấp tầng ven đô", caption: "Nhịp sống ven đô · Đông Anh" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-006", slug: "vuon-nho-gia-lam", name: "Vườn nhỏ Gia Lâm",
    location: "Gia Lâm · Hà Nội", region: "Hà Nội", category: "Vùng ven đô thị", kind: "Đất nền", setting: "Nhà vườn",
    price: 5400000000, area: 180, frontage: 9, road: 6, status: "available",
    landUse: "Đất ở", updatedAt: "25/09/2026",
    description: "Một khoảng xanh 180 m² ở Gia Lâm, nơi những con đường nhỏ nối qua khu vườn và nếp nhà quen thuộc. Mặt tiền 9 m mở ra không gian rộng rãi cho người yêu cuộc sống gần thiên nhiên ở phía Đông Hà Nội.",
    images: [{ src: "/images/gia-lam.webp", alt: "Khu đất có cây vườn giữa nếp nhà thấp tầng và đường nhỏ", caption: "Khoảng xanh phía Đông · Gia Lâm" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-007", slug: "loi-nang-hoai-duc", name: "Lối nắng Hoài Đức",
    location: "Hoài Đức · Hà Nội", region: "Hà Nội", category: "Vùng ven đô thị", kind: "Đất nền", setting: "Khu dân cư",
    price: 4650000000, area: 150, frontage: 7.5, road: 8, status: "available",
    landUse: "Đất ở", updatedAt: "25/09/2026",
    description: "Không gian 150 m² trong khu dân cư phía Tây Hà Nội, có mặt tiền 7,5 m và đường tiếp cận 8 m. Dãy nhà thấp tầng, đường thoáng và vỉa hè xanh tạo nên bối cảnh an cư gọn gàng, nhiều ánh sáng.",
    images: [{ src: "/images/hoai-duc.webp", alt: "Khu đất bên đường rộng và những ngôi nhà thấp tầng phía Tây", caption: "Nắng trên phố mới · Hoài Đức" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-008", slug: "mien-vuon-thanh-tri", name: "Miền vườn Thanh Trì",
    location: "Thanh Trì · Hà Nội", region: "Hà Nội", category: "Vùng ven đô thị", kind: "Đất nền", setting: "Nhà vườn",
    price: 6200000000, area: 200, frontage: 10, road: 6, status: "available",
    landUse: "Đất ở", updatedAt: "25/09/2026",
    description: "Khoảng đất 200 m² giữa không gian vườn và khu dân cư Thanh Trì. Mặt tiền 10 m dành nhiều khoảng mở, phù hợp với người muốn tìm hiểu một chốn ở yên tĩnh ở phía Nam Hà Nội.",
    images: [{ src: "/images/thanh-tri.webp", alt: "Khu đất rộng cạnh vườn cây và lối đi trong khu dân cư", caption: "Một nhịp sống xanh · Thanh Trì" }],
    advisor: { name: "Lê Thanh Hà", initials: "TH", role: "Chuyên viên khu vực miền Bắc" },
  },
  {
    id: "XL-009", slug: "nha-pho-ocean-park-2", name: "Nhà phố Ocean Park 2",
    location: "Ocean Park 2 · Hưng Yên", region: "Hưng Yên", category: "Ocean Park", kind: "Nhà phố", setting: "Phố xanh",
    price: 8900000000, area: 90, frontage: 5, road: 13, status: "available",
    landUse: "Đất ở đô thị", updatedAt: "25/09/2026",
    description: "Nhà phố trên diện tích đất 90 m², mặt tiền 5 m, nằm trong không gian sống Ocean Park 2 tại Hưng Yên. Kiến trúc sáng màu, ban công và hàng cây dọc phố mang đến một nhịp sống đô thị gần gũi, thuận tiện cho sinh hoạt gia đình.",
    images: [{ src: "/images/ocean-park-2.webp", alt: "Dãy nhà phố sáng màu với ban công và hàng cây ven đường", caption: "Nhịp sống nhà phố · Ocean Park 2" }],
    advisor: { name: "Phạm Ngọc Lan", initials: "NL", role: "Chuyên viên khu vực Hưng Yên" },
  },
  {
    id: "XL-010", slug: "biet-thu-ocean-park-3", name: "Biệt thự Ocean Park 3",
    location: "Ocean Park 3 · Hưng Yên", region: "Hưng Yên", category: "Ocean Park", kind: "Biệt thự", setting: "Gần công viên",
    price: 15600000000, area: 180, frontage: 10, road: 13, status: "available",
    landUse: "Đất ở đô thị", updatedAt: "25/09/2026",
    description: "Biệt thự với diện tích đất 180 m² và mặt tiền 10 m trong không gian Ocean Park 3 tại Hưng Yên. Khoảng sân xanh, hiên nhà và tầm nhìn mở về khu dạo bộ tạo nên sự riêng tư cùng cảm giác thư thái mỗi ngày.",
    images: [{ src: "/images/ocean-park-3.webp", alt: "Biệt thự sáng màu với sân vườn và lối dạo xanh phía trước", caption: "Không gian vườn và phố · Ocean Park 3" }],
    advisor: { name: "Phạm Ngọc Lan", initials: "NL", role: "Chuyên viên khu vực Hưng Yên" },
  },
];

export const properties = [...propertyFixtures].sort((a, b) =>
  propertyCategories.indexOf(a.category) - propertyCategories.indexOf(b.category),
);
export const propertyRegions = [...new Set(properties.map(property => property.region))];
export const propertySettings = [...new Set(properties.map(property => property.setting))];
export const featuredSupportProperties = properties.filter((property, index, items) =>
  items.findIndex(item => item.advisor.name === property.advisor.name) === index,
).slice(0, 3);

export type Filters = { region: string; price: string; setting: string; category?: PropertyCategory | "" };
export const emptyFilters: Filters = { region: "", price: "", setting: "", category: "" };

export function filterProperties(filters: Filters) {
  return properties.filter((property) =>
    (!filters.category || property.category === filters.category) &&
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
