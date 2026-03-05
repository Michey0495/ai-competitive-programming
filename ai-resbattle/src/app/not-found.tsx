import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-white">ページが見つかりません</h2>
      <p className="text-white/40">
        お探しのバトルは存在しないか、期限切れです。
      </p>
      <Link
        href="/"
        className="mt-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-6 py-3 rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300"
      >
        新しいバトルを始める
      </Link>
    </div>
  );
}
