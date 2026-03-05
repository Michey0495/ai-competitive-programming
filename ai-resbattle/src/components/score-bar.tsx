interface ScoreBarProps {
  score1: number;
  score2: number;
  category: string;
  comment: string;
}

export function ScoreBar({ score1, score2, category, comment }: ScoreBarProps) {
  const total = score1 + score2;
  const pct1 = total === 0 ? 50 : Math.round((score1 / total) * 100);
  const pct2 = 100 - pct1;
  const winner = score1 > score2 ? 1 : score2 > score1 ? 2 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold tabular-nums ${winner === 1 ? "text-blue-400" : "text-white/50"}`}>
          {score1}
        </span>
        <span className="text-xs text-white/30 font-medium">{category}</span>
        <span className={`text-sm font-bold tabular-nums ${winner === 2 ? "text-orange-400" : "text-white/50"}`}>
          {score2}
        </span>
      </div>
      <div
        className="flex h-2 rounded-full overflow-hidden bg-white/5"
        role="img"
        aria-label={`${category}: ${score1}点 vs ${score2}点`}
      >
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out animate-[score-fill_1s_ease-out]"
          style={{ width: `${pct1}%` }}
        />
        <div className="w-px bg-black" />
        <div
          className="bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 ease-out animate-[score-fill_1s_ease-out]"
          style={{ width: `${pct2}%` }}
        />
      </div>
      <p className="text-xs text-white/30 text-center">{comment}</p>
    </div>
  );
}
