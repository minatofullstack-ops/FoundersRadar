import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const competencyOptions = {
  sell: ["I avoid it", "I can learn", "It is my edge"],
  build: ["Not technical", "I can prototype", "I build daily"],
  operate: ["I need structure", "I keep things moving", "I make systems"],
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxProfileLength = 20_000;

type WaitlistPayload = {
  email?: unknown;
  profilePayloadMasked?: unknown;
  competencyScores?: unknown;
};

function isValidCompetencyScores(value: unknown): value is Record<keyof typeof competencyOptions, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const scores = value as Record<string, unknown>;
  return (Object.keys(competencyOptions) as Array<keyof typeof competencyOptions>).every(
    (key) => typeof scores[key] === "string" && competencyOptions[key].includes(scores[key] as never),
  );
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const profilePayloadMasked = typeof payload.profilePayloadMasked === "string" ? payload.profilePayloadMasked.trim() : "";

  if (!emailPattern.test(email) || email.length > 320) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!profilePayloadMasked || profilePayloadMasked.length > maxProfileLength) {
    return NextResponse.json({ error: "Profile text is required and must be under 20,000 characters." }, { status: 400 });
  }
  if (!isValidCompetencyScores(payload.competencyScores)) {
    return NextResponse.json({ error: "Complete each competency question before joining." }, { status: 400 });
  }
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Waitlist storage is not configured." }, { status: 503 });
  }

  const { error } = await supabase.from("foundersradar_waitlist").upsert(
    {
      email,
      profile_payload_masked: profilePayloadMasked,
      competency_scores: payload.competencyScores,
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("Waitlist insert failed", error);
    return NextResponse.json({ error: "We could not save your place right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
