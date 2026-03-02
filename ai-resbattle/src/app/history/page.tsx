import Link from "next/link";
import type { Metadata } from "next";
import { getRecentBattleIds, getBattle } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
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
      <h1 className="text-2xl font-bold">バトル履歴</h1>

      {battles.length === 0 ? (
        <p className="text-muted-foreground">まだバトルがありません。</p>
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
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {battle.restaurant1.name}
                        <span className="text-muted-foreground mx-2">vs</span>
                        {battle.restaurant2.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(battle.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {winnerName ? (
                        <Badge variant="secondary">
                          <Trophy className="h-3 w-3 mr-1" />
                          {winnerName}
                        </Badge>
                      ) : (
                        <Badge variant="outline">引き分け</Badge>
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
