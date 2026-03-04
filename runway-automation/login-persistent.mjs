import { chromium } from "playwright";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = join(__dirname, "browser-profile");
const GOOGLE_EMAIL = "michey0495@gmail.com";
const GOOGLE_PASSWORD = "Furea313";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("[login] Launching browser with persistent profile...");
  console.log("[login] Profile dir:", USER_DATA_DIR);

  // Use launchPersistentContext for persistent sessions
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=WebAuthentication,WebAuthenticationConditionalUI,WebOTP",
    ],
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] || (await context.newPage());

  // Check if already logged in
  console.log("[login] Checking login status...");
  await page.goto("https://app.runwayml.com/", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await sleep(3000);

  if (!page.url().includes("login")) {
    console.log("[login] Already logged in! URL:", page.url());
    await page.screenshot({ path: join(__dirname, "persistent-logged-in.png") });
    console.log("[login] Screenshot saved. Ready for image generation.");
    await context.close();
    return;
  }

  console.log("[login] Not logged in, starting Google OAuth...");

  // Start Google OAuth
  const popupPromise = page.waitForEvent("popup", { timeout: 15000 });
  const googleBtn = page.locator(
    'button:has-text("Google"), a:has-text("Google")'
  );
  await googleBtn.first().click();

  const popup = await popupPromise;
  console.log("[login] Google popup opened");
  await popup.waitForLoadState("networkidle");
  await sleep(2000);

  // Enter email
  const emailInput = popup.locator('input[type="email"]');
  if ((await emailInput.count()) > 0 && (await emailInput.isVisible())) {
    console.log("[login] Entering email...");
    await emailInput.click();
    await popup.keyboard.type(GOOGLE_EMAIL, { delay: 50 });
    await sleep(1000);
    await popup.locator("#identifierNext button, #identifierNext").first().click();
    await sleep(5000);
  }

  // Handle passkey challenge
  if (popup.url().includes("challenge/pk")) {
    console.log("[login] Bypassing passkey challenge...");
    await popup.evaluate(() => {
      for (const el of document.querySelectorAll("a, button")) {
        if ((el.textContent || "").includes("別の方法を試す") || (el.textContent || "").includes("Try another way")) {
          el.click();
          return;
        }
      }
    });
    await sleep(3000);
    await popup.getByText("パスワードを入力", { exact: true }).click();
    await sleep(3000);
  }

  // Enter password
  const passwordInput = popup.locator('input[type="password"]');
  if ((await passwordInput.count()) > 0) {
    await passwordInput.waitFor({ state: "visible", timeout: 15000 });
    console.log("[login] Entering password...");
    await passwordInput.click();
    await popup.keyboard.type(GOOGLE_PASSWORD, { delay: 50 });
    await sleep(1000);
    await popup.locator("#passwordNext button, #passwordNext").first().click();
    await sleep(5000);
  }

  // Check for 2FA challenge
  const currentUrl = popup.url();
  if (currentUrl.includes("challenge/selection") || currentUrl.includes("challenge/ipp")) {
    console.log("\n==============================================================");
    console.log("[2FA] 2段階認証が必要です！");
    console.log("[2FA] スマートフォンで「はい」をタップするか、");
    console.log("[2FA] SMSの確認コードを使ってログインを完了してください。");
    console.log("[2FA] ブラウザのポップアップウィンドウを操作してください。");
    console.log("==============================================================\n");

    // Try to click the SMS option automatically
    const smsOption = popup.locator('li:has-text("確認コード"), div:has-text("確認コードを取得")');
    if ((await smsOption.count()) > 0) {
      console.log("[2FA] SMS option found, clicking...");
      await smsOption.first().click();
      await sleep(3000);

      // Check if there's a code input
      const codeInput = popup.locator('input[type="tel"], input[name="idvPin"], input[autocomplete="one-time-code"]');
      if ((await codeInput.count()) > 0) {
        console.log("[2FA] SMS sent! Waiting for code input...");
        console.log("[2FA] The code will be entered when you type it in the popup.");
      }
    }

    // Wait for 2FA to complete (wait for popup to close or redirect)
    console.log("[login] Waiting for 2FA completion (up to 120 seconds)...");
    for (let i = 0; i < 60; i++) {
      if (popup.isClosed()) {
        console.log("[login] Popup closed - 2FA completed!");
        break;
      }

      const url = popup.url();
      if (url.includes("consent") || url.includes("approval")) {
        console.log("[login] Consent page detected, approving...");
        const continueBtn = popup.locator('button:has-text("Continue"), button:has-text("Allow"), button:has-text("許可")');
        if ((await continueBtn.count()) > 0) {
          await continueBtn.first().click();
        }
        await sleep(2000);
      }

      await sleep(2000);
    }
  } else {
    // Wait for popup to close normally
    console.log("[login] Waiting for popup to close...");
    await popup.waitForEvent("close", { timeout: 30000 }).catch(() => {});
  }

  await sleep(5000);

  // Check if login succeeded
  await page.goto("https://app.runwayml.com/", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await sleep(3000);

  const finalUrl = page.url();
  console.log("[login] Final URL:", finalUrl);
  await page.screenshot({ path: join(__dirname, "persistent-final.png") });

  if (!finalUrl.includes("login")) {
    console.log("[login] SUCCESS! Logged in to Runway.");
    console.log("[login] Session saved in browser-profile/");
    console.log("[login] Future runs will reuse this session.");
  } else {
    console.log("[login] FAILED - still on login page.");
  }

  await context.close();
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
