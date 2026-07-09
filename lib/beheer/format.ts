// Datumnotatie voor het postvak, altijd in Nederlandse tijd (server draait UTC).
const TIME_ZONE = "Europe/Amsterdam";

const dateTimeFormat = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const shortDateFormat = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  timeZone: TIME_ZONE,
});

const timeFormat = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "short",
  timeZone: TIME_ZONE,
});

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

// Compacte weergave voor de postvaklijst: tijd voor vandaag, "gisteren",
// anders een korte datum.
export function formatCompact(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const dayKey = dayKeyFormat.format(date);
  const todayKey = dayKeyFormat.format(now);
  if (dayKey === todayKey) return timeFormat.format(date);

  const yesterdayKey = dayKeyFormat.format(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  if (dayKey === yesterdayKey) return "gisteren";

  return shortDateFormat.format(date);
}
