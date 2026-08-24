import { NextResponse } from "next/server";
import { maskProfile, parseResume } from "@/lib/profile";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "A resume file is required." }, { status: 400 });
    return NextResponse.json({ text: await parseResume(file) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not parse that resume.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) return NextResponse.json({ error: "Profile text is required." }, { status: 400 });
    return NextResponse.json({ text: maskProfile(body.text).slice(0, 20_000) });
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
}
