import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">AIレスバトルとは</h1>

      <p className="text-white/60 leading-relaxed">
        AIレスバトルは、2つのレストランをAI (Claude) が多角的に比較・評価し、
        バトル形式で勝敗を判定するサービスです。
      </p>

      <div className="grid gap-4">
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
              評価カテゴリ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-white/60">
              <li>- 味・品質</li>
              <li>- コストパフォーマンス</li>
              <li>- 雰囲気・居心地</li>
              <li>- サービス・接客</li>
              <li>- アクセス・利便性</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
              使用AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60">
              Anthropic社のClaude AI (Claude Haiku 4.5) を使用しています。
              AI評価は一般的な知識をもとにした参考情報です。
              実際のレストランの品質は個人の主観や時期によって異なります。
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              注意事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60">
              当サービスのAI評価はエンターテインメント目的です。
              実際の食事体験の参考としてのみご利用ください。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
