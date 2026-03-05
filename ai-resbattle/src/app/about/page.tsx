import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">AIレスバトルとは</h1>

      <p className="text-white/50 leading-relaxed">
        AIレスバトルは、2つのレストランをAIが多角的に比較・評価し、
        バトル形式で勝敗を判定するサービスです。
      </p>

      <div className="grid gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">評価カテゴリ</h2>
          <ul className="space-y-1.5 text-sm text-white/50">
            <li>- 味・品質</li>
            <li>- コストパフォーマンス</li>
            <li>- 雰囲気・居心地</li>
            <li>- サービス・接客</li>
            <li>- アクセス・利便性</li>
          </ul>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">使用AI</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            AIを使用しています。
            AI評価は一般的な知識をもとにした参考情報です。
            実際のレストランの品質は個人の主観や時期によって異なります。
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">注意事項</h2>
          <p className="text-sm text-white/50 leading-relaxed">
            当サービスのAI評価はエンターテインメント目的です。
            実際の食事体験の参考としてのみご利用ください。
          </p>
        </div>
      </div>
    </div>
  );
}
