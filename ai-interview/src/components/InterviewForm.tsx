"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/spell/Spinner";

export function InterviewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    position: "",
    industry: "",
    experience: "",
    selfpr: "",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.position.trim()) {
      toast.error("希望職種を入力してください");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "エラーが発生しました");
        return;
      }
      router.push(`/result/${data.id}`);
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-white/70 mb-1.5">
            希望職種 <span className="text-violet-400">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="例: フロントエンドエンジニア"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-white/70 mb-1.5">
            業界
          </label>
          <input
            id="industry"
            type="text"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            placeholder="例: IT・Web"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-white/70 mb-1.5">
            経験年数
          </label>
          <input
            id="experience"
            type="text"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="例: 3年"
            maxLength={50}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="selfpr" className="block text-sm font-medium text-white/70 mb-1.5">
            自己PR
          </label>
          <textarea
            id="selfpr"
            value={form.selfpr}
            onChange={(e) => setForm({ ...form, selfpr: e.target.value })}
            placeholder="あなたの強みやスキルを教えてください"
            maxLength={500}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-200 resize-none"
          />
        </div>

        <div>
          <label htmlFor="motivation" className="block text-sm font-medium text-white/70 mb-1.5">
            志望動機
          </label>
          <textarea
            id="motivation"
            value={form.motivation}
            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
            placeholder="なぜこの職種を志望するのか教えてください"
            maxLength={500}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all duration-200 resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-violet-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            面接官が準備中...
          </span>
        ) : (
          "面接を受ける"
        )}
      </button>
    </form>
  );
}
