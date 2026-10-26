import { Request, Response } from "express";
export function setAuthCookies(
  _req: Request,
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
}
