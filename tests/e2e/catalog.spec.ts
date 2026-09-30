import { expect, test } from "@playwright/test";

const newListings = [
  ["goc-pho-long-bien", "Góc phố Long Biên", "12,8 tỷ ₫", "100 m²"],
  ["hien-xanh-dong-anh", "Hiên xanh Đông Anh", "3,6 tỷ ₫", "120 m²"],
  ["vuon-nho-gia-lam", "Vườn nhỏ Gia Lâm", "5,4 tỷ ₫", "180 m²"],
  ["loi-nang-hoai-duc", "Lối nắng Hoài Đức", "4,65 tỷ ₫", "150 m²"],
  ["mien-vuon-thanh-tri", "Miền vườn Thanh Trì", "6,2 tỷ ₫", "200 m²"],
  ["nha-pho-ocean-park-2", "Nhà phố Ocean Park 2", "8,9 tỷ ₫", "90 m²"],
  ["biet-thu-ocean-park-3", "Biệt thự Ocean Park 3", "15,6 tỷ ₫", "180 m²"],
] as const;

test("catalog follows category priority and segment filters combine with search", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".property-card h3")).toHaveText([
    ...newListings.map(item => item[1]), "Miền xanh ven sông", "Vườn nắng Cam Ranh", "Khoảng xanh đồng quê",
  ]);
  const categories = page.getByRole("group", { name: "Nhóm bất động sản" });
  await categories.getByRole("button", { name: "Vùng ven đô thị 4", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".property-card")).toHaveCount(4);
  await page.getByLabel("KHÔNG GIAN", { exact: true }).selectOption("Nhà vườn");
  await page.getByRole("button", { name: "Tìm lô đất", exact: true }).click();
  await expect(page.locator(".property-card h3")).toHaveText(["Vườn nhỏ Gia Lâm", "Miền vườn Thanh Trì"]);
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await categories.getByRole("button", { name: "Ocean Park 2", exact: true }).click();
  await expect(page.locator(".property-card h3")).toHaveText(["Nhà phố Ocean Park 2", "Biệt thự Ocean Park 3"]);
  await expect(categories.getByRole("button", { name: "Ocean Park 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("KHU VỰC", { exact: true }).selectOption("Hà Nội");
  await page.getByRole("button", { name: "Tìm lô đất", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Chưa có lô đất phù hợp" })).toBeVisible();
  await page.getByRole("button", { name: "Xem tất cả lô đất" }).click();
  await expect(page.locator(".property-card")).toHaveCount(10);
  await expect(categories.getByRole("button", { name: "Tất cả 10", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("all seven new listings have usable detail pages and images", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const [slug, name, price, area] of newListings) {
    const response = await page.goto(`/lo-dat/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByLabel("Tóm tắt lô đất")).toContainText(price);
    await expect(page.getByLabel("Tóm tắt lô đất")).toContainText(area);
    await expect(page.locator(".gallery-main img")).toBeVisible();
    await expect.poll(() => page.locator(".gallery-main img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.locator(".related-section .property-card")).toHaveCount(3);
    const layout = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, width: document.documentElement.clientWidth }));
    expect(layout.content).toBeLessThanOrEqual(layout.width);
  }
  expect(errors).toEqual([]);
});
