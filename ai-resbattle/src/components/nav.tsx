import Link from "next/link";
import { Swords } from "lucide-react";

export function Nav() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Swords className="h-5 w-5 text-red-500" />
          <span>AIレスバトル</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/history"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            履歴
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
