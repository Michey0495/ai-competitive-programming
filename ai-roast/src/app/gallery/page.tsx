import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ギャラリー | AIロースト",
  description: "AIが生成した愛のあるロースト一覧",
};

interface FeedItem {
  id: string;
  name: string;
  job: string;
  roast: string;
  createdAt: string;
}

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

export default async function GalleryPage() {
  const items = await getFeedItems();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">ギャラリー</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-orange-500 text-black font-bold rounded-lg text-sm hover:bg-orange-400 transition-all duration-200 cursor-pointer"
        >
          ローストする
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/50">まだローストがありません</p>
          <Link
            href="/"
            className="inline-block mt-4 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
          >
            最初のローストを生成する
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
                  <p className="text-white font-bold">{item.name}</p>
                  {item.job && (
                    <p className="text-white/40 text-xs mt-0.5">{item.job}</p>
                  )}
                </div>
                <span className="text-white/30 text-xs ml-4 shrink-0">
                  {timeAgo(item.createdAt)}
                </span>
              </div>
              <p className="text-white/60 text-sm line-clamp-3">{item.roast}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
