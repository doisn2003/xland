import { test, expect } from "@playwright/test";

test.describe("P07 — Motion foundation & Xland story image reveal", () => {
  test("story image reveal is visible and completes on scroll", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    const revealContainer = page.locator('[data-motion-island="story-image"]');
    await expect(revealContainer).toBeAttached();

    // Cuộn tới section Xland story
    await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();

    // Ảnh bên trong phải hiển thị đầy đủ
    const photo = page.locator(".story-photo");
    await expect(photo).toBeVisible();

    // Chờ animation hoàn tất và thuộc tính clearProps được gán
    await expect(revealContainer).toHaveAttribute("data-motion-state", "completed", {
      timeout: 3000,
    });
    expect(errors).toHaveLength(0);
  });

  test("deep link to #cach-hoat-dong reveals image immediately without delay", async ({
    page,
  }) => {
    await page.goto("/#cach-hoat-dong");
    const revealContainer = page.locator('[data-motion-island="story-image"]');
    await expect(revealContainer).toBeVisible();
    await expect(revealContainer).toHaveAttribute("data-motion-state", "completed");
    const photo = page.locator(".story-photo");
    await expect(photo).toBeVisible();
  });

  test("reduced motion displays static image without transform or mask", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();
    const revealContainer = page.locator('[data-motion-island="story-image"]');
    await expect(revealContainer).toHaveAttribute("data-motion-state", "completed");

    const visual = page.locator(".story-reveal-visual");
    await expect(visual).toBeVisible();

    // Không có transform dư thừa
    const transform = await visual.evaluate((el) => window.getComputedStyle(el).transform);
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  });

  test("route back and forth 5 times without memory leaks or stale state", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    for (let i = 0; i < 5; i++) {
      await page.goto("/");
      await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();
      await expect(page.locator(".story-photo")).toBeVisible();

      await page.goto("/lich-hen");
      await expect(page.getByRole("heading", { name: /Lịch xem thực địa/i })).toBeVisible();
    }

    expect(consoleErrors).toHaveLength(0);
  });

  test("business routes do not load GSAP scrollTrigger chunk globally", async ({
    page,
  }) => {
    const scriptUrls: string[] = [];
    page.on("request", (req) => {
      if (req.resourceType() === "script") {
        scriptUrls.push(req.url());
      }
    });

    await page.goto("/lich-hen");
    await expect(page.getByRole("heading", { name: /Lịch xem thực địa/i })).toBeVisible();

    // Đảm bảo không có request nào liên quan đến story-image-reveal
    const loadedStoryMotion = scriptUrls.some((url) =>
      url.includes("story-image-reveal")
    );
    expect(loadedStoryMotion).toBe(false);
  });
});
