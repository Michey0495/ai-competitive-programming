"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
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
      router.push(`/result/${data.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "スキャンに失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <Input
          type="url"
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
          {loading ? "スキャン中..." : "診断する"}
        </Button>
      </div>
      <p className="text-white/40 text-sm mt-3 text-center">
        URLを入力するだけ。登録不要、無料で診断できます。
      </p>
    </form>
  );
}
