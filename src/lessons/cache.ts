import { LRUCache } from "lru-cache";

export const myCache = new LRUCache<string, string>({
  max: 3,
  ttl: 1000 * 60 * 5,
});

// Fake slow database function (take 2 seconds)
