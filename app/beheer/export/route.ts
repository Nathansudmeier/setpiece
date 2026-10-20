import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function GET() {
  const session = await requireAdmin();
  const db = await createSupabaseServerClient();
  const tables = ["sp_items", "sp_request_links", "sp_activity"] as const;
  const result: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    time_zone: "Europe/Amsterdam",
  };
  for (const table of tables) {
    let offset = 0;
    const all: unknown[] = [];
    while (true) {
      const { data, error } = await db
        .from(table)
        .select("*")
        .eq("owner_id", session.userId)
        .order(
          table === "sp_activity"
            ? "id"
            : table === "sp_items"
              ? "id"
              : "submission_id",
        )
        .range(offset, offset + 499);
      if (error)
        return Response.json(
          { error: "Export niet beschikbaar. Probeer opnieuw." },
          { status: 503, headers: { "Cache-Control": "private, no-store" } },
        );
      all.push(...data);
      if (data.length < 500) break;
      offset += 500;
    }
    result[table] = all;
  }
  return Response.json(result, {
    headers: {
      "Content-Disposition": `attachment; filename="setpiece-werk-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
