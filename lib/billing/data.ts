import "server-only";
import { requireAdmin } from "@/lib/beheer/auth";
import { billingSessionClient, type Json } from "./client";
import { readSchema, type BillingData } from "./schema";
export async function readBilling(
  id: string | null = null,
  after: string | null = null,
): Promise<BillingData> {
  await requireAdmin();
  const db = await billingSessionClient();
  const { data, error } = await db.rpc("sp_billing_read", {
    p_id: id,
    p_after: after,
    p_limit: 100,
  });
  if (error)
    throw new Error(
      "Facturatie laden lukt niet. Controleer de verbinding en probeer opnieuw.",
    );
  const parsed = readSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(
      "De ontvangen facturatiegegevens hebben een onbekend formaat. Laat de beheerder de databaseversie controleren.",
    );
  return parsed.data;
}
export async function allBilling() {
  const first = await readBilling();
  let current = first;
  while (current.has_more) {
    current = await readBilling(null, current.cursor);
    first.invoices.push(...current.invoices);
    if (first.invoices.length > 2000)
      throw new Error(
        "Meer dan 2000 documenten: verklein de archiefselectie vóór export.",
      );
  }
  return first;
}
export function billingError(error: { code?: string; message: string }) {
  if (error.code === "PT409")
    return "Dit onderdeel is intussen gewijzigd. Je invoer blijft staan. Open de actuele versie in een nieuw tabblad en vergelijk vóór je opnieuw opslaat.";
  if (error.code === "23505")
    return "Deze poging of dit bewijs bestaat met andere gegevens. Controleer de actuele versie voordat je opnieuw probeert.";
  if (error.code === "42501")
    return "Je hebt geen toegang tot deze factuur of deze handeling vereist de ingelogde eigenaar.";
  if (["22023", "P0001"].includes(error.code ?? "")) return error.message;
  return "De wijziging is niet bevestigd. Controleer de velden en probeer dezelfde poging opnieuw.";
}
export async function billingCommand(
  request: string,
  operation: string,
  payload: Json,
  version: number | null,
) {
  await requireAdmin();
  const db = await billingSessionClient();
  const result = await db.rpc("sp_command", {
    p_request_id: request,
    p_operation: operation,
    p_payload: payload,
    p_expected_version: version,
  });
  if (result.error) throw new Error(billingError(result.error));
  return result.data;
}
