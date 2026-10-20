export const WORKSPACES = {
  setpiece: "Setpiece",
  nankaro: "Nankaro",
  "fc-groningen": "FC Groningen",
  "mv-artemis": "MV Artemis",
  prive: "Privé",
} as const;
export const WORK_STATUSES = {
  open: "Open",
  bezig: "Bezig",
  wachten: "Wachten op iemand",
  beslissing: "Beslissing nodig",
  afgerond: "Afgerond",
  gearchiveerd: "Gearchiveerd",
} as const;
export const ASSIGNEES = [
  "Nathan",
  "Jarvis",
  "Nankaro",
  "Leads",
  "Artemis",
  "Johan",
] as const;
export type Workspace = keyof typeof WORKSPACES;
export type WorkStatus = keyof typeof WORK_STATUSES;
export type WorkKind = "project" | "task" | "decision";
export type WorkItem = {
  id: string;
  owner_id: string;
  kind: WorkKind;
  workspace: Workspace;
  title: string;
  description: string;
  status: WorkStatus;
  priority: number;
  project_id: string | null;
  assignee: string;
  assignee_person_id: string | null;
  waiting_person_id: string | null;
  due_on: string | null;
  follow_up_on: string | null;
  source_url: string;
  source_ref: string;
  result: string;
  execution_ref: string;
  next_step: string;
  people: string[];
  notes: string;
  documents: { title: string; url: string }[];
  version: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};
export type Person = {
  id: string;
  naam: string;
  roepnaam: string | null;
  rollen: string[];
  functie: string | null;
  organisatie: string | null;
  email: string | null;
  telefoon: string | null;
  notitie: string | null;
  bron: string | null;
  laatste_contact: string | null;
  updated_at: string;
};
export type Activity = {
  id: number;
  item_id: string | null;
  actor: string;
  action: string;
  summary: string;
  created_at: string;
};
export type RequestLink = {
  submission_id: string;
  person_id: string | null;
  project_id: string | null;
  task_id: string | null;
  version: number;
};
export type Snapshot = {
  items: WorkItem[];
  activity: Activity[];
  links: RequestLink[];
  has_more: boolean;
  checked_at: string;
};
export function safeUrl(value: string) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return (
      ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
    );
  } catch {
    return false;
  }
}
export function validateWork(
  kind: WorkKind,
  input: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...input };
  if (
    typeof out.title !== "string" ||
    !out.title.trim() ||
    out.title.length > 240
  )
    throw new Error("Vul een titel van maximaal 240 tekens in.");
  out.title = out.title.trim();
  if (typeof out.workspace !== "string" || !(out.workspace in WORKSPACES))
    throw new Error("Kies een geldig werkgebied.");
  if (
    out.status !== undefined &&
    (typeof out.status !== "string" || !(out.status in WORK_STATUSES))
  )
    throw new Error("Kies een geldige status.");
  for (const key of ["due_on", "follow_up_on"]) {
    const v = out[key];
    if (
      v &&
      (typeof v !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(v) ||
        Number.isNaN(Date.parse(v)) ||
        new Date(v).toISOString().slice(0, 10) !== v)
    )
      throw new Error("Kies een geldige kalenderdatum.");
  }
  for (const key of ["source_url"])
    if (out[key] && !safeUrl(String(out[key])))
      throw new Error(
        "Gebruik een volledige http- of https-link zonder inloggegevens.",
      );
  if (
    kind === "task" &&
    out.status === "bezig" &&
    !String(out.execution_ref ?? "").trim()
  )
    throw new Error(
      "Voeg bewijs van de gestarte uitvoering toe. Toewijzing alleen is nog geen uitvoering.",
    );
  if (
    kind === "task" &&
    out.status === "afgerond" &&
    !String(out.result ?? "").trim()
  )
    throw new Error(
      "Beschrijf het resultaat of voeg een opleververwijzing toe.",
    );
  return out;
}
export function amsterdamDate(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Amsterdam",
  }).format(now);
}
export function todayGroups<
  T extends {
    status: string;
    due_on?: string | null;
    follow_up_on?: string | null;
  },
>(rows: T[], now = new Date()) {
  const today = amsterdamDate(now);
  const active = rows.filter(
    (x) => !["afgerond", "gearchiveerd"].includes(x.status),
  );
  const soon = new Date(`${today}T12:00:00Z`);
  soon.setUTCDate(soon.getUTCDate() + 7);
  const end = soon.toISOString().slice(0, 10);
  return {
    overdue: active.filter((x) => x.due_on && x.due_on < today),
    upcoming: active.filter(
      (x) => x.due_on && x.due_on >= today && x.due_on <= end,
    ),
    followup: active.filter((x) => x.follow_up_on && x.follow_up_on <= today),
    decisions: active.filter((x) => x.status === "beslissing"),
    open: active.filter((x) => x.status === "open" || x.status === "bezig"),
  };
}
export function dateLabel(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(`${value}T12:00:00Z`))
    : "Geen datum";
}

export async function collectPages<T>(
  fetchPage: (from: number, to: number) => Promise<T[]>,
  pageSize = 200,
): Promise<T[]> {
  if (!Number.isInteger(pageSize) || pageSize < 1)
    throw new Error("Ongeldige paginagrootte.");
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = await fetchPage(from, from + pageSize - 1);
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}
