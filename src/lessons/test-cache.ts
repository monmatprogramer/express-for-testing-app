import { delay, getUserFromDatabase } from "./cache";

// @ts-expect-error
async function showUser() {
  console.log("Fetching user...");

  const user = await getUserFromDatabase("101");

  console.log(user);
}
async function runCountDown() {
  await delay(3);
  console.log("Go!");
}

// Call the function

runCountDown();
