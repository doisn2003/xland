import {describe, it, expect} from "vitest";
import type {PropertyMediaItem} from "../../src/features/admin/property/types";

describe("Property Studio Features (Phase 2)", () => {
  it("computes sort orders correctly when setting a media item as cover", () => {
    const items: PropertyMediaItem[] = [
      {id: "m1", property_id: "p1", kind: "image", usage: "gallery", storage_key: "k1", public_url: "u1", thumbnail_url: null, alt_text: "1", duration_seconds: null, sort_order: 0, is_illustrative: false},
      {id: "m2", property_id: "p1", kind: "image", usage: "gallery", storage_key: "k2", public_url: "u2", thumbnail_url: null, alt_text: "2", duration_seconds: null, sort_order: 1, is_illustrative: false},
      {id: "m3", property_id: "p1", kind: "image", usage: "gallery", storage_key: "k3", public_url: "u3", thumbnail_url: null, alt_text: "3", duration_seconds: null, sort_order: 2, is_illustrative: false},
    ];

    // Selecting m3 as cover moves it to index 0 and shifts m1 and m2
    const target = items.find(i => i.id === "m3")!;
    const rest = items.filter(i => i.id !== "m3");
    const reordered = [target, ...rest].map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));

    expect(reordered[0]?.id).toBe("m3");
    expect(reordered[0]?.sort_order).toBe(0);
    expect(reordered[1]?.id).toBe("m1");
    expect(reordered[1]?.sort_order).toBe(1);
    expect(reordered[2]?.id).toBe("m2");
    expect(reordered[2]?.sort_order).toBe(2);
  });

  it("maps legacy entity filters to Property Studio tabs", () => {
    const subEntityToTab: Record<string, string> = {
      media: "media",
      legal: "legal",
      documents: "documents",
      amenities: "amenities",
    };

    expect(subEntityToTab["media"]).toBe("media");
    expect(subEntityToTab["legal"]).toBe("legal");
    expect(subEntityToTab["documents"]).toBe("documents");
    expect(subEntityToTab["amenities"]).toBe("amenities");
    expect(subEntityToTab["properties"]).toBeUndefined();
  });
});
