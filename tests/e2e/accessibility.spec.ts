import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`home and detail accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/lo-dat/mien-xanh-ven-song"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(scan.violations).toEqual([]);
    }
  });
}

test("keyboard can skip navigation, search, open detail and change gallery", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Đến nội dung chính" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.getByLabel("KHU VỰC", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("KHOẢNG GIÁ", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("KHÔNG GIAN", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Tìm lô đất", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".property-card")).toHaveCount(10);
  await page.getByRole("link", { name: "Miền xanh ven sông", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Ảnh tiếp theo" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".gallery figcaption")).toContainText("Cam Ranh");
});

test("text and controls remain inside the page at 200 percent CSS zoom", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ["/", "/lo-dat/mien-xanh-ven-song"]) {
    await page.goto(route);
    await page.evaluate(() => { document.documentElement.style.zoom = "2"; });
    const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(layout.content).toBeLessThanOrEqual(layout.width);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});
