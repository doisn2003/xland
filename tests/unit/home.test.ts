import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../../src/components/site-footer";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { emptyFilters, filterProperties, formatArea, formatPrice, properties, featuredSupportProperties } from "../../src/data/properties";

describe("property discovery", () => {
  it("combines region, price and setting", () => {
    expect(filterProperties({ region: "Khánh Hòa", price: "under3", setting: "Ven sông" }).map(p => p.id)).toEqual(["XL-001"]);
  });
  it("returns no matches for incompatible filters", () => {
    expect(filterProperties({ region: "Đồng bằng Bắc Bộ", price: "from3", setting: "" })).toEqual([]);
  });
  it("reset includes paused listings so their status is discoverable", () => {
    expect(filterProperties(emptyFilters)).toHaveLength(10);
    expect(filterProperties(emptyFilters).some(p => p.status === "paused")).toBe(true);
  });
  it("keeps the requested catalog order, including after filtering", () => {
    expect(properties.map(property => property.id)).toEqual([
      "XL-004", "XL-005", "XL-006", "XL-007", "XL-008", "XL-009", "XL-010", "XL-001", "XL-002", "XL-003",
    ]);
    expect(filterProperties({ ...emptyFilters, price: "from3" }).map(property => property.id)).toEqual([
      "XL-004", "XL-005", "XL-006", "XL-007", "XL-008", "XL-009", "XL-010", "XL-002",
    ]);
  });
  it("combines segment, location, price and setting", () => {
    expect(filterProperties({ region: "Hà Nội", price: "from3", setting: "Nhà vườn", category: "Vùng ven đô thị" }).map(property => property.id)).toEqual(["XL-006", "XL-008"]);
    expect(filterProperties({ ...emptyFilters, category: "Ocean Park", region: "Hưng Yên" }).map(property => property.id)).toEqual(["XL-009", "XL-010"]);
    expect(filterProperties({ ...emptyFilters, category: "Ocean Park", region: "Hà Nội" })).toEqual([]);
  });
  it("has unique routes and existing media for every property", () => {
    expect(new Set(properties.map(property => property.id)).size).toBe(10);
    expect(new Set(properties.map(property => property.slug)).size).toBe(10);
    for (const property of properties) {
      expect(property.images.length).toBeGreaterThan(0);
      for (const image of property.images) {
        expect(existsSync(resolve("public", image.src.slice(1))), image.src).toBe(true);
      }
    }
    expect(new Set(featuredSupportProperties.map(property => property.advisor.name)).size).toBe(featuredSupportProperties.length);
  });
  it("formats Vietnamese prices and areas without losing units", () => {
    expect(formatPrice(2800000000)).toBe("2,8 tỷ ₫");
    expect(formatArea(1250)).toBe("1.250 m²");
  });
  it("provides working discovery links in server HTML", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter));
    expect(html).toContain('href="/#kham-pha"');
    expect(html).toContain('href="/#nft"');
  });
});
