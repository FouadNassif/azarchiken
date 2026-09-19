// Lightweight event counters — item views (deduped per visitor per day so one
// person refreshing a page doesn't inflate the count), cart-adds, and search
// terms. Backed by Upstash Redis in production (free tier is plenty for a
// restaurant site); falls back to an in-memory store for local dev so this
// works without any setup — see isRedisConfigured().
//
// Requires in production (Vercel):
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, or
//   KV_REST_API_URL / KV_REST_API_TOKEN (same thing, different integration name)
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isRedisConfigured(): boolean {
  return getRedis() !== null;
}

// --- In-memory fallback (single process, resets on restart — dev only) ----
const memCounters = new Map<string, number>();
const memSets = new Map<string, Set<string>>();
const memSortedSets = new Map<string, Map<string, number>>();
const memExpiring = new Map<string, number>(); // key -> expiry epoch ms

function memSetNX(key: string, ttlSeconds: number): boolean {
  const now = Date.now();
  const expiry = memExpiring.get(key);
  if (expiry && expiry > now) return false;
  memExpiring.set(key, now + ttlSeconds * 1000);
  return true;
}

// ---------------------------------------------------------------------------

/** Increments a counter, but only once per (dedupeKey) within ttlSeconds. Returns true if this call counted. */
export async function incrementOncePerWindow(
  counterKey: string,
  dedupeKey: string,
  ttlSeconds: number
): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    const isNew = await redis.set(dedupeKey, "1", { nx: true, ex: ttlSeconds });
    if (!isNew) return false;
    await redis.incr(counterKey);
    return true;
  }
  const isNew = memSetNX(dedupeKey, ttlSeconds);
  if (!isNew) return false;
  memCounters.set(counterKey, (memCounters.get(counterKey) ?? 0) + 1);
  return true;
}

export async function increment(counterKey: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.incr(counterKey);
    return;
  }
  memCounters.set(counterKey, (memCounters.get(counterKey) ?? 0) + 1);
}

export async function addToSet(setKey: string, member: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.sadd(setKey, member);
    return;
  }
  const set = memSets.get(setKey) ?? new Set<string>();
  set.add(member);
  memSets.set(setKey, set);
}

export async function setCardinality(setKey: string): Promise<number> {
  const redis = getRedis();
  if (redis) return redis.scard(setKey);
  return memSets.get(setKey)?.size ?? 0;
}

export async function incrementSortedSet(setKey: string, member: string, by = 1): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.zincrby(setKey, by, member);
    return;
  }
  const zset = memSortedSets.get(setKey) ?? new Map<string, number>();
  zset.set(member, (zset.get(member) ?? 0) + by);
  memSortedSets.set(setKey, zset);
}

export async function topFromSortedSet(setKey: string, count: number): Promise<{ member: string; score: number }[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.zrange(setKey, 0, count - 1, { rev: true, withScores: true });
    const results: { member: string; score: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      results.push({ member: String(raw[i]), score: Number(raw[i + 1]) });
    }
    return results;
  }
  const zset = memSortedSets.get(setKey) ?? new Map<string, number>();
  return [...zset.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([member, score]) => ({ member, score }));
}

/** Simple abuse guard: true if the caller is still under `max` calls within `windowSeconds`. */
export async function underRateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count <= max;
  }
  const count = (memCounters.get(key) ?? 0) + 1;
  memCounters.set(key, count);
  if (count === 1) memSetNX(key, windowSeconds);
  return count <= max;
}

export async function getCounters(keys: string[]): Promise<number[]> {
  if (keys.length === 0) return [];
  const redis = getRedis();
  if (redis) {
    const values = await redis.mget<(number | null)[]>(...keys);
    return values.map((v) => Number(v) || 0);
  }
  return keys.map((k) => memCounters.get(k) ?? 0);
}
