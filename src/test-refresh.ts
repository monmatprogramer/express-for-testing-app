import "dotenv/config";
import { db } from "./db";
import { refresh } from "./modules/auth/auth.service";
import { createRefreshToken } from "./modules/auth/password";
import { hashRefreshToken } from "./modules/auth/tokens";

async function runTest() {
  try {
    const user = await db.orm.public.User.first();
    if (!user) {
      console.error("No user found in db.");
      return;
    }
    const rawRefreshToken = createRefreshToken();
    const hashToken = hashRefreshToken(rawRefreshToken);

    const createSession = await db.orm.public.Session.create({
      userId: user.id,
      currentTokenHash: hashToken,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: "192.168.0.0",
      userAgent: "test-runner",
    });
    console.log("create test session id: ", createSession.id);
    const foundSession = await refresh(rawRefreshToken);

    if (foundSession && foundSession.id === createSession.id) {
      console.log("Success");
    } else {
      console.error("Fail");
    }

    await db.orm.public.Session.where({ id: createSession.id }).delete();
  } catch (error) {
    console.error("Test error");
  } finally {
    await db.close();
  }
}

runTest();
