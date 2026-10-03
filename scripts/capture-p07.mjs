import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3000";
const outputDir = "docs/qa/ui-upgrade/P07";

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
  const captures = [];

  // 1. Chụp ảnh Xland Story reveal tại Desktop 1440px
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const storySection = page.locator("#cach-hoat-dong");
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Đợi reveal hoàn tất 850ms

    const metrics = await getPageMetrics(page);
    const fileName = "p07-story-reveal-1440.png";
    await storySection.screenshot({ path: `${outputDir}/${fileName}` });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "no-preference",
      state: "desktop-mask-reveal-completed",
      commit: gitCommit,
      timestamp: new Date().toISOString(),
    });
    await context.close();
  }

  // 2. Chụp ảnh Xland Story reveal tại Mobile 390px
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const storySection = page.locator("#cach-hoat-dong");
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // Đợi reveal mobile hoàn tất 600ms

    const metrics = await getPageMetrics(page);
    const fileName = "p07-story-reveal-390.png";
    await storySection.screenshot({ path: `${outputDir}/${fileName}` });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "no-preference",
      state: "mobile-fade-up-completed",
      commit: gitCommit,
      timestamp: new Date().toISOString(),
    });
    await context.close();
  }

  // 3. Chụp trạng thái Reduced Motion (bật trước khi tải trang)
  {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const storySection = page.locator("#cach-hoat-dong");
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const metrics = await getPageMetrics(page);
    const fileName = "p07-story-reduced-motion-1440.png";
    await storySection.screenshot({ path: `${outputDir}/${fileName}` });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "static-fallback-no-transform",
      commit: gitCommit,
      timestamp: new Date().toISOString(),
    });
    await context.close();
  }

  // 4. Chụp truy cập Deep-Link trực tiếp #cach-hoat-dong
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#cach-hoat-dong`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const storySection = page.locator("#cach-hoat-dong");
    const metrics = await getPageMetrics(page);
    const fileName = "p07-story-deeplink-1440.png";
    await storySection.screenshot({ path: `${outputDir}/${fileName}` });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "no-preference",
      state: "deeplink-immediate-visible",
      commit: gitCommit,
      timestamp: new Date().toISOString(),
    });
    await context.close();
  }

  // 5. Chụp Zoom 200% CSS zoom tại 1440px
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#cach-hoat-dong`, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });
    await page.waitForTimeout(300);

    const storySection = page.locator("#cach-hoat-dong");
    const metrics = await getPageMetrics(page);
    const fileName = "p07-story-zoom200.png";
    await storySection.screenshot({ path: `${outputDir}/${fileName}` });

    captures.push({
      file: fileName,
      route: "/#cach-hoat-dong",
      cropOf: "section#cach-hoat-dong",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "no-preference",
      state: "zoom-200-percent",
      commit: gitCommit,
      timestamp: new Date().toISOString(),
    });
    await context.close();
  }

  await browser.close();

  const metadata = {
    phase: "P07",
    title: "Nền GSAP an toàn cho React và mobile",
    generatedAt: new Date().toISOString(),
    baseURL,
    gitCommit,
    totalCaptures: captures.length,
    captures,
  };

  await writeFile(
    `${outputDir}/metadata.json`,
    JSON.stringify(metadata, null, 2),
    "utf8"
  );

  console.log(`[P07 Capture] Hoàn tất ${captures.length} ảnh tại ${outputDir}`);
}

main().catch(console.error);
