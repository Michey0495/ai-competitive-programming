import Link from "next/link";
import { InterviewForm } from "@/components/InterviewForm";
import { RecentInterviews } from "@/components/RecentInterviews";
import { ShimmerText } from "@/components/spell/ShimmerText";

export default function Home() {
  return (
    <div className="min-w-0">

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.3),transparent)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <ShimmerText variant="violet" className="text-xs font-mono tracking-[0.3em] uppercase mb-6">AI Mock Interview</ShimmerText>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">AI面接練習</h1>
          <p className="text-white/40 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">AIが面接官になって、あなたの回答を本気で評価します。</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* How it works */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { step: "1", title: "入力", desc: "職種・自己PRを記入" },
            { step: "2", title: "面接", desc: "AIが質問を生成" },
            { step: "3", title: "判定", desc: "S~Dランクで評価" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-violet-400 font-black text-lg mb-1">
                {item.step}
              </div>
              <div className="text-white text-sm font-bold">{item.title}</div>
              <div className="text-white/40 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <InterviewForm />

        {/* Recent Results */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">最近の面接結果</h2>
            <Link
              href="/feed"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              すべて見る
            </Link>
          </div>
          <RecentInterviews />
        </div>
      </div>
    </div>
  );
}
