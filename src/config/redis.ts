import { createClient, RedisClientType } from "redis";
import { env } from "./env";

export let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<void> => {
  if (!env.redisEnabled) {
    console.log("Redis disabled");
    return;
  }

  if (!env.redisUrl) {
    console.warn("REDIS_URL is empty; skipping Redis connection");
    return;
  }

  redisClient = createClient({ url: env.redisUrl });

  redisClient.on("error", (err) => {
    console.error("Redis error", err);
  });

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed; continuing without Redis", err);
  }
};
