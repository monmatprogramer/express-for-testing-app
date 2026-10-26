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
  const token: string = authHeader.split(" ").pop();
  return res.status(200).json({
    message: "Authorization",
  });
}
