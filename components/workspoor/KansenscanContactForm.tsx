"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Turnstile from "@/components/site/Turnstile";

type Status = "idle" | "submitting" | "success" | "error";

type FormValues = {
  name: string;
  company: string;
  email: string;
  employees: string;
  work: string;
  owner: string;
  phone: string;
  period: string;
};

type RequiredField = "name" | "company" | "email" | "employees" | "work" | "owner";
type Errors = Partial<Record<RequiredField, string>>;

const EMPTY_FORM: FormValues = {
  name: "",
  company: "",
  email: "",
  employees: "",
  work: "",
  owner: "",
  phone: "",
  period: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Vul je naam in, zodat we weten wie we spreken.";
  if (!values.company.trim()) errors.company = "Vul de naam van je organisatie in.";
  if (!values.email.trim()) {
    errors.email = "Vul je zakelijke e-mailadres in, zodat we kunnen reageren.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Dit e-mailadres lijkt onvolledig. Controleer het adres.";
  }
  if (!values.employees) {
    errors.employees = "Kies het aantal medewerkers, zodat we de context begrijpen.";
  }
  if (!values.work.trim()) {
    errors.work = "Beschrijf kort het terugkerende werk. Eén of twee zinnen zijn genoeg.";
  }
  if (!values.owner.trim()) {
    errors.owner = "Noem wie eigenaar kan worden van dit proces. Een functie is genoeg.";
  }
  return errors;
}

function toMessage(values: FormValues) {
  return [
    "Aanvraag kansenscan",
    "",
    `Aantal medewerkers: ${values.employees}`,
    `Terugkerend werk: ${values.work.trim()}`,
    `Mogelijke proceseigenaar: ${values.owner.trim()}`,
    `Telefoonnummer: ${values.phone.trim() || "niet opgegeven"}`,
    `Gewenste periode: ${values.period.trim() || "niet opgegeven"}`,
  ].join("\n");
}

