import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const baseURL = process.env.XLAND_URL ?? "http://127.0.0.1:3200";
const destination = process.env.XLAND_CAPTURE_DIR ?? "docs/qa/ui-upgrade/P00";

let commit = "0bf496c";
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
      .filter(img => !img.complete || !img.naturalWidth)
      .map(img => img.src),
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
  // 1. Chụp Home tại 360, 390, 430, 768, 1440px: toàn trang + crops
  for (const width of [360, 390, 430, 768, 1440]) {
    const height = width === 1440 ? 1000 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await waitMedia(page);

    const fullPath = `${destination}/home-${width}.png`;
    await page.screenshot({ path: fullPath, fullPage: true });
    await recordMetrics(page, {
      name: `home-${width}`,
      route: "/",
      width,
      height,
      state: "default seed",
    });

    // Crops
    // Hero crop
    const heroLocator = page.locator(".hero");
    if (await heroLocator.count() > 0) {
      await heroLocator.first().screenshot({ path: `${destination}/home-${width}-crop-hero.png` });
      await recordMetrics(page, {
        name: `home-${width}-crop-hero`,
        route: "/",
        width,
        height,
        state: "default seed",
        cropOf: ".hero",
      });
    }

    // Xland story crop (#cach-hoat-dong)
    const xlandLocator = page.locator("#cach-hoat-dong");
    if (await xlandLocator.count() > 0) {
      await xlandLocator.first().screenshot({ path: `${destination}/home-${width}-crop-xland.png` });
      await recordMetrics(page, {
        name: `home-${width}-crop-xland`,
        route: "/",
        width,
        height,
        state: "default seed",
        cropOf: "#cach-hoat-dong",
      });
    }

    // NFT crop (#nft)
    const nftLocator = page.locator("#nft");
    if (await nftLocator.count() > 0) {
      await nftLocator.first().screenshot({ path: `${destination}/home-${width}-crop-nft.png` });
      await recordMetrics(page, {
        name: `home-${width}-crop-nft`,
        route: "/",
        width,
        height,
        state: "default seed",
        cropOf: "#nft",
      });
    }

    // Chuyên viên crop (#nguoi-dong-hanh)
    const advisorLocator = page.locator("#nguoi-dong-hanh");
    if (await advisorLocator.count() > 0) {
      await advisorLocator.first().screenshot({ path: `${destination}/home-${width}-crop-advisors.png` });
      await recordMetrics(page, {
        name: `home-${width}-crop-advisors`,
        route: "/",
        width,
        height,
        state: "default seed",
        cropOf: "#nguoi-dong-hanh",
      });
    }

    // First Property Card crop
    const cardLocator = page.locator(".property-card").first();
    if (await cardLocator.count() > 0) {
      await cardLocator.screenshot({ path: `${destination}/home-${width}-crop-card.png` });
      await recordMetrics(page, {
        name: `home-${width}-crop-card`,
        route: "/",
        width,
        height,
        state: "default seed",
        cropOf: ".property-card:first",
      });
    }

    await context.close();
  }

  // 2. Chụp Detail đô thị (/lo-dat/goc-pho-long-bien) tại 390 và 1440
  for (const width of [390, 1440]) {
    const height = width === 1440 ? 1000 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto(`${baseURL}/lo-dat/goc-pho-long-bien`, { waitUntil: "networkidle" });
    await waitMedia(page);

    await page.screenshot({ path: `${destination}/detail-urban-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `detail-urban-${width}`,
      route: "/lo-dat/goc-pho-long-bien",
      width,
      height,
      state: "default seed (lô đô thị XL-004)",
    });

    await context.close();
  }

  // 3. Chụp Detail NFT (/nft/mien-xanh-ven-song) tại 390 và 1440
  for (const width of [390, 1440]) {
    const height = width === 1440 ? 1000 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);

    await page.screenshot({ path: `${destination}/detail-nft-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `detail-nft-${width}`,
      route: "/nft/mien-xanh-ven-song",
      width,
      height,
      state: "default seed (NFT-XL-001 mở bán)",
    });

    await context.close();
  }

  // 4. Các màn chức năng 1B tại 390 và 1440
  for (const width of [390, 1440]) {
    const height = width === 1440 ? 1000 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();

    // Catalog (/lo-dat)
    await page.goto(`${baseURL}/lo-dat?region=${encodeURIComponent("Khánh Hòa")}`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-catalog-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-catalog-${width}`,
      route: "/lo-dat?region=Khánh Hòa",
      width,
      height,
      state: "filtered by region Khánh Hòa",
    });

    // Thao tác Lưu một lô
    const saveBtn = page.getByRole("button", { name: "Lưu Miền xanh ven sông", exact: true });
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
    }

    // Đã lưu (/da-luu)
    await page.goto(`${baseURL}/da-luu`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-saved-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-saved-${width}`,
      route: "/da-luu",
      width,
      height,
      state: "1 property saved",
    });

    // Form xem thực địa (/lich-hen?lo=mien-xanh-ven-song)
    await page.goto(`${baseURL}/lich-hen?lo=mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-visit-form-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-visit-form-${width}`,
      route: "/lich-hen?lo=mien-xanh-ven-song",
      width,
      height,
      state: "visit form active",
    });

    // Điền form và xem lại
    await page.getByLabel("Ngày mong muốn", { exact: true }).fill("2026-10-08");
    await page.getByLabel("Khung giờ", { exact: true }).selectOption("09:00");
    await page.getByRole("button", { name: "Xem lại đề nghị" }).click();
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-visit-review-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-visit-review-${width}`,
      route: "/lich-hen?lo=mien-xanh-ven-song",
      width,
      height,
      state: "visit review mode",
    });

    // Gửi đề nghị
    await page.getByRole("button", { name: "Gửi đề nghị xem thực địa", exact: true }).click();
    await page.getByRole("link", { name: "Xem lịch hẹn của tôi" }).click();
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-visits-list-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-visits-list-${width}`,
      route: "/lich-hen",
      width,
      height,
      state: "visit list with new request",
    });

    // Danh sách NFT (/nft)
    await page.goto(`${baseURL}/nft`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-nft-catalog-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-nft-catalog-${width}`,
      route: "/nft",
      width,
      height,
      state: "3 NFT offerings (open, sold_out, paused)",
    });

    // Mua NFT thử nghiệm và xem Danh mục NFT (/danh-muc-nft)
    await page.goto(`${baseURL}/nft/mien-xanh-ven-song`, { waitUntil: "networkidle" });
    await waitMedia(page);
    const qtyInput = page.getByLabel("Số lượng NFT", { exact: false });
    if (await qtyInput.count() > 0) {
      await qtyInput.fill("5");
      const buyBtn = page.getByRole("button", { name: "Xác nhận mua NFT mô phỏng", exact: true });
      if (await buyBtn.count() > 0) {
        await buyBtn.click();
      }
    }
    await page.goto(`${baseURL}/danh-muc-nft`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-nft-portfolio-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-nft-portfolio-${width}`,
      route: "/danh-muc-nft",
      width,
      height,
      state: "portfolio with 5 NFT purchased",
    });

    // Trải nghiệm reset (/trai-nghiem)
    await page.goto(`${baseURL}/trai-nghiem`, { waitUntil: "networkidle" });
    await waitMedia(page);
    await page.screenshot({ path: `${destination}/functional-reset-${width}.png`, fullPage: true });
    await recordMetrics(page, {
      name: `functional-reset-${width}`,
      route: "/trai-nghiem",
      width,
      height,
      state: "reset settings screen",
    });

    await context.close();
  }

  await writeFile(
    `${destination}/metadata.json`,
    JSON.stringify(
      {
        session: "P00-baseline",
        commit,
        baseURL,
        totalCaptures: metadata.length,
        captures: metadata,
      },
      null,
      2
    ) + "\n"
  );

  console.log(`Successfully captured ${metadata.length} screenshots to ${destination}`);
} finally {
  await browser.close();
}
