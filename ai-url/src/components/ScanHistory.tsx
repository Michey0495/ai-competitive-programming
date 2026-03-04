"use client";

import { useState } from "react";
import Link from "next/link";

export interface HistoryEntry {
  id: string;
  url: string;
  totalScore: number;
  maxTotalScore: number;
  scannedAt: string;
}

const HISTORY_KEY = "aeo-scan-history";
const MAX_HISTORY = 10;

export function getScanHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToScanHistory(entry: HistoryEntry) {
  const history = getScanHistory();
  // Remove duplicate URLs (keep latest)
  const filtered = history.filter((h) => h.url !== entry.url);
  filtered.unshift(entry);
  // Trim to max
  const trimmed = filtered.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

function scoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "text-emerald-400";
  if (pct >= 50) return "text-yellow-400";
  return "text-red-400";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

export function ScanHistory() {
  const [history] = useState<HistoryEntry[]>(() => getScanHistory());

  if (history.length === 0) return null;

  return (
    <section className="py-16 px-4 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          最近の診断履歴
        </h2>
        <div className="space-y-2">
          {history.map((entry) => (
            <Link
              key={`${entry.id}-${entry.scannedAt}`}
              href={`/result/${entry.id}`}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/[0.08] transition-all duration-200 cursor-pointer block"
            >
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {entry.url}
                </p>
                <p className="text-white/30 text-xs mt-1">
                  {formatDate(entry.scannedAt)}
                </p>
              </div>
              <div className="ml-4 shrink-0 text-right">
                <span
                  className={`text-2xl font-bold font-mono ${scoreColor(entry.totalScore, entry.maxTotalScore)}`}
                >
                  {entry.totalScore}
                </span>
                <span className="text-white/30 text-sm">
                  /{entry.maxTotalScore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
