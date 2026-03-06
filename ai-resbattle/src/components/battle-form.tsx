"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spell/Spinner";

export function BattleForm() {
  const router = useRouter();
  const [restaurant1, setRestaurant1] = useState("");
  const [restaurant2, setRestaurant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doSubmit() {
    if (!restaurant1.trim() || !restaurant2.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant1, restaurant2 }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "エラーが発生しました");
        return;
      }

      const { id } = await res.json();
      router.push(`/battle/${id}`);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doSubmit();
  }

  const ready = restaurant1.trim() && restaurant2.trim();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Restaurant 1 */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-blue-400/80 tracking-wider uppercase">
            Fighter 1
          </label>
          <input
            placeholder="例: スターバックス"
            value={restaurant1}
            onChange={(e) => setRestaurant1(e.target.value)}
            maxLength={50}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all duration-300"
          />
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center py-1 md:pt-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center border-2 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <span className="text-white font-black text-base md:text-lg tracking-tighter">VS</span>
            </div>
          </div>
        </div>

        {/* Restaurant 2 */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-orange-400/80 tracking-wider uppercase">
            Fighter 2
          </label>
          <input
            placeholder="例: ドトール"
            value={restaurant2}
            onChange={(e) => setRestaurant2(e.target.value)}
            maxLength={50}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/5 transition-all duration-300"
          />
        </div>
      </div>

      {error && (
        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => doSubmit()}
            className="text-xs text-white/40 hover:text-white/70 underline transition-colors cursor-pointer"
          >
            もう一度試す
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !ready}
        className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 cursor-pointer ${
          loading
            ? "bg-white/5 text-white/30 border border-white/10 animate-[pulse-glow_2s_ease-in-out_infinite]"
            : ready
            ? "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <Spinner size="sm" className="text-red-400" />
            AI判定中...
          </span>
        ) : (
          "バトル開始"
        )}
      </button>
    </form>
  );
}
