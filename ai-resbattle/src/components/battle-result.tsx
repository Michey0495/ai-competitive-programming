"use client";

import { useEffect, useState } from "react";
import { Battle } from "@/lib/types";
import { ScoreBar } from "./score-bar";
import { ShareButtons } from "./share-buttons";

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}</>;
}

interface BattleResultProps {
  battle: Battle;
  url: string;
}

export function BattleResult({ battle, url }: BattleResultProps) {
  const { restaurant1, restaurant2, winner, summary } = battle;

  const winnerName =
    winner === "restaurant1"
      ? restaurant1.name
      : winner === "restaurant2"
      ? restaurant2.name
      : null;

  const winnerScore =
    winner === "restaurant1"
      ? restaurant1.totalScore
      : winner === "restaurant2"
      ? restaurant2.totalScore
      : null;

  return (
    <div className="space-y-8 w-full max-w-2xl">
      {/* Winner Reveal */}
      <div className="relative animate-[winner-reveal_0.6s_ease-out]">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-2xl blur-xl" />
        <div className="relative bg-white/5 border border-yellow-500/30 rounded-2xl p-8 text-center">
          <p className="text-xs font-mono text-yellow-500/60 tracking-[0.3em] uppercase mb-3">
            Battle Result
          </p>
          <p className="text-4xl font-black text-white mb-2">
            {winnerName ? (
              <>
                <span className="text-yellow-400">{winnerName}</span> の勝利
              </>
            ) : (
              <span className="text-white/70">引き分け</span>
            )}
          </p>
          {winnerScore && (
            <p className="text-lg text-yellow-500/70 font-bold mb-3">
              {winnerScore}点
            </p>
          )}
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Share CTA - immediately after result for maximum conversion */}
      <ShareButtons
        restaurant1={restaurant1.name}
        restaurant2={restaurant2.name}
        winner={winner}
        score1={restaurant1.totalScore}
        score2={restaurant2.totalScore}
        url={url}
      />

      {/* Fighter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { r: restaurant1, side: "restaurant1" as const, color: "blue" },
          { r: restaurant2, side: "restaurant2" as const, color: "orange" },
        ].map(({ r, side, color }) => {
          const isWinner = winner === side;
          return (
            <div
              key={side}
              className={`relative rounded-xl p-5 transition-all duration-300 ${
                isWinner
                  ? "bg-white/5 border-2 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                  : "bg-white/[0.02] border border-white/10"
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black px-3 py-0.5 rounded-full tracking-wider uppercase">
                  Winner
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    color === "blue" ? "bg-blue-500" : "bg-orange-400"
                  }`}
                />
                <span className="text-sm font-bold text-white">{r.name}</span>
              </div>
              <p className="text-4xl font-black text-center text-white mb-2">
                <AnimatedScore value={r.totalScore} />
                <span className="text-base font-normal text-white/30 ml-1">
                  pts
                </span>
              </p>
              <p className="text-xs text-white/40 text-center leading-relaxed">
                {r.comment}
              </p>
            </div>
          );
        })}
      </div>

      {/* Category Scores */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
        <p className="text-xs font-mono text-white/30 tracking-[0.2em] uppercase mb-6">
          Category Breakdown
        </p>
        <div className="flex justify-between text-xs font-medium mb-4">
          <span className="text-blue-400">{restaurant1.name}</span>
          <span className="text-orange-400">{restaurant2.name}</span>
        </div>
        <div className="space-y-5">
          {restaurant1.scores.map((score) => {
            const score2 = restaurant2.scores.find(
              (s) => s.category === score.category
            );
            return (
              <ScoreBar
                key={score.category}
                category={score.category}
                score1={score.score1}
                score2={score.score2}
                comment={score2?.comment ?? score.comment}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
