import { randomBytes } from "node:crypto";
import { db } from "../../db";
import { createRefreshToken, hashPassword, verifyPassword } from "./password";
import { hashRefreshToken } from "./tokens";
const dummyPasswordHash = hashPassword(randomBytes(32).toString("hex"));
const REFRESH_TTL_MS = 7 + 24 * 60 * 60 * 1000;
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

  const refreshToken = createRefreshToken();

  //Create session
  const session = await db.orm.public.Session.create({
    userId: user.id,
    currentTokenHash: hashRefreshToken(refreshToken),
    expiredAt: new Date(Date.now() + REFRESH_TTL_MS),
  });
  return;
}
