import { describe, expect, it } from "vitest";
import { parseMap } from "../../src/features/user/map-wire";

const base = () => ({
  propertyId: "property",
  availability: "ready",
  provider: "geoapify",
  poiMode: "none",
  notice: "Bản đồ khu vực",
  areaLabel: "Ba Vì, Hà Nội",
  publicArea: {
    id: "ba-vi",
    precision: "administrative_area",
    label: "Ba Vì, Hà Nội",
    centerLatitude: 21.19,
    centerLongitude: 105.43,
    radiusM: 5000,
    initialZoom: 12,
    checkedAt: null,
    sourceUpdatedAt: null,
  },
  attribution: [
    { label: "OpenStreetMap", url: "https://www.openstreetmap.org/copyright" },
    { label: "Geoapify", url: "https://www.geoapify.com/" },
  ],
  embedPageUrl: null,
  tilePathTemplate: "/maps/tiles/{z}/{x}/{y}.png",
  externalAreaMapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Ba Vì, Hà Nội"),
  externalDirectionsUrl: null,
});
describe("mobile area map contract", () => {
  it("accepts named public areas, provider attribution and same-origin tile paths", () => {
    expect(parseMap({ data: base() }, "property").publicArea?.id).toBe("ba-vi");
  });
  it("rejects property mismatch, private precision, wrong link and missing attribution", () => {
    for (const patch of [
      { propertyId: "other" },
      { publicArea: { ...base().publicArea, precision: "exact" } },
      { publicArea: { ...base().publicArea, centerLatitude: NaN } },
      {
        externalDirectionsUrl:
          "https://www.google.com/maps/dir/?api=1&destination=21,105",
      },
      { attribution: [] },
      { embedPageUrl: "https://arbitrary.example/" },
    ]) {
      expect(() =>
        parseMap({ data: { ...base(), ...patch } }, "property"),
      ).toThrow();
    }
  });
  it("fails only the optional planning layer when its metadata is malformed", () => {
    const map = parseMap(
      {
        data: {
          ...base(),
          planning: {
            region: "ha-noi",
            availability: "ready",
            notice: "Quy hoạch",
            source: { tilePathTemplate: "https://arbitrary.example/{z}.png" },
          },
        },
      },
      "property",
    );
    expect(map.availability).toBe("ready");
    expect(map.planning?.availability).toBe("unavailable");
  });
  it("preserves disabled capability without inventing a map or precise coordinates", () => {
    expect(
      parseMap(
        {
          data: {
            ...base(),
            availability: "unconfigured",
            provider: "none",
            publicArea: null,
            areaLabel: null,
            externalAreaMapUrl: null,
            attribution: [],
            tilePathTemplate: null,
          },
        },
        "property",
      ).publicArea,
    ).toBeNull();
  });
});
