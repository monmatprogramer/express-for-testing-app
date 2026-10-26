import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export function userHealth(_req: Request, res: Response) {
  return res.status(200).json({
    messsage: "User health is ok!",
  });
}

export function userLogin(req: Request, res: Response) {
  const { id, username, role } = req.body;
  const payload = {
    userId: id,
    role: role,
  };

  const token = jwt.sign(payload, env.jwt_secret, {
    subject: "usr_98765",
    issuer: env.jwt_issuer,
    audience: env.jwt_audience,
    expiresIn: "15m",
    algorithm: "HS256",
  });

  return res.status(200).json({
    message: "Login success.",
    token: token,
  });
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
    //Validate on token first
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

    return res.status(200).json({
      message: "Access granted!",
      userId: decoded.sub,
      role: decoded.role,
      tokenClaims: decoded,
    });
  } catch (error) {}
  return res.status(500).json({
    message: "Profile error",
  });
}
