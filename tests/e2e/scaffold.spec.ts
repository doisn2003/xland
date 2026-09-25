import { expect, test, type Page } from "@playwright/test";

async function noOverflow(page: Page) {
  // Compare integer CSS layout dimensions; innerWidth rounds differently in Windows WebKit.
  const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(layout.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.width);
  await page.evaluate(() => window.scrollTo(1000, window.scrollY));
  expect(await page.evaluate(() => scrollX)).toBe(0);
}

test("home renders Vietnamese product copy and images without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Một miền đất.Vạn khởi đầu.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("body")).not.toContainText(/bản demo|dữ liệu mẫu|hình ảnh minh họa|nhân vật mẫu/i);
  await expect(page.locator(".property-card")).toHaveCount(10);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator(".hero img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await noOverflow(page);
  expect(errors).toEqual([]);
});

test("filter, empty state and reset work", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("KHU VỰC", { exact: true }).selectOption("Khánh Hòa");
  await page.getByLabel("KHOẢNG GIÁ", { exact: true }).selectOption("under3");
  await page.getByRole("button", { name: "Tìm lô đất", exact: true }).click();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Miền xanh ven sông", exact: true })).toBeVisible();
  await page.getByLabel("KHÔNG GIAN", { exact: true }).selectOption("Đồng quê");
  await page.getByRole("button", { name: "Tìm lô đất", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Chưa có lô đất phù hợp" })).toBeVisible();
  await page.getByRole("button", { name: "Xem tất cả lô đất" }).click();
  await expect(page.locator(".property-card")).toHaveCount(10);
});

test("card opens matching detail, gallery and NFT information", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Miền xanh ven sông", exact: true }).click();
  await expect(page).toHaveURL(/\/lo-dat\/mien-xanh-ven-song$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Miền xanh ven sông");
  await expect(page.getByLabel("Tóm tắt lô đất")).toContainText("2,8 tỷ ₫");
  await expect(page.getByLabel("Tóm tắt lô đất")).toContainText("1.250 m²");
  await page.getByRole("button", { name: "Ảnh tiếp theo" }).click();
  await expect(page.locator(".gallery figcaption")).toContainText("Cam Ranh");
  await page.getByRole("button", { name: "Ảnh trước" }).click();
  await expect(page.locator(".gallery figcaption")).toContainText("Cam Lâm");
  await page.getByRole("link", { name: "Xem thông tin hỗ trợ" }).click();
  await expect(page).toHaveURL(/#ho-tro$/);
  await expect(page.locator("#phuong-an-nft")).toContainText("2.800.000 ₫");
  await expect(page.getByRole("button", { name: "Mua NFT · Chưa mở bán" })).toBeDisabled();
  await expect(page.locator("body")).not.toContainText(/bản demo|dữ liệu mẫu|hình ảnh minh họa|nhân vật mẫu/i);
  await noOverflow(page);
});

test("paused listing cannot accept a viewing request", async ({ page }) => {
  await page.goto("/lo-dat/khoang-xanh-dong-que");
  await expect(page.getByRole("button", { name: "Tạm dừng giới thiệu" })).toBeDisabled();
  await expect(page.getByText("Chưa nhận đề nghị xem thực địa.", { exact: true })).toBeVisible();
});

test("missing route and unknown property return 404", async ({ page }) => {
  for (const path of ["/khong-ton-tai", "/lo-dat/khong-ton-tai"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang." })).toBeVisible();
  }
  await page.getByRole("link", { name: "Về trang chủ", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("responsive layout, mobile menu, keyboard and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await noOverflow(page);
    if (width === 390) {
      await page.getByRole("button", { name: "Mở menu" }).click();
      await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
    }
    await page.goto("/lo-dat/mien-xanh-ven-song");
    await noOverflow(page);
  }
});

test("image errors keep usable fallback and detail navigation", async ({ page }) => {
  await page.route("**/_next/image?**", route => route.abort());
  await page.goto("/");
  await expect(page.locator(".hero .media-fallback")).toBeVisible();
  await page.getByRole("link", { name: "Miền xanh ven sông", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Miền xanh ven sông");
});
