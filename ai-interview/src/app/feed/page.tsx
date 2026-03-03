import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "面接結果一覧 | AI模擬面接",
  description: "AIによる模擬面接の結果一覧。S~Dランク判定。",
};

interface FeedItem {
  id: string;
  position: string;
  industry: string;
  rank: string;
  verdict: string;
  summary: string;
  createdAt: string;
}

const rankColors: Record<string, string> = {
  S: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  A: "bg-green-500/20 text-green-400 border-green-500/30",
  B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  C: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  D: "bg-red-500/20 text-red-400 border-red-500/30",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

async function getFeedItems(): Promise<FeedItem[]> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/feed`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function FeedPage() {
  const items = await getFeedItems();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">面接結果一覧</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-violet-500 text-white font-bold rounded-lg text-sm hover:bg-violet-400 transition-all duration-200 cursor-pointer"
        >
          面接を受ける
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/50">まだ面接結果がありません</p>
          <Link
            href="/"
            className="inline-block mt-4 text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            最初の面接を受ける
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/result/${item.id}`}
              className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-bold">{item.position}</p>
                  {item.industry && (
                    <p className="text-white/40 text-xs mt-0.5">{item.industry}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded border text-xs font-bold ${
                      rankColors[item.rank] ?? "bg-white/10 text-white/60 border-white/20"
                    }`}
                  >
                    {item.rank}ランク
                  </span>
                  <span className="text-white/30 text-xs">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-sm line-clamp-2">{item.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
