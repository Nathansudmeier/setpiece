"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CMS_SCHEMA,
  CMS_SLUGS,
  isCmsSlug,
  validateCms,
} from "@/lib/cms/schema";
export type CmsState = {
  error?: string;
  ok?: boolean;
  message?: string;
} | null;
export async function changeCms(
  _previous: CmsState,
  form: FormData,
): Promise<CmsState> {
  await requireAdmin();
  const slug = String(form.get("slug"));
  const action = String(form.get("intent"));
  if (!isCmsSlug(slug) || !["save", "publish", "restore"].includes(action))
    return { error: "Onbekende inhoudshandeling." };
  let content: Record<string, string> | null = null;
  try {
    if (action === "save") {
      content = Object.fromEntries(
        Object.keys(CMS_SCHEMA[slug].fields).map((k) => [
          k,
          String(form.get(k) ?? ""),
        ]),
      );
      validateCms(slug, content);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Controleer de inhoud." };
  }
  const db = await createSupabaseServerClient();
  const { error } = await db.rpc("sp_cms_command", {
    p_request_id: String(form.get("request_id")),
    p_slug: slug,
    p_action: action,
    p_content: content,
    p_expected_version: Number(form.get("version")),
    p_revision_id: form.get("revision_id") || null,
  });
  if (error)
    return {
      error:
        error.code === "PT409"
          ? "De inhoud is intussen gewijzigd. Ververs de editor en probeer opnieuw."
          : error.code === "23505"
            ? "Dit verzoek is al verwerkt. Ververs de editor."
            : "Opslaan lukte niet. Controleer de inhoud en probeer opnieuw.",
    };
  revalidatePath("/beheer", "layout");
  if (action === "publish") {
    for (const key of slug === "shared" ? CMS_SLUGS : [slug]) {
      const path = CMS_SCHEMA[key].path;
      if (path !== "shared") revalidatePath(path);
    }
    revalidatePath("/", "layout");
  }
  return {
    ok: true,
    message:
      action === "publish"
        ? "Gepubliceerd. De geselecteerde inhoud staat nu openbaar."
        : action === "restore"
          ? "Vorige versie als nieuw concept teruggezet. Controleer en publiceer om deze openbaar te maken."
          : "Concept opgeslagen. De openbare website is ongewijzigd.",
  };
}
