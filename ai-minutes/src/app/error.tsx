"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">
          エラーが発生しました
        </h1>
        <p className="text-lg text-white/60 mb-8">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#10b981] text-black font-semibold rounded-md hover:bg-[#059669] transition-all duration-200 cursor-pointer"
          >
            再試行
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-white/10 text-white font-semibold rounded-md hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
