import { Request, Response, NextFunction } from "express";
import { type RequestContext, runWithCorrelationId } from "../correlation";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger";
export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("---- Middlewar ----");
  logger.debug(`req.headers : ${req.headers}`);
  // Create Client Tracking ID
  const clientTrackId =
    (req.headers["x-request-id"] as string) ||
    (req.headers["x-correlation-id"] as string);
  // Context
  const context: RequestContext = {
    trackId: uuidv4(),
    clientTrackId,
  };

  logger.debug(`Context: $${context}`);

  req.context = context;

  // Add response header
  res.setHeader("X-Request-Id", context.trackId);
  next();
}
