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

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-blue-600">{score1}</span>
        <span className="text-muted-foreground">{category}</span>
        <span className="text-orange-500">{score2}</span>
      </div>
      <div
        className="flex h-3 rounded-full overflow-hidden bg-muted"
        role="img"
        aria-label={`${category}: ${score1}点 vs ${score2}点`}
      >
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="bg-orange-400 transition-all duration-700"
          style={{ width: `${pct2}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">{comment}</p>
    </div>
  );
}
