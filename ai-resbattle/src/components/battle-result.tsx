import { Battle } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "./score-bar";
import { ShareButtons } from "./share-buttons";

interface BattleResultProps {
  battle: Battle;
  url: string;
}

export function BattleResult({ battle, url }: BattleResultProps) {
  const { restaurant1, restaurant2, winner, summary } = battle;

  const winnerName =
    winner === "restaurant1"
      ? restaurant1.name
      : winner === "restaurant2"
      ? restaurant2.name
      : null;

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {/* 勝者発表 */}
      <Card className="border border-amber-400/30 bg-amber-400/5">
        <CardContent className="pt-6 text-center space-y-2">
          <p className="text-amber-400 font-bold text-lg">WINNER</p>
          <p className="text-sm text-white/60">AI判定結果</p>
          <p className="text-2xl font-bold text-white">
            {winnerName ? `${winnerName} の勝利` : "引き分け"}
          </p>
          <p className="text-sm text-white/60">{summary}</p>
        </CardContent>
      </Card>

      {/* 対戦カード */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { r: restaurant1, side: "restaurant1" as const, color: "blue" },
          { r: restaurant2, side: "restaurant2" as const, color: "orange" },
        ].map(({ r, side, color }) => (
          <Card
            key={side}
            className={`bg-white/5 border ${
              winner === side ? "border-amber-400/40" : "border-white/10"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-white">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    color === "blue" ? "bg-blue-400" : "bg-orange-400"
                  }`}
                />
                {r.name}
                {winner === side && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    WIN
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold text-center text-white">
                {r.totalScore}
                <span className="text-base font-normal text-white/40">
                  点
                </span>
              </p>
              <p className="text-xs text-white/60 text-center leading-relaxed">
                {r.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* カテゴリ別スコア */}
      <Card className="bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">カテゴリ別スコア</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-blue-400">{restaurant1.name}</span>
            <span className="text-orange-400">{restaurant2.name}</span>
          </div>
          {restaurant1.scores.map((score) => {
            const score2 = restaurant2.scores.find(
              (s) => s.category === score.category
            );
            return (
              <ScoreBar
                key={score.category}
                category={score.category}
                score1={score.score1}
                score2={score.score2}
                comment={score2?.comment ?? score.comment}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* シェアボタン */}
      <div className="text-center space-y-2">
        <p className="text-sm text-white/60">結果をシェア</p>
        <ShareButtons
          restaurant1={restaurant1.name}
          restaurant2={restaurant2.name}
          winner={winner}
          url={url}
        />
      </div>
    </div>
  );
}
