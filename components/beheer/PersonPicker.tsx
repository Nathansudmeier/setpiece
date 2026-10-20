"use client";
import { useId, useRef, useState } from "react";
import type { Person } from "@/lib/beheer/model";
import { searchPeople } from "@/app/beheer/work-actions";
export default function PersonPicker({
  name,
  label,
  initial = [],
  multiple = false,
}: {
  name: string;
  label: string;
  initial?: Pick<Person, "id" | "naam">[];
  multiple?: boolean;
}) {
  const uid = useId();
  const [selected, setSelected] = useState(initial);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const sequence = useRef(0);
  async function search() {
    const n = ++sequence.current;
    setPending(true);
    setError("");
    try {
      const d = await searchPeople(q);
      if (n === sequence.current) setResults(d.people);
    } catch {
      setError("Zoeken lukt niet. Probeer opnieuw.");
    } finally {
      if (n === sequence.current) setPending(false);
    }
  }
  return (
    <fieldset className="bw-person-picker">
      <legend>{label}</legend>
      {selected.map((p) => (
        <div className="bw-selected" key={p.id}>
          <input type="hidden" name={name} value={p.id} />
          <span>{p.naam}</span>
          <button
            type="button"
            aria-label={`${p.naam} verwijderen uit ${label}`}
            onClick={() => setSelected(selected.filter((x) => x.id !== p.id))}
          >
            Verwijderen
          </button>
        </div>
      ))}
      <div className="bw-picker-search">
        <label htmlFor={uid} className="bw-visually-hidden">
          Zoek persoon voor {label}
        </label>
        <input
          id={uid}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Zoek op naam of organisatie"
        />
        <button type="button" onClick={search} disabled={pending}>
          {pending ? "Zoeken…" : "Zoek"}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {results.length > 0 && (
        <ul className="bw-picker-results">
          {results
            .filter((x) => !selected.some((p) => p.id === x.id))
            .map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(multiple ? [...selected, p] : [p]);
                    setResults([]);
                    setQ("");
                  }}
                >
                  {p.naam}{" "}
                  <small>
                    {[p.organisatie, ...p.rollen].filter(Boolean).join(" · ")} ·{" "}
                    {p.id.slice(0, 8)}
                  </small>
                </button>
              </li>
            ))}
        </ul>
      )}
      <small>
        Controleer de context bij gelijke namen. Selectie koppelt de bestaande
        persoon.
      </small>
    </fieldset>
  );
}
