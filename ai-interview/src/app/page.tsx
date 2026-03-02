import { InterviewForm } from "@/components/InterviewForm";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI模擬面接",
  url: siteUrl,
  description:
    "希望職種と自己PRを入力するだけ。AIが厳しい面接官となり、あなたの面接準備度をS~Dランクで判定します。無料・登録不要。",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  creator: {
    "@type": "Organization",
    name: "Ghostfee",
    url: "https://ezoai.jp",
  },
  inLanguage: "ja",
  isAccessibleForFree: true,
  featureList:
    "AI面接官による模擬面接, S~Dランク判定, 職種別カスタマイズ質問, 質問ごとの個別評価, 結果シェア機能",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AI模擬面接とは何ですか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI模擬面接は、AIが面接官となって模擬面接を行い、あなたの面接力をS~Dランクで判定する無料サービスです。希望職種と自己PRを入力するだけで、本番さながらの面接質問と評価を受けられます。",
      },
    },
    {
      "@type": "Question",
      name: "利用料金はかかりますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全無料です。会員登録も不要で、すぐに利用できます。何度でも繰り返し練習可能です。",
      },
    },
    {
      "@type": "Question",
      name: "どのような職種に対応していますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "あらゆる職種に対応しています。エンジニア、営業、マーケティング、事務、医療、教育など、入力した職種に合わせてAIが面接質問を生成します。",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-10">
        <p className="text-violet-400 text-sm font-bold tracking-widest mb-4">
          無料・登録不要・30秒で結果
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-3">
          <span className="text-violet-400">{"//"}
          </span> AI模擬面接
        </h1>
        <p className="text-white/70 text-lg leading-relaxed">
          AIが<span className="text-violet-400 font-bold">厳しい面接官</span>
          となり、あなたの面接力を
          <span className="text-violet-400 font-bold">S~Dランク</span>
          で判定
        </p>
        <p className="text-white/40 text-sm mt-2">
          職種と自己PRを入力するだけ。本番さながらの質問と容赦ない評価。
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { step: "1", title: "入力", desc: "職種・自己PRを記入" },
          { step: "2", title: "面接", desc: "AIが質問を生成" },
          { step: "3", title: "判定", desc: "S~Dランクで評価" },
        ].map((item) => (
          <div
            key={item.step}
            className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
          >
            <div className="text-violet-400 font-black text-lg mb-1">
              {item.step}
            </div>
            <div className="text-white text-sm font-bold">{item.title}</div>
            <div className="text-white/40 text-xs mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      <InterviewForm />
    </div>
  );
}
