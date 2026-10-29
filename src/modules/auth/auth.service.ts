import { randomBytes } from "node:crypto";
import { db } from "../../db";
import { hashPassword, verifyPassword } from "./password";
const dummyPasswordHash = hashPassword(randomBytes(32).toString("hex"));
export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  // Check if user is not existing in db
  // Take time to search user
  // But it search very fast (5milliseconds)
  const user = await db.orm.public.User.where({ email })
    .select("id", "role", "passwordHash")
    .first();
  if (!user) {
    throw new Error("User does not exist");
  }

  const passwordHash = user?.passwordHash ?? (await dummyPasswordHash);
  // It take too time (slow)
  // Before it has heavy math
  const passwordMathes = await verifyPassword(input.password, passwordHash);
  if (!user || !passwordHash) {
    throw new Error("Invalid email or password.");
  }
  if (!passwordMathes) {
    throw new Error("Incorrect credential.");
  }
  console.log(passwordMathes);
  return;
}
