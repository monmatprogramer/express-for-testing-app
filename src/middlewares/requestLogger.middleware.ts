//Request Logger Middleware

import { NextFunction, Response, Request } from "express";
import { logger } from "../logger";
import { getUserAgent } from "../utils/userAgent";
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Get broser & OS name
  const userAgent = getUserAgent(req);
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: userAgent,
    });
  });
  next();
}
