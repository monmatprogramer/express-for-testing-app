import "dotenv/config";
import { db } from "./db";
import { refresh, logout, login } from "./modules/auth/auth.service";
import { createRefreshToken } from "./modules/auth/password";
import { hashRefreshToken } from "./modules/auth/tokens";
async function runTestLogin() {
  const inputEmail = "";
  const rightPass = "";
  try {
    await login({ email: inputEmail, password: rightPass });
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
}
async function runTestLogout() {
  try {
    const user = await db.orm.public.User.first();
    console.log("runTest user(search user first): ", user);
    if (!user) {
      console.error("No user found in db.");
      return;
    }
    const rawRefreshToken = createRefreshToken();
    const hashToken = hashRefreshToken(rawRefreshToken);
    console.log({
      rawRefreshToken: rawRefreshToken,
      hashToken: hashToken,
    });
    const createSession = await db.orm.public.Session.create({
      userId: user.id,
      currentTokenHash: hashToken,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: "192.168.0.0",
      userAgent: "test-runner",
    });
    console.log("create test session id: ", createSession.id);
    const foundSession = await refresh(rawRefreshToken);

    if (foundSession && foundSession.session.id === createSession.id) {
      console.log("Success");
    } else {
      console.error("Fail");
    }
    console.log("rawRefreshToken for logout: ", rawRefreshToken);
    await logout(rawRefreshToken);

    await db.orm.public.Session.where({ id: createSession.id }).delete();
  } catch (error) {
    console.error("Test error");
  } finally {
    await db.close();
  }
}

runTestLogin();
