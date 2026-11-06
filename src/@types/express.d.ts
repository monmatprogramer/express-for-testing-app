// Purpose:
// We need to add 'context' to Express request
// using 'Declartion Merging'

import { RequestContext } from "../correlation";

declare global {
  // 'global' Change every where in the project
  namespace Express {
    // Match the Express namespace and add new property
    // Merge new property 'context' into the existing Express request interface
    export interface Request {
      context?: RequestContext;
    }
  }
}
