"use client";

import { useState } from "react";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          message,
          page: window.location.pathname,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setRating(0);
        setMessage("");
      }, 2000);
    } catch {
      // silent fail
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-black border border-white/10 rounded-lg p-4 w-72 space-y-3">
          {submitted ? (
            <p className="text-white/70 text-sm text-center py-4">
              ありがとうございます
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">フィードバック</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="閉じる"
                  className="text-white/30 hover:text-white/60 text-lg leading-none cursor-pointer transition-all duration-200"
                >
                  &times;
                </button>
              </div>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n}点`}
                    className={`w-9 h-9 rounded cursor-pointer transition-all duration-200 text-sm ${
                      n <= rating
                        ? "bg-[#10b981] text-black"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ご意見をお聞かせください（任意）"
                rows={2}
                className="w-full rounded bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#10b981] resize-none transition-all duration-200"
              />
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || sending}
                className="w-full py-2 rounded bg-[#10b981] hover:bg-[#059669] text-black text-sm font-semibold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? "送信中..." : "送信"}
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white/70 rounded-full px-4 py-2 text-sm cursor-pointer transition-all duration-200"
        >
          ご意見
        </button>
      )}
    </div>
  );
}
