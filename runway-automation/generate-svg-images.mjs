import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_DIR = join(__dirname, "..");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max));
}

// Generate abstract particle field SVG
function generateHeroSVG(config) {
  const { width, height, primary, secondary, accent, name } = config;
  const particles = [];

  // Background gradient
  const bg = `<defs>
    <radialGradient id="bg1" cx="30%" cy="40%" r="70%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1"/>
    </radialGradient>
    <radialGradient id="bg2" cx="70%" cy="60%" r="60%">
      <stop offset="0%" style="stop-color:${secondary};stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0"/>
    </radialGradient>
    <filter id="blur1"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="20"/></filter>
    <filter id="blur3"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  // Large blurred orbs
  const orbs = [];
  for (let i = 0; i < 5; i++) {
    const x = rand(width * 0.1, width * 0.9);
    const y = rand(height * 0.1, height * 0.9);
    const r = rand(100, 300);
    const color = i % 2 === 0 ? primary : secondary;
    const opacity = rand(0.08, 0.2);
    orbs.push(
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#blur1)"/>`
    );
  }

  // Medium glowing circles
  for (let i = 0; i < 15; i++) {
    const x = rand(0, width);
    const y = rand(0, height);
    const r = rand(20, 80);
    const color = [primary, secondary, accent][i % 3];
    const opacity = rand(0.05, 0.15);
    orbs.push(
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#blur2)"/>`
    );
  }

  // Small bright particles
  for (let i = 0; i < 60; i++) {
    const x = rand(0, width);
    const y = rand(0, height);
    const r = rand(1, 4);
    const color = [primary, secondary, accent, "#ffffff"][i % 4];
    const opacity = rand(0.3, 0.9);
    particles.push(
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#glow)"/>`
    );
  }

  // Connecting lines (constellation style)
  const lines = [];
  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push({ x: rand(0, width), y: rand(0, height) });
  }
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (dist < 300) {
        const opacity = (1 - dist / 300) * 0.15;
        lines.push(
          `<line x1="${points[i].x}" y1="${points[i].y}" x2="${points[j].x}" y2="${points[j].y}" stroke="${accent}" stroke-width="0.5" opacity="${opacity}"/>`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${bg}
  <rect width="${width}" height="${height}" fill="#000000"/>
  <rect width="${width}" height="${height}" fill="url(#bg1)"/>
  <rect width="${width}" height="${height}" fill="url(#bg2)"/>
  ${orbs.join("\n  ")}
  ${lines.join("\n  ")}
  ${particles.join("\n  ")}
</svg>`;
}

// Generate minimalist icon SVG
function generateIconSVG(config) {
  const { primary, secondary, accent, shape } = config;
  const size = 512;
  const center = size / 2;

  let shapeElements = "";

  switch (shape) {
    case "cart":
      shapeElements = `
        <path d="M160 180 L200 180 L220 320 L380 320 L400 200 L240 200" fill="none" stroke="${primary}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
        <circle cx="250" cy="370" r="20" fill="${primary}" filter="url(#glow)"/>
        <circle cx="360" cy="370" r="20" fill="${primary}" filter="url(#glow)"/>`;
      break;
    case "flame":
      shapeElements = `
        <path d="M256 100 C256 100 180 200 180 300 C180 360 210 400 256 420 C302 400 332 360 332 300 C332 200 256 100 256 100 Z" fill="${primary}" opacity="0.8" filter="url(#glow)"/>
        <path d="M256 180 C256 180 220 240 220 310 C220 350 235 380 256 390 C277 380 292 350 292 310 C292 240 256 180 256 180 Z" fill="${secondary}" opacity="0.6" filter="url(#glow)"/>`;
      break;
    case "brain":
      shapeElements = `
        <ellipse cx="220" cy="240" rx="80" ry="100" fill="none" stroke="${primary}" stroke-width="6" filter="url(#glow)"/>
        <ellipse cx="292" cy="240" rx="80" ry="100" fill="none" stroke="${primary}" stroke-width="6" filter="url(#glow)"/>
        <path d="M256 140 L256 380" stroke="${secondary}" stroke-width="4" opacity="0.5"/>
        <circle cx="200" cy="200" r="4" fill="${accent}" filter="url(#glow)"/>
        <circle cx="312" cy="200" r="4" fill="${accent}" filter="url(#glow)"/>
        <circle cx="230" cy="280" r="3" fill="${accent}" filter="url(#glow)"/>
        <circle cx="282" cy="280" r="3" fill="${accent}" filter="url(#glow)"/>
        <line x1="200" y1="200" x2="230" y2="280" stroke="${accent}" stroke-width="1" opacity="0.5"/>
        <line x1="312" y1="200" x2="282" y2="280" stroke="${accent}" stroke-width="1" opacity="0.5"/>`;
      break;
    case "briefcase":
      shapeElements = `
        <rect x="160" y="200" width="192" height="140" rx="12" fill="none" stroke="${primary}" stroke-width="8" filter="url(#glow)"/>
        <path d="M220 200 L220 170 C220 155 230 145 245 145 L267 145 C282 145 292 155 292 170 L292 200" fill="none" stroke="${primary}" stroke-width="6" filter="url(#glow)"/>
        <line x1="160" y1="260" x2="352" y2="260" stroke="${secondary}" stroke-width="4" opacity="0.5"/>`;
      break;
    case "pen":
      shapeElements = `
        <path d="M320 140 L370 190 L220 340 L170 350 L180 300 Z" fill="none" stroke="${primary}" stroke-width="8" stroke-linejoin="round" filter="url(#glow)"/>
        <line x1="280" y1="180" x2="330" y2="230" stroke="${secondary}" stroke-width="4" opacity="0.5"/>`;
      break;
    case "question":
      shapeElements = `
        <text x="256" y="320" font-family="Georgia,serif" font-size="240" fill="${primary}" text-anchor="middle" filter="url(#glow)">?</text>`;
      break;
    case "swords":
      shapeElements = `
        <line x1="140" y1="140" x2="372" y2="372" stroke="#ef4444" stroke-width="10" stroke-linecap="round" filter="url(#glow)"/>
        <line x1="372" y1="140" x2="140" y2="372" stroke="#3b82f6" stroke-width="10" stroke-linecap="round" filter="url(#glow)"/>
        <circle cx="256" cy="256" r="20" fill="#ffffff" opacity="0.3" filter="url(#blur2)"/>`;
      break;
    case "arrows":
      shapeElements = `
        <line x1="100" y1="256" x2="256" y2="256" stroke="#ef4444" stroke-width="6" filter="url(#glow)"/>
        <line x1="412" y1="256" x2="256" y2="256" stroke="#3b82f6" stroke-width="6" filter="url(#glow)"/>
        <line x1="256" y1="100" x2="256" y2="256" stroke="#10b981" stroke-width="6" filter="url(#glow)"/>
        <line x1="256" y1="412" x2="256" y2="256" stroke="#f59e0b" stroke-width="6" filter="url(#glow)"/>
        <line x1="140" y1="140" x2="256" y2="256" stroke="#8b5cf6" stroke-width="4" filter="url(#glow)"/>
        <line x1="372" y1="372" x2="256" y2="256" stroke="#ec4899" stroke-width="4" filter="url(#glow)"/>
        <circle cx="256" cy="256" r="16" fill="#ffffff" opacity="0.8" filter="url(#glow)"/>`;
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <radialGradient id="bg1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1"/>
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="20"/></filter>
  </defs>
  <rect width="${size}" height="${size}" fill="#000000"/>
  <rect width="${size}" height="${size}" fill="url(#bg1)"/>
  <circle cx="${center}" cy="${center}" r="180" fill="${primary}" opacity="0.05" filter="url(#blur2)"/>
  ${shapeElements}
</svg>`;
}

const CONFIGS = {
  heroes: [
    { name: "ai-kaukau", savePath: "ai-kaukau/public/images/hero.svg", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
    { name: "ai-roast", savePath: "ai-roast/public/images/hero.svg", primary: "#f97316", secondary: "#ef4444", accent: "#fbbf24" },
    { name: "ai-shindan", savePath: "ai-shindan/public/images/hero.svg", primary: "#8b5cf6", secondary: "#6d28d9", accent: "#c4b5fd" },
    { name: "ai-interview", savePath: "ai-interview/public/images/hero.svg", primary: "#f59e0b", secondary: "#d97706", accent: "#fcd34d" },
    { name: "ai-catchcopy", savePath: "ai-catchcopy/public/images/hero.svg", primary: "#06b6d4", secondary: "#0891b2", accent: "#67e8f9" },
    { name: "ai-marshmallow", savePath: "ai-marshmallow/public/images/hero.svg", primary: "#ec4899", secondary: "#db2777", accent: "#f9a8d4" },
    { name: "ai-resbattle", savePath: "ai-resbattle/public/images/hero.svg", primary: "#ef4444", secondary: "#3b82f6", accent: "#ffffff" },
    { name: "ezoai-portal", savePath: "ezoai-portal/public/images/hero.svg", primary: "#8b5cf6", secondary: "#06b6d4", accent: "#f59e0b" },
  ],
  icons: [
    { name: "ai-kaukau-icon", savePath: "ai-kaukau/public/images/icon.svg", primary: "#10b981", secondary: "#059669", accent: "#34d399", shape: "cart" },
    { name: "ai-roast-icon", savePath: "ai-roast/public/images/icon.svg", primary: "#f97316", secondary: "#fbbf24", accent: "#ef4444", shape: "flame" },
    { name: "ai-shindan-icon", savePath: "ai-shindan/public/images/icon.svg", primary: "#8b5cf6", secondary: "#c4b5fd", accent: "#e9d5ff", shape: "brain" },
    { name: "ai-interview-icon", savePath: "ai-interview/public/images/icon.svg", primary: "#f59e0b", secondary: "#fcd34d", accent: "#d97706", shape: "briefcase" },
    { name: "ai-catchcopy-icon", savePath: "ai-catchcopy/public/images/icon.svg", primary: "#06b6d4", secondary: "#67e8f9", accent: "#22d3ee", shape: "pen" },
    { name: "ai-marshmallow-icon", savePath: "ai-marshmallow/public/images/icon.svg", primary: "#ec4899", secondary: "#f9a8d4", accent: "#fce7f3", shape: "question" },
    { name: "ai-resbattle-icon", savePath: "ai-resbattle/public/images/icon.svg", primary: "#ef4444", secondary: "#3b82f6", accent: "#ffffff", shape: "swords" },
    { name: "ezoai-portal-icon", savePath: "ezoai-portal/public/images/icon.svg", primary: "#8b5cf6", secondary: "#06b6d4", accent: "#f59e0b", shape: "arrows" },
  ],
};

function main() {
  let success = 0;
  const total = CONFIGS.heroes.length + CONFIGS.icons.length;

  // Generate hero images
  for (const config of CONFIGS.heroes) {
    const fullPath = join(BASE_DIR, config.savePath);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const svg = generateHeroSVG({
      width: 1920,
      height: 1080,
      ...config,
    });
    writeFileSync(fullPath, svg);
    const sizeKB = (Buffer.byteLength(svg) / 1024).toFixed(1);
    console.log(`[${++success}/${total}] Hero: ${config.name} (${sizeKB} KB)`);
  }

  // Generate icon images
  for (const config of CONFIGS.icons) {
    const fullPath = join(BASE_DIR, config.savePath);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const svg = generateIconSVG(config);
    writeFileSync(fullPath, svg);
    const sizeKB = (Buffer.byteLength(svg) / 1024).toFixed(1);
    console.log(`[${++success}/${total}] Icon: ${config.name} (${sizeKB} KB)`);
  }

  console.log(`\nDone! Generated ${success}/${total} images`);
}

main();
