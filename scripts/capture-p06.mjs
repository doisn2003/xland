import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3000";
const outputDir = "docs/qa/ui-upgrade/P06";

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

  // 1. Chuyên viên Home (#nguoi-dong-hanh) tại 5 viewports
  for (const vp of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const failedImages = [];
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") {
        failedImages.push({ url: req.url(), failure: req.failure()?.errorText });
      }
    });

    await page.goto(`${baseURL}/#nguoi-dong-hanh`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const advisorsSection = page.locator("#nguoi-dong-hanh");
    await advisorsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-advisors-home-${vp.name}.png`;

    await advisorsSection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#nguoi-dong-hanh",
      cropOf: "section#nguoi-dong-hanh",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "advisors-home-portrait",
      commit: gitCommit,
      imageFailures: failedImages,
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 2. Property Card grid trên Home (390 & 1440)
  for (const vp of [viewports[1], viewports[4]]) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    await page.goto(`${baseURL}/#kham-pha`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const propertyGrid = page.locator(".property-grid").first();
    await propertyGrid.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-card-grid-${vp.name}.png`;

    await propertyGrid.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#kham-pha",
      cropOf: ".property-grid",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "card-grid-display-serif",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 3. Detail Page Support Section (#ho-tro) tại 390 và 1440
  for (const vp of [viewports[1], viewports[4]]) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    await page.goto(`${baseURL}/lo-dat/mien-xanh-ven-song#ho-tro`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const supportSection = page.locator("#ho-tro");
    await supportSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-detail-support-${vp.name}.png`;

    await supportSection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/lo-dat/mien-xanh-ven-song#ho-tro",
      cropOf: "section#ho-tro",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "detail-support-portrait",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 4. Trang /da-luu (Favorites) empty state & saved state (390 & 1440)
  {
    // Empty state
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/da-luu`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".empty-state, .saved-count");
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-saved-empty-390.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/da-luu",
      cropOf: "full-viewport",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "favorites-empty-state",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // Saved state (sau khi save 1 lô đất)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/da-luu`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("xland.demo.journey.v1", JSON.stringify({
        favorites: ["mien-xanh-ven-song", "goc-pho-long-bien"],
        visits: []
      }));
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(".saved-count");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-saved-populated-1440.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/da-luu",
      cropOf: "full-viewport",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "favorites-populated",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // 5. Trang /lich-hen (Visits Form & List) (390 & 1440)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/lich-hen?lo=mien-xanh-ven-song`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".visit-form");
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-visit-form-390.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/lich-hen?lo=mien-xanh-ven-song",
      cropOf: "full-viewport",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "visit-form-request",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/lich-hen`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".visit-grid, .empty-state");
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-visit-list-1440.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/lich-hen",
      cropOf: "full-viewport",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "visit-list-seed",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // 6. Trang /nft/[slug] (NFT Detail & Purchase Panel) (390 & 1440)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-nft-detail-390.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/nft/mien-xanh-ven-song",
      cropOf: "full-viewport",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "nft-detail-mobile",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-nft-detail-1440.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/nft/mien-xanh-ven-song",
      cropOf: "full-viewport",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "nft-detail-desktop",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // 7. Trang /danh-muc-nft (Portfolio) (1440)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/danh-muc-nft`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-nft-portfolio-1440.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/danh-muc-nft",
      cropOf: "full-viewport",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "nft-portfolio-summary",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // 8. Trang /trai-nghiem (Reset Experience) (390 & 1440)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/trai-nghiem`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-experience-reset-390.png`;

    await page.screenshot({ path: `${outputDir}/${fileName}`, fullPage: false });

    captures.push({
      file: fileName,
      route: "/trai-nghiem",
      cropOf: "full-viewport",
      requestedViewport: { width: 390, height: 844 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "experience-reset",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }

  // 9. Zoom 200% CSS zoom tại 1440px trên Home Advisors
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#nguoi-dong-hanh`, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });

    const advisorsSection = page.locator("#nguoi-dong-hanh");
    await advisorsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p06-advisors-zoom200.png`;

    await advisorsSection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#nguoi-dong-hanh",
      cropOf: "section#nguoi-dong-hanh",
      requestedViewport: { width: 1440, height: 900 },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "advisors-zoom-200",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  await browser.close();

  // Ghi metadata.json
  const metadata = {
    phase: "P06",
    title: "Tính nhất quán thị giác và hoàn thiện người đồng hành",
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

  console.log(`[P06 Capture] Hoàn tất ${captures.length} ảnh tại ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
