import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-white/10 bg-white/5 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:text-white/90 transition-colors">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
          <span>AIレスバトル</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/history"
            className="text-white/60 hover:text-white transition-colors"
          >
            履歴
          </Link>
          <Link
            href="/about"
            className="text-white/60 hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
