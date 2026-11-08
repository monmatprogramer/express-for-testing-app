import { LRUCache } from "lru-cache";

export const myCache = new LRUCache<string, string>({
  max: 3,
  ttl: 1000 * 60 * 5,
});

// Fake slow database function (take 2 seconds)
export async function getUserFromDatabase(id: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`User_Profile_Date_For_${id}`);
    }, 2000);
  });
}

// Challenge 1
// The countdown timer
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    for (let i: number = 1; i <= 3; i++) {
      resolve(test());
    }
  });
}

function test() {
  setTimeout(() => console.log("Hello "), 4000);
}
