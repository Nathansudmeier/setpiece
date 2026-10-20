import "server-only";
import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CmsCopy, CmsSlug } from "./schema";
export type CmsRevision = {
  id: string;
  slug: CmsSlug;
  content: CmsCopy;
  created_at: string;
  actor: string;
  action: string;
};
export type CmsDocument = {
  slug: CmsSlug;
  draft: CmsCopy;
  version: number;
  published_id: string;
  published_at: string;
  updated_at: string;
  revisions: CmsRevision[];
};
export async function readCmsAdmin(slug: CmsSlug): Promise<CmsDocument> {
  await requireAdmin();
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("sp_cms_admin", { p_slug: slug });
  if (error)
    throw new Error("Website-inhoud laden lukt niet. Probeer opnieuw.");
  return data;
}
