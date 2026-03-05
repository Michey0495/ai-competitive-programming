import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import CrossPromo from "@/components/CrossPromo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteName = "AI Catchcopy Generator";
const siteDescription = "AIキャッチコピー自動生成ツール。商品名と説明を入力するだけで、プロ品質のキャッチコピーを5案無料で瞬時に生成。個人事業主・フリーランス・中小企業のマーケティングを支援。";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-catchcopy.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | AIキャッチコピー自動生成 - 無料で5案を瞬時に`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ["キャッチコピー", "AI", "自動生成", "コピーライティング", "無料", "マーケティング", "広告文", "キャッチフレーズ", "商品コピー", "AI copywriting"],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "AIキャッチコピー自動生成 - 30秒でプロ品質のコピーを5案",
    description: "商品名と説明を入力するだけ。AIがプロ品質のキャッチコピーを5案同時生成。完全無料・登録不要。",
    url: siteUrl,
    siteName,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIキャッチコピー自動生成 - 30秒でプロ品質のコピーを5案",
    description: "商品名と説明を入力するだけ。AIがプロ品質のキャッチコピーを5案同時生成。完全無料・登録不要。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: siteName,
                description: siteDescription,
                url: siteUrl,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                inLanguage: "ja",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "JPY",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "AIキャッチコピー生成は無料ですか？",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "はい、完全無料で利用できます。登録も不要です。",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "どんなキャッチコピーが生成できますか？",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "5つのトーン（プロフェッショナル、カジュアル、遊び心、エレガント、大胆）から選択でき、商品・サービスに合わせたプロ品質のキャッチコピーを5案同時に生成します。",
                    },
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <a
          href="https://ezoai.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 border-b border-white/5 py-1.5 text-center text-xs text-white/50 hover:text-white/70 transition-colors"
        >
          ezoai.jp -- 7つのAIサービスを無料で体験
        </a>
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <nav className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-lg hover:text-cyan-400 transition-colors duration-200">
              AI Catchcopy
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/create" className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                生成する
              </Link>
              <Link href="/feed" className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
                みんなの作品
              </Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-7rem)]">
          {children}
        </main>
        <footer className="border-t border-white/10 py-6">
          <div className="max-w-4xl mx-auto px-4 text-center text-white/30 text-sm">
            AI Catchcopy Generator by ezoai.jp
          </div>
        </footer>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
        <CrossPromo current="AIキャッチコピー" />
        <FeedbackWidget repoName="ai-catchcopy" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
