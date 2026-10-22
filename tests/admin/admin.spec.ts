import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {mkdir} from "node:fs/promises";

test("Admin session, forms, persistence, responsive layout and access boundaries",async({page,context,request})=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("/admin");await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Tên đăng nhập").fill("admin");await page.getByLabel("Mật khẩu",{exact:true}).fill("123456");
  await page.getByRole("button",{name:"Đăng nhập",exact:true}).click();await expect(page.getByRole("heading",{name:"Tổng quan hệ thống"})).toBeVisible();
  const cookie=(await context.cookies()).find(c=>c.name==="xland_admin_session");expect(cookie?.httpOnly).toBe(true);expect(cookie?.sameSite).toBe("Strict");
  expect(await page.evaluate(()=>document.cookie)).not.toContain("xland_admin_session");
  const csrf=await request.post("/admin/api/properties",{headers:{Origin:"https://untrusted.example"},data:{title:"invalid"}});expect(csrf.status()).toBe(403);
  const guest=await request.get("/admin/api/overview");expect(guest.status()).toBe(401);
  await mkdir("docs/qa/admin",{recursive:true});
  for(const width of [360,390,430,768,1440]){
    await page.setViewportSize({width,height:960});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.screenshot({path:`docs/qa/admin/overview-${width}.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:"reduce"});
  const accessibility=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();expect(accessibility.violations).toEqual([]);
  await page.goto("/admin/consultants/new");await expect(page.getByRole("heading",{name:"Thêm tư vấn viên"})).toBeVisible();
  const stamp=Date.now();await page.locator("#name").fill(`Tư vấn QA ${stamp}`);await page.locator("#role").fill("Chuyên viên đất nền");await page.locator("#location").fill("Hà Nội");await page.getByLabel("Điện thoại",{exact:true}).fill("0912345678");
  await page.getByRole("button",{name:"Lưu hồ sơ"}).click();await expect(page.getByRole("status")).toContainText("Đã lưu hồ sơ thành công");
  await page.locator("#location").fill("Hà Nội và vùng ven");await page.getByRole("button",{name:"Lưu hồ sơ"}).click();await expect(page.getByRole("button",{name:"Lưu hồ sơ"})).toBeEnabled();
  await page.reload();await expect(page.locator("#location")).toHaveValue("Hà Nội và vùng ven");
  await page.goto("/admin/properties/new");await expect(page.locator("#code")).toBeVisible();
  await page.locator("#code").fill(`UI-${stamp}`);await page.locator("#title").fill("Lô đất kiểm thử giao diện");
  await page.locator("#province_code").selectOption({index:1});await page.locator("#district_code").selectOption({index:1});
  for(const [id,value] of Object.entries({region:"north",category:"residential",land_type:"residential",status:"listed",status_badge:"standard",approval_status:"pending"}))await page.locator(`#${id}`).selectOption(value);
  await page.locator("#price_total").fill("2500000000");await page.locator("#area_m2").fill("120");
  await expect(page.locator("#consultant_id option")).not.toHaveCount(1);await page.locator("#consultant_id").selectOption({index:1});
  await page.locator("#commune_name").fill("Xã Hòa Lạc");await page.getByRole("button",{name:"+ Thêm điểm nổi bật",exact:true}).click();await page.getByLabel("Tiêu đề điểm nổi bật 1").fill("Đường vào rộng");await page.getByLabel("Mô tả điểm nổi bật 1").fill("Khu dân cư");
  await page.getByRole("button",{name:"Lưu hồ sơ"}).click();await expect(page.getByRole("status")).toContainText("Đã lưu hồ sơ thành công");
  await page.screenshot({path:"docs/qa/admin/property-editor-1440.png",fullPage:true});
  const propertyPath=new URL(page.url()).pathname;
  await page.reload();await expect(page.locator("#title")).toHaveValue("Lô đất kiểm thử giao diện");await expect(page.locator("#price_total")).toHaveValue("2500000000");
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:"docs/qa/admin/property-editor-390.png",fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByRole("button",{name:"Mở điều hướng"}).click();await expect(page.getByRole("navigation",{name:"Module quản trị"})).toBeVisible();await page.getByRole("button",{name:"Đóng điều hướng"}).click();
  await page.goto("/admin/videos/new");await expect(page.getByRole("heading",{name:"Tệp video & ảnh bìa"})).toBeVisible();await expect(page.locator("#caption")).toBeVisible();await expect(page.locator("#public_url")).toBeVisible();
  await page.goto("/admin/bookings");await expect(page.getByRole("table")).toBeVisible();await expect(page.getByRole("heading",{name:"Lịch xem thực địa",exact:true})).toBeVisible();
  await page.goto(propertyPath);await expect(page.getByRole("button",{name:"Lưu hồ sơ"})).toBeVisible();
  await page.getByRole("button",{name:"Đăng xuất",exact:true}).click();await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto(propertyPath);await expect(page).toHaveURL(/\/admin\/login/);
  expect(errors).toEqual([]);
});
