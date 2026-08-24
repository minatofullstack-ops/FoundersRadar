import { describe, expect, it } from "vitest";
import { matchStartups, type FounderSignals } from "@/lib/matching";
import { startupPatterns } from "@/data/startups";

const strongBuilder: FounderSignals = {
  sell: "I can learn",
  build: "I build daily",
  operate: "I make systems",
};

describe("matchStartups", () => {
  it("ranks patterns with aligned strengths first", () => {
    const results = matchStartups(strongBuilder, startupPatterns);
    expect(results[0].id).toBe("ai-copilot");
    expect(results[0].score).toBeGreaterThan(60);
  });

  it("returns a six-month roadmap for every pattern", () => {
    const results = matchStartups(strongBuilder, startupPatterns);
    expect(results.every((result) => result.roadmap)).toBe(true);
    expect(results).toHaveLength(4);
  });
});