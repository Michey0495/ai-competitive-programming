import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-6xl font-bold text-white/10">404</p>
        <h1 className="text-2xl font-bold text-white">
          ページが見つかりません
        </h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
