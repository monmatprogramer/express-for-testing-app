import { AsyncLocalStorage } from "node:async_hooks";

export interface Actor {
  userId: string;
  email: string;
  role: "ADMIN" | "TENANT";
}

export interface RequestContext {
  trackId: string;
  clientTrackId?: string;
  actor?: Actor;
}
