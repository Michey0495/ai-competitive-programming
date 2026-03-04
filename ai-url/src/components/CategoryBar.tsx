"use client";

import type { CategoryResult } from "@/types";

interface CategoryBarProps {
  category: CategoryResult;
  prevScore?: number;
  isExpanded?: boolean;
  onClick?: () => void;
}

export function CategoryBar({ category, prevScore, isExpanded, onClick }: CategoryBarProps) {
  const percentage = (category.score / category.maxScore) * 100;

  const barColor =
    percentage >= 80
      ? "bg-emerald-400"
      : percentage >= 50
        ? "bg-yellow-400"
        : "bg-red-400";

  const diff = prevScore !== undefined ? category.score - prevScore : null;

  return (
    <button
      onClick={onClick}
      aria-expanded={isExpanded}
      className="w-full text-left bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/[0.08] cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">
          {category.label}
        </span>
        <div className="flex items-center gap-2">
          {diff !== null && diff !== 0 && (
            <span
              className={`text-xs font-medium ${diff > 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {diff > 0 ? "+" : ""}
              {diff}
            </span>
          )}
          <span className="text-white/70 text-sm">
            {category.score} / {category.maxScore}
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </button>
  );
}
