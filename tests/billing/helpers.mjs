import pg from "pg";
export const url = process.env.BILLING_TEST_DATABASE_URL;
if (!url || !/^postgres(?:ql)?:\/\/[^@]+@127\.0\.0\.1:55322\//.test(url))
  throw new Error("Only isolated billing DB on 127.0.0.1:55322 is allowed");
export const owner = "675024a7-62f2-4eac-ba25-9718bb362e74";
export const today = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Amsterdam",
}).format(new Date());
export async function connect() {
  const c = new pg.Client({ connectionString: url });
  await c.connect();
  return c;
}
export async function session(c, uid = owner, role = "authenticated") {
  await c.query(
    "select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",
    [uid, role],
  );
}
export async function cmd(
  c,
  operation,
  payload = {},
  version = null,
  request = crypto.randomUUID(),
) {
  return (
    await c.query("select public.sp_command($1,$2,$3,$4) result", [
      request,
      operation,
      payload,
      version,
    ])
  ).rows[0].result;
}
export const seller = {
  name: "Setpiece testbedrijf",
  street: "Teststraat 1",
  postal_code: "1234 AB",
  city: "Teststad",
  country: "NL",
  vat_id: "NL123456789B01",
  kvk: "12345678",
  iban: "NL91ABNA0417164300",
  account_holder: "Testbedrijf",
  payment_days: 14,
  prefix: "F",
  mail_subject: "Factuur {nummer}",
  mail_body:
    "Beste {klant},\nFactuur {nummer} voor {totaal}. Betaal vóór {vervaldatum}. Referentie {referentie}.",
};
export const buyer = {
  name: "Synthetische klant",
  street: "Testlaan 2",
  postal_code: "2345 BC",
  city: "Testdorp",
  country: "NL",
  vat_id: "",
  kvk: "",
  recipients: ["billing-recipient@example.test"],
  cc: ["billing-cc@example.test"],
  payment_days: 14,
  tax_confirmed: true,
};
export const line = (price = "196950") => ({
  id: crypto.randomUUID(),
  description: "Synthetische testdienst",
  quantity: "1",
  unit: "dienst",
  unit_price_cents: price,
  vat_code: "nl_21",
  tax_treatment: "nl_standard",
});
export async function setup(c) {
  await session(c);
  const r = (
    await c.query(
      "select version from public.sp_billing_settings where owner_id=$1",
      [owner],
    )
  ).rows[0];
  await cmd(c, "settings.update", { data: seller }, r?.version ?? 1);
  return cmd(c, "customer.create", { data: buyer });
}
export async function draft(c, customer, price = "196950") {
  return cmd(c, "invoice.create", {
    customer_id: customer.id,
    invoice_on: today,
    service_from: today,
    service_until: today,
    lines: [line(price)],
  });
}
export async function final(c, customer, price = "196950") {
  const i = await draft(c, customer, price);
  return cmd(c, "invoice.finalize", { id: i.id }, i.version);
}
export async function attached(c, i) {
  i = await cmd(
    c,
    "invoice.prepare_pdf",
    {
      id: i.id,
      hash: "a".repeat(64),
      bytes: 100,
      template_version: "setpiece-invoice-v1",
    },
    i.version,
  );
  return cmd(
    c,
    "invoice.attach_pdf",
    {
      id: i.id,
      hash: "a".repeat(64),
      bytes: 100,
      path: `${owner}/${today.slice(0, 4)}/${i.number}-${i.id}.pdf`,
    },
    i.version,
  );
}
export async function dispatch(c, id) {
  return (
    await c.query(
      "select * from public.sp_invoice_dispatches where invoice_id=$1 and status<>'geannuleerd'",
      [id],
    )
  ).rows[0];
}
export async function fails(c, fn, code) {
  await c.query("savepoint expected_error");
  try {
    const { default: assert } = await import("node:assert/strict");
    await assert.rejects(fn, { code });
  } finally {
    await c.query("rollback to savepoint expected_error");
  }
}
