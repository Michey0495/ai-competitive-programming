import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Nav } from "@/components/nav";
import { FeedbackWidget } from "@/components/feedback-widget";
import CrossPromo from "@/components/CrossPromo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-resbattle.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: "AIレスバトル - 2つのレストランをAIがバトル形式で比較",
    template: "%s | AIレスバトル",
  },
  description:
    "2つのレストランをAIが味・コスパ・雰囲気・サービス・アクセスの5項目で徹底比較！バトル形式で勝者を判定します。登録不要・完全無料。",
  keywords: [
    "レストラン比較",
    "AI グルメ",
    "レストラン バトル",
    "AI 飯",
    "グルメ比較",
    "飲食店 比較",
    "Claude AI",
    "AIレスバトル",
    "restaurant battle",
    "AI food comparison",
  ],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "AIレスバトル",
    type: "website",
    locale: "ja_JP",
    url: baseUrl,
    title: "AIレスバトル - 2つのレストランをAIがバトル形式で比較",
    description:
      "2つのレストランをAIが5項目で徹底比較！バトル形式で勝者を判定します。登録不要・完全無料。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIレスバトル - 2つのレストランをAIが比較",
    description:
      "2つのレストランをAIが5項目で徹底比較！バトル形式で勝者を判定します。",
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
  name: "AIレスバトル",
  url: baseUrl,
  description:
    "2つのレストランをAIが味・コスパ・雰囲気・サービス・アクセスの5項目で徹底比較し、バトル形式で勝者を判定するWebアプリ。",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  inLanguage: "ja",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${geist.className} antialiased min-h-screen bg-black text-white`}>
        <a
          href="https://ezoai.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 border-b border-white/5 py-1.5 text-center text-xs text-white/50 hover:text-white/70 transition-colors"
        >
          ezoai.jp -- 7つのAIサービスを無料で体験
        </a>
        <Nav />
        <main>{children}</main>
        <CrossPromo current="AIレスバトル" />
        <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
          <p>© 2026 AIレスバトル</p>
        </footer>
        <FeedbackWidget repoName="ai-resbattle" />
      </body>
    </html>
  );
}
