import { MinutesForm } from "@/components/minutes-form";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://minutes.ezoai.jp";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI議事録",
  url: siteUrl,
  description:
    "会議のメモや発言ログを貼り付けるだけで、AIが要約・決定事項・アクションアイテム・ネクストステップを自動整理。無料・登録不要・5秒で完成。",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  provider: {
    "@type": "Organization",
    name: "ezoai.jp",
    url: "https://ezoai.jp",
  },
};

const features = [
  { label: "要約", desc: "議論の要点を簡潔に整理" },
  { label: "決定事項", desc: "何が決まったかを明確化" },
  { label: "TODO", desc: "誰が・いつまでに・何をするか" },
  { label: "次のアクション", desc: "次回に向けたステップ" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            AI<span className="text-[#10b981]">議事録</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            会議メモを貼り付けるだけで
            <br className="sm:hidden" />
            プロの議事録を自動生成
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/40">
            <span>無料</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>登録不要</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>5秒で完成</span>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {features.map((f) => (
            <div
              key={f.label}
              className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
            >
              <div className="text-sm font-semibold text-[#10b981]">
                {f.label}
              </div>
              <div className="text-xs text-white/40 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>

        <MinutesForm />

        <section className="mt-16 space-y-4">
          <h2 className="text-center text-sm font-semibold text-white/30 uppercase tracking-wider">
            こんな場面で使えます
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "週次の定例会議",
              "クライアントとの打合せ",
              "1on1ミーティング",
              "プロジェクトキックオフ",
            ].map((useCase) => (
              <div
                key={useCase}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/60"
              >
                {useCase}
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 text-center text-sm text-white/30">
          <p>
            Powered by AI &mdash;{" "}
            <a
              href="https://ezoai.jp"
              className="hover:text-white/50 transition-all duration-200"
            >
              ezoai.jp
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
