import { escapeHtml, mailLayout } from "./layout";

function detailsTable(
  rows: Array<[string, string]>,
  message: string,
): string {
  const table = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 16px 6px 0;color:#5c6678;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#02376b;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px;">${table}</table>
    <p style="margin:20px 0 0;white-space:pre-wrap;color:#02376b;">${escapeHtml(message)}</p>`;
}

export function contactConfirmationEmail(opts: {
  fullName: string;
}): { subject: string; html: string; text: string } {
  const first = escapeHtml(opts.fullName.trim().split(/\s+/)[0] || opts.fullName);
  return {
    subject: "We received your message — Ai.neck",
    html: mailLayout({
      title: "Thanks — we have your note.",
      body: `<p style="margin:0 0 12px;">Hi ${first},</p>
        <p style="margin:0 0 12px;">We received your working-session request. A person on the Ai.neck team typically replies within one business day.</p>
        <p style="margin:0;">If anything is urgent, you can also call us at 858-740-8878.</p>`,
    }),
    text: `Hi ${opts.fullName.trim().split(/\s+/)[0] || opts.fullName},\n\nWe received your working-session request. We typically reply within one business day.\n\nAi.neck · San Diego, CA`,
  };
}

export function contactTeamEmail(opts: {
  fullName: string;
  workEmail: string;
  company: string;
  phone?: string;
  topic: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const rows: Array<[string, string]> = [
    ["Name", opts.fullName],
    ["Work email", opts.workEmail],
    ["Company", opts.company],
    ["Phone", opts.phone?.trim() || "—"],
    ["Topic", opts.topic],
  ];
  return {
    subject: `[Ai.neck] ${opts.topic} — ${opts.fullName} (${opts.company})`,
    html: mailLayout({
      title: "New working session request",
      body: detailsTable(rows, opts.message),
    }),
    text: `Name: ${opts.fullName}\nEmail: ${opts.workEmail}\nCompany: ${opts.company}\nPhone: ${opts.phone?.trim() || "—"}\nTopic: ${opts.topic}\n\n${opts.message}`,
  };
}

export function itneckContactConfirmationEmail(opts: {
  fullName: string;
}): { subject: string; html: string; text: string } {
  const first = escapeHtml(opts.fullName.trim().split(/\s+/)[0] || opts.fullName);
  return {
    subject: "We received your message — ITneck",
    html: mailLayout({
      eyebrow: "ITneck",
      title: "Thanks — we have your note.",
      body: `<p style="margin:0 0 12px;">Hi ${first},</p>
        <p style="margin:0;">We received your message. We typically reply within one business day.</p>`,
      footer: "ITneck · San Diego, CA",
    }),
    text: `Hi ${opts.fullName.trim().split(/\s+/)[0] || opts.fullName},\n\nWe received your message. We typically reply within one business day.\n\nITneck · San Diego, CA`,
  };
}

export function itneckContactTeamEmail(opts: {
  fullName: string;
  workEmail: string;
  company: string;
  phone?: string;
  topic: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const rows: Array<[string, string]> = [
    ["Name", opts.fullName],
    ["Work email", opts.workEmail],
    ["Company", opts.company],
    ["Phone", opts.phone?.trim() || "—"],
    ["Topic", opts.topic],
  ];
  return {
    subject: `[ITneck] ${opts.topic} — ${opts.fullName} (${opts.company})`,
    html: mailLayout({
      eyebrow: "ITneck",
      title: "New contact request",
      body: detailsTable(rows, opts.message),
      footer: "ITneck · San Diego, CA",
    }),
    text: `Name: ${opts.fullName}\nEmail: ${opts.workEmail}\nCompany: ${opts.company}\nPhone: ${opts.phone?.trim() || "—"}\nTopic: ${opts.topic}\n\n${opts.message}`,
  };
}

export function techtalkTeamEmail(email: string): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `[ITneck TechTalk] New subscriber — ${email}`,
    html: mailLayout({
      eyebrow: "ITneck",
      title: "New TechTalk subscriber",
      body: `<p style="margin:0;color:#02376b;">${escapeHtml(email)}</p>`,
      footer: "ITneck · San Diego, CA",
    }),
    text: `New TechTalk subscriber: ${email}`,
  };
}
