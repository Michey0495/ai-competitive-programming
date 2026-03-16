import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBattle } from "@/lib/db";
import { BattleResult } from "@/components/battle-result";

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
      description: `勝者: ${winnerName}`,
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
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold text-center text-white">
        {battle.restaurant1.name}
        <span className="text-white/40 mx-2">vs</span>
        {battle.restaurant2.name}
      </h1>
      <BattleResult battle={battle} url={url} />
    </div>
  );
}
