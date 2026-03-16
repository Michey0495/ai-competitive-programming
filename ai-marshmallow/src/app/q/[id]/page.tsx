import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getQuestion, getRecentQuestions } from "@/lib/storage";
import { QACard } from "@/components/QACard";
import { ShareButtons } from "@/components/ShareButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const question = await getQuestion(id);
  if (!question) return { title: "見つかりません | AIマシュマロ" };

  const title = `Q: ${question.content.slice(0, 50)}${question.content.length > 50 ? "..." : ""} | AIマシュマロ`;
  const description = question.answer.slice(0, 100);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QAPage({ params }: Props) {
  const { id } = await params;
  const [question, recentQuestions] = await Promise.all([
    getQuestion(id),
    getRecentQuestions(4),
  ]);
  if (!question) notFound();

  const others = recentQuestions.filter((q) => q.id !== id).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-marshmallow.ezoai.jp";
  const pageUrl = `${siteUrl}/q/${id}`;
  const answerSnippet = question.answer.slice(0, 50).replace(/\n/g, " ");
  const shareText = `マシュに聞いてみた\n\nQ: ${question.content.slice(0, 40)}\nA: ${answerSnippet}...\n\n匿名で何でも聞けるAI -> ai-marshmallow.ezoai.jp`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <span className="inline-block w-3 h-3 rounded-full bg-pink-400" />
        </div>
        <h1 className="text-lg font-bold text-white">AIマシュマロの回答</h1>
      </div>

      <QACard question={question} />

      <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-3">
        <p className="text-sm font-semibold text-white">シェアする</p>
        <ShareButtons url={pageUrl} text={shareText} />
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-5 text-center space-y-3">
        <p className="text-sm font-semibold text-white">あなたもマシュに聞いてみる?</p>
        <p className="text-xs text-white/60">匿名OK・アカウント不要・完全無料</p>
        <Link href="/">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            質問してみる
          </Button>
        </Link>
      </div>

      {others.length > 0 && (
        <>
          <Separator className="bg-white/10" />
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white">
              他のみんなの質問
            </h2>
            {others.map((q) => (
              <QACard key={q.id} question={q} showLink />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
