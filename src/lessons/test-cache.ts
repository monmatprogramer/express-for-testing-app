import { getUserFromDatabase } from "./cache";

async function showUser() {
  console.log("Fetching user...");

  const user = await getUserFromDatabase("101");

  console.log(user);
}
