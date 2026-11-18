"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Feedback, useBillingIntent } from "./Shared";
import PersonPicker from "../PersonPicker";
import { DEFAULT_CUSTOMER, type Customer } from "@/lib/billing/schema";
import { parseEmails } from "@/lib/billing/model";
const RECIPIENT_ERROR = "Controleer de factuurontvangers en Cc.";
function addressError(value: string) {
  try {
    parseEmails(value);
    return undefined;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "Controleer het e-mailadres.";
  }
}
export default function CustomerForm({
  customer,
  projects,
  person,
}: {
  customer?: Customer;
  projects: { id: string; title: string }[];
  person?: { id: string; naam: string };
}) {
  const [data, setData] = useState(customer?.data ?? DEFAULT_CUSTOMER),
    [version, setVersion] = useState<number | null>(customer?.version ?? null),
    [to, setTo] = useState(data.recipients.join(", ")),
    [cc, setCc] = useState(data.cc.join(", ")),
    [validateAddresses, setValidateAddresses] = useState(false),
    intent = useBillingIntent(),
    router = useRouter();
  const toError = validateAddresses ? addressError(to) : undefined,
    ccError = validateAddresses ? addressError(cc) : undefined;
  function changeAddress(field: "to" | "cc", value: string) {
    if (field === "to") setTo(value);
    else setCc(value);
    if (
      intent.error === RECIPIENT_ERROR &&
      !addressError(field === "to" ? value : to) &&
      !addressError(field === "cc" ? value : cc)
    )
      intent.setError("");
  }
  return (
    <form
      className="bw-bill-section"
      onSubmit={async (e) => {
        e.preventDefault();
        setValidateAddresses(true);
        if (addressError(to) || addressError(cc)) {
          intent.setError(RECIPIENT_ERROR);
          return;
        }
        const form = new FormData(e.currentTarget);
        try {
          const payload = {
            data: { ...data, recipients: parseEmails(to), cc: parseEmails(cc) },
            person_id: String(form.get("person_id") ?? "") || null,
            project_id: String(form.get("project_id") ?? "") || null,
            active: form.get("active") === "on",
            ...(customer ? { id: customer.id } : {}),
          };
          const r = await intent.run(
            customer ? "customer.update" : "customer.create",
            payload,
            version,
          );
          if (r.ok) {
            setVersion(r.version ?? version);
            router.push("/beheer/facturen/klanten?id=" + r.id);
            router.refresh();
          }
        } catch (error) {
          intent.setError(
            error instanceof Error
              ? error.message
              : "Controleer de ontvangers.",
          );
        }
      }}
    >
      <h2>{customer ? "Klant bewerken" : "Nieuwe klant"}</h2>
      <Feedback
        error={intent.error}
        success={intent.success}
        target={toError ? "customer-to" : ccError ? "customer-cc" : undefined}
      />
      <div className="bw-bill-fields">
        {(
          [
            ["name", "Juridische factuurnaam"],
            ["street", "Feitelijk factuuradres"],
            ["postal_code", "Postcode"],
            ["city", "Plaats"],
            ["country", "Vestigingsland (landcode)"],
            ["vat_id", "Btw-id afnemer (indien van toepassing)"],
            ["kvk", "KVK afnemer (optioneel)"],
          ] as const
        ).map(([key, label]) => (
          <Field
            key={key}
            name={"customer-" + key}
            label={label}
            value={data[key]}
            onChange={(v) => setData({ ...data, [key]: v })}
          />
        ))}
        <Field
          name="customer-to"
          label="Factuurontvangers"
          value={to}
          onChange={(value) => changeAddress("to", value)}
          error={toError}
          description="Losse e-mailadressen, gescheiden door komma’s."
        />
        <Field
          name="customer-cc"
          label="Cc (optioneel)"
          value={cc}
          onChange={(value) => changeAddress("cc", value)}
          error={ccError}
        />
        <Field
          name="customer-days"
          label="Betaaltermijn in dagen"
          type="number"
          value={String(data.payment_days)}
          onChange={(v) => setData({ ...data, payment_days: Number(v) })}
        />
        <label>
          Setpiece-project (optioneel)
          <select
            aria-label="Setpiece-project (optioneel)"
            name="project_id"
            defaultValue={customer?.project_id ?? ""}
          >
            <option value="">Geen project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <PersonPicker
        name="person_id"
        label="Bestaande contactpersoon (optioneel)"
        initial={person ? [person] : []}
      />
      <label className="bw-bill-check">
        <input
          type="checkbox"
          checked={data.tax_confirmed}
          onChange={(e) =>
            setData({ ...data, tax_confirmed: e.target.checked })
          }
        />
        Ik heb de juridische afnemer, het Nederlandse vestigingsadres en de
        toepasselijke Nederlandse btw-behandeling bevestigd.
      </label>
      <p>
        Voor buitenlandse afnemers, 0%, vrijstelling of verlegging is eerst een
        gerichte uitbreiding nodig. Een Nederlandse contactpersoon of e-mail
        bepaalt de btw niet.
      </p>
      <label className="bw-bill-check">
        <input
          name="active"
          type="checkbox"
          defaultChecked={customer?.active ?? true}
        />
        Actieve klant
      </label>
      <button className="bw-primary" disabled={intent.pending}>
        {intent.pending ? "Opslaan…" : "Bewaar klant"}
      </button>
    </form>
  );
}
