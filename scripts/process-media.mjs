import { chromium } from "@playwright/test";
import { copyFile, mkdir, writeFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";

const brainDir = "C:/Users/HUST/.gemini/antigravity-ide/brain/c05c97c1-4317-46e4-9da9-bc4d5c90cfa8";

const imagesToProcess = [
  {
    id: "ADV-001",
    name: "minh-anh",
    persona: "Nguyễn Minh Anh",
    role: "Chuyên viên khu vực Khánh Hòa",
    srcFile: `${brainDir}/advisor_minh_anh_1791032351963.jpg`,
    destRaw: "assets/media/generated/advisors/minh-anh.jpg",
    destPrompt: "assets/media/generated/advisors/minh-anh.prompt.txt",
    prompt: "Professional headshot portrait of a Vietnamese female real estate advisor named Nguyen Minh Anh, around 29 years old. Warm, friendly and professional smile. Wearing an elegant off-white blouse with a light beige blazer. Natural soft window lighting, neutral blurred indoor architectural background with subtle warm tones. Clean composition, chest-up framing, sharp eye focus, high resolution, realistic skin texture. No logos, no text, no badges, no watermarks.",
    outputs: [
      { path: "public/images/advisors/minh-anh.webp", width: 512, height: 512, quality: 0.85 },
      { path: "public/images/advisors/minh-anh-thumb.webp", width: 128, height: 128, quality: 0.85 },
    ],
  },
  {
    id: "ADV-002",
    name: "hoang-nam",
    persona: "Trần Hoàng Nam",
    role: "Chuyên viên trải nghiệm nhà vườn",
    srcFile: `${brainDir}/advisor_hoang_nam_1791032372693.jpg`,
    destRaw: "assets/media/generated/advisors/hoang-nam.jpg",
    destPrompt: "assets/media/generated/advisors/hoang-nam.prompt.txt",
    prompt: "Professional headshot portrait of a Vietnamese male real estate consultant named Tran Hoang Nam, around 34 years old. Friendly, calm and trustworthy expression with a gentle smile. Wearing a well-fitted smart casual light grey blazer over a soft blue collared shirt. Natural soft daytime lighting, neutral blurred indoor architectural background with subtle warm wooden tones. Clean composition, chest-up framing, sharp eye focus, realistic natural look. No logos, no text, no badges, no watermarks.",
    outputs: [
      { path: "public/images/advisors/hoang-nam.webp", width: 512, height: 512, quality: 0.85 },
      { path: "public/images/advisors/hoang-nam-thumb.webp", width: 128, height: 128, quality: 0.85 },
    ],
  },
  {
    id: "ADV-003",
    name: "thanh-ha",
    persona: "Lê Thanh Hà",
    role: "Chuyên viên khu vực miền Bắc",
    srcFile: `${brainDir}/advisor_thanh_ha_1791032392522.jpg`,
    destRaw: "assets/media/generated/advisors/thanh-ha.jpg",
    destPrompt: "assets/media/generated/advisors/thanh-ha.prompt.txt",
    prompt: "Professional headshot portrait of an experienced Vietnamese female real estate advisor named Le Thanh Ha, around 36 years old. Elegant, confident, approachable and thoughtful expression. Wearing a tailored navy blue blazer over a soft white blouse. Soft natural indoor daylight, clean neutral blurred architectural background. Chest-up framing, sharp eye focus, high quality realistic texture. No logos, no text, no badges, no watermarks.",
    outputs: [
      { path: "public/images/advisors/thanh-ha.webp", width: 512, height: 512, quality: 0.85 },
      { path: "public/images/advisors/thanh-ha-thumb.webp", width: 128, height: 128, quality: 0.85 },
    ],
  },
  {
    id: "ADV-004",
    name: "ngoc-lan",
    persona: "Phạm Ngọc Lan",
    role: "Chuyên viên khu vực Hưng Yên",
    srcFile: `${brainDir}/advisor_ngoc_lan_1791032413542.jpg`,
    destRaw: "assets/media/generated/advisors/ngoc-lan.jpg",
    destPrompt: "assets/media/generated/advisors/ngoc-lan.prompt.txt",
    prompt: "Professional headshot portrait of a modern Vietnamese female property consultant named Pham Ngoc Lan, around 28 years old. Radiant, positive, and polite friendly smile. Wearing an elegant beige cream blazer with a simple white top. Soft natural window light, blurred bright indoor interior background with contemporary architecture feel. Clean chest-up framing, sharp eye focus, natural realistic portrait. No logos, no text, no badges, no watermarks.",
    outputs: [
      { path: "public/images/advisors/ngoc-lan.webp", width: 512, height: 512, quality: 0.85 },
      { path: "public/images/advisors/ngoc-lan-thumb.webp", width: 128, height: 128, quality: 0.85 },
    ],
  },
  {
    id: "STORY-001",
    name: "xland-story",
    persona: "Cảnh quan Xland Story",
    role: "Section giới thiệu Xland",
    srcFile: `${brainDir}/xland_story_1791032440026.jpg`,
    destRaw: "assets/media/generated/story/xland-story.jpg",
    destPrompt: "assets/media/generated/story/xland-story.prompt.txt",
    prompt: "A breathtaking cinematic landscape photograph of Vietnamese countryside and living land with rich depth. Foreground features lush green grass and native trees with soft morning sunlight, midground shows a calm winding river meandering through fertile parcels of green land, and background reveals gentle misty rolling hills under a serene golden hour morning sky. Natural vibrant tones, authentic Vietnamese topography, peaceful ecological living environment. High resolution, professional architectural and landscape photography style. No buildings, no text, no watermarks, no artificial borders.",
    outputs: [
      { path: "public/images/xland-story.webp", width: 1080, height: 1440, quality: 0.82 },
    ],
  },
];

await mkdir("assets/media/generated/advisors", { recursive: true });
await mkdir("assets/media/generated/story", { recursive: true });
await mkdir("public/images/advisors", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

const summary = [];

for (const item of imagesToProcess) {
  // 1. Lưu bản gốc và prompt
  await copyFile(item.srcFile, item.destRaw);
  await writeFile(item.destPrompt, item.prompt, "utf-8");

  // 2. Đọc file ảnh dưới dạng base64
  const rawBuf = readFileSync(item.srcFile);
  const base64Data = rawBuf.toString("base64");
  const mimeType = "image/jpeg";
  const dataUri = `data:${mimeType};base64,${base64Data}`;

  for (const out of item.outputs) {
    const webpBase64 = await page.evaluate(
      async ({ dataUri, width, height, quality }) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/webp", quality);
            resolve(dataUrl.split(",")[1]);
          };
          img.onerror = reject;
          img.src = dataUri;
        });
      },
      { dataUri, width: out.width, height: out.height, quality: out.quality }
    );

    const outBuf = Buffer.from(webpBase64, "base64");
    await writeFile(out.path, outBuf);
    const statRes = await stat(out.path);

    summary.push({
      id: item.id,
      name: item.name,
      file: out.path,
      width: out.width,
      height: out.height,
      bytes: statRes.size,
      kb: (statRes.size / 1024).toFixed(1) + " KB",
    });

    console.log(`[P02] Đã xuất: ${out.path} (${out.width}x${out.height}, ${(statRes.size / 1024).toFixed(1)} KB)`);
  }
}

await browser.close();

console.log("\n=== TỔNG KẾT TÀI NGUYÊN MEDIA P02 ===");
console.table(summary);
