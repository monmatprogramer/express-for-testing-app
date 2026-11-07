import { delay, getUserFromDatabase } from "./cache";

// @ts-expect-error
async function showUser() {
  console.log("Fetching user...");

  const user = await getUserFromDatabase("101");

  console.log(user);
}
async function runCountDown() {
  console.log("Cont down is start...");
  await delay(3);
  console.log("Finish");
}

// Call the function

runCountDown();
