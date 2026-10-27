import {test,expect} from "@playwright/test";
import {readFileSync,mkdirSync} from "node:fs";
import AxeBuilder from "@axe-core/playwright";

test('parent badge, 2x2 children, pagination and recursive detail',async({page},info)=>{
  const {subdivision:s}=JSON.parse(readFileSync('../../xland-server/.local/web-user-acceptance.json','utf8'));
  await page.goto('/lo-dat?query=QA-GARDEN');
  await expect(page.locator('.property-card .subplot-badge')).toHaveText('Nhiều lô đất con');
  await page.locator('.property-card h3 a').click();
  await expect(page).toHaveURL('/lo-dat/'+s.parentId);
  await expect(page.locator('.user-child-grid .property-card')).toHaveCount(4);
  const boxes=await page.locator('.user-child-grid .property-card').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y};}));
  expect(boxes[0]!.y).toBe(boxes[1]!.y);expect(boxes[1]!.x).toBeGreaterThan(boxes[0]!.x);expect(boxes[2]!.y).toBeGreaterThan(boxes[0]!.y);
  await page.getByRole('button',{name:'Trang sau',exact:true}).click();
  await expect(page.locator('.user-child-grid .property-card')).toHaveCount(1);
  await expect(page.locator('.user-child-grid')).toContainText('Đã bán');
  await page.getByRole('button',{name:'Trang trước',exact:true}).click();
  await expect(page.locator('.user-child-grid .property-card')).toHaveCount(4);
  await page.locator('.user-child-grid h3 a').first().click();
  await expect(page).toHaveURL('/lo-dat/'+s.childId);
  await expect(page.locator('.user-child-grid .property-card')).toHaveCount(1);
  await page.locator('.user-child-grid h3 a').click();
  await expect(page).toHaveURL('/lo-dat/'+s.nestedId);
  await page.getByRole('link',{name:'↑ Xem mảnh đất cha'}).click();
  await expect(page).toHaveURL('/lo-dat/'+s.childId);
  await page.goto('/lo-dat/'+s.parentId);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.user-child-grid .property-card')).toHaveCount(4);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  if(info.project.name==='desktop-chromium'){
    mkdirSync('docs/qa/2026-10-27-subplots',{recursive:true});
    for(const width of [360,390,430,768,1440]){
      await page.setViewportSize({width,height:1000});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:`docs/qa/2026-10-27-subplots/user-${width}.png`,fullPage:true});
    }
  }
});
