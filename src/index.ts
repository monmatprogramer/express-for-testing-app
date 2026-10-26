import express from "express";
import "dotenv/config";
import cors from "cors";
import { env } from "./config/env";
import userRoute from "./routes/user.routes";
import cookieParser from "cookie-parser";

const app = express();

const port = env.port || 3000;
const baseUrl = "api/v1";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get(`/${baseUrl}`, (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.use(`/${baseUrl}/users`, userRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
