import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-lg hover:text-emerald-400 transition-all duration-200 cursor-pointer"
        >
          AEO Checker
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/guides/llms-txt"
            className="text-white/50 hover:text-white text-sm transition-all duration-200 cursor-pointer"
          >
            ガイド
          </Link>
        </nav>
      </div>
    </header>
  );
}
