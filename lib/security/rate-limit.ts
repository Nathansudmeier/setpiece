import "server-only";

import { createHmac } from "node:crypto";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type RateLimitOptions = {
  identifier: string;
  action: string;
  limit: number;
  windowSeconds: number;
};

function anonymize(identifier: string): string {
  const secret = process.env.RATE_LIMIT_SECRET ?? process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Rate-limitconfiguratie ontbreekt.");

  return createHmac("sha256", secret).update(identifier).digest("hex");
}

export async function consumeRateLimit({
  identifier,
  action,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_identifier: anonymize(identifier),
    p_action: action,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) throw new Error(`Rate limiter niet beschikbaar: ${error.message}`);
  return data === true;
}
