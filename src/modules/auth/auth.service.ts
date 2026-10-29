import { randomBytes } from "node:crypto";
import { db } from "../../db";
import { createRefreshToken, hashPassword, verifyPassword } from "./password";
import { hashRefreshToken, signAccessToken } from "./tokens";
import {v4 as uuiv4} from "uuid"
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

  try {
    //Create session
    const session = await db.orm.public.Session.create({
      userId: user.id,
      currentTokenHash: hashRefreshToken(refreshToken),
      expiredAt: new Date(Date.now() + REFRESH_TTL_MS),
      ip: "192.168.0.0",
      userAgent: "windows",
    });
  
    const new = {
      accessToken: signAccessToken({sub:`Session-${uuiv4()}`, role:user.role, sid: user.id}),
      refreshToken,
      user: , 
    }
    
  } catch (error: unknown) {
    throw new Error("Error on creating session");
  }
  return;
}
