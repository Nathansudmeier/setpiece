import { NextResponse, type NextRequest } from "next/server";

import { cleanText, getClientIp, hasValidOrigin, logPublicEndpoint, requestIsTooLarge } from "@/lib/security/request";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  if (!hasValidOrigin(request) || requestIsTooLarge(request)) {
    logPublicEndpoint("contact", "rejected", startedAt, "invalid_request");
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (cleanText(body.website, 200)) {
    logPublicEndpoint("contact", "rejected", startedAt, "honeypot");
    return NextResponse.json({ ok: true });
  }

  const name = cleanText(body.name, 200);
  const email = cleanText(body.email, 320).toLowerCase();
  const company = cleanText(body.company, 200);
  const message = cleanText(body.message, 5_000);
  const turnstileToken = cleanText(body.turnstileToken, 2_048);

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 3) {
    return NextResponse.json(
      { error: "Controleer je naam, e-mailadres en bericht." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);

  try {
    const allowed = await consumeRateLimit({
      identifier: `contact:${ip}`,
      action: "contact_submit",
      limit: 5,
      windowSeconds: 30 * 60,
    });
    if (!allowed) {
      logPublicEndpoint("contact", "rejected", startedAt, "rate_limited");
      return NextResponse.json(
        { error: "Even rustig aan. Probeer het later opnieuw." },
        { status: 429 },
      );
    }

    if (!(await verifyTurnstile(turnstileToken, ip, "contact"))) {
      logPublicEndpoint("contact", "rejected", startedAt, "bot_check");
      return NextResponse.json(
        { error: "De beveiligingscontrole lukte niet. Vernieuw de pagina en probeer opnieuw." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      company: company || null,
      message,
      source: "homepage",
    });

    if (error) throw error;
    logPublicEndpoint("contact", "accepted", startedAt);
    return NextResponse.json({ ok: true });
  } catch {
    logPublicEndpoint("contact", "failed", startedAt, "server_error");
    return NextResponse.json(
      { error: "Het versturen lukte niet. Probeer het opnieuw of mail ons." },
      { status: 503 },
    );
  }
}
