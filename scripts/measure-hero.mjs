import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";

// Use the image processor already required by the locked Next.js installation.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const luminance = (rgb) => rgb.map(value => value / 255)
  .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  .reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0);
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage();
  for (const width of [360, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(process.env.XLAND_URL ?? "http://127.0.0.1:3000");
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".hero img").evaluate(img => img.decode());
    const boxes = await page.locator(".hero-content").evaluate(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const boxes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const style = getComputedStyle(node.parentElement);
        for (const rect of range.getClientRects()) {
          if (rect.width) boxes.push({ text: node.textContent.trim(), ...rect.toJSON(), color: style.color, fontSize: parseFloat(style.fontSize) });
        }
      }
      return boxes;
    });
    // Preserve layout and overlay; hide glyphs to sample only their background.
    await page.addStyleTag({ content: ".hero-content * { color: transparent !important; text-shadow: none !important; }" });
    const { data, info } = await sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true });
    for (const box of boxes) {
      let brightest = 0;
      for (let y = Math.ceil(box.y); y < Math.floor(box.y + box.height); y++) {
        for (let x = Math.ceil(box.x); x < Math.floor(box.x + box.width); x++) {
          const at = (y * info.width + x) * info.channels;
          brightest = Math.max(brightest, luminance([...data.slice(at, at + 3)]));
        }
      }
      // Conservative lower bound across each full text-line rectangle.
      const ratio = (luminance(box.color.match(/[\d.]+/g).slice(0, 3).map(Number)) + 0.05) / (brightest + 0.05);
      const threshold = box.fontSize >= 24 ? 3 : 4.5;
      results.push({ width, text: box.text, fontSize: box.fontSize, ratio: Number(ratio.toFixed(2)), threshold, pass: ratio >= threshold });
    }
  }
  await writeFile("docs/qa/2026-09-25-1a/hero-contrast.json", `${JSON.stringify(results, null, 2)}\n`);
  console.log({ samples: results.length, failures: results.filter(result => !result.pass) });
  if (results.some(result => !result.pass)) process.exitCode = 1;
} finally {
  await browser.close();
}
