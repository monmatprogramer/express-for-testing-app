import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { correlationMiddleware } from "./middlewares/correlation.middleware.js";
import { logger } from "./logger.js";

const app = express();

const baseUrl = "api/v1";
// Middleware section
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

app.use(correlationMiddleware);

app.get(`/${baseUrl}/user-test`, (req: Request, res: Response) => {
  logger.info("---- SERVER CONSOLE LOG ---");
  logger.info(`Internal Track ID: ${req.context?.trackId}`);
  logger.info(`Client Track ID: ${req.context?.clientTrackId}`);
  return res.json({
    message: "Request processed successfully!",
    context: req.context,
  });
});
app.get(`/${baseUrl}`, (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.use(`/${baseUrl}/users`, userRoute);

export default app;
