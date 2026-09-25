import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../../src/components/site-footer";
import { emptyFilters, filterProperties, formatArea, formatPrice } from "../../src/data/properties";

describe("property discovery", () => {
  it("combines region, price and setting", () => {
    expect(filterProperties({ region: "Khánh Hòa", price: "under3", setting: "Ven sông" }).map(p => p.id)).toEqual(["XL-001"]);
  });
  it("returns no matches for incompatible filters", () => {
    expect(filterProperties({ region: "Đồng bằng Bắc Bộ", price: "from3", setting: "" })).toEqual([]);
  });
  it("reset includes paused listings so their status is discoverable", () => {
    expect(filterProperties(emptyFilters)).toHaveLength(3);
    expect(filterProperties(emptyFilters).some(p => p.status === "paused")).toBe(true);
  });
  it("formats Vietnamese prices and areas without losing units", () => {
    expect(formatPrice(2800000000)).toBe("2,8 tỷ ₫");
    expect(formatArea(1250)).toBe("1.250 m²");
  });
  it("includes demo and photo context in server HTML", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter));
    expect(html).toContain("Bản demo · Dữ liệu mẫu");
    expect(html).toContain("Ảnh chụp minh họa bối cảnh");
  });
});
