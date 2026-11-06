// Purpose:
// We need to add 'context' to Express request
// using 'Declartion Merging'

import { RequestContext } from "../correlation";

declare global {
  namespace Express {
    // Merge new property 'context' into the existing Express request interface
    export interface Request {
      context?: RequestContext;
    }
  }
}
