"use client";

import { useState, type FormEvent } from "react";
import { emptyFilters, filterProperties, properties, propertyCategories, propertyRegions, propertySettings, type Filters, type PropertyCategory } from "@/data/properties";
import { PropertyCard } from "./property-card";
import { Icon } from "./icon";

export function PropertyExplorer() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const results = filterProperties(filters);
  function search(event: FormEvent) {
    event.preventDefault(); setFilters(draft);
    document.getElementById("ket-qua")?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function reset() { setDraft(emptyFilters); setFilters(emptyFilters); }
  function selectCategory(category: PropertyCategory | "") {
    setDraft({ ...draft, category });
    setFilters({ ...filters, category });
  }
  return (
    <section className="explorer container" id="kham-pha" aria-labelledby="explorer-title">
      <form className="search-panel" onSubmit={search} aria-label="Tìm kiếm lô đất">
        <label><span id="filter-region-label">KHU VỰC</span><select aria-labelledby="filter-region-label" value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })}><option value="">Tất cả khu vực</option>{propertyRegions.map(region => <option key={region}>{region}</option>)}</select></label>
        <label><span id="filter-price-label">KHOẢNG GIÁ</span><select aria-labelledby="filter-price-label" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })}><option value="">Tất cả mức giá</option><option value="under3">Dưới 3 tỷ</option><option value="from3">Từ 3 tỷ</option></select></label>
        <label><span id="filter-setting-label">KHÔNG GIAN</span><select aria-labelledby="filter-setting-label" value={draft.setting} onChange={(e) => setDraft({ ...draft, setting: e.target.value })}><option value="">Bạn đang tìm gì?</option>{propertySettings.map(setting => <option key={setting}>{setting}</option>)}</select></label>
        <button className="button" type="submit"><Icon name="search" />Tìm lô đất</button>
      </form>
      <div id="ket-qua" className="section-heading"><div><p className="eyebrow">NHỮNG MIỀN ĐẤT ĐÁNG KHÁM PHÁ</p><h2 id="explorer-title">Tìm một nơi dành cho bạn</h2></div><p>Không gian xanh, góc nhìn mới.<br />Bắt đầu từ những điều bạn tìm kiếm.</p></div>
      <div className="category-filters" role="group" aria-label="Nhóm bất động sản">
        <button type="button" aria-pressed={!filters.category} onClick={() => selectCategory("")}>Tất cả <span>{properties.length}</span></button>
        {propertyCategories.map(category => <button type="button" key={category} aria-pressed={filters.category === category} onClick={() => selectCategory(category)}>{category} <span>{properties.filter(property => property.category === category).length}</span></button>)}
      </div>
      <div className="results-toolbar"><p aria-live="polite">{results.length} bất động sản</p><button className="text-button" onClick={reset}>Xóa bộ lọc <span aria-hidden="true">↻</span></button></div>
      {results.length ? <div className="property-grid">{results.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><h3>Chưa có lô đất phù hợp</h3><p>Thử thay đổi khu vực hoặc mở rộng khoảng giá.</p><button className="button" onClick={reset}>Xem tất cả lô đất</button></div>}
    </section>
  );
}
