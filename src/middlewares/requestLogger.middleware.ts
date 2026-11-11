//Request Logger Middleware

import { NextFunction, Response, Request } from "express";
import { logger } from "../logger";
import { getUserAgent } from "../utils/userAgent";
import { getClientIp } from "../utils/get-client-ip";
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Get broser & OS name
  const userAgent = getUserAgent(req);
  // Get clean Client IP
  const clientIp = getClientIp(req);
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: clientIp,
      userAgent: userAgent,
    });
  });
  next();
}
