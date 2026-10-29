import { Request, Response } from "express";
import { HttpError } from "../httpError";
import { v4 as uuiv4 } from "uuid";
import { login } from "../modules/auth/auth.service";
import {
  AccessClaims,
  refreshToken,
  signAccessToken,
} from "../modules/auth/tokens";
import { setAuthCookies } from "../modules/auth/cookies";

export function userHealth(_req: Request, res: Response) {
  return res.status(200).json({
    message: "User health is ok!",
  });
}

export function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const claimsNew: AccessClaims = {
      sub: `user-${uuiv4()}`,
      role: "ADMIN",
      sid: uuiv4(),
    };

    // Sign In
    const newToken = signAccessToken(claimsNew);

    // Set HTTP-only cookie on the response
    setAuthCookies(req, res, newToken, refreshToken());
    login({ email, password });
    return res.status(200).json({
      message: "Login success.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      console.log("Message: ", error.message);
      console.log("Status: ", error.status);
    }
    if (error instanceof Error) {
      console.log("Message: ", error.message);
    }
    return res.status(400).json({
      message: "Bad request",
    });
  }
}

/**
 * Protected user profile handler.
 * Authentication & role verification is already performed by middleware.
 */
export function userProfile(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    message: "Access granted!",
    userId: req.user.userId,
    role: req.user.role,
    user: req.user,
  });
}
