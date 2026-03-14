import { Suspense } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { QACard } from "@/components/QACard";
import { getRecentQuestions } from "@/lib/storage";
import { Separator } from "@/components/ui/separator";

async function RecentQAs() {
  const questions = await getRecentQuestions(50);
  if (questions.length === 0) {
    return (
      <p className="text-center text-white/40 text-sm py-8">
        まだ質問がありません。最初の質問をしてみましょう
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QACard key={q.id} question={q} showLink />
      ))}
    </div>
  );
}

const FEATURES = [
  { label: "アカウント不要" },
  { label: "完全無料" },
  { label: "AI即回答" },
] as const;

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <span className="inline-block w-3 h-3 rounded-full bg-pink-400" />
        </div>
        <h1 className="text-2xl font-bold text-white leading-snug">
          誰にも言えないこと、<br />
          マシュに聞いてみませんか?
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          匿名でOK。恋愛・悩み・くだらない疑問、なんでも。<br className="sm:hidden" />
          AIキャラクター「マシュ」が温かく・個性的に回答します。
        </p>
        {/* Feature badges */}
        <div className="flex justify-center gap-3 flex-wrap">
          {FEATURES.map(({ label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs bg-white/5 text-white/60 rounded-full px-3 py-1.5 border border-white/10"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-white mb-1">マシュに質問する</h2>
        <p className="text-xs text-white/40 mb-4">例:「失恋してつらい」「なんで空は青いの?」「仕事やめたい」</p>
        <QuestionForm />
      </div>

      <Separator className="bg-white/10" />

      {/* Recent Q&As -- social proof */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">みんなの質問・回答</h2>
          <span className="text-xs text-white/40">(匿名)</span>
        </div>
        <Suspense fallback={
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-pink-500/20" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-5/6" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        }>
          <RecentQAs />
        </Suspense>
      </div>
    </div>
  );
}
