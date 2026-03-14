"use client";

import { useState } from "react";
import { toast } from "sonner";

/**
 * Feedback widget - embedded in all apps
 * Auto-posts user feedback to GitHub Issues
 */
export function FeedbackWidget({ repoName }: { repoName: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature" | "other">("bug");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!message.trim()) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, repo: repoName }),
      });
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setMessage("");
      }, 2000);
    } catch {
      toast.error("送信に失敗しました");
    }
  };

  const typeConfig = {
    bug: { label: "不具合" },
    feature: { label: "要望" },
    other: { label: "その他" },
  } as const;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-pink-500/80 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-500 transition-all duration-200 text-sm z-50 border border-pink-400/30"
      >
        フィードバック
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/95 border border-white/10 rounded-xl shadow-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white">フィードバック</h3>
        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors text-sm" aria-label="閉じる">
          閉じる
        </button>
      </div>
      {sent ? (
        <p className="text-green-400 text-center py-4">送信しました ありがとうございます</p>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["bug", "feature", "other"] as const).map((t) => {
              const { label } = typeConfig[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    type === t ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ご意見をお聞かせください..."
            aria-label="フィードバック内容"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm h-24 resize-none mb-3 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-400/50"
          />
          <button
            onClick={submit}
            className="w-full bg-pink-500 text-white py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors"
          >
            送信
          </button>
        </>
      )}
    </div>
  );
}
