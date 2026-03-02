"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { MinutesResult } from "@/lib/types";
import { MinutesResultCard } from "@/components/minutes-result";

export function MinutesForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MinutesResult | null>(null);

  const handleSubmit = async () => {
    if (notes.trim().length < 10) {
      toast.error("会議メモは10文字以上入力してください");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, participants, notes }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "エラーが発生しました");
        return;
      }

      const data: MinutesResult = await res.json();
      setResult(data);
      toast.success("議事録を生成しました");
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <MinutesResultCard result={result} />
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setNotes("");
            }}
            className="cursor-pointer border-white/10 text-white hover:bg-white/5"
          >
            新しい議事録を作成
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 p-6 space-y-5">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm text-white/70">会議タイトル</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="例: 第3回プロジェクト定例"
          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#10b981] transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm text-white/70">日付</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="participants" className="text-sm text-white/70">参加者</label>
          <input
            id="participants"
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            maxLength={200}
            placeholder="例: 田中、佐藤、鈴木"
            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#10b981] transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm text-white/70">
          会議メモ / 発言ログ
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={20000}
          placeholder={"会議の内容をメモやログとして貼り付けてください。\n\n例:\n田中: 新機能のリリース日について相談したい\n佐藤: 来週金曜はどうか\n田中: テストが間に合うか確認が必要\n鈴木: QAチームに確認して明日回答する"}
          rows={10}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-[#10b981] resize-none"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full cursor-pointer bg-[#10b981] hover:bg-[#059669] text-black font-semibold py-3 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            AIが議事録を生成しています...
          </span>
        ) : (
          "議事録を生成する"
        )}
      </Button>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-white/5 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
      )}
    </Card>
  );
}
