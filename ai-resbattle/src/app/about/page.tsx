import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">AIレスバトルとは</h1>

      <p className="text-muted-foreground leading-relaxed">
        AIレスバトルは、2つのレストランをAI（Claude）が多角的に比較・評価し、
        バトル形式で勝敗を判定するサービスです。
      </p>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🍽️ 評価カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 味・品質</li>
              <li>• コストパフォーマンス</li>
              <li>• 雰囲気・居心地</li>
              <li>• サービス・接客</li>
              <li>• アクセス・利便性</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🤖 使用AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AIを使用しています。
              AI評価は一般的な知識をもとにした参考情報です。
              実際のレストランの品質は個人の主観や時期によって異なります。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">⚠️ 注意事項</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              当サービスのAI評価はエンターテインメント目的です。
              実際の食事体験の参考としてのみご利用ください。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
