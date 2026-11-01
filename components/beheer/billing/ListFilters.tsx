"use client";
import { useState } from "react";
export default function ListFilters({
  filter,
  years,
}: {
  filter: { q: string; year: string; state: string };
  years: string[];
}) {
  const [open, setOpen] = useState(false),
    active = Object.values(filter).filter(Boolean).length;
  const choices = {
    concept: "Concept",
    pdf: "PDF ontbreekt",
    jarvis: "Wacht op Jarvis",
    open: "Open",
    late: "Te laat",
    paid: "Betaald / verrekend",
    credited: "Gecrediteerd",
    void: "Vervallen",
  };
  return (
    <div className="bw-bill-filters">
      <button
        className="bw-secondary bw-bill-filter-toggle"
        aria-expanded={open}
        aria-controls="invoice-filters"
        onClick={() => setOpen(!open)}
      >
        {open ? "Sluit filters" : "Toon filters"}
        {active ? ` (${active} actief)` : ""}
      </button>
      <form
        id="invoice-filters"
        className={`bw-filters ${open ? "" : "bw-bill-filters-closed"}`}
        action="/beheer/facturen"
      >
        <label>
          Zoeken
          <input
            name="q"
            defaultValue={filter.q}
            placeholder="Nummer of klant"
            maxLength={120}
          />
        </label>
        <label>
          Jaar
          <select aria-label="Jaar" name="year" defaultValue={filter.year}>
            <option value="">Alle jaren</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <label>
          Toestand
          <select
            aria-label="Toestand"
            name="state"
            defaultValue={filter.state}
          >
            <option value="">Alle facturen</option>
            {Object.entries(choices).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button className="bw-secondary">Toon selectie</button>
      </form>
    </div>
  );
}
