import { Request, Response, NextFunction } from "express";
import { type RequestContext, runWithCorrelationId } from "../correlation";
import { v4 as uuidv4 } from "uuid";

export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Context
  const context: RequestContext = {
    trackId: uuidv4(),
    clientTrackId,
  };
}
