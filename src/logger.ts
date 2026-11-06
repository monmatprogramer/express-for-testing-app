import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { env } from "./config/env";
export function test() {}
// Create logs folder under root foder of the project
const logDir = path.join(process.cwd(), "logs");
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
  transports: [new winston.transports.Console()],
  format: env.node_env === "development" ? devFormat : proFormat,
});
