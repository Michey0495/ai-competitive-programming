import { ResultDetail } from "@/components/ResultDetail";
import { SITE_URL } from "@/lib/constants";
import type { ScanResult } from "@/types";
import type { Metadata } from "next";

async function getResult(id: string): Promise<ScanResult | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/result/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    return { title: "結果が見つかりません" };
  }

  return {
    title: `${result.url} のAEOスコア: ${result.totalScore}点`,
    description: `${result.url} のAI検索対策スコアは${result.totalScore}/${result.maxTotalScore}点です。`,
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/70 text-lg">結果が見つかりません</p>
          <p className="text-white/40 text-sm">
            URLを再度入力してスキャンしてください。
          </p>
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
