import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
import AxeBuilder from '@axe-core/playwright';

test('subdivision studio creates inherited child and opens full property editor',async({page})=>{
  const {parentId}=JSON.parse(readFileSync('../../xland-server/.local/admin-tests/subplots.json','utf8'));
  await page.goto('/admin/login');
  await page.getByLabel('Tên đăng nhập').fill('admin');await page.getByLabel('Mật khẩu',{exact:true}).fill('123456');
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
  await expect(page).not.toHaveURL(/login/);
  await page.goto('/admin/properties/'+parentId);
  await expect(page.getByRole('heading',{name:'Một hồ sơ, nhiều lô đất'})).toBeVisible();
  await expect(page.getByRole('switch',{name:'Nhiều lô đất con'})).toHaveAttribute('aria-checked','true');
  await page.getByLabel('Mã lô con',{exact:true}).fill('WEB-CHILD-'+Date.now());
  await page.getByLabel('Tên lô con',{exact:true}).fill('Lô góc kiểm thử studio');
  await page.getByLabel('Diện tích lô con (m²)',{exact:true}).fill('80');
  await page.getByLabel('Giá lô con (VNĐ)',{exact:true}).fill('9007199254740993');
  await page.getByLabel('Lô góc',{exact:true}).check();
  await page.getByRole('button',{name:'Tạo lô con',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Đã tạo');
  await expect(page.locator('.admin-subdivision-stats')).toContainText('20 m²');
  mkdirSync('docs/qa/2026-10-27-subplots',{recursive:true});
  for(const width of [360,390,430,768,1440]){
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`docs/qa/2026-10-27-subplots/admin-${width}.png`,fullPage:true});
  }
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.getByRole('link',{name:'Mở hồ sơ để chỉnh sửa và duyệt →'}).click();
  await expect(page.getByRole('heading',{name:'Lô góc kiểm thử studio',exact:true})).toBeVisible();
  await expect(page.locator('#price_total')).toHaveValue('9007199254740993');
  await expect(page.locator('#approval_status')).toHaveValue('pending');
  await page.getByRole('switch',{name:'Nhiều lô đất con'}).click();
  await expect(page.getByRole('heading',{name:'Một hồ sơ, nhiều lô đất'})).toBeVisible();
});
