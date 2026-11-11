import { getUserAgent } from "./utils/userAgent";

import { describe, it, expect } from "vitest";

describe("getUserAgent", () => {
  it("return formatted user agent info", () => {
    const req = {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
    };
    const result = getUserAgent(req as any);
    expect(result).toContain("Chrome");
  });
});
