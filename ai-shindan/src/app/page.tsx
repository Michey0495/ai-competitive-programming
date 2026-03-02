import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-6 text-6xl">🧠</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
          AI性格診断
        </h1>
        <p className="text-gray-400 text-lg mb-2">10の質問に答えるだけ</p>
        <p className="text-white text-xl mb-8">
          AIがあなたの
          <span className="text-purple-400 font-bold">本当の性格</span>
          を分析します
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 text-sm text-gray-400">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">⚡</div>
            <div>約1分で完了</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🤖</div>
            <div>AI深層分析</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">📤</div>
            <div>SNSシェア</div>
          </div>
        </div>

        <Link href="/quiz">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-10 py-6 rounded-full font-bold shadow-lg shadow-purple-900/40 transition-all hover:scale-105"
          >
            診断スタート →
          </Button>
        </Link>

        <p className="mt-6 text-xs text-gray-600">
          登録不要・無料・何度でも診断OK
        </p>
      </div>
    </main>
  );
}
