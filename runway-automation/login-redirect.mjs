import { chromium } from "playwright";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(__dirname, "auth-state.json");

const GOOGLE_EMAIL = "michey0495@gmail.com";
const GOOGLE_PASSWORD = "Furea313";

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

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  // Approach 1: Intercept the Google OAuth popup and capture the redirect
  console.log("[login] Navigating to Runway login...");
  await page.goto("https://app.runwayml.com/login", { waitUntil: "networkidle" });
  await sleep(2000);

  // Listen for the popup but also capture the redirect URL
  let oauthToken = null;

  // Intercept requests to capture the google-sign-in-redirect
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("google-sign-in-redirect")) {
      console.log("[login] Captured redirect URL:", url.slice(0, 100));
    }
  });

  const popupPromise = page.waitForEvent("popup", { timeout: 15000 });

  // Click Google login
  const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")');
  await googleBtn.first().click();

  const popup = await popupPromise;
  console.log("[login] Popup opened:", popup.url().slice(0, 80));
  await popup.waitForLoadState("networkidle");
  await sleep(2000);

  // Enter email
  const emailInput = popup.locator('input[type="email"]');
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.click();
  await popup.keyboard.type(GOOGLE_EMAIL, { delay: 50 });
  await sleep(1000);

  // Click Next
  await popup.locator("#identifierNext button, #identifierNext").first().click();
  await sleep(5000);

  // Handle passkey challenge
  const popupUrl = popup.url();
  if (popupUrl.includes("challenge/pk") || popupUrl.includes("challenge")) {
    console.log("[login] Passkey challenge, clicking 'Try another way'...");
    await popup.evaluate(() => {
      const links = document.querySelectorAll("a, button");
      for (const link of links) {
        if ((link.textContent || "").includes("別の方法を試す") || (link.textContent || "").includes("Try another way")) {
          link.click();
          return;
        }
      }
    });
    await sleep(3000);

    // Click password option
    await popup.getByText("パスワードを入力", { exact: true }).click();
    await sleep(3000);
  }

  // Enter password
  const passwordInput = popup.locator('input[type="password"]');
  await passwordInput.waitFor({ state: "visible", timeout: 15000 });
  await passwordInput.click();
  await popup.keyboard.type(GOOGLE_PASSWORD, { delay: 50 });
  await sleep(1000);

  // Before clicking Next, listen for the redirect in the popup
  popup.on("request", (req) => {
    const url = req.url();
    if (url.includes("google-sign-in-redirect") && url.includes("id_token")) {
      oauthToken = url;
      console.log("[login] Captured OAuth redirect with token!");
    }
  });

  // Also listen for response
  popup.on("response", (res) => {
    if (res.url().includes("consent") || res.url().includes("signin")) {
      console.log("[login] Response:", res.url().slice(0, 80), res.status());
    }
  });

  await popup.screenshot({ path: join(__dirname, "redirect-before-submit.png") });

  // Click Next for password
  await popup.locator("#passwordNext button, #passwordNext").first().click();
  console.log("[login] Password submitted, waiting...");
  await sleep(5000);

  // Check if popup still exists
  const popupClosed = popup.isClosed();
  console.log("[login] Popup closed:", popupClosed);

  if (!popupClosed) {
    // Take screenshot of popup
    await popup.screenshot({ path: join(__dirname, "redirect-popup-after.png") });
    console.log("[login] Popup URL:", popup.url());

    // Wait for it to close
    await popup.waitForEvent("close", { timeout: 30000 }).catch(() => {});
  }

  console.log("[login] OAuth token captured:", !!oauthToken);

  // If we captured the redirect URL with token, navigate to it
  if (oauthToken) {
    console.log("[login] Navigating main page to captured redirect URL...");
    await page.goto(oauthToken, { waitUntil: "networkidle", timeout: 30000 });
    await sleep(3000);
  } else {
    // Try reloading the page
    console.log("[login] No token captured, trying page reload...");
    await page.reload({ waitUntil: "networkidle" });
    await sleep(5000);

    // Also try navigating to home
    if (page.url().includes("login")) {
      await page.goto("https://app.runwayml.com/", { waitUntil: "networkidle" });
      await sleep(3000);
    }
  }

  console.log("[login] Final URL:", page.url());
  await page.screenshot({ path: join(__dirname, "redirect-final.png") });

  // Check if logged in
  const loggedIn = !page.url().includes("login");
  console.log("[login] Logged in:", loggedIn);

  if (loggedIn) {
    // Save state
    await context.storageState({ path: STATE_FILE });
    console.log("[login] Auth state saved!");

    // Explore the page
    const bodyText = await page.locator("body").innerText().catch(() => "");
    console.log("[login] Page content preview:", bodyText.slice(0, 300));

    // Look for image generation link
    const links = await page.locator("a").all();
    for (const link of links) {
      const href = await link.getAttribute("href").catch(() => "");
      const text = await link.textContent().catch(() => "");
      if (
        href &&
        (href.includes("image") || href.includes("create") || href.includes("generate") ||
         text.toLowerCase().includes("image") || text.toLowerCase().includes("create"))
      ) {
        console.log(`  Link: ${text.trim()} -> ${href}`);
      }
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
