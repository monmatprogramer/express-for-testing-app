import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

const baseUrl = "api/v1";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

app.get(`/${baseUrl}`, (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.use(`/${baseUrl}/users`, userRoute);

export default app;
