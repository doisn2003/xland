export type AdvisorId = "ADV-001" | "ADV-002" | "ADV-003" | "ADV-004";

export interface Advisor {
  id: AdvisorId;
  name: string;
  initials: string;
  role: string;
  avatar: string;
  avatarThumb: string;
  themeClass?: string;
}

export const advisors = {
  "ADV-001": {
    id: "ADV-001",
    name: "Nguyễn Minh Anh",
    initials: "MA",
    role: "Chuyên viên khu vực Khánh Hòa",
    avatar: "/images/advisors/minh-anh.webp",
    avatarThumb: "/images/advisors/minh-anh-thumb.webp",
    themeClass: "avatar-theme-teal",
  },
  "ADV-002": {
    id: "ADV-002",
    name: "Trần Hoàng Nam",
    initials: "HN",
    role: "Chuyên viên trải nghiệm nhà vườn",
    avatar: "/images/advisors/hoang-nam.webp",
    avatarThumb: "/images/advisors/hoang-nam-thumb.webp",
    themeClass: "avatar-theme-sage",
  },
  "ADV-003": {
    id: "ADV-003",
    name: "Lê Thanh Hà",
    initials: "TH",
    role: "Chuyên viên khu vực miền Bắc",
    avatar: "/images/advisors/thanh-ha.webp",
    avatarThumb: "/images/advisors/thanh-ha-thumb.webp",
    themeClass: "avatar-theme-navy",
  },
  "ADV-004": {
    id: "ADV-004",
    name: "Phạm Ngọc Lan",
    initials: "NL",
    role: "Chuyên viên khu vực Hưng Yên",
    avatar: "/images/advisors/ngoc-lan.webp",
    avatarThumb: "/images/advisors/ngoc-lan-thumb.webp",
    themeClass: "avatar-theme-sand",
  },
} as const;

export const advisorList: Advisor[] = Object.values(advisors);

export function getAdvisorById(id: string): Advisor | undefined {
  return advisorList.find((advisor) => advisor.id === id);
}

export function getAdvisorByName(name: string): Advisor | undefined {
  return advisorList.find((advisor) => advisor.name === name);
}
