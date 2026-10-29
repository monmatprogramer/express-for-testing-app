import { db } from "../../db";
import { verifyPassword } from "./password";
export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  // Check if user is not existing in db
  const user = await db.orm.public.User.where({ email })
    .select("id", "role", "passwordHash")
    .first();
  if (!user) {
    throw new Error("User does not exist");
  }
  const passwordMathes = await verifyPassword(
    input.password,
    user!.passwordHash,
  );
  console.log(passwordMathes);
  return;
}
