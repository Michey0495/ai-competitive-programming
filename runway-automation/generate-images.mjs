import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_DIR = join(__dirname, "..");
const STATE_FILE = join(__dirname, "auth-state.json");

const GOOGLE_EMAIL = "michey0495@gmail.com";
const GOOGLE_PASSWORD = "Furea313";

// Image generation queue
const HERO_IMAGES = [
  {
    name: "ai-kaukau",
    savePath: "ai-kaukau/public/images/hero.webp",
    prompt:
      "Futuristic shopping cart floating in cosmic space, emerald green light particles and energy trails, abstract digital art, dark background, cinematic lighting, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-roast",
    savePath: "ai-roast/public/images/hero.webp",
    prompt:
      "Abstract fire and microphone composition, orange and red light rays exploding outward, dark background, dramatic lighting, digital art, cinematic, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-shindan",
    savePath: "ai-shindan/public/images/hero.webp",
    prompt:
      "Brain constellation made of purple nebula and neural network connections, stars forming personality patterns, deep space background, ethereal glow, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-interview",
    savePath: "ai-interview/public/images/hero.webp",
    prompt:
      "Geometric professional human silhouette made of amber golden light, corporate abstract art, dark background, warm lighting, sophisticated, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-catchcopy",
    savePath: "ai-catchcopy/public/images/hero.webp",
    prompt:
      "Exploding typography fragments and letters floating in space, cyan energy waves and light particles, dynamic composition, dark background, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-marshmallow",
    savePath: "ai-marshmallow/public/images/hero.webp",
    prompt:
      "Floating glowing question marks made of soft pink light particles, dreamy atmosphere, marshmallow clouds, dark background, magical, 8k",
    ratio: "16:9",
  },
  {
    name: "ai-resbattle",
    savePath: "ai-resbattle/public/images/hero.webp",
    prompt:
      "Two opposing energy forces colliding, red versus blue, dramatic impact explosion in center, dark background, epic battle scene, abstract, 8k",
    ratio: "16:9",
  },
  {
    name: "ezoai-portal",
    savePath: "ezoai-portal/public/images/hero.webp",
    prompt:
      "Multiple colorful light beams converging to a single point, rainbow spectrum, cosmic energy nexus, dark background, abstract digital art, 8k",
    ratio: "16:9",
  },
];

const ICON_IMAGES = [
  {
    name: "ai-kaukau-icon",
    savePath: "ai-kaukau/public/images/icon.webp",
    prompt:
      "Minimalist emerald green shopping cart icon, glowing energy, dark background, app icon style, clean design",
    ratio: "1:1",
  },
  {
    name: "ai-roast-icon",
    savePath: "ai-roast/public/images/icon.webp",
    prompt:
      "Minimalist orange fire flame icon, glowing, dark background, app icon style, clean design",
    ratio: "1:1",
  },
  {
    name: "ai-shindan-icon",
    savePath: "ai-shindan/public/images/icon.webp",
    prompt:
      "Minimalist purple brain icon with constellation pattern, glowing, dark background, app icon style",
    ratio: "1:1",
  },
  {
    name: "ai-interview-icon",
    savePath: "ai-interview/public/images/icon.webp",
    prompt:
      "Minimalist amber briefcase or person silhouette icon, glowing, dark background, app icon style",
    ratio: "1:1",
  },
  {
    name: "ai-catchcopy-icon",
    savePath: "ai-catchcopy/public/images/icon.webp",
    prompt:
      "Minimalist cyan letter A or pen icon, glowing, dark background, app icon style",
    ratio: "1:1",
  },
  {
    name: "ai-marshmallow-icon",
    savePath: "ai-marshmallow/public/images/icon.webp",
    prompt:
      "Minimalist pink question mark icon, soft glow, dark background, app icon style",
    ratio: "1:1",
  },
  {
    name: "ai-resbattle-icon",
    savePath: "ai-resbattle/public/images/icon.webp",
    prompt:
      "Minimalist red and blue crossed swords icon, glowing, dark background, app icon style",
    ratio: "1:1",
  },
  {
    name: "ezoai-portal-icon",
    savePath: "ezoai-portal/public/images/icon.webp",
    prompt:
      "Minimalist multicolor converging arrows icon, glowing, dark background, app icon style",
    ratio: "1:1",
  },
];

