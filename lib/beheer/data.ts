import "server-only";
import { requireAdmin } from "./auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  collectPages,
  type Person,
  type Snapshot,
  type Workspace,
  type WorkItem,
  type RequestLink,
} from "./model";
export async function getSnapshot(workspace?: Workspace): Promise<Snapshot> {
  const session = await requireAdmin();
  const db = await createSupabaseServerClient();
  const itemsPromise = collectPages<WorkItem>(async (from, to) => {
    let query = db
      .from("sp_items")
      .select("*")
      .eq("owner_id", session.userId)
      .order("id");
    if (workspace) query = query.eq("workspace", workspace);
    const { data, error } = await query.range(from, to);
    if (error)
      throw new Error(
        "Het werkoverzicht is niet beschikbaar. Ververs de pagina of probeer later opnieuw.",
      );
    return data as WorkItem[];
  });
  const linksPromise = collectPages<RequestLink>(async (from, to) => {
    const { data, error } = await db
      .from("sp_request_links")
      .select("*")
      .eq("owner_id", session.userId)
      .order("submission_id")
      .range(from, to);
    if (error)
      throw new Error("Aanvraagkoppelingen laden lukt niet. Probeer opnieuw.");
    return data as RequestLink[];
  });
  const [items, links, activity] = await Promise.all([
    itemsPromise,
    linksPromise,
    db
      .from("sp_activity")
      .select("*")
      .eq("owner_id", session.userId)
      .order("id", { ascending: false })
      .limit(100),
  ]);
  if (activity.error)
    throw new Error("Activiteit laden lukt niet. Probeer opnieuw.");
  items.sort(
    (a, b) =>
      a.priority - b.priority ||
      (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999") ||
      b.created_at.localeCompare(a.created_at),
  );
  return {
    items,
    links,
    activity: activity.data,
    has_more: false,
    checked_at: new Date().toISOString(),
  };
}
export async function getWork(id: string): Promise<WorkItem | null> {
  const session = await requireAdmin();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return null;
  const db = await createSupabaseServerClient();
  const { data, error } = await db
    .from("sp_items")
    .select("*")
    .eq("owner_id", session.userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Dit werk laden lukt niet. Probeer opnieuw.");
  return data as WorkItem | null;
}
export async function getPeople(
  query = "",
  id?: string,
): Promise<{
  people: Person[];
  moments: {
    id: string;
    datum: string;
    kanaal: string;
    omschrijving: string;
  }[];
}> {
  await requireAdmin();
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("sp_people", {
    p_query: query,
    p_id: id ?? null,
  });
  if (error)
    throw new Error(
      "Het personenbestand is niet beschikbaar. Probeer opnieuw.",
    );
  return data;
}
