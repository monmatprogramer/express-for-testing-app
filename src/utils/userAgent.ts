import { Request } from "express";
import { UAParser } from "ua-parser-js";
export function getUserAgent(req: Request): string {
  const rawUserAget = req.headers["user-agent"];
  const parser = new UAParser(rawUserAget);
  const result = parser.getResult();
  const brower =
    result.browser.name === undefined ? "Unknown" : result.browser.name;
  const os = result.os.name === undefined ? "Unknown" : result.os.name;

  return `${brower} ${os}`;
}
