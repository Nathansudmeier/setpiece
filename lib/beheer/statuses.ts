// Werkstatussen van een aanvraag in het postvak. Waarden komen overeen met
// de check-constraint op contact_submissions.status in Supabase.
export const STATUSES = {
  nieuw: { label: "Nieuw", badge: "amber" },
  in_behandeling: { label: "In behandeling", badge: "tint" },
  afgerond: { label: "Afgerond", badge: "nacht" },
  gearchiveerd: { label: "Gearchiveerd", badge: "outline" },
} as const;

export type SubmissionStatus = keyof typeof STATUSES;

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return value in STATUSES;
}

export type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  status: SubmissionStatus;
  read_at: string | null;
  notes: string | null;
};
