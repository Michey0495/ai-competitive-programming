import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackWidget } from "@/components/feedback-widget";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://minutes.ezoai.jp";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "AI議事録 - 会議メモを貼るだけで議事録を自動生成 | 無料・登録不要",
    template: "%s | AI議事録",
  },
  description:
    "会議のメモや発言ログを貼り付けるだけで、AIが要約・決定事項・アクションアイテム・ネクストステップを自動整理。無料・登録不要・5秒で完成。",
  keywords: [
    "AI議事録",
    "議事録 自動生成",
    "会議メモ AI",
    "議事録作成ツール",
    "会議 要約",
    "アクションアイテム 自動抽出",
    "AI meeting minutes",
    "meeting notes generator",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "AI議事録 - 会議メモを貼るだけ。5秒で議事録完成。",
    description:
      "要約・決定事項・TODO・ネクストアクションを自動整理。無料・登録不要。",
    url: siteUrl,
    siteName: "AI議事録",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI議事録 - 会議メモを貼るだけ。5秒で議事録完成。",
    description:
      "要約・決定事項・TODO・ネクストアクションを自動整理。無料・登録不要。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}')`}
          </Script>
        </>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FeedbackWidget />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
