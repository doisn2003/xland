import { PropertyExplorer } from "@/components/property-explorer";
import { parseCatalogQuery } from "@/features/properties/query";

export const metadata = { title: "Khám phá lô đất | Xland" };

export default async function CatalogPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseCatalogQuery(await searchParams);
  return <main id="main" className="catalog-page">
    <header className="container journey-heading"><p className="eyebrow">MỘT NƠI CHỐN, MỘT KHỞI ĐẦU</p><h1>Khám phá lô đất</h1><p>Tìm theo khu vực, ngân sách và không gian bạn yêu thích.</p></header>
    <PropertyExplorer initialQuery={query} catalog />
  </main>;
}
