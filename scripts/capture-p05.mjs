import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3200";
const outputDir = "docs/qa/ui-upgrade/P05";

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

  // 1. Chụp section NFT (#nft) tại 5 viewports
  for (const vp of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    const failedImages = [];
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") {
        failedImages.push({ url: req.url(), failure: req.failure()?.errorText });
      }
    });

    await page.goto(`${baseURL}/#nft`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const nftSection = page.locator("#nft");
    await nftSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = `p05-nft-${vp.name}.png`;

    await nftSection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#nft",
      cropOf: "section#nft",
      requestedViewport: { width: vp.width, height: vp.height },
      metrics,
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "nft-story-section",
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
    await page.goto(`${baseURL}/#nft`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.zoom = "2";
    });

    const nftSection = page.locator("#nft");
    await nftSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const metrics = await getPageMetrics(page);
    const fileName = "p05-nft-zoom-200.png";

    await nftSection.screenshot({
      path: `${outputDir}/${fileName}`,
    });

    captures.push({
      file: fileName,
      route: "/#nft",
      cropOf: "section#nft",
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

  // 3. Chụp ranh giới chuyển tiếp nhịp sáng - tối - sáng (Boundary Transition)
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/#nft`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Cuộn tới giữa ranh giới Xland Story sang NFT
    await page.evaluate(() => {
      const el = document.getElementById("nft");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo(0, top);
      }
    });
    await page.waitForTimeout(200);

    const boundaryFileName = "p05-nft-boundary-1440.png";
    await page.screenshot({
      path: `${outputDir}/${boundaryFileName}`,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    captures.push({
      file: boundaryFileName,
      route: "/",
      cropOf: "boundary-xland-story-to-nft",
      requestedViewport: { width: 1440, height: 900 },
      metrics: await getPageMetrics(page),
      browser: "Chromium (Playwright)",
      reducedMotion: "reduce",
      state: "light-to-dark-transition",
      commit: gitCommit,
      imageFailures: [],
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  // 4. Kiểm tra bàn phím, dark focus, scroll anchor và cấm từ nhạy cảm
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/#nft`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const headingBox = await page.locator("#nft-heading").boundingBox();
    const headerBox = await page.locator(".site-header").boundingBox();

    // Tiêu đề section không bị che bởi sticky header
    const titleNotCoveredByHeader = headingBox && headerBox && headingBox.y >= headerBox.height - 4;

    // Focus vào nút CTA chính
    const nftCta = page.locator("#nft .nft-cta-primary");
    await nftCta.focus();
    const isCtaFocused = await nftCta.evaluate((el) => document.activeElement === el);

    // Focus vào link phụ
    const nftSublink = page.locator("#nft .nft-link-sub");
    await nftSublink.focus();
    const isSublinkFocused = await nftSublink.evaluate((el) => document.activeElement === el);

    // Kiểm tra text section có đủ các dấu tiếng Việt, đơn vị %, ₫
    const sectionText = await page.locator("#nft").innerText();
    const hasDongUnit = sectionText.includes("₫");
    const hasPercentUnit = sectionText.includes("%");
    const hasErc1155 = sectionText.includes("ERC-1155");
    const noForbiddenWords = !/bản demo|dữ liệu mẫu|hình ảnh minh họa|nhân vật mẫu/i.test(sectionText);

    captures.push({
      file: null,
      route: "/",
      cropOf: "keyboard-dark-focus-and-units-test",
      testResults: {
        titleNotCoveredByStickyHeader: !!titleNotCoveredByHeader,
        nftCtaFocusable: isCtaFocused,
        nftSublinkFocusable: isSublinkFocused,
        hasDongUnit,
        hasPercentUnit,
        hasErc1155,
        noForbiddenWords,
      },
      timestamp: new Date().toISOString(),
    });

    await page.close();
  }

  await browser.close();

  const manifest = {
    phase: "P05",
    capturedAt: new Date().toISOString(),
    totalCaptures: captures.filter((c) => c.file).length,
    baseURL,
    commit: gitCommit,
    captures,
  };

  await writeFile(`${outputDir}/metadata.json`, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`[P05] Đã chụp thành công ${manifest.totalCaptures} ảnh vào ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
