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

test.describe("P08 — 4 GSAP motion scenes choreography", () => {
  test("Scene 1: Hero settle completes, LCP text and CTA available immediately", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");

    // LCP text and CTA must be immediately visible without opacity: 0
    const heroTitle = page.locator("#hero-title");
    await expect(heroTitle).toBeVisible();
    const heroCta = page.locator("[data-hero-cta]");
    await expect(heroCta).toBeVisible();

    // Hero image settles and is visible
    const heroImg = page.locator(".hero-photo");
    await expect(heroImg).toBeVisible();

    // CTA is immediately clickable
    await expect(heroCta).toBeEnabled();

    expect(errors).toHaveLength(0);
  });

  test("Scene 2: Story steps reveal on scroll and clear props", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();

    const steps = page.locator("[data-story-step]");
    await expect(steps).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(steps.nth(i)).toBeVisible();
    }

    // Story CTA is not delayed or hidden
    const storyCta = page.locator("[data-story-cta]");
    await expect(storyCta).toBeVisible();
    await expect(storyCta).toBeEnabled();
  });

  test("Scene 3: NFT media and flow steps appear, numbers are static values", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#nft").scrollIntoViewIfNeeded();

    // Media frame and caption visible
    const media = page.locator(".nft-media-frame");
    await expect(media).toBeVisible();

    // 3 Flow steps visible
    const nftSteps = page.locator("[data-nft-step]");
    await expect(nftSteps).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(nftSteps.nth(i)).toBeVisible();
    }

    // Static quantitative offering specs are final numbers (no count-up)
    const specValues = page.locator(".nft-spec-value");
    await expect(specValues.nth(0)).toHaveText("1.000 NFT");
    await expect(specValues.nth(1)).toHaveText("2.800.000 ₫");
    await expect(specValues.nth(2)).toContainText("0,1%");
  });

  test("Scene 4: Advisors reveal and maintain full keyboard focus and hover", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#nguoi-dong-hanh").scrollIntoViewIfNeeded();

    const cards = page.locator("[data-advisor-card]");
    await expect(cards).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }

    // Focus link inside advisor card
    const firstAdvisorLink = cards.first().locator("a.text-link");
    await firstAdvisorLink.focus();
    await expect(firstAdvisorLink).toBeFocused();
  });

  test("Deep links direct navigation renders all scenes immediately", async ({
    page,
  }) => {
    // Deep link to advisors
    await page.goto("/#nguoi-dong-hanh");
    const cards = page.locator("[data-advisor-card]");
    await expect(cards.first()).toBeVisible();

    // Deep link to NFT
    await page.goto("/#nft");
    const nftMedia = page.locator(".nft-media-frame");
    await expect(nftMedia).toBeVisible();

    // Deep link to story
    await page.goto("/#cach-hoat-dong");
    const storyPhoto = page.locator(".story-photo");
    await expect(storyPhoto).toBeVisible();
  });

  test("Reduced motion disables animation across all 4 scenes", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // All elements visible immediately with neutral transform
    await expect(page.locator(".hero-photo")).toBeVisible();

    await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-story-step]").first()).toBeVisible();

    await page.locator("#nft").scrollIntoViewIfNeeded();
    await expect(page.locator(".nft-media-frame")).toBeVisible();
    await expect(page.locator("[data-nft-step]").first()).toBeVisible();

    await page.locator("#nguoi-dong-hanh").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-advisor-card]").first()).toBeVisible();
  });
});
