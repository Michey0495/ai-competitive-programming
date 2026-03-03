import type { Battle } from "./types";

const BATTLE_TTL = 60 * 60 * 24 * 30; // 30日

const memoryStore = new Map<string, Battle>();
const memoryList: string[] = [];

async function getKV() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import("@vercel/kv");
    return kv;
  }
  return null;
}

export async function saveBattle(battle: Battle): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.set(`battle:${battle.id}`, battle, { ex: BATTLE_TTL });
    await kv.lpush("battles:recent", battle.id);
    await kv.ltrim("battles:recent", 0, 199);
  } else {
    memoryStore.set(battle.id, battle);
    memoryList.unshift(battle.id);
    if (memoryList.length > 200) memoryList.pop();
  }
}

export async function getBattle(id: string): Promise<Battle | null> {
  const kv = await getKV();
  if (kv) {
    return kv.get<Battle>(`battle:${id}`);
  }
  return memoryStore.get(id) ?? null;
}

export async function getRecentBattleIds(limit = 20): Promise<string[]> {
  const kv = await getKV();
  if (kv) {
    return kv.lrange("battles:recent", 0, limit - 1);
  }
  return memoryList.slice(0, limit);
}
