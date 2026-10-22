import {defineConfig,devices} from "@playwright/test";
export default defineConfig({
  testDir:"./tests/admin",outputDir:"admin-test-results",workers:1,fullyParallel:false,timeout:90000,reporter:"list",
  use:{baseURL:"http://127.0.0.1:3101",trace:"retain-on-failure",...devices["Desktop Chrome"]},
  webServer:[
    {command:"node --import tsx tests/admin/run-local.mjs --serve",cwd:"../../xland-server",url:"http://127.0.0.1:3006/api/v1/admin-qa-ready",timeout:120000,reuseExistingServer:true},
    {command:"pnpm start --hostname 127.0.0.1 --port 3101",url:"http://127.0.0.1:3101/admin/login",env:{XLAND_ADMIN_API_URL:"http://127.0.0.1:3006/api/v1/admin"},timeout:120000,reuseExistingServer:false},
  ],
});
