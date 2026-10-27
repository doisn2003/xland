import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';

for(const entity of ['clubs','events'] as const){
  test(`${entity} creation stays responsive, saves and navigates without a reload loop`,async({page})=>{
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto('/admin/login');
    await page.getByLabel('Tên đăng nhập').fill('admin');
    await page.getByLabel('Mật khẩu',{exact:true}).fill('123456');
    await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
    await expect(page).not.toHaveURL(/login/);
    await page.goto(`/admin/${entity}/new`);
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('.admin-refreshing')).toHaveCount(0);

    const title=`Kiểm tra ${entity} ${Date.now()}`;
    await page.locator('#title').pressSequentially(title,{delay:10});
    await page.locator(entity==='clubs'?'#activities':'#tags').fill('Kết nối cộng đồng\nGặp gỡ trực tiếp');
    await page.locator('#is_illustrative').check();
    // A later input must still work after React's effects and async loading settle.
    await page.waitForTimeout(500);
    await page.locator('#title').press('End');
    await page.locator('#title').pressSequentially(' ✓');
    await expect(page.locator('#title')).toHaveValue(title+' ✓');
    expect(errors).toEqual([]);

    await page.locator('#media').getByRole('button',{name:'+ Thêm mục',exact:true}).click();
    await page.locator('#media').getByLabel('Mô tả 1',{exact:true}).fill('Ảnh hoạt động');
    await page.locator('#media').getByRole('button',{name:'Xóa mục 1',exact:true}).click();
    if(entity==='clubs'){
      await page.locator('#summary').fill('Câu lạc bộ kết nối thành viên.');
      await page.locator('#description').fill('Thông tin kiểm thử trên database QA cô lập.');
      await page.locator('#region_label').fill('Quảng Ninh');
    }else{
      const date=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
      await page.locator('#starts_at').fill(`${date}T09:00`);
      await page.locator('#ends_at').fill(`${date}T10:00`);
      await page.locator('#venue_name').fill('Không gian cộng đồng');
      await page.locator('#address').fill('Quảng Ninh');
      await page.locator('#max_slots').fill('30');
      await page.locator('#duration_mins').fill('60');
      await page.locator('#ticket_price').fill('0');
      await page.locator('#status').selectOption('open');
      await page.locator('#benefits').getByRole('button',{name:'+ Thêm mục',exact:true}).click();
      await page.locator('#benefits').getByLabel('Tiêu đề 1',{exact:true}).fill('Gặp gỡ thành viên');
      await page.locator('#benefits').getByLabel('Mô tả 1',{exact:true}).fill('Chia sẻ kinh nghiệm.');
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    mkdirSync('docs/qa/2026-10-27-community-freeze',{recursive:true});
    for(const width of [360,390,430,768,1440]){
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0);});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:`docs/qa/2026-10-27-community-freeze/${entity}-${width}.png`,fullPage:true});
    }
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    const created=page.waitForResponse(response=>response.url().endsWith(`/admin/api/${entity}`)&&response.request().method()==='POST');
    await page.getByRole('button',{name:'Lưu hồ sơ',exact:true}).click();
    const response=await created;expect(response.status()).toBe(201);
    const {data}=await response.json();expect(data.title).toBe(title+' ✓');
    expect(data[entity==='clubs'?'activities':'tags']).toEqual(['Kết nối cộng đồng','Gặp gỡ trực tiếp']);
    await expect(page).toHaveURL(new RegExp(`/admin/${entity}/${data.id}`));
    await page.reload();
    const saved=await page.request.get(`/admin/api/${entity}/${data.id}`);
    expect(saved.status()).toBe(200);expect((await saved.json()).data.title).toBe(title+' ✓');

    // Exercise client navigation, cached metadata and another previously affected form.
    await page.getByRole('navigation',{name:'Module quản trị'}).getByRole('link',{name:'Tư vấn viên',exact:true}).click();
    await page.getByRole('link',{name:'+ Thêm mới',exact:true}).click();
    await page.locator('#name').fill('Kiểm tra điều hướng');
    await expect(page.locator('#name')).toHaveValue('Kiểm tra điều hướng');
    await expect(page.locator('.admin-refreshing')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
