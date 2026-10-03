import { chromium } from "@playwright/test";

const baseURL = process.env.XLAND_BASE_URL || "http://127.0.0.1:3000";

async function measurePage(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  let jsBytes = 0;
  let jsCount = 0;
  let totalBytes = 0;

  page.on("response", async (response) => {
    const req = response.request();
    try {
      const body = await response.body();
      const bytes = body.length;
      totalBytes += bytes;
      if (req.resourceType() === "script" || response.url().endsWith(".js")) {
        jsBytes += bytes;
        jsCount++;
      }
    } catch {}
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  await browser.close();
  return { jsBytes, jsCount, totalBytes };
}

async function main() {
  console.log(`Measuring baseline on ${baseURL}...`);
  const home = await measurePage(`${baseURL}/`);
  const form = await measurePage(`${baseURL}/lich-hen`);

  console.log("BASELINE HOME:", {
    jsKB: (home.jsBytes / 1024).toFixed(2),
    jsCount: home.jsCount,
    totalKB: (home.totalBytes / 1024).toFixed(2),
  });

  console.log("BASELINE FORM (/lich-hen):", {
    jsKB: (form.jsBytes / 1024).toFixed(2),
    jsCount: form.jsCount,
    totalKB: (form.totalBytes / 1024).toFixed(2),
  });
}

main().catch(console.error);

