import type { MatchResult } from "@/lib/matching";

export type LlmProvider = {
  name: string;
  explainMatch: (match: MatchResult) => Promise<string>;
};

const localProvider: LlmProvider = {
  name: "local-template",
  async explainMatch(match) {
    return `${match.name} is a ${match.score}% fit because its first customers resemble the kind of problem your ${match.matchedStrengths.join(" and ")} strengths can address. Validate the audience manually before building.`;
  },
};

export function getLlmProvider(): LlmProvider {
  return localProvider;
}
