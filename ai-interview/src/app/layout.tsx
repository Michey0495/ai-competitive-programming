import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import CrossPromo from "@/components/CrossPromo";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | AI模擬面接",
    default: "AI模擬面接 - AIがあなたの面接力をS~Dランクで判定 | 無料・登録不要",
  },
  description:
    "希望職種と自己PRを入力するだけで、AIが厳しい面接官となり面接準備度をS~Dランクで判定。就活・転職の面接対策に。無料・登録不要・24時間対応。",
  keywords: [
    "AI面接", "模擬面接", "面接対策", "面接練習", "就活", "転職",
    "面接準備", "AI面接官", "面接評価", "自己PR",
    "mock interview", "AI interview", "interview practice",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "AI模擬面接 - AIが面接力をS~Dランクで即判定",
    description:
      "職種と自己PRを入力するだけ。AIが厳しい面接官となり、本番さながらの質問で面接準備度を判定。無料・登録不要。",
    url: siteUrl,
    siteName: "AI模擬面接",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI模擬面接 - AIが面接力をS~Dランクで即判定",
    description:
      "職種と自己PRを入力するだけ。AIが厳しい面接官となり、本番さながらの質問で面接準備度を判定。無料・登録不要。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
    name: "ezoai.jp",
    url: "https://ezoai.jp",
  },
  inLanguage: "ja",
  isAccessibleForFree: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <a
            href="https://ezoai.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-violet-500/10 via-transparent to-violet-500/10 border-b border-white/5 py-1.5 text-center text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            ezoai.jp -- 7つのAIサービスを無料で体験
          </a>
          <Nav />
          <main className="flex-1">{children}</main>
          <CrossPromo current="AI面接練習" />
          <footer className="text-center py-6 text-white/30 text-sm">
            <p>AI模擬面接 by ezoai.jp</p>
          </footer>
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" },
          }}
        />
        <FeedbackWidget repoName="ai-interview" />
      </body>
    </html>
  );
}
