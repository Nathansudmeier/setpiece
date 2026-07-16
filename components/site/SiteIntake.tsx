"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ds";
import Turnstile from "@/components/site/Turnstile";

type Status = "idle" | "loading" | "done" | "error";

const TYPES = [
  "Onderneming of MKB",
  "Vereniging of club",
  "Non-profit of stichting",
  "Anders",
];

export default function SiteIntake() {
  const [type, setType] = useState(TYPES[0]);
  const [challenge, setChallenge] = useState("");
  const [goal, setGoal] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [briefing, setBriefing] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);

  const submitting = status === "loading";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (challenge.trim().length < 3 || goal.trim().length < 3) {
      setError("Vul kort in waar het schuurt en wat je wilt bereiken.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, challenge, goal, website, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Er ging iets mis. Probeer het opnieuw.");
        setTurnstileReset((value) => value + 1);
        setStatus("error");
        return;
      }
      setBriefing(data.briefing);
      setStatus("done");
      track("intake_completed", { organizationType: type });
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
      setTurnstileReset((value) => value + 1);
      setStatus("error");
    }
  };

  const takeToContact = () => {
    const summary =
      "Ik heb de AI-intake ingevuld.\n\n" +
      `Organisatie: ${type}\n` +
      `Waar het schuurt: ${challenge.trim()}\n` +
      `Wat ik wil bereiken: ${goal.trim()}`;
    window.dispatchEvent(
      new CustomEvent("setpiece:prefill-contact", { detail: { message: summary } }),
    );
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const reset = () => {
    setStatus("idle");
    setBriefing("");
    setError("");
    setTurnstileToken("");
    setTurnstileReset((value) => value + 1);
  };

  return (
    <section id="intake" className="sp-section sp-intake">
      <div className="sp-container" style={{ maxWidth: 860 }}>
        <div className="sp-intake__head">
          <p className="sp-eyebrow" data-reveal>AI-intake</p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "40ms" }}>
            Zie in één minuut wat de eerste zet zou zijn.
          </h2>
          <p className="sp-intake__lead" data-reveal style={{ transitionDelay: "80ms" }}>
            Beantwoord drie vragen. Je krijgt direct een kort spelplan, opgesteld met dezelfde AI
            die we voor klanten inzetten. Gratis, geen account, geen verplichting.
          </p>
        </div>

        <div className="sp-intake__panel" data-reveal>
          {status === "done" ? (
            <div className="sp-intake__result" role="status">
              <p className="sp-intake__result-label">Jouw eerste spelplan</p>
              <div className="sp-intake__briefing">
                {briefing.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="sp-intake__result-actions">
                <Button variant="primary" size="lg" onClick={takeToContact}>
                  Pak dit samen op
                </Button>
                <button type="button" className="sp-intake__again" onClick={reset}>
                  Opnieuw invullen
                </button>
              </div>
              <p className="sp-intake__disclaimer">
                Dit is een eerste schets van de AI. Een gesprek gaat dieper en scherper.
              </p>
            </div>
          ) : (
            <form className="sp-intake__form" onSubmit={handleSubmit}>
              <div className="sp-field">
                <label htmlFor="intake-type">Wat voor organisatie ben je?</label>
                <div className="sp-select-wrap">
                  <select
                    id="intake-type"
                    className="sp-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={submitting}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg className="sp-select-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
                    <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="sp-field">
                <label htmlFor="intake-challenge">Waar loopt het spaak?</label>
                <textarea
                  id="intake-challenge"
                  rows={3}
                  maxLength={600}
                  placeholder="Bijvoorbeeld: ons verhaal is vaag, onze site is verouderd, marketing is losse acties."
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="sp-field">
                <label htmlFor="intake-goal">Wat wil je bereiken?</label>
                <textarea
                  id="intake-goal"
                  rows={3}
                  maxLength={600}
                  placeholder="Bijvoorbeeld: meer aanvragen, een herkenbaar merk, slimmer werken met AI."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Honeypot: verborgen voor mensen, ingevuld door bots */}
              <div className="sp-intake__hp" aria-hidden="true" hidden>
                <label htmlFor="intake-website">Website</label>
                <input
                  id="intake-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Turnstile
                action="intake"
                onToken={setTurnstileToken}
                resetKey={turnstileReset}
              />

              {status === "error" && (
                <p className="sp-form-error" role="alert">{error}</p>
              )}

              <div className="sp-intake__actions">
                <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                  {submitting ? "Bezig met je spelplan..." : "Genereer mijn spelplan"}
                </Button>
                <span className="sp-intake__hint">Duurt een paar seconden.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
