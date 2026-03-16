import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import CrossPromo from "@/components/CrossPromo";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-marshmallow.ezoai.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AIマシュマロ -- 匿名でAIに何でも質問できるQ&Aサービス",
    template: "%s | AIマシュマロ",
  },
  description: "匿名で質問するとAIキャラクター「マシュ」が個性的に回答します。恋愛・仕事・日常の悩みをAIに相談。アカウント不要・完全無料。",
  keywords: ["AI", "匿名質問", "Q&A", "人工知能", "相談", "マシュマロ", "AIチャット", "無料", "匿名"],
  authors: [{ name: "Michey" }],
  creator: "Michey",
  openGraph: {
    title: "AIマシュマロ -- 匿名でAIに何でも質問できる",
    description: "匿名で質問するとAIキャラクター「マシュ」が個性的に回答します。アカウント不要・完全無料。",
    siteName: "AIマシュマロ",
    url: siteUrl,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "AIマシュマロ -- AIが匿名質問に個性的に回答",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIマシュマロ -- 匿名でAIに何でも質問できる",
    description: "匿名で質問するとAIキャラクター「マシュ」が個性的に回答します。アカウント不要・完全無料。",
    images: [`${siteUrl}/opengraph-image`],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AIマシュマロ",
  url: siteUrl,
  description: "匿名で質問するとAIキャラクター「マシュ」が個性的に回答するQ&Aサービス。アカウント不要・完全無料。",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  inLanguage: "ja",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geist.className} min-h-screen flex flex-col`}>
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
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <CrossPromo current="AIマシュマロ" />
        <Footer />
        <FeedbackWidget repoName="ai" />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
