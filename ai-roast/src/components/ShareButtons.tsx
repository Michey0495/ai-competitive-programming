"use client";

import { toast } from "sonner";

type Props = {
  shareUrl: string;
  shareText: string;
  name: string;
};

export function ShareButtons({ shareUrl, shareText, name }: Props) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("リンクをコピーしました！");
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-bold text-gray-600">
        {name}さんのロースト結果をシェアしよう！
      </p>
      <div className="flex gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <span>𝕏</span>
          <span>Xでシェア</span>
        </a>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          🔗 リンクをコピー
        </button>
      </div>
    </div>
  );
}
