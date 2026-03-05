import Link from "next/link";
import { BattleForm } from "@/components/battle-form";
import { getRecentBattleIds, getBattle } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch recent battles for social proof
  const recentIds = await getRecentBattleIds(5);
  const recentBattles = (
    await Promise.all(recentIds.map((id) => getBattle(id)))
  ).filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_-10%,rgba(239,68,68,0.25),transparent),radial-gradient(ellipse_60%_40%_at_70%_-10%,rgba(249,115,22,0.15),transparent)]" />
          <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <p className="text-red-400/80 text-xs font-mono tracking-[0.3em] uppercase mb-6">
            AI Restaurant Battle
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            AIレスバトル
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            2つのレストランを入力。AIが5項目で採点し、勝者を決める。
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Battle Form */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="flex flex-col items-center gap-12">
          <BattleForm />

          {/* Categories */}
          <div className="w-full max-w-2xl">
            <p className="text-center text-xs font-mono text-white/30 tracking-[0.2em] uppercase mb-5">
              5 Categories
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {["味・品質", "コスパ", "雰囲気", "サービス", "アクセス"].map(
                (label, i) => (
                  <div
                    key={label}
                    className="bg-white/[0.03] border border-white/5 rounded-lg py-3 text-center hover:bg-white/[0.06] transition-all duration-300"
                  >
                    <div className="text-xs font-mono text-red-400/60 mb-1">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/50 font-medium">
                      {label}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="w-full max-w-2xl">
            <p className="text-center text-xs font-mono text-white/30 tracking-[0.2em] uppercase mb-5">
              3 Steps
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { step: "01", label: "2つのレストランを入力" },
                { step: "02", label: "AIが5項目で自動採点" },
                { step: "03", label: "勝者を判定、結果をシェア" },
              ].map(({ step, label }) => (
                <div key={step}>
                  <div className="text-2xl font-black text-white/10 mb-2">
                    {step}
                  </div>
                  <div className="text-xs text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Battles - Social Proof */}
      {recentBattles.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-mono text-white/30 tracking-[0.2em] uppercase">
              Recent Battles
            </p>
            <Link
              href="/history"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              すべて見る
            </Link>
          </div>
          <div className="grid gap-2">
            {recentBattles.map((b) => {
              const winnerName =
                b!.winner === "restaurant1"
                  ? b!.restaurant1.name
                  : b!.winner === "restaurant2"
                  ? b!.restaurant2.name
                  : "引き分け";
              return (
                <Link
                  key={b!.id}
                  href={`/battle/${b!.id}`}
                  className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3 hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
                >
                  <span className="text-sm text-white/70">
                    {b!.restaurant1.name}
                    <span className="text-red-500 font-bold mx-2">VS</span>
                    {b!.restaurant2.name}
                  </span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                    {winnerName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer text */}
      <section className="text-center pb-16">
        <p className="text-xs text-white/20">
          AI powered / 無料・登録不要
        </p>
      </section>
    </div>
  );
}
