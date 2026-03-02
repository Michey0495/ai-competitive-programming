import { BattleForm } from "@/components/battle-form";
import { Swords, Zap, Trophy, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-10 py-8">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-lg">
        <Badge variant="secondary" className="text-xs font-medium">
          登録不要・完全無料
        </Badge>
        <div className="flex items-center justify-center gap-3">
          <Swords className="h-9 w-9 text-red-500" />
          <h1 className="text-4xl font-bold tracking-tight">AIレスバトル</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          どっちのレストランが勝つ？<br />
          <span className="text-foreground font-medium">AIが5項目で採点して決着をつけます。</span>
        </p>
        <p className="text-sm text-muted-foreground">
          「マクドナルド vs モスバーガー」「スタバ vs ドトール」なんでもOK
        </p>
      </div>

      {/* Battle Form */}
      <BattleForm />

      {/* 評価カテゴリ */}
      <div className="w-full max-w-lg">
        <p className="text-center text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
          AIが採点する6項目
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "味・品質", emoji: "🍽️" },
            { label: "コスパ", emoji: "💰" },
            { label: "雰囲気", emoji: "✨" },
            { label: "サービス", emoji: "👨‍💼" },
            { label: "アクセス", emoji: "📍" },
            { label: "総合判定", emoji: "🏆" },
          ].map(({ label, emoji }) => (
            <div key={label} className="bg-muted/50 rounded-lg py-3 space-y-1">
              <div className="text-2xl">{emoji}</div>
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
            { icon: <Swords className="h-5 w-5 mx-auto text-red-500" />, label: "2つのレストランを入力" },
            { icon: <Zap className="h-5 w-5 mx-auto text-yellow-500" />, label: "AIが自動で5項目採点" },
            { icon: <Trophy className="h-5 w-5 mx-auto text-amber-500" />, label: "勝者を判定！" },
          ].map(({ icon, label }) => (
            <div key={label} className="space-y-2">
              {icon}
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Share2 className="h-4 w-4" />
          <span>バトル結果はX（Twitter）・LINEでシェアできます</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Anthropic Claude AI powered • 無料・登録不要
        </p>
      </div>
    </div>
  );
}
