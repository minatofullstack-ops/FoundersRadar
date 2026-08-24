"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import type { MatchResult } from "@/lib/matching";

const competencies = [
  { key: "sell", prompt: "How comfortable are you creating demand?", options: ["I avoid it", "I can learn", "It is my edge"] },
  { key: "build", prompt: "How close are you to the product?", options: ["Not technical", "I can prototype", "I build daily"] },
  { key: "operate", prompt: "How do you handle the messy middle?", options: ["I need structure", "I keep things moving", "I make systems"] },
] as const;

function maskProfile(value: string) {
  return value.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/gi, "[email masked]").replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[phone masked]").replace(/\b(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi, "[profile masked]");
}

export default function Home() {
  const [profile, setProfile] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const chooseAnswer = (answer: string) => {
    const next = [...answers];
    next[step] = answer;
    setAnswers(next);
    if (step < competencies.length - 1) setStep(step + 1);
  };

  const parseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/parse-resume", { method: "POST", body });
    const result = (await response.json()) as { text?: string; error?: string };
    if (!response.ok) setError(result.error ?? "We could not parse that resume.");
    else setProfile(result.text ?? "");
  };

  const findMatches = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const competencyScores = { sell: answers[0], build: answers[1], operate: answers[2] };
    try {
      const response = await fetch("/api/matches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ competencyScores }) });
      const result = (await response.json()) as { matches?: MatchResult[]; error?: string };
      if (!response.ok) throw new Error(result.error);
      setMatches(result.matches ?? []);
      setActiveMatch(result.matches?.[0] ?? null);
      window.dispatchEvent(new CustomEvent("foundersradar:match-computed"));
    } catch (matchError) {
      setError(matchError instanceof Error ? matchError.message : "Matching is unavailable right now.");
    } finally { setLoading(false); }
  };

  const saveMatch = (match: MatchResult) => setSaved((current) => current.includes(match.id) ? current.filter((id) => id !== match.id) : [...current, match.id]);
  const completed = answers.length === competencies.length && answers.every(Boolean);

  if (matches.length > 0 && activeMatch) return <main className="radar-shell results-shell"><nav className="topbar"><Link className="brand" href="/"><span className="brand-mark">FR</span> FoundersRadar</Link><button className="text-button" onClick={() => setMatches([])}>Start over ↗</button></nav><section className="results-header"><p className="eyebrow">Your founder signal · Experimental readout</p><h1>Three directions<br /><em>worth testing.</em></h1><p className="lede">Based on your calibration, these startup patterns line up with the strengths you already have in motion. Treat this as a starting point, not a verdict.</p></section><section className="results-grid"><div className="match-list"><div className="list-heading"><span>Ranked opportunities</span><span>{matches.length} signals</span></div>{matches.map((match, index) => <button className={activeMatch.id === match.id ? "match-card active" : "match-card"} key={match.id} onClick={() => setActiveMatch(match)}><span className="rank">0{index + 1}</span><span><strong>{match.name}</strong><small>{match.category}</small></span><b>{match.score}%</b><span className="save-mark" onClick={(event) => { event.stopPropagation(); saveMatch(match); }}>{saved.includes(match.id) ? "★" : "☆"}</span></button>)}</div><div className="detail-panel"><div className="detail-top"><span className="step-tag">{activeMatch.category}</span><span className="match-score">{activeMatch.score}% fit</span></div><h2>{activeMatch.name}</h2><p className="detail-problem">{activeMatch.problem}</p><div className="signal-note"><span>Why this surfaced</span><p>{activeMatch.signal}</p></div><div className="strength-row">{activeMatch.matchedStrengths.map((strength) => <span key={strength}>+ {strength}</span>)}</div><h3>First six months</h3><div className="roadmap">{activeMatch.roadmap.map((focus, index) => <div key={focus}><span>0{index + 1}</span><p>{focus}</p></div>)}</div><button className="primary-button" onClick={() => setShowWaitlist(true)}>Get the full founder roadmap <span>→</span></button></div></section>{showWaitlist && <WaitlistModal email={email} setEmail={setEmail} onClose={() => setShowWaitlist(false)} />}</main>;

  return <main className="radar-shell"><nav className="topbar"><a className="brand" href="#top"><span className="brand-mark">FR</span> FoundersRadar</a><span className="status"><i /> Private beta · local experiment</span></nav><section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">A clearer signal for your next move</p><h1>Find the company<br /><em>only you</em> can build.</h1><p className="lede">FoundersRadar matches your lived experience to startup patterns where you have an unfair advantage.</p><div className="proof"><span className="avatars"><b>AM</b><b>JK</b><b>SR</b></span><span>Built for the first-time founder<br /><strong>before the big leap.</strong></span></div></div><div className="intake-card"><div className="card-heading"><span className="step-tag">01 / 02</span><span>Founder signal check</span></div><h2>Start with your story.</h2><p className="card-sub">Your profile stays local in this experimental version.</p><form onSubmit={findMatches}><label htmlFor="profile">Your LinkedIn profile text or resume</label><textarea id="profile" value={profile} onChange={(event) => setProfile(maskProfile(event.target.value))} placeholder="Paste your profile text here..." rows={5} /><div className="upload-row"><label className="upload"><span>＋</span> Drop a resume<input type="file" accept=".pdf,.docx,.txt" onChange={parseFile} /></label><span className="privacy">⌁ Masked on-device</span></div><div className="question"><div className="question-meta"><span>Quick calibration</span><span>{step + 1} of {competencies.length}</span></div><p>{competencies[step].prompt}</p><div className="answer-grid">{competencies[step].options.map((option) => <button type="button" className={answers[step] === option ? "answer selected" : "answer"} key={option} onClick={() => chooseAnswer(option)}>{option}<span>↗</span></button>)}</div></div><button className="primary-button" disabled={!profile || !completed || loading} type="submit">{loading ? "Reading your signal..." : "See my founder signal"}<span>→</span></button>{error && <p className="form-error" role="alert">{error}</p>}<p className="fine-print">No payment today. Local matching only.</p></form></div></section><section className="signal-strip"><div><span className="strip-number">01</span><strong>Experience over ambition</strong><p>Patterns in what you have already done.</p></div><div><span className="strip-number">02</span><strong>Market signal, not noise</strong><p>Directions matched to your lived context.</p></div><div><span className="strip-number">03</span><strong>A roadmap that sounds like you</strong><p>Six months of practical next moves.</p></div></section></main>;
}

function WaitlistModal({ email, setEmail, onClose }: { email: string; setEmail: (value: string) => void; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setStatus("saving");
    const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, profilePayloadMasked: "Experimental match profile", competencyScores: { sell: "I can learn", build: "I can learn", operate: "I can learn" } }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setStatus("error"); setMessage(result.error ?? "Could not save your place."); } else setStatus("done");
  };
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose} aria-label="Close">×</button>{status === "done" ? <><span className="success-icon">✓</span><h2>You are on the radar.</h2><p>We will send your private roadmap to <strong>{email}</strong>.</p><button className="secondary-button" onClick={onClose}>Back to results</button></> : <><span className="step-tag">PRIVATE BETA</span><h2>Keep your signal.</h2><p>Reserve your place for the full roadmap at <strong>$14.99/mo</strong>.</p><form onSubmit={submit}><input className="email-input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /><button className="primary-button" disabled={status === "saving"} type="submit">{status === "saving" ? "Saving..." : "Reserve my place"}<span>→</span></button>{status === "error" && <p className="form-error" role="alert">{message}</p>}</form><p className="fine-print">Your profile data is masked before storage.</p></>}</div></div>;
}
