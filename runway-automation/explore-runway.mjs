import { chromium } from "playwright";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, "auth-state.json");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=WebAuthentication,WebAuthenticationConditionalUI,WebOTP",
    ],
  });

  const context = existsSync(STATE_FILE)
    ? await browser.newContext({ storageState: STATE_FILE })
    : await browser.newContext();

  const page = await context.newPage();

  // Try navigating to the main app page (not login)
  console.log("[explore] Navigating to Runway home...");
  await page.goto("https://app.runwayml.com/", { waitUntil: "networkidle", timeout: 30000 });
  await sleep(3000);
  console.log("[explore] URL:", page.url());
  await page.screenshot({ path: join(__dirname, "explore-1-home.png") });

  // If we're on login page, the saved auth state didn't work
  if (page.url().includes("login")) {
    console.log("[explore] Still on login page. Auth state may be invalid.");

    // Try reloading after a brief wait
    await page.reload({ waitUntil: "networkidle" });
    await sleep(3000);
    console.log("[explore] After reload URL:", page.url());
    await page.screenshot({ path: join(__dirname, "explore-1b-after-reload.png") });
  }

  // Try different URLs
  const urls = [
    "https://app.runwayml.com/dashboard",
    "https://app.runwayml.com/create",
    "https://app.runwayml.com/video/image",
    "https://app.runwayml.com/ai-tools",
    "https://app.runwayml.com/image/generate",
  ];

  for (let i = 0; i < urls.length; i++) {
    console.log(`\n[explore] Trying ${urls[i]}...`);
    await page.goto(urls[i], { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
    await sleep(2000);
    console.log(`[explore] Final URL: ${page.url()}`);
    await page.screenshot({ path: join(__dirname, `explore-${i + 2}-${urls[i].split("/").pop()}.png`) });
  }

  // Check cookies
  const cookies = await context.cookies();
  console.log("\n[explore] Cookies:");
  for (const c of cookies) {
    if (c.domain.includes("runway")) {
      console.log(`  ${c.name}=${c.value.slice(0, 20)}... (domain: ${c.domain})`);
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
