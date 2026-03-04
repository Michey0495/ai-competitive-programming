import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "robots.txtのAIクローラー設定 - AI検索対策ガイド",
  description:
    "robots.txtでGPTBot, ClaudeBot, PerplexityBot等のAIクローラーを許可する方法。AI検索エンジンに発見されるための設定ガイド。",
};

export default function RobotsTxtGuide() {
  return (
    <>
      <h1>robots.txt AIクローラー設定</h1>

      <p>
        AI検索エンジンは専用のクローラーボットでサイトをスキャンします。
        robots.txtでこれらのボットを許可することで、AI検索結果に表示される可能性が高まります。
      </p>

      <h2>主要なAIクローラーボット</h2>
      <ul>
        <li><code>GPTBot</code> - OpenAI (ChatGPT検索)</li>
        <li><code>ChatGPT-User</code> - ChatGPTのブラウジング機能</li>
        <li><code>ClaudeBot</code> - Anthropic (Claude)</li>
        <li><code>anthropic-ai</code> - Anthropicの学習用クローラー</li>
        <li><code>PerplexityBot</code> - Perplexity AI</li>
        <li><code>Google-Extended</code> - Google Gemini</li>
        <li><code>cohere-ai</code> - Cohere</li>
      </ul>

      <h2>推奨設定</h2>
      <pre>{`# AI Crawler Access
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

Sitemap: https://example.com/sitemap.xml`}</pre>

      <h2>注意点</h2>
      <ul>
        <li>既存のrobots.txtにAIボットのDisallowルールがないか確認する</li>
        <li>Sitemapの指定を忘れずに追加する</li>
        <li>ワイルドカード(*) でDisallow: / を設定しない</li>
      </ul>
    </>
  );
}
