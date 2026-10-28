import { env } from "./config/env";
import app from "./app";

const port = Number(env.port ?? 3000);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
