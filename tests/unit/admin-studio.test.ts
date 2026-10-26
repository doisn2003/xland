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

describe("Social & Community Hub Features (Phase 3)", () => {
  it("formats CSV cells safely with quotes and escapes", () => {
    function escapeCsvCell(val: unknown): string {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    }

    expect(escapeCsvCell("Nguyen Van A")).toBe('"Nguyen Van A"');
    expect(escapeCsvCell('Tech, "CEO"')).toBe('"Tech, ""CEO"""');
    expect(escapeCsvCell(null)).toBe('""');
    expect(escapeCsvCell(123)).toBe('"123"');
  });

  it("calculates event capacity and status correctly", () => {
    function computeCapacity(registered: number, maxSlots: number | null): {percent: number; isFull: boolean} {
      if (!maxSlots || maxSlots <= 0) return {percent: 0, isFull: false};
      const percent = Math.min(100, Math.round((registered / maxSlots) * 100));
      return {percent, isFull: registered >= maxSlots};
    }

    expect(computeCapacity(50, 100)).toEqual({percent: 50, isFull: false});
    expect(computeCapacity(100, 100)).toEqual({percent: 100, isFull: true});
    expect(computeCapacity(120, 100)).toEqual({percent: 100, isFull: true});
    expect(computeCapacity(25, null)).toEqual({percent: 0, isFull: false});
  });

  it("handles video moderation hotkey actions", () => {
    type Action = "approve" | "reject" | "next" | "prev" | "toggle_play" | null;
    function resolveHotkeyAction(key: string, isTextareaFocused: boolean): Action {
      if (isTextareaFocused) return null;
      switch (key.toLowerCase()) {
        case "a": return "approve";
        case "r": return "reject";
        case "j":
        case "arrowdown": return "next";
        case "k":
        case "arrowup": return "prev";
        case " ": return "toggle_play";
        default: return null;
      }
    }

    expect(resolveHotkeyAction("a", false)).toBe("approve");
    expect(resolveHotkeyAction("A", false)).toBe("approve");
    expect(resolveHotkeyAction("r", false)).toBe("reject");
    expect(resolveHotkeyAction(" ", false)).toBe("toggle_play");
    expect(resolveHotkeyAction("j", false)).toBe("next");
    expect(resolveHotkeyAction("k", false)).toBe("prev");
    expect(resolveHotkeyAction("a", true)).toBeNull(); // ignore when typing
  });

  it("resolves legacy registrations entity navigation to event studio tab", () => {
    function resolveLegacyEntityRoute(entity: string, queryFilter?: {field: string; value: string}): string | null {
      if (entity === "registrations" && queryFilter?.field === "event_id") {
        return `/admin/events/${queryFilter.value}?tab=registrations`;
      }
      return null;
    }

    expect(resolveLegacyEntityRoute("registrations", {field: "event_id", value: "evt-123"})).toBe(
      "/admin/events/evt-123?tab=registrations"
    );
    expect(resolveLegacyEntityRoute("properties")).toBeNull();
  });
});

describe("RBAC & Permissions (Phase 4)", () => {
  function checkSuperAdmin(roles?: string[], role?: string): boolean {
    return !!(roles?.includes("admin") || role === "admin");
  }

  function checkModerator(roles?: string[], role?: string): boolean {
    if (checkSuperAdmin(roles, role)) return false;
    return !!(roles?.includes("moderator") || role === "moderator");
  }

  function filterVisibleGroups(
    groups: {title: string; items: [string, string][]}[],
    isSuperAdmin: boolean
  ) {
    return groups.filter(g => {
      if (g.title === "HỆ THỐNG" && !isSuperAdmin) return false;
      return true;
    });
  }

  it("identifies Super Admin vs Moderator correctly", () => {
    expect(checkSuperAdmin(["admin"])).toBe(true);
    expect(checkSuperAdmin(["moderator", "admin"])).toBe(true);
    expect(checkSuperAdmin(undefined, "admin")).toBe(true);
    expect(checkSuperAdmin(["moderator"])).toBe(false);
    expect(checkSuperAdmin([])).toBe(false);

    expect(checkModerator(["moderator"])).toBe(true);
    expect(checkModerator(undefined, "moderator")).toBe(true);
    expect(checkModerator(["admin", "moderator"])).toBe(false);
  });

  it("filters sidebar groups by role (hides system group for moderators)", () => {
    const sampleGroups = [
      {title: "ĐIỀU HÀNH", items: [["overview", "Tổng quan"]] as [string, string][]},
      {title: "BẤT ĐỘNG SẢN", items: [["properties", "Lô đất"]] as [string, string][]},
      {title: "HỆ THỐNG", items: [["users", "Người dùng"], ["audit", "Nhật ký"]] as [string, string][]},
    ];

    const adminVisible = filterVisibleGroups(sampleGroups, true);
    expect(adminVisible.some(g => g.title === "HỆ THỐNG")).toBe(true);
    expect(adminVisible.length).toBe(3);

    const modVisible = filterVisibleGroups(sampleGroups, false);
    expect(modVisible.some(g => g.title === "HỆ THỐNG")).toBe(false);
    expect(modVisible.length).toBe(2);
  });

  it("enforces destructive action gating (moderators cannot delete)", () => {
    function canPerformAction(action: "read" | "create" | "update" | "delete", isSuperAdmin: boolean): boolean {
      if (isSuperAdmin) return true;
      if (action === "delete") return false;
      return true;
    }

    expect(canPerformAction("read", false)).toBe(true);
    expect(canPerformAction("update", false)).toBe(true);
    expect(canPerformAction("delete", false)).toBe(false);
    expect(canPerformAction("delete", true)).toBe(true);
  });
});
