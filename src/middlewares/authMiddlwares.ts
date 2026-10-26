import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../modules/auth/tokens";
import { env } from "../config/env";

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
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ message: "You are not logg in ." });
    return;
  }
  try {
    const decode = verifyAccessToken(token);
  } catch (error) {}
  console.log("👉token from cookie", token);
  req.user = { id: "001", role: "admin" };
  next();
}
