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

const storage = new AsyncLocalStorage();

// export function runWithCorrelationId<T>(context: RequestContext): T {
//   return storage.run(context);
// }
export function first() {
  const store = { id: 2 };

  try {
    storage.run(store, () => {
      const r = storage.getStore();
      console.log("In run : ", r);
      setTimeout(() => {
        const r = storage.getStore();
        console.log("setTimeout r: ", r);
      }, 200);
      throw new Error();
    });
  } catch (error) {
    console.log("Error: ", error);
    console.log(storage.getStore());
  }
}
