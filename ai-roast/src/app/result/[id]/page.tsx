import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { RoastResult } from "@/types";
import { ShareButtons } from "@/components/ShareButtons";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await kv.get<RoastResult>(`roast:${id}`);
  if (!result) return { title: "結果が見つかりません" };

  const title = `${result.input.name}さんへのAIロースト🔥`;
  const desc = result.roast.slice(0, 100) + "…";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/result/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await kv.get<RoastResult>(`roast:${id}`);
  if (!result) notFound();

  const lines = result.roast.split("\n").filter((l) => l.trim());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roast.ezoai.jp";
  const shareUrl = `${siteUrl}/result/${id}`;
  const shareText = `AIにロースト（毒舌ツッコミ）されました🔥\n\n${result.roast.slice(0, 80)}…\n\nあなたもやってみる👇`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🔥</div>
          <h1 className="text-2xl font-black text-gray-900">
            {result.input.name}さんへのロースト
          </h1>
        </div>

        {/* Result Card - screenshot worthy */}
        <div
          id="roast-card"
          className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-orange-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🔥</div>
            <div>
              <p className="font-black text-xl text-gray-900">
                {result.input.name}
              </p>
              {result.input.job && (
                <p className="text-sm text-gray-500">{result.input.job}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {lines.map((line, i) => (
              <p
                key={i}
                className="text-gray-800 leading-relaxed text-base border-l-4 border-orange-300 pl-4"
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">by AIロースト🔥</span>
            <span className="text-xs text-gray-400">roast.ezoai.jp</span>
          </div>
        </div>

        <ShareButtons shareUrl={shareUrl} shareText={shareText} name={result.input.name} />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          >
            🔥 自分もロースト される
          </Link>
        </div>
      </div>
    </main>
  );
}
