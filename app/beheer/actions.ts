"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/beheer/auth";
import { isSubmissionStatus } from "@/lib/beheer/statuses";

export type FormState = { error?: string; ok?: boolean } | null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Vul je e-mailadres en wachtwoord in." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Inloggen lukte niet. Controleer je gegevens en probeer opnieuw." };
  }

  redirect("/beheer");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/beheer/login");
}

export async function updateStatus(id: string, status: string): Promise<FormState> {
  await requireAdmin();
  if (!isSubmissionStatus(status)) {
    return { error: "Onbekende status." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: "Status bijwerken lukte niet. Probeer opnieuw." };
  }

  revalidatePath("/beheer");
  revalidatePath(`/beheer/aanvragen/${id}`);
  return { ok: true };
}

export async function saveNotes(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 10000).trim();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ notes: notes || null })
    .eq("id", id);

  if (error) {
    return { error: "Notities opslaan lukte niet. Probeer opnieuw." };
  }

  revalidatePath(`/beheer/aanvragen/${id}`);
  return { ok: true };
}
