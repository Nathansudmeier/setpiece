import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { CMS_SCHEMA, defaultsFor, type CmsCopy, type CmsSlug } from "./schema";
import { createPageMetadata } from "@/lib/seo";
// This client has only the public key. The RPC returns the published revision;
// it cannot read drafts, even if called without the application.
export const readPublished = cache(async (slug: CmsSlug): Promise<CmsCopy> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return defaultsFor(slug);
  try {
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
          }),
      },
    });
    const { data, error } = await db.rpc("sp_public_content", { p_slug: slug });
    if (error || !data?.content) return defaultsFor(slug);
    return { ...defaultsFor(slug), ...data.content };
  } catch {
    return defaultsFor(slug);
  }
});
export async function cmsMetadata(slug: Exclude<CmsSlug, "shared">) {
  const copy = await readPublished(slug);
  const meta = createPageMetadata({
    title: copy.seo_title,
    description: copy.seo_description,
    path: CMS_SCHEMA[slug].path,
  });
  return slug === "home"
    ? { ...meta, title: { absolute: `Setpiece | ${copy.seo_title}` } }
    : meta;
}
