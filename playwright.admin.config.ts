import {defineConfig,devices} from "@playwright/test";
import {existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const serverRoot=process.env.XLAND_SERVER_ROOT?resolve(process.env.XLAND_SERVER_ROOT):["../../xland-server","../xland-server","../xland-server/xland-server"].map(p=>resolve(root,p)).find(p=>existsSync(resolve(p,"tests/admin/run-local.mjs")));
if(!serverRoot||!existsSync(resolve(serverRoot,"tests/admin/run-local.mjs")))throw new Error("Không tìm thấy backend QA. Đặt XLAND_SERVER_ROOT thành đường dẫn tuyệt đối tới xland-server.");
export default defineConfig({
  testDir:"./tests/admin",outputDir:"admin-test-results",workers:1,fullyParallel:false,timeout:90000,reporter:"list",
  use:{baseURL:"http://127.0.0.1:3101",trace:"retain-on-failure",...devices["Desktop Chrome"]},
  webServer:[
    {command:"node --import tsx tests/admin/run-local.mjs --serve",cwd:serverRoot,url:"http://127.0.0.1:3006/api/v1/admin-qa-ready",timeout:120000,reuseExistingServer:false},
    {command:"pnpm start --hostname 127.0.0.1 --port 3101",url:"http://127.0.0.1:3101/admin/login",env:{XLAND_ADMIN_API_URL:"http://127.0.0.1:3006/api/v1/admin"},timeout:120000,reuseExistingServer:false},
  ],
});
