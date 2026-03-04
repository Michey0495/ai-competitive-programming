import * as cheerio from "cheerio";

export async function generateLlmsTxt(url: string): Promise<string> {
  let html: string;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AEOChecker/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    html = await res.text();
  } catch {
    return `# ${new URL(url).hostname}\n> サイトの説明をここに記入してください\n\n## ページ一覧\n- ${url}: トップページ\n`;
  }

  const $ = cheerio.load(html);

  const title = $("title").text().trim() || new URL(url).hostname;
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    "サイトの説明をここに記入してください";

  // Collect internal links
  const links: { href: string; text: string }[] = [];
  const seen = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text().trim();
    if (!text || text.length > 100) return;

    let fullUrl = href;
    if (href.startsWith("/")) {
      fullUrl = new URL(href, url).toString();
    } else if (!href.startsWith("http")) {
      return;
    }

    if (!fullUrl.startsWith(new URL(url).origin)) return;
    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    links.push({ href: fullUrl, text: text.slice(0, 60) });
  });

  let output = `# ${title}\n> ${description}\n\n`;

  if (links.length > 0) {
    output += "## ページ一覧\n";
    for (const link of links.slice(0, 30)) {
      output += `- [${link.text}](${link.href})\n`;
    }
  }

  return output;
}

export function generateRobotsTxt(url: string): string {
  const sitemapUrl = `${new URL(url).origin}/sitemap.xml`;

  return `# AI Crawler Access
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: cohere-ai
Allow: /

# General
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
}
