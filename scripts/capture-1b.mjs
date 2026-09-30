import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3200";
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/2026-09-30-1b";
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];
try {
  for (const width of [360, 390, 430, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    page.on("pageerror", error => errors.push({ width, message: error.message }));
    async function capture(name) {
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (const image of document.images) { image.loading = "eager"; await image.decode().catch(() => {}); }
      });
      await page.screenshot({ path: `${destination}/${name}-${width}.png`, fullPage: true });
      results.push({ name, width, ...await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        imageFailures: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
      })) });
    }
    await page.goto(`${baseURL}/lo-dat?region=${encodeURIComponent("Khánh Hòa")}`);
    await capture("catalog");
    await page.getByRole("button", { name: "Lưu Miền xanh ven sông", exact: true }).click();
    await page.goto(`${baseURL}/da-luu`);
    await capture("saved");
    await page.goto(`${baseURL}/lich-hen?lo=mien-xanh-ven-song`);
    await capture("visit-form");
    await page.getByLabel("Ngày mong muốn", { exact: true }).fill("2026-10-05");
    await page.getByLabel("Khung giờ", { exact: true }).selectOption("09:00");
    await page.getByRole("button", { name: "Xem lại đề nghị" }).click();
    await capture("visit-review");
    await page.getByRole("button", { name: "Gửi đề nghị xem thực địa", exact: true }).click();
    await page.getByRole("link", { name: "Xem lịch hẹn của tôi" }).click();
    await expect(page).toHaveURL(`${baseURL}/lich-hen`);
    await expect(page.getByRole("heading", { name: "Đã nhận đề nghị xem thực địa" })).toHaveCount(0);
    await capture("visits");
    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`);
    await capture("nft-detail");
    await page.goto(`${baseURL}/trai-nghiem`);
    await page.getByRole("button", { name: "Đặt lại trải nghiệm", exact: true }).click();
    await capture("reset");
    await page.close();
  }
  await writeFile(`${destination}/layout.json`, JSON.stringify({ results, errors }, null, 2) + "\n");
  console.log(JSON.stringify({ captures: results.length, layoutFailures: results.filter(item => item.scrollWidth > item.clientWidth), imageFailures: results.filter(item => item.imageFailures.length), errors }));
} finally { await browser.close(); }
