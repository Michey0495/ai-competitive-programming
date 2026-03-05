import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-red-500 font-black">VS</span>
          <span className="text-white">AIレスバトル</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/history"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            履歴
          </Link>
          <Link
            href="/about"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
