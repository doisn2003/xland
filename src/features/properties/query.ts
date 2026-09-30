import { emptyFilters, filterProperties, propertyCategories, propertyRegions, propertySettings, type Filters } from "../../data/properties";

export type Sort = "featured" | "price-asc" | "price-desc" | "area-desc";
export type CatalogQuery = { filters: Filters; sort: Sort };
type Params = Record<string, string | string[] | undefined>;

function allowed(value: Params[string], choices: readonly string[]) {
  return typeof value === "string" && choices.includes(value) ? value : "";
}

export function parseCatalogQuery(params: Params): CatalogQuery {
  return {
    filters: {
      region: allowed(params.region, propertyRegions),
      price: allowed(params.price, ["under3", "from3"]),
      setting: allowed(params.setting, propertySettings),
      category: allowed(params.category, propertyCategories) as Filters["category"],
    },
    sort: (allowed(params.sort, ["price-asc", "price-desc", "area-desc"]) || "featured") as Sort,
  };
}

export function catalogUrl(filters: Filters = emptyFilters, sort: Sort = "featured") {
  const params = new URLSearchParams();
  for (const key of ["region", "price", "setting", "category"] as const) {
    if (filters[key]) params.set(key, filters[key]);
  }
  if (sort !== "featured") params.set("sort", sort);
  return `/lo-dat${params.size ? `?${params}` : ""}`;
}

export function catalogResults({ filters, sort }: CatalogQuery) {
  const results = filterProperties(filters);
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "area-desc") results.sort((a, b) => b.area - a.area);
  return results;
}
