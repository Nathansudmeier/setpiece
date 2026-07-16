import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

import { cleanText, getClientIp, hasValidOrigin, logPublicEndpoint, requestIsTooLarge } from "@/lib/security/request";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_INTAKE_MODEL ?? "claude-haiku-4-5";
const FALLBACK_MODEL = process.env.ANTHROPIC_INTAKE_FALLBACK_MODEL ?? "claude-sonnet-5";
const DAILY_LIMIT = Math.max(1, Math.min(500, Number(process.env.INTAKE_DAILY_LIMIT) || 80));

// Invoerlimieten (harde grens tegen misbruik en te grote requests).
const LIMITS = { type: 80, challenge: 600, goal: 600 };

const SYSTEM = `Je bent de strateeg van Setpiece, een freelance bureau voor strategie en digitale identiteit uit Almere. Iemand vult op de website drie velden in: wat voor organisatie ze zijn, waar het schuurt en wat ze willen bereiken.

Schrijf een kort, scherp eerste spelplan. Toon: direct, menselijk, nuchter, zelfverzekerd. Schrijf zoals je praat, geen bureautaal, geen jargon, geen loze beloftes.

Regels:
- Nederlands.
- Nooit em-dashes. Gebruik gewone leestekens.
- Nooit de woorden "duiken in", "naadloos", "essentieel", "uniek".
- Geen kopjes, geen opsomtekens, geen markdown. Alleen platte tekst.
- Precies drie korte alinea's, gescheiden door een lege regel:
  1. Wat je hoort en waar het echt om draait (spiegel hun situatie kort terug).
  2. De eerste twee of drie concrete zetten die je zou voorstellen.
  3. Een nuchtere afsluiter dat dit een eerste schets is en dat een gesprek dieper gaat.
- Samen maximaal ongeveer 130 woorden.
- Geef alleen het spelplan terug. Geen inleiding, geen meta-uitleg, geen aanhef.`;

async function generateBriefing(
  anthropic: Anthropic,
  model: string,
  userContent: string,
  signal: AbortSignal,
): Promise<string> {
  const message = await anthropic.messages.create(
    {
      model,
      max_tokens: 240,
      thinking: { type: "disabled" },
      system: SYSTEM,
      messages: [{ role: "user", content: userContent }],
    },
    { signal },
  );

  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  if (!hasValidOrigin(request) || requestIsTooLarge(request)) {
    logPublicEndpoint("intake", "rejected", startedAt, "invalid_request");
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  // Honeypot: bots vullen dit verborgen veld vaak in.
  if (cleanText(data.website, 200)) {
    logPublicEndpoint("intake", "rejected", startedAt, "honeypot");
    return NextResponse.json({ error: "Aanvraag geweigerd." }, { status: 400 });
  }

  const type = cleanText(data.type, LIMITS.type).replace(/\s+/g, " ");
  const challenge = cleanText(data.challenge, LIMITS.challenge).replace(/\s+/g, " ");
  const goal = cleanText(data.goal, LIMITS.goal).replace(/\s+/g, " ");
  const turnstileToken = cleanText(data.turnstileToken, 2_048);

  if (challenge.length < 3 || goal.length < 3) {
    return NextResponse.json(
      { error: "Vul kort in waar het schuurt en wat je wilt bereiken." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "De intake staat even uit. Mail of gebruik het contactformulier." },
      { status: 503 },
    );
  }

  const userContent = `Organisatie: ${type || "niet ingevuld"}\nWaar het schuurt: ${challenge}\nWat ze willen bereiken: ${goal}`;
  const ip = getClientIp(request);

  try {
    const [ipAllowed, budgetAllowed] = await Promise.all([
      consumeRateLimit({
        identifier: `intake:${ip}`,
        action: "intake_generate",
        limit: 4,
        windowSeconds: 15 * 60,
      }),
      consumeRateLimit({
        identifier: "intake:global",
        action: "intake_daily_budget",
        limit: DAILY_LIMIT,
        windowSeconds: 24 * 60 * 60,
      }),
    ]);

    if (!ipAllowed || !budgetAllowed) {
      logPublicEndpoint("intake", "rejected", startedAt, ipAllowed ? "daily_budget" : "rate_limited");
      return NextResponse.json(
        { error: "De intake heeft zijn limiet bereikt. Probeer het later opnieuw of neem contact op." },
        { status: 429 },
      );
    }

    if (!(await verifyTurnstile(turnstileToken, ip, "intake"))) {
      logPublicEndpoint("intake", "rejected", startedAt, "bot_check");
      return NextResponse.json(
        { error: "De beveiligingscontrole lukte niet. Vernieuw de pagina en probeer opnieuw." },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic();
    const signal = AbortSignal.timeout(15_000);
    let briefing: string;

    try {
      briefing = await generateBriefing(anthropic, MODEL, userContent, signal);
    } catch (error) {
      if (signal.aborted || !FALLBACK_MODEL || FALLBACK_MODEL === MODEL) throw error;
      briefing = await generateBriefing(anthropic, FALLBACK_MODEL, userContent, signal);
    }

    if (!briefing) {
      return NextResponse.json(
        { error: "Er kwam geen antwoord terug. Probeer het opnieuw." },
        { status: 502 },
      );
    }

    logPublicEndpoint("intake", "accepted", startedAt);
    return NextResponse.json({ briefing });
  } catch {
    logPublicEndpoint("intake", "failed", startedAt, "server_error");
    return NextResponse.json(
      { error: "Het genereren lukte niet. Probeer het opnieuw of mail ons." },
      { status: 502 },
    );
  }
}
