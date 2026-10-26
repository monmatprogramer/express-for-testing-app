import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { UserTokenPayload } from "../../controllers/user.controllers";
type Role = "ADMIN" | "TENANT";
export interface AccessClaims {
  sub: string;
  role: Role;
  sid: string;
}
export function signAccessToken(claims: AccessClaims): string {
  const payload = {
    sid: claims.sid,
    role: claims.role,
  };

  return jwt.sign(payload, env.jwt_secret, {
    subject: claims.sub,
    issuer: env.jwt_issuer,
    audience: env.jwt_audience,
    expiresIn: "15m",
    algorithm: "HS256",
  });
}
export function verifyAccessToken(token: string) {}
