import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function generateCacheKey(group: string, params: Record<string, any>) {
  const sortedParams = Object.fromEntries(
    Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
  );
  const json = JSON.stringify(sortedParams);
  const hash = crypto.createHash("md5").update(json).digest("hex");
  return `cache:${group}:${hash}`;
}

type FetchFn<T> = () => Promise<T>;

export async function getCachedData<T>(
  group: string,
  params: Record<string, any>,
  fetchFn: FetchFn<T>,
  ttl = 86400 // 1 day in seconds
): Promise<T> {
  if (process.env.CACHE_DISABLE!) {
    return await fetchFn();
  }

  const key = generateCacheKey(group, params);
  const groupSetKey = `groupkeys:${group}`;

  const cached = await redis.get<T>(key);
  if (cached) {
    console.log(`🔁 Cache hit for key: ${key}`);
    return cached;
  }

  console.log(`📡 Cache miss. Fetching and storing key: ${key}`);
  const data = await fetchFn();

  await redis.set(key, data, { ex: ttl });

  await redis.sadd(groupSetKey, key);

  const groupTtl = await redis.ttl(groupSetKey);
  if (groupTtl === -1) {
    await redis.expire(groupSetKey, ttl);
  }

  return data;
}

export async function invalidateGroupCache(group: string): Promise<void> {
  const groupSetKey = `groupkeys:${group}`;
  const keys = await redis.smembers(groupSetKey);

  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`🧹 Cleared ${keys.length} cache keys in group: ${group}`);
  }

  await redis.del(groupSetKey);
}
