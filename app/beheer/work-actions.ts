"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateWork, type WorkKind } from "@/lib/beheer/model";
import { getPeople } from "@/lib/beheer/data";
export type WorkFormState = {
  error?: string;
  ok?: boolean;
  id?: string;
} | null;
function message(error: { code?: string; message: string }) {
  if (error.code === "PT409")
    return "Dit onderdeel is intussen gewijzigd. Ververs de pagina en pas je wijziging opnieuw toe.";
  if (error.code === "23505")
    return "Dit verzoek is al verwerkt met andere gegevens. Ververs de pagina.";
  if (error.code === "42501") return "Je hebt geen toegang tot deze gegevens.";
  const known = [
    "Project en werkgebied moeten overeenkomen",
    "Persoon niet beschikbaar",
    "Ongeldige koppeling",
    "Heropen het werk eerst",
    "Werkgebied wijzigen kan pas als gekoppelde acties zijn verplaatst",
  ];
  return (
    known.find((x) => error.message.includes(x)) ??
    "Opslaan lukte niet. Controleer de velden en probeer opnieuw."
  );
}
export async function saveWork(
  _previous: WorkFormState,
  form: FormData,
): Promise<WorkFormState> {
  await requireAdmin();
  const kind = String(form.get("kind")) as WorkKind;
  if (!["project", "task", "decision"].includes(kind))
    return { error: "Onbekend onderdeel." };
  const id = String(form.get("id") ?? "");
  const payload: Record<string, unknown> = {};
  for (const key of [
    "title",
    "workspace",
    "description",
    "status",
    "assignee",
    "source_url",
    "source_ref",
    "result",
    "execution_ref",
    "next_step",
    "notes",
  ])
    payload[key] = String(form.get(key) ?? "").trim();
  for (const key of [
    "project_id",
    "assignee_person_id",
    "waiting_person_id",
    "due_on",
    "follow_up_on",
  ])
    payload[key] = String(form.get(key) ?? "") || null;
  payload.priority = Number(form.get("priority") ?? 2);
  payload.people = form.getAll("people").map(String).filter(Boolean);
  const docTitle = form.getAll("document_title").map(String);
  const docUrl = form.getAll("document_url").map(String);
  payload.documents = docTitle
    .map((title, i) => ({ title: title.trim(), url: docUrl[i]?.trim() ?? "" }))
    .filter((x) => x.title || x.url);
  try {
    validateWork(kind, payload);
    if (id) payload.id = id;
    const db = await createSupabaseServerClient();
    const { data, error } = await db.rpc("sp_command", {
      p_request_id: String(form.get("request_id")),
      p_operation: `${kind}.${id ? "update" : "create"}`,
      p_payload: payload,
      p_expected_version: id ? Number(form.get("version")) : null,
    });
    if (error) return { error: message(error) };
    revalidatePath("/beheer", "layout");
    return { ok: true, id: data.id };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Controleer de invoer.",
    };
  }
}
export async function quickUpdate(form: FormData) {
  await requireAdmin();
  const db = await createSupabaseServerClient();
  const patch = JSON.parse(String(form.get("patch") ?? "{}"));
  const { error } = await db.rpc("sp_command", {
    p_request_id: String(form.get("request_id")),
    p_operation: `${String(form.get("kind"))}.update`,
    p_payload: { id: String(form.get("id")), ...patch },
    p_expected_version: Number(form.get("version")),
  });
  if (error) throw new Error(message(error));
  revalidatePath("/beheer", "layout");
}
export async function searchPeople(query: string) {
  return getPeople(query.slice(0, 120));
}
export async function saveRequestLink(
  _previous: WorkFormState,
  form: FormData,
): Promise<WorkFormState> {
  await requireAdmin();
  const db = await createSupabaseServerClient();
  const payload: Record<string, unknown> = {
    submission_id: String(form.get("submission_id")),
  };
  for (const key of ["person_id", "project_id", "task_id"])
    payload[key] = String(form.get(key) ?? "") || null;
  const { error } = await db.rpc("sp_command", {
    p_request_id: String(form.get("request_id")),
    p_operation: "request.link",
    p_payload: payload,
    p_expected_version: form.get("version")
      ? Number(form.get("version"))
      : null,
  });
  if (error) return { error: message(error) };
  revalidatePath("/beheer", "layout");
  return { ok: true };
}
