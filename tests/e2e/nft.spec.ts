import { expect, test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
const offeringPath = "/nft/mien-xanh-ven-song";
test("purchase, reload, portfolio and reset stay consistent", async ({ page }) => {
  await page.goto("/nft");
  await page.getByRole("link", { name: "Miền xanh ven sông", exact: true }).click();
  await page.getByLabel("Số lượng NFT", { exact: true }).fill("10");
  await page.getByLabel(/Tôi đã đọc/).check();
  await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
  await expect(page.getByRole("heading", { name: "Xem lại yêu cầu" })).toBeFocused();
  await expect(page.getByRole("complementary", { name: "Mua NFT mô phỏng", exact: true })).toContainText("28.000.000 ₫");
  await page.getByRole("button", { name: "Xác nhận mua NFT mô phỏng" }).dblclick();
  await expect(page.getByRole("heading", { name: "Thành công mô phỏng" })).toBeVisible();
  await page.getByRole("link", { name: "Xem danh mục NFT" }).click();
  await expect(page.locator(".nft-holding")).toContainText("1%");
  await expect(page.locator(".nft-holding")).toContainText("28.000.000 ₫");
  await page.reload();
  await expect(page.locator(".nft-history li")).toHaveCount(1);
  await page.getByRole("button", { name: "Đặt lại demo NFT", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận đặt lại" }).click();
  await expect(page.getByRole("heading", { name: "Chưa có NFT trong danh mục" })).toBeVisible();
  await page.goto(offeringPath);
  await expect(page.getByRole("complementary", { name: "Mua NFT mô phỏng", exact: true })).toContainText("750 NFT còn lại");
});
test("validation, cancel and failure never create holdings", async ({ page }) => {
  await page.goto(offeringPath);
  for (const value of ["0", "-1", "1.5", "751"]) {
    await page.getByLabel("Số lượng NFT", { exact: true }).fill(value);
    await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
    await expect(page.locator("#purchase-error")).not.toBeEmpty();
  }
  await page.getByLabel("Số lượng NFT", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
  await expect(page.locator("#purchase-error")).toContainText("xác nhận đã đọc");
  for (const action of ["Hủy yêu cầu", "Mô phỏng thất bại"]) {
    await page.getByLabel(/Tôi đã đọc/).check();
    await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
    if (action === "Mô phỏng thất bại") await page.getByText("Thử tình huống lỗi", { exact: true }).click();
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(page.getByText("Danh mục và số NFT còn lại không thay đổi.")).toBeVisible();
    await page.getByRole("button", { name: "Tạo yêu cầu mới" }).click();
  }
  await page.goto("/danh-muc-nft");
  await expect(page.getByRole("heading", { name: "Chưa có NFT trong danh mục" })).toBeVisible();
  await expect(page.locator(".nft-history li")).toHaveCount(2);
});
test("unavailable offerings and unknown routes", async ({ page }) => {
  await page.goto("/nft/vuon-nang-cam-ranh");
  await expect(page.getByRole("button", { name: "Hết NFT", exact: true })).toBeDisabled();
  await page.goto("/nft/khoang-xanh-dong-que");
  await expect(page.getByRole("button", { name: "Tạm dừng", exact: true })).toBeDisabled();
  expect((await page.goto("/nft/khong-ton-tai"))?.status()).toBe(404);
});
test("NFT pages meet automated accessibility and responsive checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/nft", offeringPath, "/danh-muc-nft"]) {
    await page.goto(path);
    for (const width of [360, 390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});
test("corrupt or blocked storage leaves a usable demo", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("xland.demo.nft.v1", "{broken"));
  await page.goto("/danh-muc-nft");
  await expect(page.getByText(/Dữ liệu demo cũ hoặc lỗi/)).toBeVisible();
  await page.getByRole("button", { name: "Đặt lại demo NFT", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận đặt lại" }).click();
  await expect(page.getByText("Đã đặt lại demo NFT.")).toBeVisible();
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error("blocked"); }; Storage.prototype.getItem = () => { throw new Error("blocked"); }; });
  await page.goto(offeringPath);
  await expect(page.getByText(/Demo chỉ giữ trong phiên này/)).toBeVisible();
  await page.getByLabel(/Tôi đã đọc/).check();
  await page.getByRole("button", { name: "Xem lại trước khi mua" }).click();
  await page.getByRole("button", { name: "Xác nhận mua NFT mô phỏng" }).click();
  await expect(page.getByRole("heading", { name: "Thành công mô phỏng" })).toBeVisible();
});
