import { Request, Response } from "express";
import { env } from "../../config/env";

export function setAuthCookies(
  _req: Request,
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  // Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
  });
}
