import nodemailer from "nodemailer";

export function mailFrom(): string {
  return process.env.MAIL_FROM ?? "Ai.neck <noreply@itneck.ai>";
}

export function mailToSupport(): string {
  return process.env.MAIL_TO?.trim() || "support@itneck.com";
}

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_PASS);
}

function transporter() {
  const pass = process.env.SMTP_PASS;
  if (!pass) {
    throw new Error("SMTP_PASS is not configured.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.itneck.ai",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER ?? "noreply@itneck.ai",
      pass,
    },
  });
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  cc?: string;
  bcc?: string;
}): Promise<{ ok: true; messageId?: string } | { ok: false; error: string }> {
  if (!process.env.SMTP_PASS) {
    console.error("SMTP_PASS is not configured; email not sent.");
    return { ok: false, error: "Email is not configured." };
  }

  try {
    const info = await transporter().sendMail({
      from: mailFrom(),
      to: opts.to,
      cc: opts.cc,
      bcc: opts.bcc,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      messageId: `<${crypto.randomUUID()}@itneck.ai>`,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error("SMTP send failed:", err);
    return { ok: false, error: "We couldn't send email right now." };
  }
}
