import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold mb-2">AEO Checker</p>
            <p className="text-white/40 text-sm leading-relaxed">
              AI検索対策チェッカー。AI検索エンジンでの発見されやすさをスコアリング。
            </p>
          </div>
          <div>
            <p className="text-white/70 font-medium text-sm mb-3">ガイド</p>
            <div className="flex flex-col gap-2">
              <Link href="/guides/llms-txt" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                llms.txtの書き方
              </Link>
              <Link href="/guides/robots-txt-ai" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                robots.txt AI設定
              </Link>
              <Link href="/guides/structured-data" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                構造化データ
              </Link>
              <Link href="/guides/meta-tags" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                メタタグ最適化
              </Link>
            </div>
          </div>
          <div>
            <p className="text-white/70 font-medium text-sm mb-3">リンク</p>
            <div className="flex flex-col gap-2">
              <Link href="/guides/content-structure" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                コンテンツ構造
              </Link>
              <Link href="/guides/sitemap" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                サイトマップ
              </Link>
              <Link href="/guides/technical" className="text-white/40 hover:text-white text-sm transition-all duration-200 cursor-pointer">
                技術的要素
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-white/30 text-xs">
            &copy; 2026 AEO Checker by ezoai.jp
          </p>
        </div>
      </div>
    </footer>
  );
}