const ALL_IMAGES = [...HERO_IMAGES, ...ICON_IMAGES];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function loginToRunway(page) {
  console.log("[login] Navigating to Runway...");
  await page.goto("https://app.runwayml.com/login", {
    waitUntil: "networkidle",
  });
  await sleep(2000);

  // Google OAuth opens in a popup window - listen for it
  const popupPromise = page.waitForEvent("popup", { timeout: 15000 });

  // Click "Sign in with Google" button
  const googleBtn = page.locator(
    'button:has-text("Google"), a:has-text("Google"), [data-testid*="google"]'
  );
  if ((await googleBtn.count()) > 0) {
    console.log("[login] Clicking Google sign-in button...");
    await googleBtn.first().click();
  } else {
    const allLinks = await page.locator("a, button").all();
    for (const link of allLinks) {
      const text = await link.textContent().catch(() => "");
      if (text.toLowerCase().includes("google")) {
        console.log("[login] Found Google link:", text);
        await link.click();
        break;
      }
    }
  }

  // Handle Google OAuth popup
  try {
    const popup = await popupPromise;
    console.log("[login] Google popup opened:", popup.url());
    await popup.waitForLoadState("networkidle");
    await sleep(2000);

    // Take debug screenshot of popup
    await popup.screenshot({
      path: join(__dirname, "popup-1-initial.png"),
    });

    // Enter email - use keyboard.type for more human-like behavior
    const emailInput = popup.locator('input[type="email"]');
    await emailInput.waitFor({ timeout: 10000 });
    console.log("[login] Entering email...");
    await emailInput.click();
    await popup.keyboard.type(GOOGLE_EMAIL, { delay: 50 });
    await sleep(1000);

    await popup.screenshot({
      path: join(__dirname, "popup-2-email-entered.png"),
    });

    // Click Next - try multiple selectors
    const nextBtn = popup.locator("#identifierNext button, #identifierNext, button:has-text('Next'), button:has-text('次へ')");
    console.log("[login] Clicking Next button...");
    await nextBtn.first().click();
    await sleep(5000);

    await popup.screenshot({
      path: join(__dirname, "popup-3-after-next.png"),
    });

    // Check if there's a passkey challenge or verification step
    const currentPopupUrl = popup.url();
    console.log("[login] Current popup URL:", currentPopupUrl);

    // Handle passkey challenge - click "Try another way" / "別の方法を試す"
    if (currentPopupUrl.includes("challenge/pk") || currentPopupUrl.includes("challenge")) {
      console.log("[login] Passkey challenge detected, clicking 'Try another way'...");

      // Wait for page to settle, then use evaluate to click the link via JS
      await sleep(2000);

      // Try clicking via JavaScript to bypass any native dialog overlay
      const clicked = await popup.evaluate(() => {
        const links = document.querySelectorAll("a, button");
        for (const link of links) {
          const text = link.textContent || "";
          if (text.includes("別の方法を試す") || text.includes("Try another way")) {
            link.click();
            return true;
          }
        }
        return false;
      });
      console.log("[login] JS click result:", clicked);
      await sleep(3000);

      await popup.screenshot({
        path: join(__dirname, "popup-3b-other-methods.png"),
      });

      // Check if we're on the method selection page
      const methodPageText = await popup.locator("body").innerText();
      console.log("[login] Method page text:", methodPageText.slice(0, 300));

      // Use Playwright locator to click "パスワードを入力" with proper event dispatch
      const passwordOption = popup.getByText("パスワードを入力", { exact: true });
      if ((await passwordOption.count()) > 0) {
        console.log("[login] Clicking 'パスワードを入力' with Playwright locator...");
        // Wait for navigation after click
        await Promise.all([
          popup.waitForURL(/challenge\/pwd/, { timeout: 10000 }).catch(() => {}),
          passwordOption.click(),
        ]);
        await sleep(3000);
      } else {
        // Fallback: try to find and click via evaluate with dispatchEvent
        console.log("[login] Trying fallback click method...");
        await popup.evaluate(() => {
          const elements = document.querySelectorAll("*");
          for (const el of elements) {
            if (el.childNodes.length === 1 && el.textContent?.trim() === "パスワードを入力") {
              el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
              return;
            }
          }
        });
        await sleep(3000);
      }

      await popup.screenshot({
        path: join(__dirname, "popup-3c-password-page.png"),
      });
      console.log("[login] After password option click, URL:", popup.url());
    }

    // Enter password - wait longer and check for visibility
    const passwordInput = popup.locator('input[type="password"]');
    try {
      await passwordInput.waitFor({ state: "visible", timeout: 20000 });
    } catch {
      console.log("[login] Password input not visible, checking page state...");
      await popup.screenshot({
        path: join(__dirname, "popup-3d-no-password.png"),
      });
      const allInputs = await popup.locator("input").all();
      console.log("[login] Found inputs:", allInputs.length);
      for (const inp of allInputs) {
        const type = await inp.getAttribute("type");
        const name = await inp.getAttribute("name");
        const visible = await inp.isVisible();
        console.log(`  input type=${type} name=${name} visible=${visible}`);
      }
      // Also log all visible text for debugging
      const bodyText = await popup.locator("body").innerText();
      console.log("[login] Page text:", bodyText.slice(0, 500));
      throw new Error("Password input not found");
    }

    console.log("[login] Entering password...");
    await passwordInput.click();
    await popup.keyboard.type(GOOGLE_PASSWORD, { delay: 50 });
    await sleep(1000);

    await popup.screenshot({
      path: join(__dirname, "popup-4-password-entered.png"),
    });

    const passNextBtn = popup.locator("#passwordNext button, #passwordNext, button:has-text('Next'), button:has-text('次へ')");
    await passNextBtn.first().click();
    console.log("[login] Waiting for popup to close...");

    // Wait for popup to close (means auth completed)
    await popup.waitForEvent("close", { timeout: 30000 }).catch(() => {});
    console.log("[login] Popup closed, waiting for Runway to process login...");
    await sleep(5000);

    // Wait for the main page to finish the "Logging in with Google" state
    // The page might redirect to dashboard or stay at the same URL but update content
    for (let i = 0; i < 20; i++) {
      const url = page.url();
      const hasLogin = url.includes("login");
      const bodyText = await page.locator("body").innerText().catch(() => "");
      const isLoggingIn = bodyText.includes("Logging in") || bodyText.includes("ログイン中");

      if (!hasLogin && !isLoggingIn) {
        console.log("[login] Successfully logged in to Runway!");
        break;
      }

      if (i === 19) {
        // Take final debug screenshot
        await page.screenshot({ path: join(__dirname, "login-final-debug.png") });
        console.log("[login] Login may have completed, continuing...");
      }

      console.log(`[login] Waiting for login to complete... (${(i + 1) * 2}s) url=${url.slice(0, 50)}`);
      await sleep(2000);
    }
  } catch (e) {
    console.log("[login] Google OAuth flow issue:", e.message);
    await page.screenshot({
      path: join(__dirname, "login-debug.png"),
    });
    console.log("[login] Main page screenshot saved to login-debug.png");
    throw new Error("Login failed - check login-debug.png and popup-debug.png");
  }
}

