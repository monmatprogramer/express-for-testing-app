import { Request } from "express";
export function getClientIp(req: Request) {
  console.log(req.headers["x-forwarded-for"]);
  return "";
}
