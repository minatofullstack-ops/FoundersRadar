export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthMode = "local-experiment" | "supabase";

export function getAuthMode(): AuthMode {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "supabase" : "local-experiment";
}
