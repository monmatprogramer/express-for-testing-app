import { delay, getUserFromDatabase } from "./cache";

// @ts-expect-error
async function showUser() {
  console.log("Fetching user...");

  const user = await getUserFromDatabase("101");

  console.log(user);
}
async function runCountDown() {
  console.log("Cont down is start...");
  for (let i: number = 3; i >= 1; i--) {
    await delay(i);
  }
  console.log("Go!");
}

// Call the function

runCountDown();
