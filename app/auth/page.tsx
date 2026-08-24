"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  return <main className="radar-shell auth-shell"><nav className="topbar"><Link className="brand" href="/"><span className="brand-mark">FR</span> FoundersRadar</Link></nav><section className="auth-card"><span className="step-tag">YOUR PRIVATE RADAR</span>{sent ? <><span className="success-icon">✓</span><h1>Check your inbox.</h1><p>A magic link would be sent to <strong>{email}</strong> once Supabase Auth is configured.</p></> : <><h1>Keep your matches<br /><em>close.</em></h1><p>Sign in to save your startup directions and return to your founder history.</p><form onSubmit={submit}><input className="email-input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /><button className="primary-button" type="submit">Send magic link <span>→</span></button></form></>}</section></main>;
}
