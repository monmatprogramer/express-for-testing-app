import { Request, Response } from "express";
import { HttpError } from "../httpError.js";
import { v4 as uuiv4 } from "uuid";
import { login } from "../modules/auth/auth.service.js";
import { logger } from "../logger.js";
import {
  AccessClaims,
  refreshToken,
  signAccessToken,
} from "../modules/auth/tokens.js";
import { setAuthCookies } from "../modules/auth/cookies.js";
import { getUserAgent } from "../utils/userAgent.js";

export function userHealth(_req: Request, res: Response) {
  return res.status(200).json({
    message: "User health is ok!",
  });
}

export function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  // Get brower and OS name
  const userAgent = getUserAgent(req);
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
    login({
      email,
      password,
      ip: req.ip,
      userAgent: userAgent,
    });
    logger.info("User login request", { email: req.body.email, ip: req.ip });
    return res.status(200).json({
      message: "Login success.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn("Login HTTP error", {
        status: error.status,
        message: error.message,
      });
    }
    if (error instanceof Error) {
      logger.error("Login Error", {
        message: error.message,
      });
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

export function userLogout(req: Request, res: Response) {}
