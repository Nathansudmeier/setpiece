"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Toast } from "@/components/ds";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm = { name: "", email: "", company: "", message: "" };

export default function SiteContact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const email = "hello@setpiece.nl";
  const mailHref = "mailto:" + email + "?subject=" + encodeURIComponent("Nieuw project via setpiece.nl");

  const update = (field: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      message: form.message.trim(),
      source: "homepage",
    });

    if (error) {
      setStatus("error");
      return;
    }

    setForm(emptyForm);
    setStatus("success");

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

          <p className="sp-eyebrow sp-eyebrow--on-dark" style={{ textAlign: "center" }}>Trap af</p>
          <h2 className="sp-h2" style={{ textAlign: "center" }}>Laten we praten over jouw volgende kans.</h2>

          {status === "success" ? (
            <div className="sp-form-success" role="status">
              <span className="sp-form-success__mark" aria-hidden="true">✓</span>
              <p className="sp-form-success__title">Bericht binnen. Bedankt.</p>
              <p className="sp-form-success__msg">
                We reageren binnen 1 werkdag op {email ? "je aanvraag" : ""}. Liever direct schakelen?{" "}
                <a href={mailHref}>Mail ons.</a>
              </p>
            </div>
          ) : (
            <>
              <p className="body">
                Vertel kort waar je mee bezig bent. We reageren binnen 1 werkdag.
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

                {status === "error" && (
                  <p className="sp-form-error" role="alert">
                    Het versturen lukte niet. Probeer het opnieuw of mail rechtstreeks naar{" "}
                    <a href={mailHref}>{email}</a>.
                  </p>
                )}

                <div className="sp-form-actions">
                  <Button variant="primary" size="lg" type="submit" disabled={submitting}>
                    {submitting ? "Versturen…" : "Verstuur bericht →"}
                  </Button>
                  <span className="email-line">
                    of mail <a href={mailHref}>{email}</a>
                  </span>
                </div>
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
