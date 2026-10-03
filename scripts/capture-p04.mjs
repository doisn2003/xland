import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3200";
const outputDir = "docs/qa/ui-upgrade/P04";

const gitCommit = (() => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
})();

async function getPageMetrics(page) {
  return await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    devicePixelRatio: window.devicePixelRatio,
  }));
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    reducedMotion: "reduce",
  });

  const captures = [];

  const viewports = [
    { width: 360, height: 740, name: "360" },
    { width: 390, height: 844, name: "390" },
    { width: 430, height: 932, name: "430" },
    { width: 768, height: 1024, name: "768" },
    { width: 1440, height: 900, name: "1440" },
  ];

  // 1. Chụp section Xland Story (#cach-hoat-dong) tại 5 viewports
  for (const vp of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const failedImages = [];
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") {
        failedImages.push({ url: req.url(), failure: req.failure()?.errorText });
      }
    });

    await page.goto(`${baseURL}/#cach-hoat-dong`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const storySection = page.locator("#cach-hoat-dong");
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p04-story-${vp.name}.png`;

    await storySection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "xland-story-section",
      commit: gitCommit,
      imageFailures: failedImages,
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 2. Chụp zoom 200% CSS zoom tại 1440px
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#cach-hoat-dong`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });

    const storySection = page.locator("#cach-hoat-dong");
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = "p04-story-zoom-200.png";

    await storySection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "zoom-200-percent",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 3. Kiểm tra bàn phím và scroll anchor
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

    // Click link từ footer tới #cach-hoat-dong
    const footerLink = page.locator('footer a[href="/#cach-hoat-dong"]');
    await footerLink.scrollIntoViewIfNeeded();
    await footerLink.click();
    await page.waitForTimeout(300);

    const headingBox = await page.locator("#story-title").boundingBox();
    const headerBox = await page.locator(".site-header").boundingBox();

    // Tiêu đề story không bị che bởi sticky header
    const titleNotCoveredByHeader = headingBox && headerBox && headingBox.y >= headerBox.height - 4;

    // Test tab navigation qua story CTA
    const storyCta = page.locator(".story-cta");
    await storyCta.focus();
    const isCtaFocused = await storyCta.evaluate((el) => el === document.activeElement);

    const sublink = page.locator(".story-sublink");
    await page.keyboard.press("Tab");
    const isSublinkFocused = await sublink.evaluate((el) => el === document.activeElement);

    captures.push({
      file: null,
      route: "/",
      cropOf: "keyboard-and-scroll-test",
      testResults: {
        titleNotCoveredByStickyHeader: titleNotCoveredByHeader,
        storyCtaFocusable: isCtaFocused,
        storySublinkFocusable: isSublinkFocused,
      },
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  await browser.close();

  const manifest = {
    phase: "P04",
    capturedAt: new Date().toISOString(),
    totalCaptures: captures.filter((c) => c.file).length,
    baseURL,
    commit: gitCommit,
    captures,
  };

  await writeFile(`${outputDir}/metadata.json`, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[P04] Đã chụp thành công ${manifest.totalCaptures} ảnh vào ${outputDir}`);
}

main().catch((err) => {
  console.error("Lỗi khi chạy capture-p04:", err);
  process.exit(1);
});
