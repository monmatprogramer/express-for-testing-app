import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { env } from "./config/env";
import { getContext } from "./correlation";
export function test() {}
// Create logs folder under root foder of the project
const logDir = path.join(process.cwd(), "logs");

// Create a folder in the project
mkdirSync(logDir, { recursive: true });

const correlationFormat = winston.format((info) => {
  const context = getContext();
  if (context) {
    info.trackId = context.trackId;
    info.clientTracktId = context.clientTrackId;
  }
  return info;
});
const metadataFormat = winston.format((info) => {
  info.service = "express-for-testing-app";
  info.environment = "env.node_env";
  return info;
});

// Logger for Dev
const devFormat = winston.format.combine(
  correlationFormat(),
  metadataFormat(),
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr =
      Object.keys(meta).length > 0 ? `${JSON.stringify(meta)}` : "";
    const trackStr = meta.trackId ? `[trackId: ${meta.trackId}]` : "";
    return `${timestamp} [${level}]${trackStr}: ${message}${metaStr}`;
  }),
);

// Logger for Pro
const proFormat = winston.format.combine(
  correlationFormat(),
  metadataFormat(),
  winston.format.timestamp(),
  winston.format.json(),
);
const fileFormat = winston.format.combine(
  correlationFormat(),
  metadataFormat(),
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
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],
  format: env.node_env === "development" ? devFormat : proFormat,
});
