import { Request } from "express";
import { UAParser } from "ua-parser-js";
export function getUserAgent(req: Request): string {
  const rawUserAget = req.headers["user-agent"];
  const parser = new UAParser(rawUserAget);
  const result = parser.getResult();
  const brower = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";

  return `${brower} ${os}`;
}
