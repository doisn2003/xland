import { expect, test } from "@playwright/test";

test("home renders without runtime errors or horizontal overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mở lối cho những cơ hội mới.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByLabel("Trạng thái trải nghiệm")).toBeVisible();
  const layout = await page.evaluate(() => ({
    // Use CSS layout coordinates: Windows WebKit mobile emulation can report
    // a differently scaled innerWidth even for a bare HTML document.
    width: document.documentElement.getBoundingClientRect().width,
    clientWidth: document.documentElement.clientWidth,
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute("content"),
    screenWidth: screen.width,
    scale: window.visualViewport?.scale,
    bodyWidth: getComputedStyle(document.body).width,
    scrollWidth: document.documentElement.scrollWidth,
    overflowing: Array.from(document.querySelectorAll("body *"))
      .filter((element) => element.getBoundingClientRect().right > window.innerWidth)
      .map((element) => ({ tag: element.tagName, className: element.className, right: element.getBoundingClientRect().right })),
  }));
  expect(layout.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(Math.ceil(layout.width));
  await page.evaluate(() => window.scrollTo(1000, 0));
  expect(await page.evaluate(() => window.scrollX)).toBe(0);
  expect(errors).toEqual([]);
});

test("missing route returns 404 and links back home", async ({ page }) => {
  const response = await page.goto("/khong-ton-tai");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Không tìm thấy trang." })).toBeVisible();
  await page.getByRole("link", { name: "Về trang chủ" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mở lối cho những cơ hội mới.");
});
