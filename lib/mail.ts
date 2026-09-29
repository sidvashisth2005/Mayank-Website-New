// Minimal Resend client. Without RESEND_API_KEY and MAYANK_INBOX_EMAIL the
// site runs in demo mode: submissions are validated but nothing is sent.

type Attachment = { filename: string; content: string };

type Mail = {
  subject: string;
  rows: [string, string][];
  replyTo?: string;
  attachments?: Attachment[];
};

export function referenceId() {
  return `MYK-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

function escape(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

export async function sendMail({ subject, rows, replyTo, attachments }: Mail): Promise<"sent" | "demo"> {
  const key = process.env.RESEND_API_KEY;
  const inbox = process.env.MAYANK_INBOX_EMAIL;
  if (!key || !inbox) return "demo";

  const html = `<table style="font-family:Helvetica,Arial,sans-serif;font-size:14px;border-collapse:collapse;max-width:680px">${rows
    .map(([label, value]) => `<tr><td style="padding:10px 16px 10px 0;border-bottom:1px solid #ddd;color:#666;vertical-align:top;white-space:nowrap">${escape(label)}</td><td style="padding:10px 0;border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(value || "Not provided")}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value || "Not provided"}`).join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAYANK_FROM_EMAIL || "Mayank <onboarding@resend.dev>",
      to: [inbox],
      reply_to: replyTo,
      subject,
      html,
      text,
      attachments,
    }),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  return "sent";
}

export const MIN_FILL_MS = 4000;
