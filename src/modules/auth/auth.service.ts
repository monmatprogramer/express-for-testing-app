import { db } from "../../db";

export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = await db.orm.public.User.first({ email });
  console.log("user: ", user);
  return;
}
