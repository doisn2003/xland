import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Run against an already running production server after pnpm check.
const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3000";
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/2026-09-25-1a";
const detailSlug = process.env.XLAND_DETAIL_SLUG ?? "mien-xanh-ven-song";
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const results = [];
  for (const width of [360, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 });
    for (const [name, route] of [["home", "/"], ["detail", `/lo-dat/${detailSlug}`]]) {
      await page.goto(`${baseURL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      // Load below-the-fold media before full-page capture.
      await page.evaluate(async () => {
        for (const img of document.images) {
          img.loading = "eager";
          await img.decode().catch(() => {});
        }
      });
      await page.screenshot({ path: `${destination}/${name}-${width}.png`, fullPage: true });
      if (width === 390) await page.screenshot({ path: `${destination}/${name}-390-fold.png` });
      if (name === "home" && [390, 1440].includes(width)) {
        await page.locator(".property-card").first().screenshot({ path: `${destination}/card-${width}.png` });
      }
      results.push({ name, width, ...await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        imageFailures: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
      })) });
    }
  }
  await writeFile(`${destination}/layout.json`, `${JSON.stringify(results, null, 2)}\n`);
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
