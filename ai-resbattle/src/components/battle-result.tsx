import { Battle } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBar } from "./score-bar";
import { ShareButtons } from "./share-buttons";
import { Trophy } from "lucide-react";

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
      <Card className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
        <CardContent className="pt-6 text-center space-y-2">
          <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
          <p className="text-sm text-muted-foreground">AI判定結果</p>
          <p className="text-2xl font-bold">
            {winnerName ? `「${winnerName}」の勝利！` : "引き分け！"}
          </p>
          <p className="text-sm text-muted-foreground">{summary}</p>
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
            className={
              winner === side ? "border-2 border-yellow-400" : undefined
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    color === "blue" ? "bg-blue-500" : "bg-orange-400"
                  }`}
                />
                {r.name}
                {winner === side && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    WIN
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold text-center">
                {r.totalScore}
                <span className="text-base font-normal text-muted-foreground">
                  点
                </span>
              </p>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {r.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* カテゴリ別スコア */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">カテゴリ別スコア</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-blue-600">{restaurant1.name}</span>
            <span className="text-orange-500">{restaurant2.name}</span>
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
        <p className="text-sm text-muted-foreground">結果をシェア</p>
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
