import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { correlationMiddleware } from "./middlewares/correlation.middleware.js";

const app = express();

const baseUrl = "api/v1";
// Middleware section
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(correlationMiddleware);

app.set("trust proxy", true);

app.get(`/${baseUrl}`, (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.use(`/${baseUrl}/users`, userRoute);

export default app;
