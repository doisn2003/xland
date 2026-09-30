import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { Visits } from "@/features/journey/visits";

export const metadata = { title: "Lịch xem thực địa | Xland" };
export default async function VisitsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lo } = await searchParams;
  const property = properties.find(item => item.slug === lo);
  if (lo !== undefined && !property) notFound();
  return <main id="main" className="container journey-page"><header className="journey-heading"><p className="eyebrow">TỪ HỒ SƠ ĐẾN TRẢI NGHIỆM THỰC TẾ</p><h1>Lịch xem thực địa</h1><p>Chọn thời gian. Theo dõi đề nghị. Gặp gỡ một miền đất.</p></header><Visits key={property?.id ?? "list"} property={property} /></main>;
}
