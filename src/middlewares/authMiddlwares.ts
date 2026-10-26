import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../modules/auth/tokens";
import type { Role } from "../modules/auth/tokens";
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  console.log("req ", req);
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ message: "You are not logg in ." });
    return;
  }
  try {
    const decode = verifyAccessToken(token);
    if (decode === "string") {
      res.status(403).json({
        message: "Unauthorized",
      });
      return;
    }
    console.log("decode: ", decode);
  } catch (error) {
    console.error("AuthMiddleware: ", error);
  }
  req.user = { id: "001", role: "admin" };
  next();
}
