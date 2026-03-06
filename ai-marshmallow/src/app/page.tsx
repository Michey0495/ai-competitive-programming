import { Suspense } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import { QACard } from "@/components/QACard";
import { ShimmerText } from "@/components/spell/ShimmerText";
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

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(236,72,153,0.3),transparent)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <ShimmerText variant="pink" className="text-xs font-mono tracking-[0.3em] uppercase mb-6">AI Marshmallow</ShimmerText>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">AIマシュマロ</h1>
          <p className="text-white/40 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">誰にも言えないこと、マシュに聞いてみませんか?</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
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
    </div>
  );
}
