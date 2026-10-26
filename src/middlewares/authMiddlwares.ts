import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../modules/auth/tokens";
import { UserTokenPayload } from "../controllers/user.controllers";
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies.accessToken;
  req.user = { userId: "0001", role: "admin" };
  console.log("req: ", req.user);
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
    const userDeconded = decode as UserTokenPayload;
    const role = userDeconded.role;
    if (role !== "ADMIN") {
      res.status(403).json({
        message: "Access denied.",
      });
    }
    next();
  } catch (error) {
    console.error("AuthMiddleware: ", error);
  }
}
