import { webkit, devices } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Diagnostic only. Does not modify the page CSS, viewport assertions or test projects.
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/2026-09-30-1b";
const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3200";
await mkdir(destination, { recursive: true });
const browser = await webkit.launch();
const results = [];
try {
  for (const [name, options] of [["iphone-13", devices["iPhone 13"]], ["desktop-control", { viewport: { width: 390, height: 844 } }]]) {
    const page = await browser.newPage(options);
    for (const mode of ["minimal-html", "xland"]) {
      if (mode === "minimal-html") await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><h1>Viewport check</h1></body></html>');
      else await page.goto(`${baseURL}/lo-dat`);
      const metrics = await page.evaluate(() => ({ innerWidth, clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, devicePixelRatio, scale: visualViewport.scale }));
      await page.evaluate(() => window.scrollTo(1000, 0));
      results.push({ name, mode, requestedWidth: 390, ...metrics, scrollX: await page.evaluate(() => scrollX) });
    }
    await page.close();
  }
  await writeFile(`${destination}/webkit-viewport.json`, JSON.stringify(results, null, 2) + "\n");
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
