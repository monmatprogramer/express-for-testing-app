import "dotenv/config";
import { db } from "./db.js";
import { refresh, logout, login } from "./modules/auth/auth.service.js";
import { createRefreshToken } from "./modules/auth/password.js";
import { hashRefreshToken } from "./modules/auth/tokens.js";
import type { Actor, RequestContext } from "./correlation.js";
type SingAccessToken = string;
interface User {
  id: string;
  role: string;
  email: string;
  name: string;
}
interface ResultLogin {
  sessionid: string;
  accessToken: SingAccessToken;
  user: User;
  refreshToken: string;
}

// @ts-expect-error
// Login test
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

// @ts-expect-error
// Logout test
async function runTestRefreshToken() {
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
    console.log("-----Test function----");
    console.log("rawRefreshToken for logout: ", rawRefreshToken);
    console.log("\n\n");
    await logout(rawRefreshToken);

    await db.orm.public.Session.where({ id: createSession.id }).delete();
  } catch (error) {
    console.error("Test error");
  } finally {
    await db.close();
  }
}

async function runTestLogout() {
  const email: string = "monsokmeanmon@gmail.com";
  const pass: string = "12345678";
  try {
    const result: ResultLogin = await login({ email, password: pass });
    const rawRefreshToken = result.refreshToken;
    await logout(rawRefreshToken);
    console.log("Logout successfull");
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
    process.exit(1);
  }
}
// Refresh test
async function runTestRefresh() {
  try {
    // const user = await db.orm.public.User.first();
    console.log("---RunTestRefresh()----");
    const email: string = "monsokmeanmon@gmail.com";
    const pass: string = "12345678";
    const result: ResultLogin = await login({ email, password: pass });
    const rawRefreshToken = result.refreshToken;
    const resultRefres = await refresh(rawRefreshToken);
    const updatedSession = await db.orm.public.Session.first({
      id: resultRefres.session.id,
    });
    console.log("updatedSession: ");
    console.log(updatedSession);
    await db.orm.public.Session.where({ id: resultRefres.session.id }).delete();
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await db.close();
    process.exit(1);
  }
}

// Test Correlation files
// -- Type of Actor---
function runtTestCorrelation() {
  const actor1: Actor = {
    userId: "0001",
    email: "test@test.com",
    role: "ADMIN",
  };
  const requestContext: RequestContext = {
    trackId: "0001",
    actor: actor1,
  };
  console.log(requestContext);
}

runtTestCorrelation();