export default function KansenscanContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);

  const submitting = status === "submitting";
  const mailHref =
    "mailto:hallo@setpiece.nl?subject=" +
    encodeURIComponent("Kansenscan bespreken via setpiece.nl");

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  const update =
    (field: keyof FormValues) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const nextValue = event.target.value;
      const nextValues = { ...values, [field]: nextValue };
      setValues(nextValues);
      if (field in errors) {
        const fieldName = field as RequiredField;
        setErrors((current) => ({
          ...current,
          [fieldName]: validate(nextValues)[fieldName],
        }));
      }
      if (status === "error") {
        setStatus("idle");
        setStatusMessage("");
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`scan-${firstError}`)?.focus();
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          company: values.company,
          email: values.email,
          message: toMessage(values),
          website,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setStatusMessage(result.error ?? "Het versturen lukte niet. Probeer het opnieuw.");
        setTurnstileReset((value) => value + 1);
        return;
      }
    } catch {
      setStatus("error");
      setStatusMessage("Het versturen lukte niet. Probeer het opnieuw of mail rechtstreeks.");
      setTurnstileReset((value) => value + 1);
      return;
    }

    setValues(EMPTY_FORM);
    setWebsite("");
    setTurnstileToken("");
    setStatus("success");
    setStatusMessage(
      "Aanvraag verstuurd. Nathan reageert binnen twee werkdagen. Bij een mogelijke match volgt een gesprek van maximaal 30 minuten.",
    );
    track("contact_submitted", { source: "kansenscan" });
  };

  const fieldError = (field: RequiredField) => errors[field];

  if (status === "success") {
    return (
      <div ref={successRef} className="ws-form-success" role="status" tabIndex={-1}>
        <span aria-hidden="true">✓</span>
        <h2>Aanvraag verstuurd.</h2>
        <p>{statusMessage}</p>
        <a className="ws-text-link" href={mailHref}>
          Liever direct mailen?
        </a>
      </div>
    );
  }

  return (
    <form
      className="ws-contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="scan-form-title"
    >
      <div className="ws-form-intro">
        <p className="ws-context">Aanvraag kansenscan</p>
        <h2 id="scan-form-title">Vertel welk werk steeds terugkomt.</h2>
        <p>Alle velden zijn verplicht, tenzij ze als optioneel zijn gemarkeerd.</p>
      </div>

      {Object.keys(errors).length > 0 ? (
        <div className="ws-form-summary" role="alert">
          Controleer de gemarkeerde velden en verstuur opnieuw.
        </div>
      ) : null}

      <div className="ws-form-pair">
        <div className="ws-field">
          <label htmlFor="scan-name">Naam</label>
          <input
            id="scan-name"
            name="name"
            autoComplete="name"
            maxLength={200}
            required
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(fieldError("name"))}
            aria-describedby={fieldError("name") ? "scan-name-error" : undefined}
            disabled={submitting}
          />
          {fieldError("name") ? <p id="scan-name-error">{fieldError("name")}</p> : null}
        </div>

        <div className="ws-field">
          <label htmlFor="scan-company">Organisatie</label>
          <input
            id="scan-company"
            name="company"
            autoComplete="organization"
            maxLength={200}
            required
            value={values.company}
            onChange={update("company")}
            aria-invalid={Boolean(fieldError("company"))}
            aria-describedby={fieldError("company") ? "scan-company-error" : undefined}
            disabled={submitting}
          />
          {fieldError("company") ? (
            <p id="scan-company-error">{fieldError("company")}</p>
          ) : null}
        </div>
      </div>

      <div className="ws-form-pair">
        <div className="ws-field">
          <label htmlFor="scan-email">Zakelijk e-mailadres</label>
          <input
            id="scan-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={320}
            required
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "scan-email-error" : undefined}
            disabled={submitting}
          />
          {fieldError("email") ? <p id="scan-email-error">{fieldError("email")}</p> : null}
        </div>

        <div className="ws-field">
          <label htmlFor="scan-employees">Aantal medewerkers</label>
          <select
            id="scan-employees"
            name="employees"
            required
            value={values.employees}
            onChange={update("employees")}
            aria-invalid={Boolean(fieldError("employees"))}
            aria-describedby={fieldError("employees") ? "scan-employees-error" : undefined}
            disabled={submitting}
          >
            <option value="">Maak een keuze</option>
            <option value="1 tot 14">1 tot 14</option>
            <option value="15 tot 75">15 tot 75</option>
            <option value="Meer dan 75">Meer dan 75</option>
          </select>
          {fieldError("employees") ? (
            <p id="scan-employees-error">{fieldError("employees")}</p>
          ) : null}
        </div>
      </div>

      <div className="ws-field">
        <label htmlFor="scan-work">
          Welk terugkerend werk kost nu de meeste tijd of veroorzaakt kwaliteitsverschil?
        </label>
        <textarea
          id="scan-work"
          name="work"
          rows={5}
          maxLength={3000}
          required
          value={values.work}
          onChange={update("work")}
          aria-invalid={Boolean(fieldError("work"))}
          aria-describedby={
            fieldError("work") ? "scan-work-help scan-work-error" : "scan-work-help"
          }
          disabled={submitting}
        />
        <small id="scan-work-help">
          Beschrijf de situatie in je eigen woorden. Een concreet voorbeeld helpt meer dan
          een volledige analyse. Deel nog geen namen, personeelsgegevens of andere
          vertrouwelijke persoonsgegevens.
        </small>
        {fieldError("work") ? <p id="scan-work-error">{fieldError("work")}</p> : null}
      </div>

      <div className="ws-field">
        <label htmlFor="scan-owner">Wie kan eigenaar worden van dit proces?</label>
        <input
          id="scan-owner"
          name="owner"
          maxLength={300}
          required
          value={values.owner}
          onChange={update("owner")}
          aria-invalid={Boolean(fieldError("owner"))}
          aria-describedby={
            fieldError("owner") ? "scan-owner-help scan-owner-error" : "scan-owner-help"
          }
          disabled={submitting}
        />
        <small id="scan-owner-help">
          Bijvoorbeeld een teamleider of officemanager. Een functie is genoeg.
        </small>
        {fieldError("owner") ? <p id="scan-owner-error">{fieldError("owner")}</p> : null}
      </div>

      <div className="ws-form-pair">
        <div className="ws-field">
          <label htmlFor="scan-phone">
            Telefoonnummer <span>(optioneel)</span>
          </label>
          <input
            id="scan-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={100}
            value={values.phone}
            onChange={update("phone")}
            disabled={submitting}
          />
        </div>
        <div className="ws-field">
          <label htmlFor="scan-period">
            Gewenste periode <span>(optioneel)</span>
          </label>
          <input
            id="scan-period"
            name="period"
            maxLength={300}
            value={values.period}
            onChange={update("period")}
            placeholder="Bijvoorbeeld: komende twee weken"
            disabled={submitting}
          />
        </div>
      </div>

      <div hidden aria-hidden="true">
        <label htmlFor="scan-website">Website</label>
        <input
          id="scan-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <Turnstile action="contact" onToken={setTurnstileToken} resetKey={turnstileReset} />

      {status === "error" ? (
        <p className="ws-form-server-error" role="alert">
          {statusMessage} <a href={mailHref}>Mail naar hallo@setpiece.nl.</a>
        </p>
      ) : null}

      <div className="ws-form-actions">
        <button className="ws-button" type="submit" disabled={submitting}>
          {submitting ? "Aanvraag wordt verwerkt…" : "Verstuur aanvraag"}
        </button>
        <p>
          We gebruiken je gegevens alleen om deze aanvraag te beoordelen en te
          beantwoorden. Lees hoe dat werkt in onze <Link href="/privacy">privacyverklaring</Link>.
        </p>
      </div>
    </form>
  );
}
