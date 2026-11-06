import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { env } from "./config/env";
export function test() {}
// Create logs folder under root foder of the project
const logDir = path.join(process.cwd(), "logs");

// Create a folder in the project
mkdirSync(logDir, { recursive: true });

// Logger for Dev
const devFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
);

// Logger for Pro
const proFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

// Caller
export const logger = winston.createLogger({
  level: env.node_env === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
  format: env.node_env === "development" ? devFormat : proFormat,
});
