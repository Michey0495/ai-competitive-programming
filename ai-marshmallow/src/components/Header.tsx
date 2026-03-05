import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-80 transition-opacity">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-400" />
          <span>AIマシュマロ</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/about" className="hover:text-white transition-colors">
            このサービスについて
          </Link>
        </nav>
      </div>
    </header>
  );
}
