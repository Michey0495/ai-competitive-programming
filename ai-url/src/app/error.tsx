"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-6xl font-bold text-white/10">Error</p>
        <h1 className="text-2xl font-bold text-white">
          エラーが発生しました
        </h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
