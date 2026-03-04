import { ResultDetail } from "@/components/ResultDetail";
import { getResult } from "@/lib/store";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = getResult(id);

  if (!result) {
    return { title: "結果が見つかりません" };
  }

  const title = `${result.url} のAEOスコア: ${result.totalScore}点`;
  const description = `${result.url} のAI検索対策スコアは${result.totalScore}/${result.maxTotalScore}点です。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/api/og?score=${result.totalScore}&url=${encodeURIComponent(result.url)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = getResult(id);

  if (!result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/70 text-lg">結果が見つかりません</p>
          <p className="text-white/40 text-sm">
            URLを再度入力してスキャンしてください。
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg cursor-pointer transition-all duration-200"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <ResultDetail result={result} />
    </div>
  );
}
