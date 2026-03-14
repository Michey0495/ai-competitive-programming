import Link from "next/link";
import type { Metadata } from "next";
import { getRecentBattleIds, getBattle } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Battle } from "@/lib/types";

export const metadata: Metadata = {
  title: "バトル履歴",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const ids = await getRecentBattleIds(50);
  const battles = (
    await Promise.all(ids.map((id) => getBattle(id)))
  ).filter(Boolean) as Battle[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">バトル履歴</h1>

      {battles.length === 0 ? (
        <p className="text-white/60">まだバトルがありません。</p>
      ) : (
        <div className="grid gap-3">
          {battles.map((battle) => {
            const winnerName =
              battle.winner === "restaurant1"
                ? battle.restaurant1.name
                : battle.winner === "restaurant2"
                ? battle.restaurant2.name
                : null;

            return (
              <Link key={battle.id} href={`/battle/${battle.id}`}>
                <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {battle.restaurant1.name}
                        <span className="text-white/40 mx-2">vs</span>
                        {battle.restaurant2.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(battle.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {winnerName ? (
                        <Badge variant="secondary" className="bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          {winnerName}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/10 text-white/60">引き分け</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
