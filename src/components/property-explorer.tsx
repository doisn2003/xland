"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { emptyFilters, properties, propertyCategories, propertyRegions, propertySettings, type Filters, type PropertyCategory } from "@/data/properties";
import { catalogResults, catalogUrl, type CatalogQuery, type Sort } from "@/features/properties/query";
import { PropertyCard } from "./property-card";
import { Icon } from "./icon";

export function PropertyExplorer({ initialQuery = { filters: emptyFilters, sort: "featured" }, catalog = false }: { initialQuery?: CatalogQuery; catalog?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [homeFilters, setFilters] = useState<Filters>(initialQuery.filters);
  const [draft, setDraft] = useState<Filters>(initialQuery.filters);
  const queryKey = JSON.stringify(initialQuery);
  const [draftSource, setDraftSource] = useState(queryKey);
  // Synchronize back/forward navigation without remounting focused controls.
  if (draftSource !== queryKey) {
    setDraftSource(queryKey);
    setDraft(initialQuery.filters);
  }
  const filters = catalog ? initialQuery.filters : homeFilters;
  const results = catalogResults({ filters, sort: initialQuery.sort });
  function navigate(next: Filters, sort = initialQuery.sort) {
    startTransition(() => router.push(catalogUrl(next, sort), { scroll: !catalog }));
  }
  function search(event: FormEvent) {
    event.preventDefault(); navigate(draft);
  }
  function reset() {
    if (catalog) navigate(emptyFilters, "featured");
    else { setDraft(emptyFilters); setFilters(emptyFilters); }
  }
  function selectCategory(category: PropertyCategory | "") {
    if (catalog) navigate({ ...filters, category });
    else { setDraft({ ...draft, category }); setFilters({ ...filters, category }); }
  }
  return (
    <section className="explorer container" id="kham-pha" aria-labelledby="explorer-title" aria-busy={pending}>
      <form className="search-panel" onSubmit={search} aria-label="Tìm kiếm lô đất">
        <label><span id="filter-region-label">KHU VỰC</span><select disabled={pending} aria-labelledby="filter-region-label" value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })}><option value="">Tất cả khu vực</option>{propertyRegions.map(region => <option key={region}>{region}</option>)}</select></label>
        <label><span id="filter-price-label">KHOẢNG GIÁ</span><select disabled={pending} aria-labelledby="filter-price-label" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })}><option value="">Tất cả mức giá</option><option value="under3">Dưới 3 tỷ</option><option value="from3">Từ 3 tỷ</option></select></label>
        <label><span id="filter-setting-label">KHÔNG GIAN</span><select disabled={pending} aria-labelledby="filter-setting-label" value={draft.setting} onChange={(e) => setDraft({ ...draft, setting: e.target.value })}><option value="">Bạn đang tìm gì?</option>{propertySettings.map(setting => <option key={setting}>{setting}</option>)}</select></label>
        <button className="button" type="submit" disabled={pending}><Icon name="search" />{pending ? "Đang tìm…" : "Tìm lô đất"}</button>
      </form>
      <div id="ket-qua" className="section-heading"><div><p className="eyebrow">NHỮNG MIỀN ĐẤT ĐÁNG KHÁM PHÁ</p><h2 id="explorer-title">Tìm một nơi dành cho bạn</h2></div><p>Không gian xanh, góc nhìn mới.<br />Bắt đầu từ những điều bạn tìm kiếm.</p></div>
      <div className="category-filters" role="group" aria-label="Nhóm bất động sản">
        <button disabled={pending} type="button" aria-pressed={!filters.category} onClick={() => selectCategory("")}>Tất cả <span>{properties.length}</span></button>
        {propertyCategories.map(category => <button disabled={pending} type="button" key={category} aria-pressed={filters.category === category} onClick={() => selectCategory(category)}>{category} <span>{properties.filter(property => property.category === category).length}</span></button>)}
      </div>
      <div className="results-toolbar"><p aria-live="polite">{pending ? "Đang cập nhật kết quả…" : `${results.length} bất động sản`}</p>{catalog && <label className="sort-field">Sắp xếp<select aria-label="Sắp xếp" disabled={pending} value={initialQuery.sort} onChange={event => navigate(filters, event.target.value as Sort)}><option value="featured">Đề xuất</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="area-desc">Diện tích lớn nhất</option></select></label>}<button disabled={pending} className="text-button" onClick={reset}>Xóa bộ lọc <span aria-hidden="true">↻</span></button></div>
      {results.length ? <div className="property-grid">{results.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><h3>Chưa có lô đất phù hợp</h3><p>Thử thay đổi khu vực hoặc mở rộng khoảng giá.</p><button disabled={pending} className="button" onClick={reset}>Xem tất cả lô đất</button></div>}
    </section>
  );
}
