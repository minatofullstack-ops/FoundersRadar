export type CompetencyKey = "sell" | "build" | "operate";
export type CompetencyAnswer = "I avoid it" | "I can learn" | "It is my edge" | "Not technical" | "I can prototype" | "I build daily" | "I need structure" | "I keep things moving" | "I make systems";

export type FounderSignals = Record<CompetencyKey, CompetencyAnswer>;

export type StartupPattern = {
  id: string;
  name: string;
  category: string;
  problem: string;
  audience: string;
  signal: string;
  strengths: CompetencyKey[];
  roadmap: [string, string, string, string, string, string];
};

export type MatchResult = StartupPattern & {
  score: number;
  matchedStrengths: CompetencyKey[];
  gap: string;
};

const answerWeights: Record<string, number> = {
  "It is my edge": 3,
  "I can prototype": 3,
  "I build daily": 3,
  "I make systems": 3,
  "I can learn": 2,
  "I keep things moving": 2,
  "Not technical": 1,
  "I need structure": 1,
  "I avoid it": 1,
};

const competencyLabels: Record<CompetencyKey, string> = { sell: "sales", build: "building", operate: "operations" };

export function matchStartups(signals: FounderSignals, patterns: StartupPattern[]): MatchResult[] {
  return patterns
    .map((pattern) => {
      const matchedStrengths = pattern.strengths.filter((strength) => answerWeights[signals[strength]] >= 2);
      const totalPossible = pattern.strengths.length * 3;
      const earned = pattern.strengths.reduce((sum, strength) => sum + answerWeights[signals[strength]], 0);
      const score = Math.round((earned / totalPossible) * 100);
      const gap = pattern.strengths.find((strength) => answerWeights[signals[strength]] === 1);
      return { ...pattern, score, matchedStrengths, gap: gap ? `Strengthen your ${competencyLabels[gap]} motion` : "Strong founder fit across the core motion" };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildRoadmap(match: MatchResult) {
  return match.roadmap.map((focus, index) => ({ month: index + 1, focus }));
}
