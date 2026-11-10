import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { LRUCache } from "lru-cache";
// Create interface UserAgentInfo
export interface UserAgentInfo {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
  fullUserAgent: string;
}

// Configuration
export interface UserAgentConfig {
  includeDevice?: boolean;
  seperator?: string;
  defaultBrowser?: string;
  defaultOS?: string;
}

// Map of userAgent
const userAgentCache = new Map<string, UserAgentInfo>();

// Constants for defaults
const DEFAULT_BROWSER = "Unknown Browser";
const DEFAULT_OS = "Unknown OS";
const DEFAULT_DEVICE = "Unknown Device";
const DEFAULT_SEPARATOR = " | ";

// Get user agent
export function getUserAgent(req: Request): string {
  const rawUserAgent = req.headers["user-agent"];
  const parser = new UAParser(rawUserAgent);
  const result = parser.getResult();
  const brower = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";
  return `${brower} ${os}`;
}
