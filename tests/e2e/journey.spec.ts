import { expect, test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

const slug = "mien-xanh-ven-song";
const name = "Miền xanh ven sông";

test("URL filters survive reload and history and sorting returns matching listings", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("KHU VỰC", { exact: true }).selectOption("Khánh Hòa");
  await page.getByRole("button", { name: "Tìm lô đất", exact: true }).click();
  await expect(page).toHaveURL(/\/lo-dat\?region=/);
  await page.getByLabel("Sắp xếp", { exact: true }).selectOption("price-desc");
  await expect(page).toHaveURL(/sort=price-desc/);
  await expect(page.locator(".property-card h3")).toHaveText(["Vườn nắng Cam Ranh", name]);
  await page.reload();
  await expect(page.getByLabel("KHU VỰC", { exact: true })).toHaveValue("Khánh Hòa");
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await expect(page.locator(".property-card")).toHaveCount(10);
  await page.goBack();
  await expect(page.locator(".property-card h3")).toHaveText(["Vườn nắng Cam Ranh", name]);
  await page.getByRole("link", { name, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/lo-dat/${slug}$`));
  await page.goBack();
  await expect(page).toHaveURL(/sort=price-desc/);
  await expect(page.getByLabel("Sắp xếp", { exact: true })).toHaveValue("price-desc");
});

test("save on card, detail and saved page shares state across reload and tabs", async ({ page, context }) => {
  await page.goto("/lo-dat");
  await page.getByRole("button", { name: `Lưu ${name}`, exact: true }).click();
  await page.getByRole("link", { name, exact: true }).click();
  await expect(page.getByRole("button", { name: `Bỏ lưu ${name}`, exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: `Bỏ lưu ${name}`, exact: true })).toBeVisible();
  const second = await context.newPage();
  await second.goto("/da-luu");
  await expect(second.locator(".property-card h3")).toHaveText([name]);
  await second.getByRole("button", { name: `Bỏ lưu ${name}`, exact: true }).click();
  await expect(second.getByRole("heading", { name: "Chưa có lô đất đã lưu" })).toBeVisible();
  await expect(page.getByRole("button", { name: `Lưu ${name}`, exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("request, reload, change and cancel a visit without auto confirmation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`/lo-dat/${slug}`);
  await page.getByRole("link", { name: "Đề nghị xem thực địa" }).click();
  await page.getByRole("button", { name: "Xem lại đề nghị" }).click();
  await expect(page.getByLabel("Ngày mong muốn", { exact: true })).toBeFocused();
  await page.getByLabel("Ngày mong muốn", { exact: true }).fill("2026-10-05");
  await page.getByLabel("Khung giờ", { exact: true }).selectOption("09:00");
  await page.getByLabel("Số người tham dự", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Xem lại đề nghị" }).click();
  await expect(page.getByRole("heading", { name: "Xem lại lịch mong muốn" })).toBeFocused();
  await page.getByRole("button", { name: "Gửi đề nghị xem thực địa", exact: true }).dblclick();
  await expect(page.getByRole("heading", { name: "Đã nhận đề nghị xem thực địa" })).toBeVisible();
  await page.getByRole("link", { name: "Xem lịch hẹn của tôi" }).click();
  let card = page.locator(".visit-card").filter({ has: page.getByRole("heading", { name, exact: true }) });
  await expect(card).toHaveCount(1);
  await expect(card.locator(".visit-status")).toHaveText("Chờ sắp xếp");
  await page.reload();
  await card.getByRole("button", { name: "Đề nghị đổi lịch" }).click();
  await card.getByLabel("Ngày mong muốn", { exact: true }).fill("2026-10-06");
  await card.getByRole("button", { name: "Xem lại đề nghị" }).click();
  await card.getByRole("button", { name: "Gửi đề nghị đổi lịch", exact: true }).click();
  await card.getByRole("button", { name: "Đóng yêu cầu" }).click();
  await expect(card.getByRole("button", { name: "Đề nghị đổi lịch" })).toBeFocused();
  await expect(card.locator(".visit-status")).toHaveText("Chờ duyệt đổi lịch");
  await expect(card.locator(".visit-date")).toContainText("5 tháng 10");
  await expect(card.getByText(/Đề nghị mới:/)).toContainText("6 tháng 10");
  await card.getByRole("button", { name: "Đề nghị hủy", exact: true }).click();
  await card.getByRole("button", { name: "Giữ lịch", exact: true }).click();
  await expect(card.locator(".visit-status")).toHaveText("Chờ duyệt đổi lịch");
  await card.getByRole("button", { name: "Đề nghị hủy", exact: true }).click();
  await card.getByRole("button", { name: "Gửi đề nghị hủy", exact: true }).click();
  await expect(card.locator(".visit-status")).toHaveText("Chờ xử lý hủy");
  await page.reload();
  card = page.locator(".visit-card").filter({ has: page.getByRole("heading", { name, exact: true }) });
  await expect(card.locator(".visit-status")).toHaveText("Chờ xử lý hủy");
  await card.getByText("Chi tiết và lịch sử yêu cầu", { exact: true }).click();
  await expect(card.locator(".visit-history li")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("direct paused and unknown visit links cannot create requests", async ({ page }) => {
  await page.goto("/lich-hen?lo=khoang-xanh-dong-que");
  await expect(page.getByRole("heading", { name: "Chưa nhận đề nghị xem thực địa" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Xem lại đề nghị" })).toHaveCount(0);
  expect((await page.goto("/lich-hen?lo=missing"))?.status()).toBe(404);
});

test("full reset restores visit seeds, favorites and NFT but preserves unrelated storage", async ({ page }) => {
  await page.goto(`/lo-dat/${slug}`);
  await page.evaluate(() => localStorage.setItem("unrelated", "keep-me"));
  await page.getByRole("button", { name: `Lưu ${name}`, exact: true }).click();
  await page.goto("/lich-hen");
  const first = page.locator(".visit-card").first();
  await first.getByRole("button", { name: "Đề nghị hủy", exact: true }).click();
  await first.getByRole("button", { name: "Gửi đề nghị hủy", exact: true }).click();
  await page.goto(`/nft/${slug}`);
  await page.getByLabel(/Tôi đã đọc/).check();
  await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
  await page.getByRole("button", { name: "Xác nhận mua NFT" }).click();
  await page.goto("/trai-nghiem");
  await page.getByRole("button", { name: "Đặt lại trải nghiệm", exact: true }).click();
  await page.getByRole("button", { name: "Giữ trải nghiệm" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("xland.demo.journey.v1")!).favorites)).toEqual(["XL-001"]);
  await page.getByRole("button", { name: "Đặt lại trải nghiệm", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận đặt lại toàn bộ" }).click();
  await expect(page.getByRole("status")).toContainText("Đã đặt lại trải nghiệm.");
  await page.goto("/da-luu");
  await expect(page.getByRole("heading", { name: "Chưa có lô đất đã lưu" })).toBeVisible();
  await page.goto("/lich-hen");
  await expect(page.locator(".visit-card")).toHaveCount(3);
  await expect(page.locator(".visit-status").first()).toHaveText("Đang điều phối");
  await page.goto("/danh-muc-nft");
  await expect(page.getByRole("heading", { name: "Chưa có NFT trong danh mục" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe("keep-me");
});

test("invalid and blocked storage leave discovery usable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("xland.demo.journey.v1", "{broken"));
  await page.goto("/da-luu");
  await expect(page.getByRole("status")).toContainText("Không đọc được dữ liệu đã lưu");
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error("blocked"); }; Storage.prototype.getItem = () => { throw new Error("blocked"); }; });
  await page.goto(`/lo-dat/${slug}`);
  await page.getByRole("button", { name: `Lưu ${name}`, exact: true }).click();
  await page.getByRole("navigation", { name: "Điều hướng cuối trang" }).getByRole("link", { name: "Lô đất đã lưu" }).click();
  await expect(page.locator(".property-card h3")).toHaveText([name]);
  await expect(page.getByRole("status")).toContainText("chỉ giữ trong phiên này");
});

test("new routes are accessible at five widths with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/lo-dat", "/da-luu", `/lich-hen?lo=${slug}`, "/trai-nghiem"]) {
    await page.goto(route);
    for (const width of [360, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      if (width === 390 || width === 1440) expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    }
  }
});
