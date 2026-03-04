"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToScanHistory } from "@/components/ScanHistory";

const SCAN_STEPS = [
  "ページを取得中...",
  "llms.txt をチェック中...",
  "robots.txt をチェック中...",
  "構造化データを分析中...",
  "メタタグを検査中...",
  "コンテンツ構造を分析中...",
  "内部リンクを調査中...",
  "技術的要素を検査中...",
  "スコアを計算中...",
];

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let targetUrl = url.trim();
    if (!targetUrl) return;

    if (
      !targetUrl.startsWith("http://") &&
      !targetUrl.startsWith("https://")
    ) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      new URL(targetUrl);
    } catch {
      toast.error("有効なURLを入力してください");
      return;
    }

    setLoading(true);
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((prev) =>
        prev < SCAN_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 2500);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "スキャンに失敗しました");
      }

      const data = await res.json();

      addToScanHistory({
        id: data.id,
        url: data.url,
        totalScore: data.totalScore,
        maxTotalScore: data.maxTotalScore,
        scannedAt: data.scannedAt,
      });

      router.push(`/result/${data.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "スキャンに失敗しました"
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            aria-label="診断するURLを入力"
            className="flex-1 h-14 bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !url.trim()}
            className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg cursor-pointer transition-all duration-200"
          >
            {loading ? "診断中..." : "診断する"}
          </Button>
        </div>
      </form>
      {loading ? (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-5 py-3">
            <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-white/70 text-sm">
              {SCAN_STEPS[stepIndex]}
            </span>
          </div>
          <div className="mt-3">
            <div className="w-48 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((stepIndex + 1) / SCAN_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white/40 text-sm mt-3 text-center">
          URLを入力するだけ。登録不要、無料で診断できます。
        </p>
      )}
    </div>
  );
}
