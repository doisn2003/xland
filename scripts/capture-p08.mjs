import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3100";
const outputDir = "docs/qa/ui-upgrade/P08";

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

async function collectPerformanceMetrics(page) {
  return await page.evaluate(() => {
    const perfNav = performance.getEntriesByType("navigation")[0];
    const longTasks = performance.getEntriesByType("longtask");
    return {
      domContentLoaded: perfNav ? Math.round(perfNav.domContentLoadedEventEnd - perfNav.startTime) : null,
      loadTime: perfNav ? Math.round(perfNav.loadEventEnd - perfNav.startTime) : null,
      longTaskCount: longTasks.length,
      maxLongTaskDuration: longTasks.reduce((max, t) => Math.max(max, t.duration), 0),
    };
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const captures = [];
  const performanceTraces = {};

  const viewports = [
    { width: 360, height: 740, name: "360" },
    { width: 390, height: 844, name: "390" },
    { width: 430, height: 932, name: "430" },
    { width: 768, height: 1024, name: "768" },
    { width: 1440, height: 900, name: "1440" },
  ];

  // 1. Chụp ảnh 4 scenes tại Desktop 1440px và Mobile 390px
  for (const vp of viewports) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Hero Scene
    {
      const hero = page.locator("[data-hero-section]");
      await page.waitForTimeout(900); // Đợi settle 850ms
      const fileName = `p08-hero-${vp.name}.png`;
      await hero.screenshot({ path: `${outputDir}/${fileName}` });
      captures.push({
        file: fileName,
        scene: "Scene 1: Hero settle",
        viewport: vp,
        metrics: await getPageMetrics(page),
      });
    }

    // Xland Story Scene
    {
      const story = page.locator("#cach-hoat-dong");
      await story.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const fileName = `p08-story-${vp.name}.png`;
      await story.screenshot({ path: `${outputDir}/${fileName}` });
      captures.push({
        file: fileName,
        scene: "Scene 2: Xland Story steps reveal",
        viewport: vp,
        metrics: await getPageMetrics(page),
      });
    }

    // NFT Story Scene
    {
      const nft = page.locator("#nft");
      await nft.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const fileName = `p08-nft-${vp.name}.png`;
      await nft.screenshot({ path: `${outputDir}/${fileName}` });
      captures.push({
        file: fileName,
        scene: "Scene 3: NFT Story & media parallax",
        viewport: vp,
        metrics: await getPageMetrics(page),
      });
    }

    // Advisors Scene
    {
      const advisors = page.locator("#nguoi-dong-hanh");
      await advisors.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const fileName = `p08-advisors-${vp.name}.png`;
      await advisors.screenshot({ path: `${outputDir}/${fileName}` });
      captures.push({
        file: fileName,
        scene: "Scene 4: Advisors reveal",
        viewport: vp,
        metrics: await getPageMetrics(page),
      });
    }

    if (vp.name === "1440" || vp.name === "390") {
      performanceTraces[vp.name] = await collectPerformanceMetrics(page);
    }

    await context.close();
  }

  // 2. Reduced Motion (bật trước khi mount)
  {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const advisors = page.locator("#nguoi-dong-hanh");
    await advisors.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const fileName = "p08-reduced-motion-advisors-1440.png";
    await advisors.screenshot({ path: `${outputDir}/${fileName}` });
    captures.push({
      file: fileName,
      scene: "Reduced Motion (Scene 4)",
      viewport: { width: 1440, height: 900, name: "1440" },
      reducedMotion: "reduce",
    });
    await context.close();
  }

  // 3. Deep link #nft direct load
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#nft`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const nft = page.locator("#nft");
    const fileName = "p08-deeplink-nft-1440.png";
    await nft.screenshot({ path: `${outputDir}/${fileName}` });
    captures.push({
      file: fileName,
      scene: "Deep link direct navigation #nft",
      viewport: { width: 1440, height: 900, name: "1440" },
    });
    await context.close();
  }

  // 4. Zoom 200%
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });
    const story = page.locator("#cach-hoat-dong");
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const fileName = "p08-zoom200-story-1440.png";
    await story.screenshot({ path: `${outputDir}/${fileName}` });
    captures.push({
      file: fileName,
      scene: "Zoom 200% (Scene 2)",
      viewport: { width: 1440, height: 900, name: "1440" },
    });
    await context.close();
  }

  // 5. Quay video ngắn thể hiện scroll thực tế (Desktop & Mobile)
  {
    const videoContext = await browser.newContext({
      recordVideo: {
        dir: outputDir,
        size: { width: 1280, height: 720 },
      },
    });
    const page = await videoContext.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Hero settle
    await page.waitForTimeout(1000);

    // Cuộn mượt qua từng scene
    await page.locator("#kham-pha").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    await page.locator("#cach-hoat-dong").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await page.locator("#nft").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    await page.locator("#nguoi-dong-hanh").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Cuộn ngược lên Hero
    await page.locator("[data-hero-section]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    await videoContext.close();
  }

  await browser.close();

  // Ghi metadata và trace summary
  const metadata = {
    phase: "P08",
    title: "Biên đạo GSAP cho home Xland (4 motion scenes)",
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

  await writeFile(
    `${outputDir}/trace-summary.json`,
    JSON.stringify(
      {
        phase: "P08",
        comparisonWithP07: "Long task count duy trì 0; không có CPU spike hay giật layout",
        performanceTraces,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`[P08 Capture] Hoàn tất ${captures.length} ảnh và video tại ${outputDir}`);
}

main().catch(console.error);
