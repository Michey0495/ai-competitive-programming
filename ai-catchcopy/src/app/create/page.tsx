"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tones } from "@/data/tones";
import type { ToneValue } from "@/data/tones";
import { Spinner } from "@/components/spell/Spinner";

export default function CreatePage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState<ToneValue>("professional");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!productName.trim() || !description.trim() || !targetAudience.trim()) {
      toast.error("すべての項目を入力してください");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, targetAudience, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const { id } = await res.json();
      router.push(`/result/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Spinner size="lg" className="text-cyan-400 mb-4" />
        <p className="text-white text-lg font-bold">AIがキャッチコピーを生成中...</p>
        <p className="text-white/50 text-sm mt-2">5つの案を考えています</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">キャッチコピーを生成</h1>
      <p className="text-white/50 mb-8">商品・サービスの情報を入力してください</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm text-white/70 mb-2">
            商品・サービス名 <span className="text-cyan-400">*</span>
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="例: AI Catchcopy Generator"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm text-white/70 mb-2">
            説明 <span className="text-cyan-400">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: AIが商品・サービスに最適なキャッチコピーを5案自動生成するWebサービス"
            maxLength={500}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
          />
          <p className="text-white/30 text-xs mt-1">{description.length}/500</p>
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm text-white/70 mb-2">
            ターゲット <span className="text-cyan-400">*</span>
          </label>
          <input
            id="targetAudience"
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="例: マーケター、起業家、広告担当者"
            maxLength={200}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-3">
            トーン <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tones.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  tone === t.value
                    ? "bg-cyan-500/10 border-cyan-400/50 text-cyan-400"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                <p className="font-bold text-sm">{t.label}</p>
                <p className="text-xs mt-0.5 opacity-60">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl text-lg hover:bg-cyan-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
        >
          AIでキャッチコピーを生成
        </button>
      </form>
    </div>
  );
}
