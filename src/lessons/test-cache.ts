import { callGetUser, delay, getUserFromDatabase } from "./cache";

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
callGetUser();
