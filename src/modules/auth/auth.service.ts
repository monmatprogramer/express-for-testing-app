import { db } from "../../db";
import { randomBytes } from "node:crypto";
export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = await db.orm.public.User.first({ email });

  console.log("user: ", user);
  console.log("---create refresh token----");
  console.log(randomBytes(32).toString("base64url"));
  return;
}