async function generateImage(page, prompt, ratio) {
  console.log(`[generate] Navigating to image generation...`);
  await page.goto("https://app.runwayml.com/image-generation", {
    waitUntil: "networkidle",
  });
  await sleep(3000);

  // Take a screenshot to see the current page state
  await page.screenshot({
    path: join(__dirname, "page-state.png"),
  });

  // Look for the prompt input
  const promptInput = page.locator(
    'textarea, [contenteditable="true"], input[placeholder*="prompt" i], input[placeholder*="describe" i]'
  );

  if ((await promptInput.count()) === 0) {
    console.log("[generate] Could not find prompt input, taking screenshot...");
    await page.screenshot({
      path: join(__dirname, "no-input-debug.png"),
    });

    // Try alternative URLs
    const altUrls = [
      "https://app.runwayml.com/create",
      "https://app.runwayml.com/ai-tools/generate",
    ];
    for (const url of altUrls) {
      console.log(`[generate] Trying ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      await sleep(2000);
      if ((await promptInput.count()) > 0) break;
    }
  }

  // Fill the prompt
  const input = promptInput.first();
  await input.click();
  await input.fill(prompt);
  console.log(`[generate] Prompt entered`);

  // Set aspect ratio if there's a ratio selector
  if (ratio === "1:1") {
    const ratioBtn = page.locator(
      'button:has-text("1:1"), [data-value="1:1"]'
    );
    if ((await ratioBtn.count()) > 0) {
      await ratioBtn.first().click();
      await sleep(500);
    }
  } else if (ratio === "16:9") {
    const ratioBtn = page.locator(
      'button:has-text("16:9"), [data-value="16:9"]'
    );
    if ((await ratioBtn.count()) > 0) {
      await ratioBtn.first().click();
      await sleep(500);
    }
  }

  // Click generate button
  const generateBtn = page.locator(
    'button:has-text("Generate"), button:has-text("Create"), button[type="submit"]'
  );
  await generateBtn.first().click();
  console.log(`[generate] Generation started, waiting...`);

  // Wait for image to appear (this could take 30-60 seconds)
  await sleep(10000);

  // Wait for the generated image to appear
  // Look for the result image
  let imageUrl = null;
  for (let i = 0; i < 30; i++) {
    // Check for generated image
    const images = await page
      .locator("img[src*='runway'], img[src*='cdn'], img[src*='blob']")
      .all();
    for (const img of images) {
      const src = await img.getAttribute("src");
      if (src && (src.includes("runway") || src.includes("cdn"))) {
        imageUrl = src;
        break;
      }
    }
    if (imageUrl) break;

    // Also check for download button appearing
    const downloadBtn = page.locator(
      'button:has-text("Download"), a[download], button[aria-label*="download" i]'
    );
    if ((await downloadBtn.count()) > 0) {
      console.log(`[generate] Download button appeared`);
      break;
    }

    console.log(`[generate] Waiting for result... (${(i + 1) * 5}s)`);
    await sleep(5000);
  }

  return imageUrl;
}

async function downloadImage(page, savePath) {
  const fullPath = join(BASE_DIR, savePath);
  const dir = dirname(fullPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // Try to download via the download button
  const downloadBtn = page.locator(
    'button:has-text("Download"), a[download], button[aria-label*="download" i]'
  );

  if ((await downloadBtn.count()) > 0) {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }).catch(() => null),
      downloadBtn.first().click(),
    ]);

    if (download) {
      await download.saveAs(fullPath);
      console.log(`[download] Saved to ${fullPath}`);
      return true;
    }
  }

  // Fallback: find the image and save it directly
  const images = await page
    .locator("img[src*='runway'], img[src*='cdn']")
    .all();
  for (const img of images) {
    const src = await img.getAttribute("src");
    if (src && !src.startsWith("data:")) {
      console.log(`[download] Fetching image from: ${src}`);
      const response = await page.request.get(src);
      const buffer = await response.body();
      writeFileSync(fullPath, buffer);
      console.log(`[download] Saved to ${fullPath}`);
      return true;
    }
  }

  console.log(`[download] Could not download image for ${savePath}`);
  await page.screenshot({
    path: join(__dirname, `download-fail-${Date.now()}.png`),
  });
  return false;
}

async function main() {
  const startIdx = parseInt(process.argv[2] || "0", 10);
  const headless = process.argv.includes("--headless");

  console.log(
    `Starting image generation from index ${startIdx}, headless=${headless}`
  );
  console.log(`Total images to generate: ${ALL_IMAGES.length}`);

  const browser = await chromium.launch({
    headless,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=WebAuthentication,WebAuthenticationConditionalUI,WebOTP",
    ],
  });

  const context = existsSync(STATE_FILE)
    ? await browser.newContext({ storageState: STATE_FILE })
    : await browser.newContext();

  const page = await context.newPage();

  // Check if already logged in
  await page.goto("https://app.runwayml.com/", { waitUntil: "networkidle" });
  await sleep(2000);

  const currentUrl = page.url();
  if (currentUrl.includes("login") || currentUrl.includes("signin")) {
    console.log("[main] Not logged in, performing login...");
    await loginToRunway(page);

    // Save auth state for future runs
    await context.storageState({ path: STATE_FILE });
    console.log("[main] Auth state saved");
  } else {
    console.log("[main] Already logged in!");
  }

  // Generate images
  let successCount = 0;
  let failCount = 0;

  for (let i = startIdx; i < ALL_IMAGES.length; i++) {
    const img = ALL_IMAGES[i];
    const fullPath = join(BASE_DIR, img.savePath);

    if (existsSync(fullPath)) {
      console.log(`[${i}/${ALL_IMAGES.length}] Skip (exists): ${img.name}`);
      successCount++;
      continue;
    }

    console.log(
      `\n[${i}/${ALL_IMAGES.length}] Generating: ${img.name}`
    );
    console.log(`  Prompt: ${img.prompt.slice(0, 80)}...`);
    console.log(`  Ratio: ${img.ratio}`);
    console.log(`  Save: ${img.savePath}`);

    try {
      await generateImage(page, img.prompt, img.ratio);
      const downloaded = await downloadImage(page, img.savePath);
      if (downloaded) {
        successCount++;
        console.log(`  -> Success!`);
      } else {
        failCount++;
        console.log(`  -> Download failed`);
      }
    } catch (e) {
      failCount++;
      console.log(`  -> Error: ${e.message}`);
      await page.screenshot({
        path: join(__dirname, `error-${i}.png`),
      });
    }

    // Save state periodically
    await context.storageState({ path: STATE_FILE });

    // Wait between generations to avoid rate limiting
    await sleep(3000);
  }

  console.log(
    `\nDone! Success: ${successCount}, Failed: ${failCount}`
  );
  await browser.close();
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
