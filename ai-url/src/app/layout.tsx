import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aeo.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: "AEO Checker - AI検索対策チェッカー",
    template: "%s | AEO Checker",
  },
  description:
    "URLを入力するだけでAI検索エンジン(ChatGPT, Perplexity, Claude, Gemini)での発見されやすさを100点満点でスコアリング。日本語で具体的な改善アクションを提示。llms.txt/robots.txtの自動生成機能付き。",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "AEO Checker",
    url: siteUrl,
    title: "AEO Checker - AI検索対策チェッカー",
    description:
      "URLを入力するだけでAI検索エンジンでの発見されやすさを100点満点でスコアリング。日本語で改善アクションを提示。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO Checker - AI検索対策チェッカー",
    description:
      "AI検索エンジンでの発見されやすさをスコアリング。改善提案とllms.txt自動生成。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja">
      <body className={`${geist.className} min-h-screen flex flex-col`}>
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
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
