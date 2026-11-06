import { Request, Response, NextFunction } from "express";
import { runWithCorrelationId } from "../correlation";
import { v4 as uuidv4 } from "uuid";

export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {}
