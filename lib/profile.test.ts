import { describe, expect, it } from "vitest";
import { maskProfile } from "@/lib/profile";

describe("maskProfile", () => {
  it("removes common contact and profile identifiers", () => {
    const result = maskProfile("Email founder@example.com, call +1 (555) 123-4567, or linkedin.com/in/founder at 12 Main Street.");
    expect(result).not.toContain("founder@example.com");
    expect(result).not.toContain("555");
    expect(result).toContain("[profile masked]");
    expect(result).toContain("[address masked]");
  });

  it("masks visible names as part of the privacy scrub", () => {
    const result = maskProfile("Alice Johnson reached out from founder@example.com.");
    expect(result).not.toContain("Alice Johnson");
    expect(result).toContain("[name masked]");
    expect(result).toContain("[email masked]");
  });
});