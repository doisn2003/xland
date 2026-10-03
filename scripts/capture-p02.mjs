import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3200";
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/ui-upgrade/P02";

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
  // 1. Chụp Contact Sheet /qa-media-proof tại 5 kích thước tiêu chuẩn
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
    await page.goto(`${baseURL}/qa-media-proof`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const name = `p02-media-proof-${vp.label}`;
    await recordMetrics(page, {
      name,
      route: "/qa-media-proof",
      width: vp.width,
      height: vp.height,
      state: "media-proof-full",
    });
    await page.screenshot({
      path: `${destination}/${name}.png`,
      fullPage: true,
    });
    await context.close();
  }

  // 2. Chụp Section Người đồng hành trên trang chủ (390 & 1440)
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

    const sec = page.locator("#nguoi-dong-hanh");
    if ((await sec.count()) > 0) {
      await sec.scrollIntoViewIfNeeded();
      const name = `p02-home-advisors-${vp.label}`;
      await sec.screenshot({
        path: `${destination}/${name}.png`,
      });
      await recordMetrics(page, {
        name,
        route: "/",
        width: vp.width,
        height: vp.height,
        state: "home-advisors-section",
        cropOf: "#nguoi-dong-hanh",
      });
    }

    await context.close();
  }

  // 3. Chụp Người đồng hành trên trang chi tiết lô đất (390 & 1440)
  for (const vp of [
    { width: 390, height: 844, label: "390" },
    { width: 1440, height: 900, label: "1440" },
  ]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${baseURL}/lo-dat/mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const supportSection = page.locator("#ho-tro");
    if ((await supportSection.count()) > 0) {
      await supportSection.scrollIntoViewIfNeeded();
      const name = `p02-detail-support-${vp.label}`;
      await supportSection.screenshot({
        path: `${destination}/${name}.png`,
      });
      await recordMetrics(page, {
        name,
        route: "/lo-dat/mien-xanh-ven-song",
        width: vp.width,
        height: vp.height,
        state: "detail-support-section",
        cropOf: "#ho-tro",
      });
    }

    await context.close();
  }

  // Ghi metadata.json
  await writeFile(
    `${destination}/metadata.json`,
    JSON.stringify(
      {
        phase: "P02",
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

  console.log(`[P02] Đã chụp thành công ${metadata.length} ảnh vào ${destination}`);
} finally {
  await browser.close();
}
