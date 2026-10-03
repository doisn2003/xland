import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3200";
const outputDir = "docs/qa/ui-upgrade/P03";

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

  // 1. Chụp Hero + Search Panel ở 5 viewports tiêu chuẩn
  for (const vp of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const failedImages = [];
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") {
        failedImages.push({ url: req.url(), failure: req.failure()?.errorText });
      }
    });

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p03-shell-hero-${vp.name}.png`;

    // Chụp phần viewport đầu trang (Header + Hero + Search panel lộ diện)
    await page.screenshot({
      path: `${outputDir}/${fileName}`,
      fullPage: false,
    });

    captures.push({
      file: fileName,
      route: "/",
      cropOf: "viewport-top",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "shell-hero-top",
      commit: gitCommit,
      imageFailures: failedImages,
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 2. Chụp Mobile Menu Open ở 390px
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Mở menu
    const menuToggle = page.locator(".menu-toggle");
    await menuToggle.click();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = "p03-mobile-menu-open-390.png";

    await page.screenshot({
      path: `${outputDir}/${fileName}`,
      fullPage: false,
    });

    captures.push({
      file: fileName,
      route: "/",
      cropOf: "site-header-open",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "mobile-menu-open",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 3. Chụp Footer tại 390px và 1440px
  for (const width of [390, 1440]) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const footerLocator = page.locator("footer.site-footer");
    await footerLocator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    const metrics = await getPageMetrics(page);
    const fileName = `p03-footer-${width}.png`;

    await footerLocator.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/",
      cropOf: "footer.site-footer",
      requestedViewport: { width, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "site-footer",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 4. Chụp short-height mobile (390×600)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = "p03-short-height-390.png";

    await page.screenshot({
      path: `${outputDir}/${fileName}`,
      fullPage: false,
    });

    captures.push({
      file: fileName,
      route: "/",
      cropOf: "short-viewport",
      requestedViewport: { width: 390, height: 600 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "short-height-mobile",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 5. Chụp Zoom 200% tại 1440px
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = "p03-zoom-200-1440.png";

    await page.screenshot({
      path: `${outputDir}/${fileName}`,
      fullPage: false,
    });

    captures.push({
      file: fileName,
      route: "/",
      cropOf: "zoom-200",
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

  // 6. Kiểm tra tương tác bàn phím và scroll anchor
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

    // Test Escape key closes menu and focuses trigger
    const menuToggle = page.locator(".menu-toggle");
    await menuToggle.click();
    await page.keyboard.press("Escape");
    const isExpanded = await menuToggle.getAttribute("aria-expanded");
    const isFocused = await menuToggle.evaluate((el) => el === document.activeElement);

    // Test Hero CTA click scrolls smoothly to #kham-pha without header overlap
    const heroCta = page.locator(".hero-cta");
    await heroCta.click();
    await page.waitForTimeout(300);

    const searchPanelVisible = await page.locator(".search-panel").isVisible();
    const searchPanelBox = await page.locator(".search-panel").boundingBox();
    const headerBox = await page.locator(".site-header").boundingBox();

    // Kiểm tra search panel không bị che khuất bởi sticky header
    const notCoveredByHeader = searchPanelBox && headerBox && searchPanelBox.y >= headerBox.height - 2;

    captures.push({
      file: null,
      route: "/",
      cropOf: "keyboard-and-scroll-test",
      testResults: {
        escapeClosesMenu: isExpanded === "false",
        escapeRestoresFocus: isFocused,
        searchPanelVisibleAfterCta: searchPanelVisible,
        searchPanelNotCoveredByStickyHeader: notCoveredByHeader,
      },
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  await browser.close();

  const manifest = {
    phase: "P03",
    capturedAt: new Date().toISOString(),
    totalCaptures: captures.filter((c) => c.file).length,
    baseURL,
    commit: gitCommit,
    captures,
  };

  await writeFile(`${outputDir}/metadata.json`, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[P03] Đã chụp thành công ${manifest.totalCaptures} ảnh vào ${outputDir}`);
}

main().catch((err) => {
  console.error("Lỗi khi chạy capture-p03:", err);
  process.exit(1);
});
