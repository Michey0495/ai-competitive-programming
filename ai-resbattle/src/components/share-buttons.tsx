"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  restaurant1: string;
  restaurant2: string;
  winner: string;
  url: string;
}

export function ShareButtons({ restaurant1, restaurant2, winner, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const winnerName =
    winner === "restaurant1"
      ? restaurant1
      : winner === "restaurant2"
      ? restaurant2
      : "引き分け";

  const text = `【AIレスバトル】${restaurant1} vs ${restaurant2}の勝者は「${winnerName}」！\n#AIレスバトル`;

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
    <div className="flex flex-wrap gap-2 justify-center">
      <Button variant="outline" size="sm" onClick={shareX}>
        𝕏 でシェア
      </Button>
      <Button variant="outline" size="sm" onClick={shareLine}>
        LINE でシェア
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink} disabled={copied}>
        {copied ? "コピーしました" : "リンクをコピー"}
      </Button>
    </div>
  );
}
