const Redis = require("ioredis");
const logger = require("../utils/logger");

let client = null;

const getClient = () => {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      retryStrategy: (times) => Math.min(times * 100, 3000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    client.on("connect",  () => logger.info("✅ Redis connected"));
    client.on("error",    (err) => logger.error(`Redis error: ${err.message}`));
    client.on("close",    () => logger.warn("Redis connection closed"));
  }
  return client;
};

const set = async (key, value, ttlSeconds = 300) => {
  try {
    const redis = getClient();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    logger.error(`Redis SET error [${key}]: ${err.message}`);
  }
};

const get = async (key) => {
  try {
    const redis = getClient();
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    logger.error(`Redis GET error [${key}]: ${err.message}`);
    return null;
  }
};

const del = async (key) => {
  try {
    await getClient().del(key);
  } catch (err) {
    logger.error(`Redis DEL error [${key}]: ${err.message}`);
  }
};

const delPattern = async (pattern) => {
  try {
    const redis = getClient();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    logger.error(`Redis DEL pattern error [${pattern}]: ${err.message}`);
  }
};

// Cache wrapper — returns cached value or calls fn and caches result
const cached = async (key, fn, ttl = 300) => {
  const cached = await get(key);
  if (cached) return cached;
  const result = await fn();
  await set(key, result, ttl);
  return result;
};

module.exports = { getClient, set, get, del, delPattern, cached };
