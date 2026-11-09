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
// Before enhance
export async function delayOld(ms: number): Promise<void> {
  return new Promise((resolve) => {
    console.log("Before");
    resolve(countDown(ms));
  });
}

async function test(i: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(console.log(`${i}...`)), 1000);
  });
}
async function countDown2(ms: number) {
  for (let i: number = 1; i <= ms; i++) {
    await test(i);
  }

  console.log("GO!");
}

// After enhance
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export async function delay(seconds: number): Promise<void> {
  console.log("Before");
  for (let i: number = 1; i <= seconds; i++) {
    await sleep(1000);
    console.log(`${i}...`);
  }
  console.log("Go!");
}

// Promise chaining
async function getUser(id: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    console.log("getUser");
    resolve({ id: id, name: "John" });
  });
}

async function getUserPosts(name: string): Promise<{ name: string[] }> {
  return new Promise((resolve) => {
    resolve({ name: ["Post 1", "Post 2"] });
  });
}
export async function callGetUser() {
  await getUser(1).then((result) => getUserPosts(result.name));
}
