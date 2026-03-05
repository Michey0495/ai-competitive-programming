"use client";

import { useState } from "react";

interface ShareButtonsProps {
  restaurant1: string;
  restaurant2: string;
  winner: string;
  score1: number;
  score2: number;
  url: string;
}

export function ShareButtons({ restaurant1, restaurant2, winner, score1, score2, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const winnerName =
    winner === "restaurant1"
      ? restaurant1
      : winner === "restaurant2"
      ? restaurant2
      : "引き分け";

  const text = `${restaurant1}(${score1}点) vs ${restaurant2}(${score2}点)\n\nAI判定の勝者は「${winnerName}」\n\n#AIレスバトル`;

  function shareX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  function shareLine() {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
      <p className="text-xs font-mono text-white/30 tracking-[0.2em] uppercase mb-4 text-center">
        Share Result
      </p>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={shareX}
          className="bg-white/5 border border-white/10 rounded-lg py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
        >
          X でシェア
        </button>
        <button
          onClick={shareLine}
          className="bg-white/5 border border-white/10 rounded-lg py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
        >
          LINE でシェア
        </button>
        <button
          onClick={copyLink}
          disabled={copied}
          className="bg-white/5 border border-white/10 rounded-lg py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer disabled:text-white/30"
        >
          {copied ? "コピー済み" : "リンクをコピー"}
        </button>
      </div>
    </div>
  );
}
