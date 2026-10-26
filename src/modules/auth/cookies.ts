import { Request, Response } from "express";
import { env } from "../../config/env";
export function setAuthCookies(
  _req: Request,
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  //Access Token
  // Syntax: res.cookie(name, value, options)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  //Refresh Token
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.node_env === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
