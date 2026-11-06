import { LRUCache } from "lru-cache/raw";

export const myCache = new LRUCache<string, string>({
  max: 3,
  ttl: 1000 * 60 * 5,
});
