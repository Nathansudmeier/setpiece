"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { Button, Toast } from "@/components/ds";
import Turnstile from "@/components/site/Turnstile";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm = { name: "", email: "", company: "", message: "" };

export default function SiteContact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // De AI-intake kan het formulier voorvullen met de gegeven antwoorden.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      if (!detail?.message) return;
      setForm((prev) => ({ ...prev, message: detail.message as string }));
      setStatus("idle");
    };
    window.addEventListener("setpiece:prefill-contact", onPrefill);
    return () => window.removeEventListener("setpiece:prefill-contact", onPrefill);
  }, []);

  const email = "hallo@setpiece.nl";
  const mailHref = "mailto:" + email + "?subject=" + encodeURIComponent("Kennismaking via setpiece.nl");

  const update = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website, turnstileToken }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrorMessage(result.error ?? "Het versturen lukte niet. Probeer het opnieuw.");
        setTurnstileReset((value) => value + 1);
        setStatus("error");
        return;
      }
    } catch {
      setErrorMessage("Het versturen lukte niet. Probeer het opnieuw of mail ons.");
      setTurnstileReset((value) => value + 1);
      setStatus("error");
      return;
    }

    setForm(emptyForm);
    setWebsite("");
    setTurnstileToken("");
    setStatus("success");
    track("contact_submitted", { source: "homepage" });

    // toon een bevestiging in de toast
    setToastVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastVisible(false), 4000);
  };

  const submitting = status === "submitting";

  return (
    <section id="contact" className="sp-section" style={{ background: "var(--surface-page)" }}>
      <div className="sp-container" style={{ maxWidth: 820 }}>
        <div className="sp-contact-card" data-reveal>
          <span className="sp-contact-glass" aria-hidden="true"></span>

          <p className="sp-eyebrow sp-eyebrow--on-dark" style={{ textAlign: "center" }}>Kennismaking</p>
          <h2 className="sp-h2" style={{ textAlign: "center" }}>Laten we praten over jouw volgende kans.</h2>

          {status === "success" ? (
            <div className="sp-form-success" role="status">
              <span className="sp-form-success__mark" aria-hidden="true">✓</span>
              <p className="sp-form-success__title">Bericht binnen. Bedankt.</p>
              <p className="sp-form-success__msg">
                We reageren binnen 1 werkdag op je bericht. Liever direct schakelen?{" "}
                <a href={mailHref}>Mail ons.</a>
              </p>
            </div>
          ) : (
            <>
              <p className="body">
                Vertel waar het schuurt en wat je wilt bereiken. Dan kijken we samen naar de slimste volgende zet.
              </p>

              <form className="sp-contact-form" onSubmit={handleSubmit} noValidate={false}>
                <div className="sp-form-row">
                  <div className="sp-field">
                    <label htmlFor="contact-name">Naam</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={200}
                      placeholder="Jouw naam"
                      value={form.name}
                      onChange={update("name")}
                      disabled={submitting}
                    />
                  </div>
                  <div className="sp-field">
                    <label htmlFor="contact-email">E-mail</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={320}
                      placeholder="jij@bedrijf.nl"
                      value={form.email}
                      onChange={update("email")}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="sp-field">
                  <label htmlFor="contact-company">Organisatie <span className="sp-field__opt">optioneel</span></label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    maxLength={200}
                    placeholder="Bedrijf of vereniging"
                    value={form.company}
                    onChange={update("company")}
                    disabled={submitting}
                  />
                </div>

                <div className="sp-field">
                  <label htmlFor="contact-message">Waar kunnen we bij helpen?</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={5000}
                    rows={5}
                    placeholder="Een paar zinnen over je plan, je vereniging of de vraag die speelt."
                    value={form.message}
                    onChange={update("message")}
                    disabled={submitting}
                  />
                </div>

                <div className="sp-intake__hp" aria-hidden="true" hidden>
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                <Turnstile
                  action="contact"
                  onToken={setTurnstileToken}
                  resetKey={turnstileReset}
                />

                {status === "error" && (
                  <p className="sp-form-error" role="alert">
                    {errorMessage}{" "}
                    <a href={mailHref}>Mail rechtstreeks naar {email}.</a>
                  </p>
                )}

                <div className="sp-form-actions">
                  <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                    {submitting ? "Versturen..." : "Verstuur bericht"}
                  </Button>
                  <span className="email-line">
                    Liever direct mailen? <a href={mailHref}>{email}</a>
                  </span>
                </div>

                <p className="sp-form-reassure">
                  <span className="sp-form-reassure__dot" aria-hidden="true" />
                  Gratis en vrijblijvend. We reageren binnen 1 werkdag.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <div className={`sp-toast-holder ${toastVisible ? "is-visible" : ""}`} aria-live="polite">
        <Toast variant="highlight" title="Verstuurd" message="We nemen binnen 1 werkdag contact op." />
      </div>
    </section>
  );
}
