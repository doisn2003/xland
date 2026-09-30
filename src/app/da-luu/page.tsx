import { SavedProperties } from "@/features/journey/favorites";

export const metadata = { title: "Lô đất đã lưu | Xland" };
export default function SavedPage() {
  return <main id="main" className="container journey-page"><header className="journey-heading"><p className="eyebrow">NHỮNG NƠI BẠN QUAN TÂM</p><h1>Lô đất đã lưu</h1><p>Giữ lại cảm hứng. Tiếp nối hành trình khi bạn sẵn sàng.</p></header><SavedProperties /></main>;
}
