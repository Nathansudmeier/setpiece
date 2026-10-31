"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  mutateBilling,
  type BillingResult,
} from "@/app/beheer/billing-actions";
import type { Json } from "@/lib/billing/client";
export function BillingTabs() {
  const path = usePathname();
  return (
    <nav className="bw-bill-tabs" aria-label="Facturatie">
      {[
        ["/beheer/facturen", "Facturen"],
        ["/beheer/facturen/klanten", "Klanten"],
        ["/beheer/facturen/instellingen", "Instellingen"],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            (
              href === "/beheer/facturen"
                ? !path.includes("/klanten") && !path.includes("/instellingen")
                : path.startsWith(href)
            )
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function Feedback({
  error,
  success,
  target,
}: {
  error?: string;
  success?: string;
  target?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) ref.current?.focus();
  }, [error]);
  return (
    <>
      {error && (
        <div className="bw-bill-error" ref={ref} tabIndex={-1} role="alert">
          <strong>De wijziging is niet opgeslagen</strong>
          <p>{error}</p>
          {target && <a href={"#" + target}>Controleer de invoer</a>}{" "}
          <Link href="/beheer/facturen/instellingen">
            Controleer bedrijfsgegevens
          </Link>{" "}
          ·{" "}
          <a
            href={
              typeof window === "undefined" ? "#" : window.location.pathname
            }
            target="_blank"
            rel="noreferrer"
          >
            Open actuele versie
          </a>
        </div>
      )}
      {success && (
        <p className="bw-bill-feedback" role="status">
          {success}
        </p>
      )}
    </>
  );
}
export function useBillingIntent() {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const running = useRef(false),
    intent = useRef<{ signature: string; id: string } | null>(null);
  async function run(
    operation: string,
    payload: Json,
    version: number | null,
  ): Promise<BillingResult> {
    if (running.current)
      return { ok: false, error: "De vorige poging loopt nog." };
    running.current = true;
    setPending(true);
    setError("");
    setSuccess("");
    const signature = JSON.stringify([operation, payload, version]);
    if (intent.current?.signature !== signature)
      intent.current = { signature, id: crypto.randomUUID() };
    try {
      let result: BillingResult | undefined;
      for (let n = 0; n < 3; n++) {
        try {
          result = await mutateBilling(
            intent.current.id,
            operation,
            payload,
            version,
          );
          break;
        } catch {
          if (n === 2)
            throw new Error(
              "Geen bevestiging ontvangen. Probeer dezelfde poging opnieuw; de verzoek-ID blijft behouden.",
            );
        }
      }
      if (!result) throw new Error("Geen bevestiging ontvangen.");
      if (result.ok) {
        intent.current = null;
        setSuccess("Opgeslagen.");
      } else setError(result.error ?? "Opslaan is niet bevestigd.");
      return result;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Opslaan is niet bevestigd.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      running.current = false;
      setPending(false);
    }
  }
  return { pending, error, success, run, setError, setSuccess };
}
export function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  description,
  error,
  maxLength = 500,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  description?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <label htmlFor={name}>
      {label}
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [description ? name + "-help" : "", error ? name + "-error" : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {description && <small id={name + "-help"}>{description}</small>}
      {error && <small id={name + "-error"}>{error}</small>}
    </label>
  );
}
