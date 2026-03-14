import { BattleForm } from "@/components/battle-form";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-8">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-lg">
        <Badge variant="secondary" className="text-xs font-medium bg-white/5 text-white/60 border border-white/10">
          登録不要 / 完全無料
        </Badge>
        <div className="flex items-center justify-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
          <h1 className="text-4xl font-bold tracking-tight text-white">AIレスバトル</h1>
        </div>
        <p className="text-white/60 text-lg leading-relaxed">
          どっちのレストランが勝つ?<br />
          <span className="text-white font-medium">AIが5項目で採点して決着をつけます。</span>
        </p>
        <p className="text-sm text-white/40">
          マクドナルド vs モスバーガー、スタバ vs ドトール -- なんでもOK
        </p>
      </div>

      {/* Battle Form */}
      <BattleForm />

      {/* 評価カテゴリ */}
      <div className="w-full max-w-lg">
        <p className="text-center text-xs text-white/40 mb-4 font-medium uppercase tracking-wider">
          AIが採点する6項目
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "味・品質", color: "bg-blue-400" },
            { label: "コスパ", color: "bg-emerald-400" },
            { label: "雰囲気", color: "bg-purple-400" },
            { label: "サービス", color: "bg-cyan-400" },
            { label: "アクセス", color: "bg-rose-400" },
            { label: "総合判定", color: "bg-amber-400" },
          ].map(({ label, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-lg py-3 space-y-2 transition-all duration-200 hover:bg-white/10 cursor-pointer">
              <div className="flex justify-center">
                <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
              </div>
              <div className="text-xs text-white/60 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 使い方 */}
      <div className="w-full max-w-lg">
        <p className="text-center text-xs text-white/40 mb-4 font-medium uppercase tracking-wider">
          使い方
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { dot: "bg-blue-400", label: "2つのレストランを入力" },
            { dot: "bg-amber-400", label: "AIが自動で5項目採点" },
            { dot: "bg-emerald-400", label: "勝者を判定!" },
          ].map(({ dot, label }) => (
            <div key={label} className="space-y-2">
              <div className="flex justify-center">
                <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
              </div>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div className="text-center space-y-1">
        <p className="text-sm text-white/60">
          バトル結果はX (Twitter) ・LINEでシェアできます
        </p>
        <p className="text-xs text-white/40">
          Anthropic Claude AI powered / 無料・登録不要
        </p>
      </div>
    </div>
  );
}
