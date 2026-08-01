import { describe, expect, it } from "vitest";
import { analyzeLoopSafety } from "@/services/LoopSafetyAnalyzer";

describe("analyzeLoopSafety", () => {
  it("flags while(true) without break", () => {
    const result = analyzeLoopSafety(`
      function decide(self, opponent) {
        while (true) {}
        return { left: false, right: false, up: false, down: false, action1: false, action2: false, action3: false };
      }
    `);

    expect(result.safe).toBe(false);
    expect(result.dangerousLoops.length).toBeGreaterThan(0);
    expect(result.error).toMatch(/INFINITE LOOP/i);
  });

  it("allows while(true) with break", () => {
    const result = analyzeLoopSafety(`
      function decide(self, opponent) {
        while (true) { break; }
        return { left: false, right: false, up: false, down: false, action1: false, action2: false, action3: false };
      }
    `);

    expect(result.safe).toBe(true);
    expect(result.error).toBeNull();
  });

  it("flags for(;;) without break", () => {
    const result = analyzeLoopSafety(`
      function decide(self, opponent) {
        for (;;) {}
        return { left: false, right: false, up: false, down: false, action1: false, action2: false, action3: false };
      }
    `);

    expect(result.safe).toBe(false);
    expect(result.dangerousLoops.some((l) => l.type === "for")).toBe(true);
  });

  it("passes safe decide-only script", () => {
    const result = analyzeLoopSafety(`
      function decide(self, opponent) {
        return { left: false, right: true, up: false, down: false, action1: false, action2: false, action3: false };
      }
    `);

    expect(result.safe).toBe(true);
    expect(result.dangerousLoops).toEqual([]);
  });
});
