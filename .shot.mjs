import puppeteer from "puppeteer-core";
import fs from "node:fs";
const OUT = process.argv[2];
const RUTA = "/" + (process.argv[3] || "");
const W = Number(process.argv[4] || 1440), H = Number(process.argv[5] || 900);
const shots = (process.argv[6] || "0").split(",").map(Number);
const mobile = process.argv[7] === "m";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true, args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, isMobile: mobile, hasTouch: mobile });
page.on("pageerror", e => console.log("[pageerror]", String(e).slice(0, 300)));
page.on("requestfailed", r => console.log("[reqfail]", r.url().slice(-60), r.failure()?.errorText));
await page.goto("http://localhost:5173" + RUTA, { waitUntil: "networkidle2", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 2600));
fs.mkdirSync(OUT, { recursive: true });
for (const y of shots) {
  await page.evaluate(yy => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/y${y}.png` });
  console.log("shot", y);
}
await browser.close();
