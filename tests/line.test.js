import { describe, it, expect } from "vitest";
import { makeLine } from "../src/line.js";

describe("makeLine", () => {
  it("formats a line with ISO date (JST) and quote text", () => {
    // 2025-09-13 09:00 JST は UTC 2025-09-13 00:00
    const fixed = new Date("2025-09-13T00:00:00Z");
    const q = "テストは友達。怖くない。";
    const line = makeLine({ quote: q, now: fixed });
    expect(line).toContain("2025-09-13");
    expect(line.endsWith(q)).toBe(true);
  });
});
