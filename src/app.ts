import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { correlationMiddleware } from "./middlewares/correlation.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { getUserAgent } from "./utils/userAgent.js";

const app = express();

const baseUrl = "api/v1";
// Middleware section
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(correlationMiddleware);
app.use(requestLogger);

app.set("trust proxy", true);
app.get(`/${baseUrl}/headers`, (req, res) => {
  getUserAgent(req, { includeDevice: false });
  return res.json({
    useragents: req.headers["user-agent"],
  });
});
app.get(`/${baseUrl}/health`, (req, res) => {
  //Test get client ip
  res.json({ message: "Hello from Express!", ip: req.ip });
});

app.use(`/${baseUrl}/users`, userRoute);

export default app;
