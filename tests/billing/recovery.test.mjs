import test from "node:test";
import assert from "node:assert/strict";
import { recoverInvoicePdf, hashPdf } from "../../lib/billing/pdf-recovery.ts";
const bytes = Buffer.from("%PDF-synthetic-verifiable-test-bytes");
function fixture() {
  let i = {
    id: crypto.randomUUID(),
    owner_id: crypto.randomUUID(),
    status: "definitief",
    number: "F2026-0001",
    sequence_year: 2026,
    frozen: {},
    pdf_path: null,
    pdf_hash: null,
    pdf_bytes: null,
    pdf_prepared_hash: null,
    pdf_prepared_bytes: null,
    version: 1,
  };
  const objects = new Map(),
    count = { render: 0, upload: 0, attach: 0 };
  const io = {
    read: async (p) => objects.get(p) ?? null,
    render: async () => {
      count.render++;
      return bytes;
    },
    prepare: async (_i, hash, n) => {
      i = {
        ...i,
        pdf_prepared_hash: hash,
        pdf_prepared_bytes: n,
        version: i.version + 1,
      };
      return i;
    },
    upload: async (p, b) => {
      count.upload++;
      if (objects.has(p)) throw new Error("no upsert");
      objects.set(p, b);
    },
    attach: async (_i, p, hash, n) => {
      count.attach++;
      i = {
        ...i,
        pdf_path: p,
        pdf_hash: hash,
        pdf_bytes: n,
        status: "klaar_voor_verzending",
        version: i.version + 1,
      };
    },
  };
  return {
    get invoice() {
      return i;
    },
    objects,
    count,
    io,
  };
}
test("render failure leaves finalized numbered invoice and retry succeeds", async () => {
  const f = fixture(),
    render = f.io.render;
  f.io.render = async () => {
    throw new Error("render failure");
  };
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io));
  assert.equal(f.invoice.number, "F2026-0001");
  assert.equal(f.invoice.pdf_prepared_hash, null);
  f.io.render = render;
  await recoverInvoicePdf(f.invoice, f.io);
  assert.equal(f.invoice.status, "klaar_voor_verzending");
});
test("upload failure keeps preparation; stable rerender resumes without new number", async () => {
  const f = fixture(),
    upload = f.io.upload;
  f.io.upload = async () => {
    throw new Error("upload failure");
  };
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io));
  assert.equal(f.invoice.pdf_prepared_hash, hashPdf(bytes));
  f.io.upload = upload;
  await recoverInvoicePdf(f.invoice, f.io);
  assert.equal(f.invoice.number, "F2026-0001");
});
test("successful upload but failed attach reuses object without rerender/upload", async () => {
  const f = fixture(),
    attach = f.io.attach;
  f.io.attach = async () => {
    throw new Error("attach failure");
  };
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io));
  assert.equal(f.objects.size, 1);
  f.io.attach = attach;
  await recoverInvoicePdf(f.invoice, f.io);
  assert.equal(f.count.render, 1);
  assert.equal(f.count.upload, 1);
  assert.equal(f.count.attach, 1);
});
test("lost attach response re-entry verifies archive without second attach", async () => {
  const f = fixture(),
    attach = f.io.attach;
  f.io.attach = async (...args) => {
    await attach(...args);
    throw new Error("response lost");
  };
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io));
  await recoverInvoicePdf(f.invoice, f.io);
  assert.equal(f.count.attach, 1);
  assert.equal(f.count.upload, 1);
});
test("prepared but missing object with changed renderer never replaces expected bytes", async () => {
  const f = fixture();
  f.io.upload = async () => {
    throw new Error("failure");
  };
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io));
  f.io.render = async () => Buffer.from("%PDF-different");
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io), /andere bytes/);
  assert.equal(f.objects.size, 0);
});
test("uploaded object with wrong hash is never attached or overwritten", async () => {
  const f = fixture();
  await f.io.prepare(f.invoice, hashPdf(bytes), bytes.length);
  const path = `${f.invoice.owner_id}/2026/${f.invoice.number}-${f.invoice.id}.pdf`;
  f.objects.set(path, Buffer.from("%PDF-corrupt"));
  await assert.rejects(recoverInvoicePdf(f.invoice, f.io), /integriteit/);
  assert.equal(f.count.attach, 0);
  assert.equal(f.count.upload, 0);
});
