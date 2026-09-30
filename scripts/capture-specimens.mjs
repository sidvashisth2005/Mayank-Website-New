// Captures every sample product's screens from the image studio.
//
//   1. npm run build
//   2. MAYANK_STUDIO=1 npx next start -p 3100
//   3. node scripts/capture-specimens.mjs            (needs Playwright installed)
//
// Output: public/assets/<slug>/1.jpg, 2.jpg, 3.jpg

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const base = process.env.STUDIO_URL ?? "http://localhost:3100";
const studioSource = fs.readFileSync(path.join("lib", "catalogue", "studio.ts"), "utf8");
const slugs = [...studioSource.matchAll(/^\s+"?([a-z-]+)"?: \{ kind:/gm)].map((match) => match[1]);
const only = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const slug of slugs.filter((item) => !only || item === only)) {
  const dir = path.join("public", "assets", slug);
  fs.mkdirSync(dir, { recursive: true });
  for (const view of [0, 1, 2]) {
    const response = await page.goto(`${base}/studio/${slug}?view=${view}`, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`${slug} view ${view}: HTTP ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, `${view + 1}.jpg`), type: "jpeg", quality: 84, clip: { x: 0, y: 0, width: 1600, height: 1000 } });
  }
  console.log(`captured ${slug}`);
}
await browser.close();
