import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { entity, page as wirePage, money } from "../../src/features/user/wire";

type Fixture = {
  accounts: { id: string; username: string; password: string }[];
  properties: { id: string; price_total: string }[];
  slot: { id: string; property_id: string };
  video: { id: string; property_id: string; author_id: string };
  event: { id: string };
  ordinaryAuthor: string;
  startedEvent: string;
  cancelledEvent: string;
  schema: { tables: number; rls: boolean; force_rls: boolean };
};
const fixture = (): Fixture =>
  JSON.parse(
    readFileSync(
      resolve("../../xland-server/.local/web-user-acceptance.json"),
      "utf8",
    ),
  );
const base = "http://127.0.0.1:3311/api/v1";
const origin = "http://127.0.0.1:3100";
function account(info: TestInfo, offset: number) {
  return fixture().accounts[
    info.project.name === "desktop-chromium"
      ? offset
      : info.project.name === "mobile-chromium"
        ? 6 + offset
        : 12 + offset
  ]!;
}
async function login(
  page: Page,
  info: TestInfo,
  offset: number,
  destination = "/tai-khoan",
) {
  const a = account(info, offset);
  await page.goto("/dang-nhap?returnTo=" + encodeURIComponent(destination));
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill(a.username);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(a.password);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(
    new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"),
  );
  return a;
}
async function mobile(page: Page, info: TestInfo, offset: number) {
  const a = account(info, offset);
  const response = await page.request.post(base + "/auth/sessions", {
    data: { username: a.username, password: a.password },
  });
  expect(response.ok()).toBeTruthy();
  const token = (await response.json()).data.accessToken;
  return { Authorization: "Bearer " + token };
}
test.setTimeout(120000);

test("catalog filters, exact prices, UUID detail, legal, map gate and real empty state", async ({
  page,
}) => {
  const api = await page.request.get(base + "/properties?limit=12");
  const properties = wirePage(await api.json(), "Property");
  await page.goto("/lo-dat");
  await expect(page.locator(".property-card")).toHaveCount(
    properties.data.length,
  );
  await expect(page.locator(".property-card").first()).toContainText(
    properties.data[0]!.title,
  );
  await expect(page.locator(".property-card").first()).toContainText(
    money(properties.data[0]!.priceTotal),
  );
  await page.getByText("Bộ lọc và sắp xếp", { exact: true }).click();
  await page
    .getByLabel("Từ khóa", { exact: true })
    .fill(properties.data[0]!.code);
  await page.getByRole("button", { name: "Áp dụng bộ lọc" }).click();
  await expect(page).toHaveURL(/query=/);
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".property-card")).toHaveCount(1);
  await page
    .getByRole("link", { name: properties.data[0]!.title, exact: true })
    .click();
  await expect(page).toHaveURL("/lo-dat/" + properties.data[0]!.id);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    properties.data[0]!.title,
  );
  await page.getByRole("button", {name:"Pháp lý",exact:true}).click();
  await expect(
    page.getByRole("heading", { name: "Hồ sơ và pháp lý" }),
  ).toBeVisible();
  await page.getByRole("button", {name:"Khu vực",exact:true}).click();
  await page.getByRole("button", { name: "Xem bản đồ khu vực" }).click();
  await expect(page.getByText("Bản đồ hiện chưa sẵn sàng.")).toBeVisible();
  await page.goto("/lo-dat?query=NoSuchProperty__web");
  await expect(
    page.getByText("Không tìm thấy lô đất phù hợp. Hãy điều chỉnh bộ lọc."),
  ).toBeVisible();
  const invalid = await page.goto("/lo-dat/mien-xanh-ven-song");
  expect(invalid?.status()).toBe(404);
  await page.goto("/nft");
  await expect(
    page.getByRole("heading", { name: "Tính năng sắp ra mắt" }),
  ).toBeVisible();
  expect((await page.request.get("/trai-nghiem")).status()).toBe(404);
});

