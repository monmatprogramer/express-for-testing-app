import { Request } from "express";
export function getClientIp(req: Request) {
  let rawIp =
    req.ip ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress;
  console.log(rawIp);
  return "";
}
