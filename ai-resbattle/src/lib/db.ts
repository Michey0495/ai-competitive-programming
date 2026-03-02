import { kv } from "@vercel/kv";
import type { Battle } from "./types";

const BATTLE_TTL = 60 * 60 * 24 * 30; // 30日

export async function saveBattle(battle: Battle): Promise<void> {
  await kv.set(`battle:${battle.id}`, battle, { ex: BATTLE_TTL });
  await kv.lpush("battles:recent", battle.id);
  await kv.ltrim("battles:recent", 0, 199);
}

export async function getBattle(id: string): Promise<Battle | null> {
  return kv.get<Battle>(`battle:${id}`);
}

export async function getRecentBattleIds(limit = 20): Promise<string[]> {
  return kv.lrange("battles:recent", 0, limit - 1);
}
