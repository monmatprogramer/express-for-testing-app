import { callGetUser, delay, getUserFromDatabase } from "./cache";

import { myCache } from "./cache";

myCache.set("user1", "This is user 1");

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
};

main();
