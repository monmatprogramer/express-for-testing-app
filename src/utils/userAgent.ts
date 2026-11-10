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

/**
 * Extract and formats user agent information from an Express request
 * @param req - Express Request Object
 * @param config - Optional configuration for output format
 * @returns Formatted user agent information string
 * @example
 * // Return: "Chrome | Windows | Desktop | Mozilla/5.0"
 *
 */
// Get user agent
export function getUserAgent(
  req: Request,
  config: UserAgentConfig = {},
): string {
  // It gets user request header object but its result can be empty string also
  const userAgent = getRawUserAgent(req);

  const cacheKey = `${userAgent}${JSON.stringify(config)}`;
  console.log(cacheKey);

  // Req object
  const rawUserAgent = req.headers["user-agent"];
  const parser = new UAParser(rawUserAgent);
  const result = parser.getResult();
  const brower = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";
  return `${brower} ${os}`;
}
function getRawUserAgent(req: Request): string {
  // Req objects
  const header = req.headers["user-agent"];

  if (Array.isArray(header)) {
    return header[0] ?? "";
  }
  return header ?? "";
}
