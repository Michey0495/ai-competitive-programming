"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BattleForm() {
  const router = useRouter();
  const [restaurant1, setRestaurant1] = useState("");
  const [restaurant2, setRestaurant2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="space-y-2">
          <Label htmlFor="restaurant1" className="text-white/60">レストラン 1</Label>
          <Input
            id="restaurant1"
            placeholder="例: スターバックス"
            value={restaurant1}
            onChange={(e) => setRestaurant1(e.target.value)}
            maxLength={50}
            disabled={loading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
          />
        </div>

        <div className="pb-2 text-white/40 font-bold text-sm">
          VS
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant2" className="text-white/60">レストラン 2</Label>
          <Input
            id="restaurant2"
            placeholder="例: ドトール"
            value={restaurant2}
            onChange={(e) => setRestaurant2(e.target.value)}
            maxLength={50}
            disabled={loading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:border-blue-400 focus-visible:ring-blue-400/30"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
        size="lg"
        disabled={loading || !restaurant1.trim() || !restaurant2.trim()}
      >
        {loading ? "AI判定中..." : "バトル開始"}
      </Button>
    </form>
  );
}
