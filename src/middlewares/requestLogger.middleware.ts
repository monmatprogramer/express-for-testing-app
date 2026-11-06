//Request Logger Middleware

import { NextFunction, Response, Request } from "express";
import { logger } from "../logger";
import { UAParser } from "ua-parser-js";
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const rawUserAgent = req.headers["user-agent"];
  const parser = new UAParser(rawUserAgent);
  const result = parser.getResult();
  const browser = result.browser.name;
  const os = result.os.name;
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: `${browser} ${os}`,
    });
  });
  next();
}
