import "server-only";

import { Resend } from "resend";

type ContactNotificationInput = {
  submissionId: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
};

let resendClient: Resend | null = null;

function getNotificationConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_NOTIFICATION_FROM;
  const to = process.env.CONTACT_NOTIFICATION_TO;

  if (!apiKey || !from || !to) {
    throw new Error("Resend-notificatieconfiguratie ontbreekt.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return { client: resendClient, from, to };
}

function asSingleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function createNotificationText(input: ContactNotificationInput) {
  const beheerUrl = `https://setpiece.nl/beheer/aanvragen/${encodeURIComponent(input.submissionId)}`;

  return [
    "Nieuwe kansenscan-aanvraag via setpiece.nl",
    "",
    `Naam: ${asSingleLine(input.name)}`,
    `Bedrijf: ${input.company ? asSingleLine(input.company) : "Niet ingevuld"}`,
    `E-mail: ${input.email}`,
    "",
    "Bericht:",
    input.message,
    "",
    "Open de aanvraag in het beveiligde postvak:",
    beheerUrl,
  ].join("\n");
}

export async function sendContactNotification(input: ContactNotificationInput) {
  const { client, from, to } = getNotificationConfig();
  const response = await client.emails.send(
    {
      from,
      to,
      replyTo: input.email,
      subject: `Nieuwe kansenscan-aanvraag van ${asSingleLine(input.name)}`,
      text: createNotificationText(input),
    },
    {
      idempotencyKey: `contact-submission/${input.submissionId}`,
    },
  );

  if (response.error) {
    throw new Error(`Resend-weigeringscode: ${response.error.name}`);
  }

  return response.data.id;
}

export function logContactNotification(
  status: "sent" | "failed",
  submissionId: string,
  reason?: string,
) {
  const entry = {
    event: "contact_notification",
    status,
    submissionId,
    reason,
  };

  if (status === "failed") {
    console.error(JSON.stringify(entry));
    return;
  }

  console.info(JSON.stringify(entry));
}
