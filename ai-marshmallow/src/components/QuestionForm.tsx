"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/spell/Spinner";

const MAX_LENGTH = 280;

const EXAMPLES = [
  "失恋してつらい",
  "仕事やめたい",
  "なんで空は青いの?",
  "友達に嫌なことを言われた",
  "将来が不安",
  "好きな人に告白したい",
];

export function QuestionForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "エラーが発生しました");
        setIsLoading(false);
        return;
      }

      const question = await res.json();
      toast.success("マシュが回答しました!");
      router.push(`/q/${question.id}`);
    } catch {
      toast.error("通信エラーが発生しました。しばらく後にお試しください。");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="今、何に困ってる? なんでも聞いてみて (匿名OK)"
        aria-label="質問を入力"
        maxLength={MAX_LENGTH}
        rows={4}
        className="resize-none text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:border-pink-400/50 focus-visible:ring-pink-400/20"
        disabled={isLoading}
      />
      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="text-xs bg-white/5 hover:bg-white/10 text-white/60 rounded-full px-2.5 py-1 transition-colors border border-white/10"
            disabled={isLoading}
          >
            {ex}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${value.length > MAX_LENGTH * 0.9 ? "text-orange-400" : "text-white/40"}`}>
          {value.length} / {MAX_LENGTH}
        </span>
        <Button
          type="submit"
          disabled={!value.trim() || isLoading}
          size="sm"
          className="bg-pink-500 hover:bg-pink-600 text-white"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              マシュが考え中...
            </span>
          ) : (
            "質問を送る"
          )}
        </Button>
      </div>
    </form>
  );
}
