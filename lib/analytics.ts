export type AnalyticsEvent = "profile_started" | "resume_parsed" | "match_computed" | "match_saved" | "waitlist_submitted";

export function trackEvent(event: AnalyticsEvent, properties: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const entry = { event, properties, occurredAt: new Date().toISOString() };
  const existing = JSON.parse(window.localStorage.getItem("foundersradar:analytics") ?? "[]") as unknown[];
  window.localStorage.setItem("foundersradar:analytics", JSON.stringify([...existing.slice(-99), entry]));
  window.dispatchEvent(new CustomEvent("foundersradar:analytics", { detail: entry }));
}
