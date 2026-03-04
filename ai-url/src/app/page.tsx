import { ScanForm } from "@/components/ScanForm";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AEO Checker",
  alternateName: "AI検索対策チェッカー",
  url: "https://aeo.ezoai.jp",
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
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            あなたのサイトは
            <br />
            <span className="text-emerald-400">AI検索</span>
            に対応していますか?
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            URLを入力するだけで、ChatGPT・Perplexity・Claude・Gemini等の
            AI検索エンジンでの発見されやすさを100点満点でスコアリング。
            日本語で具体的な改善アクションを提示します。
          </p>
          <p className="text-white/40 text-sm">
            無料・登録不要・30秒で診断完了
          </p>
          <ScanForm />
        </div>
      </section>

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
    </div>
  );
}
