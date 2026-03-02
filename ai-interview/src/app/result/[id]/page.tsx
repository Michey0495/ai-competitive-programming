import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ShareButtons } from "@/components/ShareButtons";
import type { InterviewResult } from "@/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-interview.ezoai.jp";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await kv.get<InterviewResult>(`interview:${id}`);

  if (!result) {
    return { title: "結果が見つかりません" };
  }

  const title = `${result.input.position}の面接力: ${result.rank}ランク`;
  const desc = result.summary.slice(0, 100) + "...";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/result/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  };
}

const rankColor: Record<string, string> = {
  S: "text-yellow-400 border-yellow-400/30",
  A: "text-violet-400 border-violet-400/30",
  B: "text-blue-400 border-blue-400/30",
  C: "text-white/70 border-white/20",
  D: "text-red-400 border-red-400/30",
};

const verdictColor: Record<string, string> = {
  合格見込み: "bg-green-500/20 text-green-400",
  要改善: "bg-yellow-500/20 text-yellow-400",
  厳しい: "bg-red-500/20 text-red-400",
};

const scoreColor: Record<string, string> = {
  良い: "text-green-400",
  普通: "text-white/60",
  要改善: "text-red-400",
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await kv.get<InterviewResult>(`interview:${id}`);

  if (!result) {
    notFound();
  }

  const shareText = `AI模擬面接で「${result.input.position}」の面接力を判定してもらったら${result.rank}ランクでした\n\nあなたも面接力を診断してみませんか?`;
  const shareUrl = `${siteUrl}/result/${id}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          <span className="text-violet-400">{"//"}
          </span> 面接結果
        </h1>
        <p className="text-white/50 text-sm">AI模擬面接の判定結果</p>
      </div>

      {/* Result Card */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs mb-1">希望職種</p>
              <p className="text-white font-bold text-lg">
                {result.input.position}
              </p>
              {result.input.industry && (
                <p className="text-white/40 text-sm mt-0.5">
                  {result.input.industry}
                  {result.input.experience
                    ? ` / ${result.input.experience}`
                    : ""}
                </p>
              )}
            </div>
            <div className="text-center">
              <div
                className={`text-5xl font-black ${rankColor[result.rank]?.split(" ")[0] ?? "text-white"}`}
              >
                {result.rank}
              </div>
              <div
                className={`mt-1 text-xs px-3 py-1 rounded-full inline-block ${verdictColor[result.verdict] ?? "bg-white/10 text-white/60"}`}
              >
                {result.verdict}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluations */}
        <div className="p-6 space-y-5">
          <div>
            <p className="text-white/40 text-xs font-medium mb-3">
              面接質問と評価
            </p>
            <div className="space-y-4">
              {result.evaluations.map((ev, i) => (
                <div
                  key={i}
                  className="border-l-2 border-white/10 pl-4 space-y-1"
                >
                  <p className="text-white/80 text-sm font-medium">
                    Q{i + 1}. {ev.question}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {ev.evaluation}
                  </p>
                  <p
                    className={`text-xs ${scoreColor[ev.score] ?? "text-white/40"}`}
                  >
                    判定: {ev.score}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-white/10 pt-5">
            <p className="text-white/40 text-xs font-medium mb-2">総合評価</p>
            <p className="text-white/70 text-sm leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Advice */}
          <div className="border-t border-white/10 pt-5">
            <p className="text-white/40 text-xs font-medium mb-2">
              改善アドバイス
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              {result.advice}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex justify-between items-center">
          <span className="text-white/30 text-xs">by AI模擬面接</span>
          <span className="text-white/20 text-xs">ai-interview.ezoai.jp</span>
        </div>
      </div>

      {/* Share */}
      <div className="space-y-4">
        <ShareButtons shareText={shareText} shareUrl={shareUrl} />
        <Link
          href="/"
          className="block w-full bg-violet-500 text-white font-bold px-8 py-3 rounded-lg text-center hover:bg-violet-600 transition-all duration-200 cursor-pointer"
        >
          自分も面接を受ける
        </Link>
      </div>
    </div>
  );
}
