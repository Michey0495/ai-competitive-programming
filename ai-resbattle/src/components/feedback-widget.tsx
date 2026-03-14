"use client";

import { useState } from "react";

/**
 * フィードバックウィジェット - 全アプリに埋め込む
 * ユーザーからのフィードバックを GitHub Issues に自動投稿
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
      alert("送信に失敗しました");
    }
  };

  const typeLabels = {
    bug: "不具合",
    feature: "要望",
    other: "その他",
  };

  const typeDots = {
    bug: "bg-red-400",
    feature: "bg-blue-400",
    other: "bg-white/40",
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 text-sm z-50"
      >
        フィードバック
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/95 border border-white/10 rounded-xl shadow-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white">
          フィードバック
        </h3>
        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors text-sm">
          閉じる
        </button>
      </div>
      {sent ? (
        <div className="text-emerald-400 text-center py-4">
          <p>送信しました。ありがとうございます。</p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {(["bug", "feature", "other"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all duration-200 ${
                  type === t ? "bg-blue-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${typeDots[t]}`} />
                {typeLabels[t]}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ご意見をお聞かせください..."
            className="w-full border border-white/10 bg-white/5 text-white placeholder:text-white/40 rounded-lg p-2 text-sm h-24 resize-none mb-3 focus:outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={submit}
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600 transition-all duration-200"
          >
            送信
          </button>
        </>
      )}
    </div>
  );
}
