import { callGetUser, delay, getUserFromDatabase } from "./cache";

import { myCache, myNewCache } from "./cache";

myCache.set("user1", "This is user 1");
myNewCache.set("user2", {
  browser: "Chrome",
  os: "macOS",
  device: "Macintoh",
});

// @ts-expect-error

async function showUser() {
  console.log("Fetching user...");

  const user = await getUserFromDatabase("101");

  console.log(user);
}
// @ts-expect-error
async function runCountDown() {
  await delay(3);
}

// Call the function
// callGetUser();
//
// -- main --
const main = () => {
  console.log(myCache.has("user2"));
  console.log(myNewCache.get("user2"));
};

main();
