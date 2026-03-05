import type { Metadata } from "next";
import Link from "next/link";
import { getRecentBattleIds, getBattle } from "@/lib/db";
import { FeedList } from "@/components/FeedList";

export const metadata: Metadata = {
  title: "バトル履歴",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const ids = await getRecentBattleIds(20);
  const battles = (
    await Promise.all(ids.map((id) => getBattle(id)))
  ).filter(Boolean);

  const items = battles.map((b) => ({
    id: b!.id,
    restaurant1: b!.restaurant1.name,
    restaurant2: b!.restaurant2.name,
    winner: b!.winner,
    summary: b!.summary,
    createdAt: b!.createdAt,
    likes: 0,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">バトル履歴</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-white/40 text-lg">まだバトルがありません</p>
          <p className="text-white/25 text-sm">2つのレストランを入力して、最初のバトルを始めよう</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
          >
            バトルを開始する
          </Link>
        </div>
      ) : (
        <FeedList initialItems={items} initialNextCursor={items.length >= 20 ? 20 : null} />
      )}
    </div>
  );
}
