import { env } from "./config/env";
import app from "./app";
import { databaseUrl, db } from "./db";

// Define the port for server first.
const port = Number(env.port ?? 3000);

// Create a function as a service to create db connection
// It is promise
const start = async (): Promise<void> => {
  // Wait the completion for connecting to db.
  await db.connect({ url: databaseUrl });
  // If the connection is successful
};

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
