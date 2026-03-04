import { BattleForm } from "@/components/battle-form";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(239,68,68,0.3),transparent)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <p className="text-red-400/80 text-xs font-mono tracking-[0.3em] uppercase mb-6">AI Res Battle</p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">AIレスバトル</h1>
          <p className="text-white/40 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">どっちのレストランが勝つ? AIが5項目で採点して決着をつけます。</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="flex flex-col items-center gap-10 px-4 py-10">
        {/* Battle Form */}
        <BattleForm />

        {/* 評価カテゴリ */}
        <div className="w-full max-w-lg">
          <p className="text-center text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
            AIが採点する6項目
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "味・品質", num: "01" },
              { label: "コスパ", num: "02" },
              { label: "雰囲気", num: "03" },
              { label: "サービス", num: "04" },
              { label: "アクセス", num: "05" },
              { label: "総合判定", num: "06" },
            ].map(({ label, num }) => (
              <div key={label} className="bg-muted/50 rounded-lg py-3 space-y-1 hover:bg-muted/70 transition-all duration-300">
                <div className="text-sm font-bold text-red-400">{num}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 使い方 */}
        <div className="w-full max-w-lg">
          <p className="text-center text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
            使い方
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { step: "01", label: "2つのレストランを入力" },
              { step: "02", label: "AIが自動で5項目採点" },
              { step: "03", label: "勝者を判定!" },
            ].map(({ step, label }) => (
              <div key={label} className="space-y-2">
                <div className="text-sm font-bold text-red-400">{step}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            バトル結果はX (Twitter)・LINEでシェアできます
          </p>
          <p className="text-xs text-muted-foreground">
            AI powered / 無料・登録不要
          </p>
        </div>
      </div>
    </div>
  );
}
