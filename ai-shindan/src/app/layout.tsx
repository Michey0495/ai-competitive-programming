import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shindan.ezoai.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AI性格診断 | あなたの本当の性格を発見しよう",
  description:
    "10の質問に答えるだけで、AIがあなたの性格タイプを詳しく分析。SNSでシェアできる結果カードも生成。さあ、本当の自分を発見しよう！",
  openGraph: {
    title: "AI性格診断 | あなたの本当の性格を発見しよう",
    description:
      "10の質問に答えるだけで、AIがあなたの性格タイプを詳しく分析。SNSでシェアできる結果カードも生成。",
    url: siteUrl,
    siteName: "AI性格診断",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI性格診断 | あなたの本当の性格を発見しよう",
    description:
      "10の質問に答えるだけで、AIがあなたの性格タイプを詳しく分析。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
