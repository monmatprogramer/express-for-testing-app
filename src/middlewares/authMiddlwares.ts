import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../modules/auth/tokens.js";

// 1. Strongly typed user object attached to the request
export interface AuthUser {
  userId: string;
  role: string;
  sid?: string;
  [key: string]: unknown;
}

// 2. Extend Express Request globally so req.user is recognized across the app
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Export AuthRequest for backward-compatibility
export interface AuthRequest extends Request {
  user?: AuthUser;
}

interface DecodedTokenPayload extends jwt.JwtPayload {
  sub?: string;
  sid?: string;
  role?: string;
}

/**
 * Extracts the JWT token with priority:
 * 1. HTTP-Only Cookie (`req.cookies.accessToken`)
 * 2. Authorization Header (`Bearer <token>` as fallback for API tools/Postman)
 */
export function extractToken(req: Request): string | undefined {
  // 1. Check cookie first
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  // 2. Fallback to Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return undefined;
}

/**
 * Middleware: Authenticates user by verifying the JWT token.
 * Attaches the verified user information to `req.user`.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      message: "Authentication required. Please log in.",
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    if (typeof decoded === "string") {
      res.status(401).json({
        message: "Invalid token format.",
      });
      return;
    }

    const payload = decoded as DecodedTokenPayload;

    req.user = {
      userId: payload.sub ?? payload.sid ?? "",
      role: payload.role ?? "user",
      sid: payload.sid,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Session expired. Please log in again.",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid or malformed token.",
      });
      return;
    }

    res.status(401).json({
      message: "Authentication failed.",
    });
  }
}

/**
 * Middleware Factory: Restricts access to users with specific roles.
 * Usage: router.get('/admin-only', requireAuth, requireRole('ADMIN'), handler);
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
      return;
    }

    next();
  };
}

/**
 * Convenience Middleware: Combines requireAuth + requireRole("ADMIN").
 * Usage: router.get('/admin-route', requireAdmin, handler);
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  requireAuth(req, res, () => {
    requireRole("ADMIN")(req, res, next);
  });
}
