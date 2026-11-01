"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Feedback, useBillingIntent } from "./Shared";
import { renderMail, formatEuro } from "@/lib/billing/model";
import { amsterdamDate } from "@/lib/beheer/model";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/billing/schema";
const sections = [
  {
    title: "Bedrijfsgegevens",
    fields: [
      ["name", "Juridische bedrijfsnaam"],
      ["street", "Feitelijk vestigingsadres"],
      ["postal_code", "Postcode"],
      ["city", "Plaats"],
      ["country", "Landcode"],
      ["vat_id", "Btw-identificatienummer"],
      ["kvk", "KVK-nummer"],
    ],
  },
  {
    title: "Bank en betaaltermijn",
    fields: [
      ["iban", "IBAN"],
      ["account_holder", "Rekeninghouder"],
      ["payment_days", "Standaard betaaltermijn in dagen"],
    ],
  },
  { title: "Nummering", fields: [["prefix", "Prefix (1–4 hoofdletters)"]] },
  {
    title: "Factuurmail",
    fields: [
      ["mail_subject", "Onderwerp"],
      ["mail_body", "Berichttekst"],
    ],
  },
] as const;
export default function SettingsForm({
  settings,
}: {
  settings: Settings | null;
}) {
  const [values, setValues] = useState(settings?.data ?? DEFAULT_SETTINGS),
    [version, setVersion] = useState(settings?.version ?? 1),
    [savedSection, setSavedSection] = useState("");
  const intent = useBillingIntent(),
    router = useRouter();
  const exampleValues = {
    nummer: `${values.prefix || "F"}${amsterdamDate().slice(0, 4)}-0001`,
    klant: "Voorbeeldklant",
    totaal: formatEuro("12100"),
    vervaldatum: "14-11-2026",
    referentie: "VOORBEELD",
  };
  function example(template: string) {
    try {
      return renderMail(template, exampleValues);
    } catch {
      return "Vul het sjabloon met ondersteunde velden in om een voorbeeld te zien.";
    }
  }
  return (
    <>
      <Feedback error={intent.error} target="name" />
      <p>
        Je kunt onvolledige gegevens bewaren. Definitief maken vereist een
        geldig factuuradres, btw-id, KVK, bankgegevens en ingevuld mailsjabloon.
      </p>
      {sections.map((section) => (
        <form
          className="bw-bill-section"
          key={section.title}
          onSubmit={async (e) => {
            e.preventDefault();
            const data: Record<string, string | number> = {};
            for (const [key] of section.fields) data[key] = values[key];
            const r = await intent.run("settings.update", { data }, version);
            if (r.ok) {
              setVersion(r.version ?? version);
              setSavedSection(section.title);
              router.refresh();
            }
          }}
        >
          <h2>{section.title}</h2>
          {section.title === "Nummering" && (
            <p>
              Facturen en credits delen één doorlopende reeks per kalenderjaar.
              Een andere prefix reset de teller niet.
            </p>
          )}
          {section.title === "Factuurmail" && (
            <>
              <p>
                Jarvis maakt een concept in <strong>nathan@setpiece.nl</strong>.
                Je verstuurt zelf.
              </p>
              <p>
                Beschikbare velden:{" "}
                {"{nummer}, {klant}, {totaal}, {vervaldatum}, {referentie}"}.
                Onbekende velden blokkeren definitief maken.
              </p>
            </>
          )}
          <div className="bw-bill-fields">
            {section.fields.map(([key, label]) =>
              key === "mail_body" ? (
                <label key={key} htmlFor={key}>
                  {label}
                  <textarea
                    id={key}
                    aria-label={label}
                    value={values[key]}
                    onChange={(e) =>
                      setValues({ ...values, [key]: e.target.value })
                    }
                    rows={7}
                    maxLength={10000}
                  />
                </label>
              ) : (
                <Field
                  key={key}
                  name={key}
                  label={label}
                  value={String(values[key])}
                  type={key === "payment_days" ? "number" : "text"}
                  onChange={(v) =>
                    setValues({
                      ...values,
                      [key]: key === "payment_days" ? Number(v) : v,
                    })
                  }
                />
              ),
            )}
          </div>
          {section.title === "Factuurmail" && (
            <section
              className="bw-bill-mail-example"
              aria-label="Mailvoorbeeld met fictieve gegevens"
            >
              <h3>Voorbeeld met fictieve gegevens</h3>
              <p>
                <strong>Onderwerp:</strong> {example(values.mail_subject)}
              </p>
              <p className="bw-bill-body">{example(values.mail_body)}</p>
            </section>
          )}
          <button
            className={
              section.title === "Bedrijfsgegevens"
                ? "bw-primary"
                : "bw-secondary"
            }
            disabled={intent.pending}
          >
            {intent.pending
              ? "Opslaan…"
              : `Bewaar ${section.title.toLowerCase()}`}
          </button>
          {savedSection === section.title && (
            <p role="status">Opgeslagen. {section.title} zijn bewaard.</p>
          )}
        </form>
      ))}
      <p className="bw-bill-note">
        Instellingen wijzigen nooit een definitieve factuur. Het product
        gebruikt het factuurstelsel en ondersteunt EUR-facturen met Nederlandse
        21% en 9% btw. Controleer per prestatie welk tarief van toepassing is.
      </p>
    </>
  );
}
