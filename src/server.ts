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
  // Start the server to linten
  app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
};

// This is our server start
start().catch(async (error: unknown) => {
  console.error("Error at starting the server: ", error);
  // If the connection has any error, stop connection immedately.
  await db.close();
  // Stop application also
  process.exit(1);
});
