import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 h-12">
        <Link href="/" className="text-white font-bold text-sm tracking-wide hover:text-violet-400 transition-colors">
          AI模擬面接
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/feed" className="text-white/50 text-xs hover:text-white transition-colors">
            面接結果一覧
          </Link>
          <Link href="/" className="text-xs text-black bg-violet-400 hover:bg-violet-300 px-3 py-1 rounded-full font-bold transition-colors">
            面接を受ける
          </Link>
        </div>
      </div>
    </nav>
  );
}
