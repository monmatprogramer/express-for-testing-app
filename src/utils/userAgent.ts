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
export function getUserAgent(req: Request): string {
  const rawUserAgent = req.headers["user-agent"];
  const parser = new UAParser(rawUserAgent);
  const result = parser.getResult();
  const brower = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";
  return `${brower} ${os}`;
}
