import { Request } from "express";
export function getClientIp(req: Request) {
  let rawIp =
    req.ip ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress;
  if (rawIp?.startsWith("::ffff:")) {
    rawIp = rawIp.replace("::ffff:", "");
  }
  if (rawIp === "::1") {
    rawIp = "127.0.0.1";
  }
  return rawIp;
}
