import Link from "next/link";
import { RoastForm } from "@/components/RoastForm";
import { RecentRoasts } from "@/components/RecentRoasts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            AI ロースト
          </h1>
          <p className="text-gray-600 text-lg">
            あなたのプロフィールをAIが
            <span className="text-red-500 font-bold">愛のある毒舌</span>
            でツッコみます
          </p>
          <p className="text-sm text-gray-400 mt-1">
            ※ 笑えるツッコミです。傷つけるものではありません
          </p>
        </div>

        <RoastForm />

        {/* Recent Roasts */}
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">最近のロースト</h2>
            <Link
              href="/gallery"
              className="text-sm text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              すべて見る
            </Link>
          </div>
          <RecentRoasts />
        </div>

        <footer className="text-center mt-12 text-xs text-gray-400">
          <p>Powered by Claude AI | © 2026 AIロースト</p>
        </footer>
      </div>
    </main>
  );
}
