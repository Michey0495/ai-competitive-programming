import { ScanForm } from "@/components/ScanForm";
import { ScanHistory } from "@/components/ScanHistory";
import { CATEGORY_CONFIG } from "@/types";
import Link from "next/link";

const GUIDE_LINKS = [
  { href: "/guides/llms-txt", label: "llms.txtの書き方", desc: "AI検索エンジンにサイトを理解させるファイル" },
  { href: "/guides/robots-txt-ai", label: "robots.txt AI設定", desc: "AIクローラーのアクセスを許可する方法" },
  { href: "/guides/structured-data", label: "構造化データ", desc: "JSON-LD/Schema.orgでコンテンツを構造化" },
  { href: "/guides/meta-tags", label: "メタタグ最適化", desc: "title, description, OGPの最適化" },
  { href: "/guides/content-structure", label: "コンテンツ構造", desc: "AI検索で引用されやすい文章構造" },
  { href: "/guides/sitemap", label: "サイトマップ", desc: "内部リンクとサイトマップの最適化" },
  { href: "/guides/technical", label: "技術的要素", desc: "HTTPS, 速度, モバイル対応" },
];

const FAQ_ITEMS = [
  {
    q: "AEO（AI検索対策）とは何ですか？",
    a: "AEOはAI Engine Optimizationの略で、ChatGPT、Perplexity、Claude、GeminiなどのAI検索エンジンにサイトの情報を正しく理解・引用してもらうための最適化手法です。従来のSEO（検索エンジン最適化）に加えて、AI特有の対策が必要になります。",
  },
  {
    q: "llms.txtとは何ですか？",
    a: "llms.txtはAI検索エンジン（大規模言語モデル）がサイトの内容を効率的に理解するためのファイルです。サイトの概要、主要ページ、API仕様などをマークダウン形式で記述し、サイトのルートディレクトリに設置します。",
  },
  {
    q: "スコアはどのように計算されますか？",
    a: "llms.txt（15点）、robots.txt AI対応（15点）、構造化データ（15点）、メタタグ（15点）、コンテンツ構造（15点）、内部リンク（15点）、技術的要素（10点）の7カテゴリ、合計100点満点で採点されます。各カテゴリで具体的なチェック項目を検査し、スコアを算出します。",
  },
  {
    q: "診断は無料ですか？",
    a: "はい、完全無料で利用できます。ユーザー登録も不要で、URLを入力するだけで約30秒で診断が完了します。",
  },
  {
    q: "robots.txtでAIクローラーを許可する必要がありますか？",
    a: "AI検索エンジンに表示されたい場合は、GPTBot、ClaudeBot、PerplexityBot等のAIクローラーをrobots.txtで許可する必要があります。多くのサイトではデフォルトで許可されていますが、明示的にブロックしている場合はAI検索結果に表示されなくなります。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AEO Checker",
  alternateName: "AI検索対策チェッカー",
  url: "https://ai-url.ezoai.jp",
  description:
    "URLを入力するだけでAI検索エンジン(ChatGPT, Perplexity, Claude, Gemini)での発見されやすさを100点満点でスコアリング。日本語で具体的な改善アクションを提示。",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  featureList: [
    "AI検索エンジン最適化スコアリング",
    "llms.txt自動生成",
    "robots.txt自動生成",
    "7カテゴリ診断",
    "日本語改善提案",
  ],
  creator: {
    "@type": "Organization",
    name: "ezoai.jp",
    url: "https://ezoai.jp",
  },
  image: "https://ai-url.ezoai.jp/api/og",
  screenshot: "https://ai-url.ezoai.jp/api/og",
  datePublished: "2026-03-05",
  inLanguage: ["ja", "en"],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "AI検索エンジンにサイトを最適化する方法",
  description: "AEO Checkerを使って3ステップでAI検索対策を行う手順",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "URLを入力",
      text: "AEO Checkerにアクセスし、診断したいサイトのURLを入力します。",
      url: "https://ai-url.ezoai.jp",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "スコアを確認",
      text: "7カテゴリで自動スキャンされ、100点満点のスコアと改善ポイントが表示されます。",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "生成ファイルを設置",
      text: "自動生成されたllms.txtとrobots.txtをダウンロードしてサイトのルートディレクトリに設置します。",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-emerald-400 text-sm font-medium tracking-wide uppercase">
            日本初のAEO診断ツール
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            あなたのサイトは
            <br />
            <span className="text-emerald-400">AI検索</span>
            に対応していますか?
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            ChatGPT・Perplexity・Claude・Geminiが回答を生成するとき、
            あなたのサイトは引用されていますか？
            <br />
            URLを入力するだけで、AI検索での発見されやすさを
            <span className="text-white font-medium">100点満点</span>
            でスコアリング。
          </p>
          <p className="text-white/40 text-sm">
            無料・登録不要・30秒で診断完了
          </p>
          <ScanForm />
        </div>
      </section>

      {/* Why AEO matters - urgency */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400">40%</p>
              <p className="text-white/50 text-sm leading-relaxed">
                のWeb検索がAI検索エンジン経由に移行すると予測（2026年）
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400">93%</p>
              <p className="text-white/50 text-sm leading-relaxed">
                のサイトがAI検索最適化に未対応（当ツール調べ）
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400">30秒</p>
              <p className="text-white/50 text-sm leading-relaxed">
                で診断完了。改善に必要なファイルも自動生成
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scan history */}
      <ScanHistory />

      {/* Scoring categories */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            7つのカテゴリで総合診断
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORY_CONFIG.map((cat) => (
              <div
                key={cat.key}
                className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/[0.08] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{cat.label}</span>
                  <span className="text-emerald-400 text-sm font-mono">
                    {cat.maxScore}点
                  </span>
                </div>
              </div>
            ))}
            <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">合計</span>
                <span className="text-emerald-400 font-bold font-mono">
                  100点
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            AI検索対策の3ステップ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "URLを入力",
                desc: "診断したいサイトのURLを入力するだけ。登録不要。",
              },
              {
                step: "2",
                title: "スコアを確認",
                desc: "7カテゴリで自動スキャン。改善ポイントを日本語で表示。",
              },
              {
                step: "3",
                title: "ファイルを設置",
                desc: "自動生成されたllms.txtとrobots.txtをサイトに設置。",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-lg p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide links */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            AI検索対策ガイド
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDE_LINKS.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer block"
              >
                <span className="text-white font-medium block mb-1">
                  {guide.label}
                </span>
                <span className="text-white/40 text-sm">{guide.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            こんな方におすすめ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "SEO対策はしているが、AI検索での表示状況が分からない",
              "llms.txtやrobots.txtのAI対応を何から始めればいいか分からない",
              "自社サイトがChatGPTやPerplexityで引用されているか確認したい",
              "競合より先にAI検索対策を始めて差をつけたい",
            ].map((text) => (
              <div
                key={text}
                className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-start gap-3"
              >
                <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>
                <span className="text-white/70 text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden"
              >
                <summary className="px-6 py-4 text-white font-medium cursor-pointer hover:bg-white/[0.08] transition-all duration-200 list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-white/30 group-open:rotate-180 transition-transform duration-200 ml-4 shrink-0">
                    &#9660;
                  </span>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            今すぐ、あなたのサイトを診断
          </h2>
          <p className="text-white/50">
            AI検索エンジンに発見されるサイトへ。まずは現状を知ることから。
          </p>
          <ScanForm />
        </div>
      </section>
    </div>
  );
}
