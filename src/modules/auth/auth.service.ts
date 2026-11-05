import { randomBytes } from "node:crypto";
import { db } from "../../db.js";
import { Logger } from "@/common/logger";
import {
  createRefreshToken,
  hashPassword,
  verifyPassword,
} from "./password.js";
import { or } from "@prisma/orm-postgres/orm-client";
import { hashRefreshToken, signAccessToken } from "./tokens.js";

const dummyPasswordHash = hashPassword(randomBytes(32).toString("hex"));
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export async function login(input: {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
}) {
  const email = input.email.trim().toLowerCase();
  // Check if user is not existing in db
  // Take time to search user
  // But it search very fast (5milliseconds)
  const user = await db.orm.public.User.where({ email })
    .select("id", "role", "passwordHash", "name", "email")
    .first();

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
      ip: input.ip,
      userAgent: input.userAgent,
    });

    const newObject = {
      sessionid: session.id, //for testing.
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
    return newObject;
  } catch (error: unknown) {
    throw new Error("Error on creating session");
  }
}
async function refreshTransaction(hashedToken: string) {
  return await db.transaction(async (tx) => {
    // Search session by hashed token
    const session = await tx.orm.public.Session.where((s) =>
      or(
        s.currentTokenHash.eq(hashedToken),
        s.previousTokenHash.eq(hashedToken),
      ),
    )
      .forUpdate()
      .first();
    // If not found
    if (session === null) {
      throw new Error("Unauthorized");
    }

    // Session is found but has revoke at time
    if (session.revokedAt !== null) {
      throw new Error("Session has been revoked");
    }

    // Session is found and not revoke time, check expired date
    if (new Date(session.expiredAt).getTime() <= Date.now()) {
      throw new Error("Session expired");
    }

    // Create a current token
    // When currentTokenHash == hashedToken mean token is not expire
    const isCurrent = session.currentTokenHash === hashedToken;
    // Set up new refreshToken when currentTokenHash is expired
    if (!isCurrent) {
      const lastRotatedTime =
        new Date(session.expiredAt).getTime() - REFRESH_TTL_MS;

      const timeSinceRotation = Date.now() - lastRotatedTime;
      const REFRESH_GRACE_PERIOD_MS = 10 * 1000;

      if (timeSinceRotation <= REFRESH_GRACE_PERIOD_MS) {
        throw new Error(
          "Token was already refreshed concurrently. Please retry with the last token",
        );
      }

      await tx.orm.public.Session.where({ userId: session.userId }).updateAll({
        revokedAt: new Date(),
      });

      throw new Error("Token reuse detected. All sessions revoked.");
    }

    const user = await tx.orm.public.User.first({ id: session.userId });
    if (!user) {
      await tx.orm.public.Session.where({ id: session.id }).update({
        revokedAt: new Date(),
      });
      throw new Error("User not found");
    }

    const newRefreshToken = createRefreshToken();

    await tx.orm.public.Session.where({ id: session.id }).update({
      previousTokenHash: hashedToken,
      currentTokenHash: newRefreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TTL_MS),
    });
    const updatedRefresh = {
      accessToken: signAccessToken({
        sub: user.id,
        role: user.role,
        sid: session.id,
      }),
      refreshToken: newRefreshToken,
      session: {
        id: session.id,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    return updatedRefresh;
  });
}
//
export async function refresh(refreshToken: string) {
  // To hash the rawRefreshToken
  const tokenHash = hashRefreshToken(refreshToken);
  return await refreshTransaction(tokenHash);
}

// Logout
export async function logout(rawRefreshToken: string | null): Promise<void> {
  if (!rawRefreshToken) {
    return;
  }
  const tokenHash = hashRefreshToken(rawRefreshToken);
  // Find session by hash token
  const session = await db.orm.public.Session.where((s) =>
    or(s.currentTokenHash.eq(tokenHash), s.previousTokenHash.eq(tokenHash)),
  ).first();
  // 1. if Session is null or empty or underfine
  // 2. If Session has data but its currentTokenHash is not equal tokenHash therefore
  // user invalid
  if (!session || session.currentTokenHash !== tokenHash) {
    // Stop execute here
    return;
  }

  try {
    await db.orm.public.Session.where({ id: session.id }).update({
      revokedAt: new Date(),
    });
  } catch (error) {
    console.error("Logout error: ", error);
  }
}

function normalizeToken(rawRefreshToken: string | null): {
  isValid: boolean;
  value: string;
} {
  if (!rawRefreshToken || rawRefreshToken.trim().length === 0)
    return {
      isValid: true,
      value: "value",
    };
}
