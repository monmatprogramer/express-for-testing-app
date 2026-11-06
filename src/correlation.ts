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

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithCorrelationId<T>(
  context: RequestContext,
  next: () => T,
) {
  try {
    storage.run(context, next);
  } catch (error) {
    console.error(error);
  }
}
