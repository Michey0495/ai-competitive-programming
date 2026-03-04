import type { ScanResult } from "@/types";

// In-memory store for MVP (replace with Vercel KV in production)
const results = new Map<string, ScanResult>();

export function setResult(id: string, result: ScanResult) {
  results.set(id, result);
}

export function getResult(id: string): ScanResult | undefined {
  return results.get(id);
}
