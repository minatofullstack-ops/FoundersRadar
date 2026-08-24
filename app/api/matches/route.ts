import { NextResponse } from "next/server";
import { startupPatterns } from "@/data/startups";
import { matchStartups, type FounderSignals } from "@/lib/matching";

const allowed = {
  sell: ["I avoid it", "I can learn", "It is my edge"],
  build: ["Not technical", "I can prototype", "I build daily"],
  operate: ["I need structure", "I keep things moving", "I make systems"],
} as const;

function isSignals(value: unknown): value is FounderSignals {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const signals = value as Record<string, unknown>;
  return (Object.keys(allowed) as Array<keyof typeof allowed>).every((key) =>
    typeof signals[key] === "string" && allowed[key].includes(signals[key] as never),
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { competencyScores?: unknown };
    if (!isSignals(body.competencyScores)) {
      return NextResponse.json({ error: "Complete all competency questions." }, { status: 400 });
    }
    return NextResponse.json({ matches: matchStartups(body.competencyScores, startupPatterns) });
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
}
