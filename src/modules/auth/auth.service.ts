import { db } from "../../db";
import { verifyPassword } from "./password";
export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = await db.orm.public.User.where({ email })
    .select("id", "role", "passwordHash")
    .first();
  const passwordMathes = await verifyPassword(
    input.password,
    user!.passwordHash,
  );
  console.log(passwordMathes);
  return;
}
