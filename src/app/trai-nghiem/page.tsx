import { ResetExperience } from "@/features/journey/reset";
export const metadata = { title: "Cài đặt trải nghiệm | Xland" };
export default function ExperiencePage() {
  return <main id="main" className="container journey-page"><header className="journey-heading"><p className="eyebrow">KHÔNG GIAN CỦA BẠN</p><h1>Cài đặt trải nghiệm</h1><p>Quản lý hành trình trên trình duyệt hiện tại.</p></header><ResetExperience /></main>;
}
