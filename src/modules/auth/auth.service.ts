import { randomBytes } from "node:crypto";
import { db } from "../../db";
import { createRefreshToken, hashPassword, verifyPassword } from "./password";
import { hashRefreshToken, signAccessToken } from "./tokens";
const dummyPasswordHash = hashPassword(randomBytes(32).toString("hex"));
const REFRESH_TTL_MS = 7 + 24 * 60 * 60 * 1000;
export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  // Check if user is not existing in db
  // Take time to search user
  // But it search very fast (5milliseconds)
  const user = await db.orm.public.User.where({ email })
    .select("id", "role", "passwordHash", "name", "email")
    .first();
  if (!user) {
    throw new Error("User does not exist");
  }

  const passwordHash = user?.passwordHash ?? (await dummyPasswordHash);
  // It take too time (slow)
  // Before it has heavy math
  const passwordMathes = await verifyPassword(input.password, passwordHash);
  if (!user || !passwordMathes) {
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

    const newObject = {
      accessToken: signAccessToken({
        sub: session.id,
        role: user.role,
        sid: user.id,
      }),
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      refreshToken: refreshToken,
    };
  } catch (error: unknown) {
    throw new Error("Error on creating session");
  }
  return;
}

export async function refresh(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);
  // Find the hash token in session db
  try {
  } catch (error) {
    console.error(error);
  }
}
