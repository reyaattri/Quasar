import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { env } from "./http.ts";
import { AiError, type Task } from "./tasks.ts";

export const serviceClient = () =>
  createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

export async function requireUser(req: Request, db: SupabaseClient) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) throw new AiError(401, "Sign in first.");
  const { data, error } = await db.auth.getUser(auth.slice(7));
  if (error || !data.user) throw new AiError(401, "Your session has expired. Sign in again.");
  return data.user;
}

// Entitlement comes from RevenueCat on the server; a client-supplied flag is never trusted.
export async function requirePlus(userId: string) {
  const res = await fetch(
    "https://api.revenuecat.com/v1/subscribers/" + encodeURIComponent(userId),
    {
      headers: { Authorization: "Bearer " + env("REVENUECAT_SECRET_KEY") },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!res.ok) throw new Error("Subscription verification unavailable");
  const entitlement = (await res.json()).subscriber?.entitlements?.quasar_pro;
  const active =
    !!entitlement &&
    (!entitlement.expires_date || new Date(entitlement.expires_date) > new Date());
  if (!active) throw new AiError(402, "This needs an active Quasar Plus subscription.");
}

export async function consumeQuota(db: SupabaseClient, userId: string, task: Task) {
  const { data, error } = await db.rpc("consume_ai_quota", { p_uid: userId, p_task: task });
  if (error) throw error;
  if (!data) throw new AiError(429, "You've used today's AI requests for this feature. They reset tomorrow.");
}

export async function logRequest(
  db: SupabaseClient,
  row: { user_id: string; task: Task; model?: string; status: string; input_tokens?: number; output_tokens?: number },
) {
  const { error } = await db.from("ai_requests").insert(row);
  if (error) console.error("ai_log_failed", error.message);
}
