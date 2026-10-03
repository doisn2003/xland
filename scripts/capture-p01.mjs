import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3200";
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/ui-upgrade/P01";

let commit = "HEAD";
try {
  commit = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
} catch {}

await mkdir(destination, { recursive: true });

const browser = await chromium.launch();
const metadata = [];

async function waitMedia(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = "eager";
      await img.decode().catch(() => {});
    }
  });
}

async function recordMetrics(page, { name, route, width, height, state, cropOf }) {
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    devicePixelRatio: window.devicePixelRatio,
    imageFailures: [...document.images]
      .filter((img) => !img.complete || !img.naturalWidth)
      .map((img) => img.src),
  }));

  const item = {
    file: `${name}.png`,
    route,
    cropOf: cropOf ?? null,
    requestedViewport: { width, height },
    metrics: {
      innerWidth: metrics.innerWidth,
      clientWidth: metrics.clientWidth,
      scrollWidth: metrics.scrollWidth,
      devicePixelRatio: metrics.devicePixelRatio,
    },
    browser: "Chromium (Playwright)",
    reducedMotion: "reduce",
    state,
    commit,
    imageFailures: metrics.imageFailures,
    timestamp: new Date().toISOString(),
  };

  metadata.push(item);
  return metrics;
}

try {
  // 1. Chụp Proof sheet tại 5 kích thước tiêu chuẩn: 360, 390, 430, 768, 1440
  const viewports = [
    { width: 360, height: 740, label: "360" },
    { width: 390, height: 844, label: "390" },
    { width: 430, height: 932, label: "430" },
    { width: 768, height: 1024, label: "768" },
    { width: 1440, height: 900, label: "1440" },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/qa-identity-proof`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const name = `p01-proof-sheet-${vp.label}`;
    await recordMetrics(page, {
      name,
      route: "/qa-identity-proof",
      width: vp.width,
      height: vp.height,
      state: "proof-sheet-full",
    });
    await page.screenshot({
      path: `${destination}/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  // 2. Chụp Header & Footer trên trang chủ ở 390 và 1440
  for (const vp of [
    { width: 390, height: 844, label: "390" },
    { width: 1440, height: 900, label: "1440" },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await waitMedia(page);

    // Chụp toàn bộ Home
    const homeName = `p01-home-${vp.label}`;
    await page.screenshot({
      path: `${destination}/${homeName}.png`,
      fullPage: false,
    });
    await recordMetrics(page, {
      name: homeName,
      route: "/",
      width: vp.width,
      height: vp.height,
      state: "home-fold",
    });

    // Header
    const headerName = `p01-header-brand-${vp.label}`;
    const headerLoc = page.locator(".site-header");
    if ((await headerLoc.count()) > 0) {
      await headerLoc.screenshot({
        path: `${destination}/${headerName}.png`,
      });
      await recordMetrics(page, {
        name: headerName,
        route: "/",
        width: vp.width,
        height: vp.height,
        state: "header-default",
        cropOf: ".site-header",
      });
    }

    // Footer
    const footerName = `p01-footer-brand-${vp.label}`;
    const footerLoc = page.locator(".site-footer");
    if ((await footerLoc.count()) > 0) {
      await footerLoc.scrollIntoViewIfNeeded();
      await footerLoc.screenshot({
        path: `${destination}/${footerName}.png`,
      });
      await recordMetrics(page, {
        name: footerName,
        route: "/",
        width: vp.width,
        height: vp.height,
        state: "footer-inverse-dark",
        cropOf: ".site-footer",
      });
    }

    await context.close();
  }

  // 3. Chụp Form lịch hẹn và Button trạng thái ở 390 & 1440
  for (const vp of [
    { width: 390, height: 844, label: "390" },
    { width: 1440, height: 900, label: "1440" },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/lich-hen?lo=mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const name = `p01-visit-form-${vp.label}`;
    await page.screenshot({
      path: `${destination}/${name}.png`,
      fullPage: false,
    });
    await recordMetrics(page, {
      name,
      route: "/lich-hen?lo=mien-xanh-ven-song",
      width: vp.width,
      height: vp.height,
      state: "visit-form-loaded",
    });

    await context.close();
  }

  // 4. Chụp NFT Purchase panel ở 390 & 1440
  for (const vp of [
    { width: 390, height: 844, label: "390" },
    { width: 1440, height: 900, label: "1440" },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const name = `p01-nft-panel-${vp.label}`;
    await page.screenshot({
      path: `${destination}/${name}.png`,
      fullPage: false,
    });
    await recordMetrics(page, {
      name,
      route: "/nft/mien-xanh-ven-song",
      width: vp.width,
      height: vp.height,
      state: "nft-panel-loaded",
    });

    await context.close();
  }

  // 5. Chụp SaveButton trạng thái (default và saved) trên trang chi tiết lô đất
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/lo-dat/mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const saveBtn = page.locator(".property-summary .save-button");
    if ((await saveBtn.count()) > 0) {
      await saveBtn.scrollIntoViewIfNeeded();
      await saveBtn.screenshot({
        path: `${destination}/p01-save-button-default.png`,
      });
      await recordMetrics(page, {
        name: "p01-save-button-default",
        route: "/lo-dat/mien-xanh-ven-song",
        width: 390,
        height: 844,
        state: "save-button-default",
        cropOf: ".property-summary .save-button[aria-pressed=false]",
      });

      // Click to toggle
      await saveBtn.click();
      await page.waitForTimeout(300);
      await saveBtn.screenshot({
        path: `${destination}/p01-save-button-active.png`,
      });
      await recordMetrics(page, {
        name: "p01-save-button-active",
        route: "/lo-dat/mien-xanh-ven-song",
        width: 390,
        height: 844,
        state: "save-button-active",
        cropOf: ".property-summary .save-button[aria-pressed=true]",
      });
    }

    await context.close();
  }

  // Ghi metadata.json
  await writeFile(
    `${destination}/metadata.json`,
    JSON.stringify(
      {
        phase: "P01",
        capturedAt: new Date().toISOString(),
        totalCaptures: metadata.length,
        baseURL,
        commit,
        captures: metadata,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`[P01] Đã chụp thành công ${metadata.length} ảnh vào ${destination}`);
} finally {
  await browser.close();
}
