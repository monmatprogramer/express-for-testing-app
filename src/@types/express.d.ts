// Purpose:
// We need to add 'context' to Express request
// using 'Declartion Merging'

import { RequestContext } from "../correlation";

declare global {
  namespace Express {
    export interface Request {
      context?: RequestContext;
    }
  }
}
