import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/60 mb-8">
          ページが見つかりませんでした
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#10b981] text-black font-semibold rounded-md hover:bg-[#059669] transition-all duration-200 cursor-pointer"
        >
          トップページに戻る
        </Link>
      </div>
    </main>
  );
}