test("same account web/mobile favorites, profile and settings; logout clears personal UI", async ({
  page,
}, info) => {
  const p = fixture().properties[0]!;
  await login(page, info, 0, "/lo-dat/" + p.id);
  const headers = await mobile(page, info, 0);
  await page.getByRole("button", { name: "Lưu lô đất", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "✓ Lưu lô đất", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const saved = wirePage(
    await (
      await page.request.get(base + "/properties?savedOnly=true", { headers })
    ).json(),
    "Property",
  );
  expect(saved.data.map((p) => p.id)).toContain(p.id);
  expect(
    (
      await page.request.delete(base + `/properties/${p.id}/saved`, { headers })
    ).ok(),
  ).toBeTruthy();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Lưu lô đất", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.goto("/tai-khoan");
  await page.getByLabel("Tên hiển thị").fill("Khách web " + info.project.name);
  await page.getByLabel("Điện thoại liên hệ").fill("0912345678");
  await page.getByRole("button", { name: "Lưu hồ sơ" }).click();
  await expect(page.getByRole("status")).toHaveText("Đã cập nhật hồ sơ.");
  const profile = entity(
    (await (await page.request.get(base + "/me/profile", { headers })).json())
      .data,
    "UserProfile",
  );
  expect(profile.displayName).toBe("Khách web " + info.project.name);
  expect(profile.contactPhone).toBe("+84912345678");
  await page.goto("/tai-khoan/cai-dat");
  await page.getByLabel("Tự phát video").check();
  await page.getByRole("button", { name: "Lưu cài đặt" }).click();
  await expect(page.getByRole("status")).toHaveText("Đã lưu cài đặt.");
  expect(
    (await (await page.request.get(base + "/me/settings", { headers })).json())
      .data.feedAutoplay,
  ).toBe(true);
  await page.goto("/tai-khoan");
  const otherTab = await page.context().newPage();
  await otherTab.goto("/da-luu");
  await expect(otherTab.getByRole("heading", { level: 1 })).toHaveText(
    "Nội dung đã lưu",
  );
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await expect(page).toHaveURL("/");
  await expect(
    otherTab.getByRole("heading", { name: "Tiếp tục với tài khoản Xland" }),
  ).toBeVisible();
  await otherTab.close();
  await page.goto("/da-luu");
  await expect(
    page.getByRole("heading", { name: "Tiếp tục với tài khoản Xland" }),
  ).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toMatch(
    /accessToken|xland-user|favorite/,
  );
});

test("support consent, booking review and finance snapshots persist to the shared API", async ({
  page,
}, info) => {
  const f = fixture(),
    id = f.slot.property_id;
  await login(page, info, 1, "/lo-dat/" + id);
  const headers = await mobile(page, info, 1);
  await page.getByRole("button", {name:"Tài chính",exact:true}).click();
  await page
    .locator("#tai-chinh")
    .getByRole("button", { name: "Tính ước tính" })
    .click();
  await expect(
    page.locator("#tai-chinh").getByText("Tổng gốc và lãi", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lưu kế hoạch", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Đã lưu kế hoạch" }),
  ).toBeVisible();
  const plans = wirePage(
    await (
      await page.request.get(base + "/me/finance-plans", { headers })
    ).json(),
    "SavedFinancePlan",
  );
  expect(plans.data).toHaveLength(1);
  expect(plans.data[0]!.result).not.toBeNull();
  await page.goto("/ho-tro?propertyId=" + id);
  await page.getByLabel("Họ và tên").fill("Khách kiểm thử");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0912345678");
  await page
    .getByLabel("Lời nhắn")
    .fill("Tôi muốn tìm hiểu hồ sơ khu vực này.");
  const consent = page.getByRole("checkbox");
  await expect(consent).not.toBeChecked();
  await consent.check();
  await page.getByRole("button", { name: "Gửi yêu cầu", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Đã tiếp nhận yêu cầu.");
  expect(
    wirePage(
      await (
        await page.request.get(base + "/me/support-requests", { headers })
      ).json(),
      "SupportRequest",
    ).data,
  ).toHaveLength(1);
  await page.goto("/lich-hen?propertyId=" + id);
  await page
    .getByRole("combobox", { name: "Khung giờ", exact: true })
    .selectOption(f.slot.id);
  await page.getByLabel("Họ và tên").fill("Khách kiểm thử");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0912345678");
  await page.getByRole("button", { name: "Xem lại yêu cầu" }).click();
  await expect(
    page.getByRole("heading", { name: "Kiểm tra yêu cầu" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Gửi yêu cầu xem đất" }).click();
  await expect(page).toHaveURL(/\/lich-hen\/[0-9a-f-]{36}$/);
  await expect(
    page.getByText("Chờ chính sách đặt cọc", { exact: false }).first(),
  ).toBeVisible();
  const bookings = wirePage(
    await (await page.request.get(base + "/me/bookings", { headers })).json(),
    "Booking",
  );
  expect(bookings.data).toHaveLength(1);
  expect(bookings.data[0]!.status).toBe("awaiting_deposit");
  expect(bookings.data[0]!.confirmedStartsAt).toBeNull();
  const other = await mobile(page, info, 4);
  expect(
    (
      await page.request.get(base + "/bookings/" + bookings.data[0]!.id, {
        headers: other,
      })
    ).status(),
  ).toBe(404);
});

test("ordinary authors, follow, comments, saved video and event registration use server identity", async ({
  page,
}, info) => {
  const f = fixture();
  await login(page, info, 2, "/nguoi-dang/" + f.ordinaryAuthor);
  const headers = await mobile(page, info, 2);
  await expect(
    page.getByText(
      "Người đăng nội dung không mặc nhiên là chủ sở hữu bất động sản.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Theo dõi", exact: true }).click();
  await expect(page.getByRole("button", { name: "✓ Theo dõi" })).toBeVisible();
  expect(
    wirePage(
      await (
        await page.request.get(base + "/me/following", { headers })
      ).json(),
      "PublicAuthor",
    ).data.map((a) => a.id),
  ).toContain(f.ordinaryAuthor);
  await page.goto("/video/" + f.video.id);
  await page.getByRole("button", { name: "Lưu video", exact: true }).click();
  await expect(page.getByRole("button", { name: "✓ Lưu video" })).toBeVisible();
  await page.getByRole("button", { name: /^Bình luận/ }).click();
  await page
    .getByLabel("Bình luận của bạn")
    .fill("Câu hỏi từ website " + info.project.name);
  await page.getByRole("button", { name: "Gửi bình luận" }).click();
  await expect(
    page.getByText("Câu hỏi từ website " + info.project.name, { exact: true }),
  ).toBeVisible();
  const comments = wirePage(
    await (
      await page.request.get(base + "/videos/" + f.video.id + "/comments", {
        headers,
      })
    ).json(),
    "VideoComment",
  );
  const own = comments.data.find((c) => c.author.id === account(info, 2).id)!;
  expect(own.canDelete).toBe(true);
  const other = await mobile(page, info, 4);
  expect(
    (
      await page.request.delete(
        base + `/videos/${f.video.id}/comments/${own.id}`,
        { headers: other },
      )
    ).status(),
  ).toBe(404);
  await page.getByRole("button", { name: "Xóa bình luận của tôi" }).click();
  await expect(page.getByText(own.text, { exact: true })).toHaveCount(0);
  await page.goto("/su-kien/" + f.event.id);
  await page.getByLabel("Họ và tên").fill("Khách sự kiện");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0912345678");
  await page.getByRole("button", { name: "Gửi đăng ký" }).click();
  await expect(page.getByRole("status")).toContainText("Đã tiếp nhận đăng ký");
  const registrations = wirePage(
    await (
      await page.request.get(base + "/me/event-registrations", { headers })
    ).json(),
    "EventRegistration",
  );
  expect(registrations.data).toHaveLength(1);
  expect(registrations.data[0]!.paymentMode).toBe("disabled");
  expect(registrations.data[0]!.status).toBe("pending");
  await page.goto("/cau-lac-bo");
  await expect(page.locator("main h2").first()).toBeVisible();
  const started = entity(
    (await (await page.request.get(base + "/events/" + f.startedEvent)).json())
      .data,
    "XlandEvent",
  );
  const cancelled = entity(
    (
      await (
        await page.request.get(base + "/events/" + f.cancelledEvent)
      ).json()
    ).data,
    "XlandEvent",
  );
  expect(started.status).toBe("closed");
  expect(started.remainingSlots).toBe(0);
  expect(cancelled.status).toBe("cancelled");
  const closed = wirePage(
    await (await page.request.get(base + "/events?status=closed")).json(),
    "XlandEvent",
  );
  expect(closed.data.map((e) => e.id)).toContain(f.startedEvent);
});

test("BFF rejects CSRF and personal leakage; retry creates exactly one support request", async ({
  page,
}, info) => {
  const a = account(info, 3),
    p = fixture().properties[0]!;
  expect((await page.request.get("/api/xland/me/profile")).status()).toBe(401);
  const wrong = await page.request.post("/api/xland/auth/sessions", {
    headers: { Origin: "https://evil.example" },
    data: { username: a.username, password: a.password },
  });
  expect(wrong.status()).toBe(403);
  const response = await page.request.post("/api/xland/auth/sessions", {
    headers: { Origin: origin },
    data: { username: a.username, password: a.password },
  });
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.data.accessToken).toBeUndefined();
  expect(response.headers()["set-cookie"]).toContain("SameSite=lax");
  // Use native browser cookie handling as well as APIRequestContext's jar.
  await login(page, info, 3);
  const cookies = await page.context().cookies();
  const cookie = cookies.find((c) => c.name === "xland_user_session")!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.path).toBe("/");
  expect(cookie.domain).toBe("127.0.0.1");
  // Windows' bundled WebKit ignores SameSite even on a minimal HTTP server.
  // Assert the actual header above and enforce the CSRF boundary in a browser,
  // including engines which send cookies despite that attribute.
  const attack = await page.context().newPage();
  await attack.route("http://localhost:3100/csrf-check", (route) =>
    route.fulfill({
      contentType: "text/html",
        body: `<form action="${origin}/api/xland/support-requests" method="POST" enctype="text/plain"><button>Send cross-site request</button></form>`,
    }),
  );
  await attack.goto("http://localhost:3100/csrf-check");
  const blocked = attack.waitForResponse(
    (r) => r.url() === origin + "/api/xland/support-requests",
  );
  await attack.getByRole("button", { name: "Send cross-site request" }).click();
  expect((await blocked).status()).toBe(403);
  await attack.waitForLoadState('load');
  await attack.unrouteAll({ behavior: 'wait' });
  await attack.goto('about:blank');
  await attack.close();
  expect((await page.request.get("/api/xland/admin/properties")).status()).toBe(
    404,
  );
  expect(
    (await page.request.get("/api/xland/properties?limit=1&limit=2")).status(),
  ).toBe(400);
  const body = {
    propertyId: p.id,
    kind: "legal_review",
    message: "Kiểm tra retry",
    contactName: "Khách retry",
    contactPhone: "0912345678",
    consentToShareContact: true,
  };
  const headers = { Origin: origin, "Idempotency-Key": crypto.randomUUID() };
  const [one, two] = await Promise.all([
    page.request.post("/api/xland/support-requests", { headers, data: body }),
    page.request.post("/api/xland/support-requests", { headers, data: body }),
  ]);
  expect(one.status()).toBe(201);
  expect(two.status()).toBe(201);
  expect((await one.json()).data.id).toBe((await two.json()).data.id);
  expect(
    (
      await page.request.post("/api/xland/support-requests", {
        headers,
        data: { ...body, message: "Nội dung khác" },
      })
    ).status(),
  ).toBe(409);
  const other = await mobile(page, info, 4);
  expect(
    wirePage(
      await (
        await page.request.get(base + "/me/support-requests", {
          headers: other,
        })
      ).json(),
      "SupportRequest",
    ).data,
  ).toHaveLength(0);
  const result = await page.request.get("/api/xland/me/support-requests");
  expect(result.headers()["cache-control"]).toContain("no-store");
  await page.goto("/tai-khoan");
  expect(await page.content()).not.toContain(cookie.value);
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    "xland_user_session",
  );
});

test("responsive layouts, keyboard, reduced motion and accessibility", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/lo-dat");
    await expect(page.locator(".property-card").first()).toBeVisible();
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      client: document.documentElement.clientWidth,
      width: document.documentElement.scrollWidth,
    }));
    expect(layout.viewport).toBe(width);
    expect(layout.width).toBeLessThanOrEqual(layout.client + 1);
    await page.screenshot({
      path: info.outputPath("catalog-" + width + ".png"),
      fullPage: true,
    });
    for (const [name, path] of [
      ["home", "/"],
      ["detail", "/lo-dat/" + fixture().properties[0]!.id],
    ]) {
      await page.goto(path!);
      await expect(page.locator("main h1")).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath(`${name}-${width}.png`),
        fullPage: false,
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 960 });
  await page.goto("/dang-nhap");
  await expect(page.getByLabel("Tên đăng nhập")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await page.goto("/lo-dat");
  await expect(page.locator(".property-card").first()).toBeVisible();
  const catalogAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(catalogAxe.violations).toEqual([]);
});
