import winston from "winston";
import { env } from "./config/env";
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
