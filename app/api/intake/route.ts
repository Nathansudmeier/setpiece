import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Model gecentraliseerd: één regel om te wisselen. Opus 4.8 is de kwaliteits-
// default; wil je goedkoper/sneller op dit publieke eindpunt, zet dan bijv.
// "claude-haiku-4-5" of "claude-sonnet-5".
const MODEL = "claude-opus-4-8";

// Invoerlimieten (harde grens tegen misbruik en te grote requests).
const LIMITS = { type: 80, challenge: 700, goal: 700 };

// Lichte in-memory ratelimiter. Best effort: serverless instances delen dit
// geheugen niet, dus dit is een eerste drempel, geen sluitende bescherming.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

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

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "onbekend").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Even rustig aan. Probeer het over een paar minuten opnieuw." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  // Honeypot: bots vullen dit verborgen veld vaak in.
  if (clean(data.website, 200)) {
    return NextResponse.json({ error: "Aanvraag geweigerd." }, { status: 400 });
  }

  const type = clean(data.type, LIMITS.type);
  const challenge = clean(data.challenge, LIMITS.challenge);
  const goal = clean(data.goal, LIMITS.goal);

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

  try {
    const anthropic = new Anthropic();
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      thinking: { type: "disabled" },
      system: SYSTEM,
      messages: [{ role: "user", content: userContent }],
    });

    const briefing = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!briefing) {
      return NextResponse.json(
        { error: "Er kwam geen antwoord terug. Probeer het opnieuw." },
        { status: 502 },
      );
    }

    return NextResponse.json({ briefing });
  } catch {
    return NextResponse.json(
      { error: "Het genereren lukte niet. Probeer het opnieuw of mail ons." },
      { status: 502 },
    );
  }
}
