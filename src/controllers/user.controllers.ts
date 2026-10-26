import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../httpError";

export interface UserTokenPayload extends JwtPayload {
  userId?: number | string;
  role?: string;
  username?: string;
}

export function userHealth(_req: Request, res: Response) {
  return res.status(200).json({
    message: "User health is ok!",
  });
}

export function userLogin(req: Request, res: Response) {
  const { id, username, role } = req.body;
  try {
    if (!id || id === 0) {
      throw new HttpError(400, "Id is 0");
    }
    if (!role || role.length === 0) {
      throw new Error("role is empty");
    }
    const payload = {
      userId: id,
      username: username,
      role: role,
    };

    const token = jwt.sign(payload, env.jwt_secret, {
      subject: id ? String(id) : "usr_98765",
      issuer: env.jwt_issuer,
      audience: env.jwt_audience,
      expiresIn: "15m",
      algorithm: "HS256",
    });

    return res.status(200).json({
      message: "Login success.",
      token: token,
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

export function userProfile(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header" });
  }

  // Get token
  const token: string | undefined = authHeader.split(" ").pop();
  try {
    // Validate on token first
    if (!token || token.length === 0) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const decoded = jwt.verify(token, env.jwt_secret, {
      issuer: env.jwt_issuer,
      audience: env.jwt_audience,
      algorithms: ["HS384", "HS256"],
    });

    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const userPayload = decoded as UserTokenPayload;

    return res.status(200).json({
      message: "Access granted!",
      userId: userPayload.sub,
      role: userPayload.role,
      user: userPayload,
      tokenClaims: userPayload,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid or expired token",
        details: error.message,
      });
    }
    return res.status(500).json({
      message: "Profile error",
    });
  }
}
