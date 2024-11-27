import Queue from "bull";
import Redis from "ioredis";
import { config } from "dotenv";

// setting the env variables
const result = config();

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Connected to Upstash Redis."));
redis.on("error", (err) => console.error("Redis connection error:", err));

// Create a Bull queue
export const messageQueue = new Queue("messageQueue", {
  redis: redis, // Connect Bull to your Redis instance
});
