//Request Logger Middleware

import { NextFunction, Response, Request } from "express";
import { logger } from "../logger";
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  });
  next();
}
