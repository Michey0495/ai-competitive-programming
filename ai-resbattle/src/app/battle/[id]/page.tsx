import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getBattle } from "@/lib/db";
import { BattleResult } from "@/components/battle-result";
import { LikeButton } from "@/components/LikeButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const battle = await getBattle(id);
  if (!battle) return {};

  const { restaurant1, restaurant2, winner } = battle;
  const winnerName =
    winner === "restaurant1"
      ? restaurant1.name
      : winner === "restaurant2"
      ? restaurant2.name
      : "引き分け";

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-resbattle.ezoai.jp";
  const ogImageUrl = `${baseUrl}/api/og/${id}`;

  return {
    title: `${restaurant1.name} vs ${restaurant2.name}`,
    description: `AI判定：${winnerName}が勝利！${battle.summary}`,
    openGraph: {
      title: `【AIレスバトル】${restaurant1.name} vs ${restaurant2.name}`,
      description: `${restaurant1.name}(${restaurant1.totalScore}点) vs ${restaurant2.name}(${restaurant2.totalScore}点) - 勝者: ${winnerName}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };
}

export default async function BattlePage({ params }: Props) {
  const { id } = await params;
  const battle = await getBattle(id);

  if (!battle) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-resbattle.ezoai.jp";
  const url = `${baseUrl}/battle/${id}`;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Mini hero for result page */}
      <div className="relative py-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(239,68,68,0.15),transparent)]" />
        <div className="relative">
          <p className="text-xs font-mono text-red-400/60 tracking-[0.3em] uppercase mb-4">
            Battle #{id.slice(0, 6)}
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {battle.restaurant1.name}
            <span className="mx-3 text-red-500">VS</span>
            {battle.restaurant2.name}
          </h1>
          <Link
            href="/"
            className="inline-block mt-4 text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            あなたもバトルを試す →
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 pb-16">
        <BattleResult battle={battle} url={url} />
        <LikeButton id={id} />

        {/* Rematch CTA */}
        <div className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-xl p-5 text-center">
          <p className="text-sm text-white/40 mb-3">別のバトルも試してみる?</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-3 rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            新しいバトルを始める
          </Link>
        </div>
      </div>
    </div>
  );
}
