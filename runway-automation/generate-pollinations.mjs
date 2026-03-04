import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_DIR = join(__dirname, "..");

const HERO_IMAGES = [
  {
    name: "ai-kaukau",
    savePath: "ai-kaukau/public/images/hero.webp",
    prompt:
      "Futuristic shopping cart floating in cosmic space, emerald green light particles and energy trails, abstract digital art, dark background, cinematic lighting, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-roast",
    savePath: "ai-roast/public/images/hero.webp",
    prompt:
      "Abstract fire and microphone composition, orange and red light rays exploding outward, dark background, dramatic lighting, digital art, cinematic, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-shindan",
    savePath: "ai-shindan/public/images/hero.webp",
    prompt:
      "Brain constellation made of purple nebula and neural network connections, stars forming personality patterns, deep space background, ethereal glow, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-interview",
    savePath: "ai-interview/public/images/hero.webp",
    prompt:
      "Geometric professional human silhouette made of amber golden light, corporate abstract art, dark background, warm lighting, sophisticated, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-catchcopy",
    savePath: "ai-catchcopy/public/images/hero.webp",
    prompt:
      "Exploding typography fragments and letters floating in space, cyan energy waves and light particles, dynamic composition, dark background, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-marshmallow",
    savePath: "ai-marshmallow/public/images/hero.webp",
    prompt:
      "Floating glowing question marks made of soft pink light particles, dreamy atmosphere, marshmallow clouds, dark background, magical, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ai-resbattle",
    savePath: "ai-resbattle/public/images/hero.webp",
    prompt:
      "Two opposing energy forces colliding, red versus blue, dramatic impact explosion in center, dark background, epic battle scene, abstract, 8k quality",
    width: 1920,
    height: 1080,
  },
  {
    name: "ezoai-portal",
    savePath: "ezoai-portal/public/images/hero.webp",
    prompt:
      "Multiple colorful light beams converging to a single point, rainbow spectrum, cosmic energy nexus, dark background, abstract digital art, 8k quality",
    width: 1920,
    height: 1080,
  },
];

const ICON_IMAGES = [
  {
    name: "ai-kaukau-icon",
    savePath: "ai-kaukau/public/images/icon.webp",
    prompt:
      "Minimalist emerald green shopping cart icon, glowing energy, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-roast-icon",
    savePath: "ai-roast/public/images/icon.webp",
    prompt:
      "Minimalist orange fire flame icon, glowing, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-shindan-icon",
    savePath: "ai-shindan/public/images/icon.webp",
    prompt:
      "Minimalist purple brain icon with constellation pattern, glowing, dark background, app icon style, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-interview-icon",
    savePath: "ai-interview/public/images/icon.webp",
    prompt:
      "Minimalist amber briefcase icon, glowing, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-catchcopy-icon",
    savePath: "ai-catchcopy/public/images/icon.webp",
    prompt:
      "Minimalist cyan pen nib icon, glowing, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-marshmallow-icon",
    savePath: "ai-marshmallow/public/images/icon.webp",
    prompt:
      "Minimalist pink question mark icon, soft glow, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ai-resbattle-icon",
    savePath: "ai-resbattle/public/images/icon.webp",
    prompt:
      "Minimalist red and blue crossed swords icon, glowing, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
  {
    name: "ezoai-portal-icon",
    savePath: "ezoai-portal/public/images/icon.webp",
    prompt:
      "Minimalist multicolor converging arrows icon, glowing, dark background, app icon style, clean design, centered",
    width: 512,
    height: 512,
  },
];

const ALL_IMAGES = [...HERO_IMAGES, ...ICON_IMAGES];

async function downloadImage(prompt, width, height, savePath) {
  const fullPath = join(BASE_DIR, savePath);
  const dir = dirname(fullPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(fullPath, buffer);
  return buffer.length;
}

async function main() {
  const startIdx = parseInt(process.argv[2] || "0", 10);
  console.log(`Generating ${ALL_IMAGES.length} images via Pollinations.ai`);
  console.log(`Starting from index ${startIdx}\n`);

  let success = 0;
  let fail = 0;

  for (let i = startIdx; i < ALL_IMAGES.length; i++) {
    const img = ALL_IMAGES[i];
    const fullPath = join(BASE_DIR, img.savePath);

    if (existsSync(fullPath)) {
      console.log(`[${i + 1}/${ALL_IMAGES.length}] SKIP (exists): ${img.name}`);
      success++;
      continue;
    }

    console.log(`[${i + 1}/${ALL_IMAGES.length}] Generating: ${img.name}`);
    console.log(`  Size: ${img.width}x${img.height}`);
    console.log(`  Save: ${img.savePath}`);

    try {
      const size = await downloadImage(img.prompt, img.width, img.height, img.savePath);
      console.log(`  -> OK (${(size / 1024).toFixed(0)} KB)`);
      success++;
    } catch (e) {
      console.log(`  -> FAIL: ${e.message}`);
      fail++;
    }

    // Brief delay to be polite
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone! Success: ${success}, Failed: ${fail}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
