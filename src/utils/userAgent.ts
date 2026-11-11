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
  const cachedResult = userAgentCache.get(cacheKey);
  // It the cache has
  if (cachedResult) return formatResult(cachedResult, config);
  const resultNew = parseUserAgent(userAgent, config);

  if (userAgentCache.size >= 1000) {
    userAgentCache.clear();
  }
  // if cache size is <1000
  userAgentCache.set(cacheKey, resultNew);
  return formatResult(resultNew, config);
}

function capitalizeDevice(deviceType: string): string {
  if (deviceType === DEFAULT_DEVICE) return deviceType;
  return deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
}
//  Reusable parser instance - created once for performance
let sharedParser: UAParser | null = null;

function getParser(): UAParser {
  if (!sharedParser) {
    sharedParser = new UAParser();
  }
  return sharedParser;
}

function parseUserAgent(
  userAgent: string,
  config: UserAgentConfig,
): UserAgentInfo {
  // If user agent is empty, this will be return default value in object of user agent
  if (!userAgent) {
    // It return object user agent that we want to use in the application
    return {
      browser: config.defaultBrowser ?? DEFAULT_BROWSER,
      os: config.defaultOS ?? DEFAULT_OS,
      device: DEFAULT_DEVICE,
      isMobile: false,
      fullUserAgent: "",
    };
  }

  const parser = getParser();
  // it returns ua, browser{name, version, major, type}, cpu,device,engine,os{name,version}
  const result = parser.setUA(userAgent).getResult();
  const browser = result.browser.name ?? DEFAULT_BROWSER;
  const os = result.os.name ?? DEFAULT_OS;
  const device = result.device.type ?? DEFAULT_DEVICE;
  const isMobile =
    result.device.type === "mobile" || result.device.type === "tablet";
  // If user agent is not empty
  const userAgentInfo: UserAgentInfo = {
    browser,
    os,
    device: capitalizeDevice(device),
    isMobile,
    fullUserAgent: userAgent,
  };

  return userAgentInfo;
}
function getRawUserAgent(req: Request): string {
  // Req objects
  const header = req.headers["user-agent"];

  if (Array.isArray(header)) {
    return header[0] ?? "";
  }
  return header ?? "";
}
function formatResult(info: UserAgentInfo, config: UserAgentConfig): string {
  const seperator = config.seperator ?? DEFAULT_SEPARATOR;

  if (config.includeDevice === false) {
    return `${info.browser}${seperator}${info.os}`;
  }
  return `${info.browser}${seperator}${info.os}${seperator}${info.device}`;
}
