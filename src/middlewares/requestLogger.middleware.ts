//Request Logger Middleware

import { NextFunction, Response, Request } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  next();
}
