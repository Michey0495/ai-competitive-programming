import * as cheerio from "cheerio";
import type {
  CategoryResult,
  ScanFinding,
  ScanRecommendation,
} from "@/types";
import { AI_BOTS } from "@/types";

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AEOChecker/1.0; +https://aeo.ezoai.jp)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.text();
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AEOChecker/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

function getBaseUrl(url: string): string {
  const u = new URL(url);
  return `${u.protocol}//${u.host}`;
}

// --- Category Scanners ---

export async function checkLlmsTxt(
  baseUrl: string
): Promise<CategoryResult> {
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  const content = await fetchText(`${baseUrl}/llms.txt`);

  if (!content) {
    findings.push({ status: "fail", message: "llms.txt が見つかりません" });
    recommendations.push({
      priority: "high",
      message: "llms.txt をルートに設置してください",
      code: "# サイト名\n> サイトの説明\n\n## ページ一覧\n- /path: ページの説明",
    });
  } else {
    findings.push({ status: "pass", message: "llms.txt が存在します" });
    score += 5;

    if (content.startsWith("#")) {
      findings.push({
        status: "pass",
        message: "正しいフォーマット(#見出し)で記述されています",
      });
      score += 5;
    } else {
      findings.push({
        status: "warn",
        message: "フォーマットが標準的ではありません",
      });
      recommendations.push({
        priority: "medium",
        message: "llms.txtは # 見出しで始めてください",
      });
      score += 2;
    }

    if (content.length > 200) {
      findings.push({
        status: "pass",
        message: "十分な情報量があります",
      });
      score += 5;
    } else {
      findings.push({
        status: "warn",
        message: "内容が少ないです（200文字未満）",
      });
      recommendations.push({
        priority: "medium",
        message:
          "サイトの概要、主要ページ一覧、APIの説明などを追加してください",
      });
      score += 2;
    }
  }

  return {
    key: "llms_txt",
    label: "llms.txt",
    score,
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkRobotsTxt(
  baseUrl: string
): Promise<CategoryResult> {
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  const content = await fetchText(`${baseUrl}/robots.txt`);

  if (!content) {
    findings.push({ status: "fail", message: "robots.txt が見つかりません" });
    recommendations.push({
      priority: "high",
      message: "robots.txt を設置してAIクローラーを許可してください",
    });
  } else {
    findings.push({ status: "pass", message: "robots.txt が存在します" });
    score += 3;

    const lower = content.toLowerCase();

    // Check for sitemap
    if (lower.includes("sitemap:")) {
      findings.push({ status: "pass", message: "Sitemap指定があります" });
      score += 2;
    } else {
      findings.push({ status: "warn", message: "Sitemap指定がありません" });
      recommendations.push({
        priority: "medium",
        message: "robots.txtにSitemap: URLを追加してください",
      });
    }

    // Check if AI bots are blocked
    const blockedBots: string[] = [];
    const allowedBots: string[] = [];

    for (const bot of AI_BOTS) {
      const botLower = bot.toLowerCase();
      const hasDisallow =
        lower.includes(`user-agent: ${botLower}`) &&
        lower.includes("disallow: /");
      if (hasDisallow) {
        blockedBots.push(bot);
      } else {
        allowedBots.push(bot);
      }
    }

    if (blockedBots.length === 0) {
      findings.push({
        status: "pass",
        message: "AIクローラーがブロックされていません",
      });
      score += 5;
    } else {
      findings.push({
        status: "fail",
        message: `ブロックされているAIボット: ${blockedBots.join(", ")}`,
      });
      recommendations.push({
        priority: "high",
        message: `${blockedBots.join(", ")} のDisallow設定を解除してください`,
      });
      score += Math.max(0, 5 - blockedBots.length);
    }

    // Check for wildcard allow
    if (
      lower.includes("user-agent: *") &&
      !lower.match(/user-agent: \*[\s\S]*?disallow: \/\s*$/m)
    ) {
      findings.push({
        status: "pass",
        message: "全クローラーにアクセスが許可されています",
      });
      score += 5;
    } else {
      score += 3;
    }
  }

  return {
    key: "robots_txt",
    label: "robots.txt AI対応",
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkStructuredData(
  html: string
): Promise<CategoryResult> {
  const $ = cheerio.load(html);
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  const jsonLdScripts = $('script[type="application/ld+json"]');

  if (jsonLdScripts.length === 0) {
    findings.push({
      status: "fail",
      message: "JSON-LD構造化データが見つかりません",
    });
    recommendations.push({
      priority: "high",
      message: "Schema.orgのJSON-LDを追加してください",
      code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "サイト名",\n  "url": "https://example.com"\n}\n</script>',
    });
  } else {
    findings.push({
      status: "pass",
      message: `JSON-LD構造化データが${jsonLdScripts.length}件見つかりました`,
    });
    score += 5;

    let hasOrg = false;
    let hasFaq = false;

    jsonLdScripts.each((_, el) => {
      try {
        const data = JSON.parse($(el).text());
        const type = data["@type"] || "";
        if (type === "Organization" || type === "WebSite") hasOrg = true;
        if (type === "FAQPage") hasFaq = true;
      } catch {
        // ignore parse errors
      }
    });

    if (hasOrg) {
      findings.push({
        status: "pass",
        message: "Organization/WebSite構造化データがあります",
      });
      score += 5;
    } else {
      findings.push({
        status: "warn",
        message: "Organization/WebSite構造化データがありません",
      });
      recommendations.push({
        priority: "medium",
        message: "WebSiteまたはOrganizationのJSON-LDを追加してください",
      });
      score += 2;
    }

    if (hasFaq) {
      findings.push({
        status: "pass",
        message: "FAQPage構造化データがあります",
      });
      score += 5;
    } else {
      findings.push({
        status: "warn",
        message: "FAQPage構造化データがありません",
      });
      recommendations.push({
        priority: "low",
        message:
          "よくある質問がある場合、FAQPage構造化データの追加を検討してください",
      });
      score += 2;
    }
  }

  return {
    key: "structured_data",
    label: "構造化データ",
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkMetaTags(
  html: string,
  url: string
): Promise<CategoryResult> {
  const $ = cheerio.load(html);
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  // Title
  const title = $("title").text().trim();
  if (title && title.length > 0) {
    findings.push({
      status: title.length >= 10 && title.length <= 70 ? "pass" : "warn",
      message: `title: "${title}" (${title.length}文字)`,
    });
    score += title.length >= 10 && title.length <= 70 ? 4 : 2;
  } else {
    findings.push({ status: "fail", message: "titleタグがありません" });
    recommendations.push({
      priority: "high",
      message: "10-70文字のtitleタグを設定してください",
    });
  }

  // Description
  const desc =
    $('meta[name="description"]').attr("content")?.trim() ?? "";
  if (desc.length > 0) {
    findings.push({
      status: desc.length >= 50 && desc.length <= 160 ? "pass" : "warn",
      message: `description: ${desc.length}文字`,
    });
    score += desc.length >= 50 && desc.length <= 160 ? 3 : 1;
  } else {
    findings.push({
      status: "fail",
      message: "meta descriptionがありません",
    });
    recommendations.push({
      priority: "high",
      message: "50-160文字のmeta descriptionを設定してください",
    });
  }

  // OGP
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;

  if (ogCount === 3) {
    findings.push({ status: "pass", message: "OGPタグが完備されています" });
    score += 4;
  } else if (ogCount > 0) {
    findings.push({
      status: "warn",
      message: `OGPタグが不完全です (${ogCount}/3)`,
    });
    score += 2;
    recommendations.push({
      priority: "medium",
      message: "og:title, og:description, og:image をすべて設定してください",
    });
  } else {
    findings.push({ status: "fail", message: "OGPタグがありません" });
    recommendations.push({
      priority: "high",
      message: "OGP(Open Graph Protocol)タグを追加してください",
    });
  }

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) {
    findings.push({ status: "pass", message: "canonical URLが設定されています" });
    score += 4;
  } else {
    findings.push({
      status: "warn",
      message: "canonical URLがありません",
    });
    recommendations.push({
      priority: "medium",
      message: `<link rel="canonical" href="${url}" /> を追加してください`,
    });
    score += 1;
  }

  return {
    key: "meta_tags",
    label: "メタタグ",
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkContentStructure(
  html: string
): Promise<CategoryResult> {
  const $ = cheerio.load(html);
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  // H1
  const h1Count = $("h1").length;
  if (h1Count === 1) {
    findings.push({ status: "pass", message: "H1タグが1つあります" });
    score += 3;
  } else if (h1Count > 1) {
    findings.push({
      status: "warn",
      message: `H1タグが${h1Count}個あります（1つが推奨）`,
    });
    score += 1;
  } else {
    findings.push({ status: "fail", message: "H1タグがありません" });
    recommendations.push({
      priority: "high",
      message: "ページにH1タグを1つ追加してください",
    });
  }

  // Heading hierarchy
  const headings = $("h1, h2, h3, h4, h5, h6");
  if (headings.length >= 3) {
    findings.push({
      status: "pass",
      message: `見出しが${headings.length}個あります`,
    });
    score += 3;
  } else if (headings.length > 0) {
    findings.push({
      status: "warn",
      message: `見出しが${headings.length}個しかありません`,
    });
    score += 1;
    recommendations.push({
      priority: "medium",
      message: "コンテンツをH2/H3で構造化してください",
    });
  } else {
    findings.push({ status: "fail", message: "見出しタグがありません" });
    recommendations.push({
      priority: "high",
      message: "H1-H3タグでコンテンツを構造化してください",
    });
  }

  // Text content length
  const textContent = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = textContent.length;
  if (wordCount >= 1000) {
    findings.push({
      status: "pass",
      message: `テキスト量: ${wordCount}文字（十分）`,
    });
    score += 3;
  } else if (wordCount >= 300) {
    findings.push({
      status: "warn",
      message: `テキスト量: ${wordCount}文字（やや少ない）`,
    });
    score += 2;
  } else {
    findings.push({
      status: "fail",
      message: `テキスト量: ${wordCount}文字（不足）`,
    });
    recommendations.push({
      priority: "medium",
      message: "AI検索エンジンが引用できるよう、本文テキストを充実させてください",
    });
    score += 1;
  }

  // FAQ-like content
  const hasFaq =
    html.toLowerCase().includes("faq") ||
    $("details, summary").length > 0 ||
    $("dt, dd").length > 0;
  if (hasFaq) {
    findings.push({
      status: "pass",
      message: "FAQ/Q&A形式のコンテンツが検出されました",
    });
    score += 3;
  } else {
    findings.push({
      status: "warn",
      message: "FAQ/Q&A形式のコンテンツがありません",
    });
    recommendations.push({
      priority: "low",
      message:
        "よくある質問(FAQ)セクションを追加すると、AI検索で引用されやすくなります",
    });
    score += 1;
  }

  // Lists
  const listItems = $("ul li, ol li").length;
  if (listItems >= 3) {
    findings.push({
      status: "pass",
      message: "リスト構造が使用されています",
    });
    score += 3;
  } else {
    findings.push({
      status: "warn",
      message: "リスト構造が少ないです",
    });
    score += 1;
  }

  return {
    key: "content_structure",
    label: "コンテンツ構造",
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkInternalLinks(
  html: string,
  baseUrl: string
): Promise<CategoryResult> {
  const $ = cheerio.load(html);
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;

  // Internal links
  const links = $("a[href]");
  let internalCount = 0;
  let externalCount = 0;

  links.each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (href.startsWith("/") || href.startsWith(baseUrl)) {
      internalCount++;
    } else if (href.startsWith("http")) {
      externalCount++;
    }
  });

  if (internalCount >= 5) {
    findings.push({
      status: "pass",
      message: `内部リンク: ${internalCount}件`,
    });
    score += 5;
  } else if (internalCount > 0) {
    findings.push({
      status: "warn",
      message: `内部リンク: ${internalCount}件（少ない）`,
    });
    score += 2;
    recommendations.push({
      priority: "medium",
      message: "関連ページへの内部リンクを増やしてください",
    });
  } else {
    findings.push({ status: "fail", message: "内部リンクがありません" });
    recommendations.push({
      priority: "high",
      message: "サイト内の関連ページへのリンクを追加してください",
    });
  }

  // Nav
  const hasNav = $("nav").length > 0;
  if (hasNav) {
    findings.push({
      status: "pass",
      message: "navタグによるナビゲーションがあります",
    });
    score += 5;
  } else {
    findings.push({
      status: "warn",
      message: "navタグが見つかりません",
    });
    recommendations.push({
      priority: "medium",
      message: "<nav>タグでナビゲーションを構造化してください",
    });
    score += 2;
  }

  // Sitemap check
  const sitemapContent = await fetchText(`${baseUrl}/sitemap.xml`);
  if (sitemapContent) {
    findings.push({ status: "pass", message: "sitemap.xml が存在します" });
    score += 5;
  } else {
    findings.push({
      status: "warn",
      message: "sitemap.xml が見つかりません",
    });
    recommendations.push({
      priority: "medium",
      message: "sitemap.xml を生成して設置してください",
    });
    score += 1;
  }

  return {
    key: "internal_links",
    label: "内部リンク",
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    recommendations,
  };
}

export async function checkTechnical(
  url: string,
  html: string
): Promise<CategoryResult> {
  const findings: ScanFinding[] = [];
  const recommendations: ScanRecommendation[] = [];
  let score = 0;
  const $ = cheerio.load(html);

  // HTTPS
  if (url.startsWith("https://")) {
    findings.push({ status: "pass", message: "HTTPSが使用されています" });
    score += 4;
  } else {
    findings.push({ status: "fail", message: "HTTPSが使用されていません" });
    recommendations.push({
      priority: "high",
      message: "HTTPSに移行してください",
    });
  }

  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport) {
    findings.push({
      status: "pass",
      message: "viewportメタタグが設定されています",
    });
    score += 3;
  } else {
    findings.push({
      status: "fail",
      message: "viewportメタタグがありません",
    });
    recommendations.push({
      priority: "high",
      message: "viewportメタタグを追加してモバイル対応してください",
    });
  }

  // Lang attribute
  const lang = $("html").attr("lang");
  if (lang) {
    findings.push({
      status: "pass",
      message: `lang属性: "${lang}"`,
    });
    score += 3;
  } else {
    findings.push({
      status: "warn",
      message: "html lang属性がありません",
    });
    recommendations.push({
      priority: "medium",
      message: '<html lang="ja"> を設定してください',
    });
    score += 1;
  }

  return {
    key: "technical",
    label: "技術的要素",
    score: Math.min(score, 10),
    maxScore: 10,
    findings,
    recommendations,
  };
}

export async function scanUrl(url: string): Promise<{
  categories: CategoryResult[];
  totalScore: number;
  maxTotalScore: number;
}> {
  const baseUrl = getBaseUrl(url);
  const html = await fetchPage(url);

  const categories = await Promise.all([
    checkLlmsTxt(baseUrl),
    checkRobotsTxt(baseUrl),
    checkStructuredData(html),
    checkMetaTags(html, url),
    checkContentStructure(html),
    checkInternalLinks(html, baseUrl),
    checkTechnical(url, html),
  ]);

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxTotalScore = categories.reduce((sum, c) => sum + c.maxScore, 0);

  return { categories, totalScore, maxTotalScore };
}
