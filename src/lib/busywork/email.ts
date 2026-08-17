import { hoursPeriodLabel, minutesToLabel } from "./map";
import type { BusyworkPayload } from "./schema";
import {
  escapeHtml,
  mailButton,
  mailHeading,
  mailLayout,
  mailList,
} from "@/lib/mail/layout";

export function magicLinkEmailHtml(opts: {
  firstName: string;
  url: string;
  origin: string;
}): { subject: string; html: string; text: string } {
  const subject = `${opts.firstName}, your End Your Busywork link`;
  const html = mailLayout({
    origin: opts.origin,
    title: "Continue your workshop",
    body: `<p style="margin:0 0 12px;">Hi ${escapeHtml(opts.firstName)},</p>
     <p style="margin:0 0 12px;">Use this private link to start — or pick up where you left off. It expires in 20 minutes.</p>
     ${mailButton(opts.url, "Continue End Your Busywork")}
     <p style="margin:16px 0 0;">If you didn’t request this, you can ignore the email.</p>`,
  });
  const text = `Hi ${opts.firstName},\n\nContinue End Your Busywork:\n${opts.url}\n\nThis link expires in 20 minutes.\n\n${opts.origin}\n`;
  return { subject, html, text };
}

function resultsBody(opts: {
  firstName: string;
  payload: BusyworkPayload;
  robotHoursPerWeek: number;
  contactUrl?: string;
  exploreUrl?: string;
}): { html: string; text: string } {
  const { payload } = opts;

  const robotLines = payload.robotTasks.map((idea) => {
    return `${idea.text} (${hoursPeriodLabel(idea.hoursPerWeek, idea.frequency)})`;
  });

  const superhumanLines = payload.superhuman.map((idea) => {
    return `${idea.text} — Prep: ${minutesToLabel(idea.prepMinutes)} | Decision/performance: ${minutesToLabel(idea.performanceMinutes)}`;
  });

  const hireLines = payload.hire.map((idea) => {
    return `${idea.responsibilities} — Measure: ${idea.kpi}`;
  });

  const cta =
    opts.contactUrl && opts.exploreUrl
      ? `${mailButton(opts.contactUrl, "Turn my best idea into an AI agent")}
     <p style="margin:16px 0 0;"><a href="${escapeHtml(opts.exploreUrl)}" style="color:#02376b;">Explore more</a></p>`
      : "";

  const html = `<p style="margin:0 0 12px;">Hi ${escapeHtml(opts.firstName)},</p>
     <p style="margin:0 0 16px;">Here are the ideas you entered in End Your Busywork.</p>
     ${mailHeading("Your high-value work")}
     ${mailList(payload.highValue.map((idea) => idea.text))}
     ${mailHeading("Your busywork")}
     ${mailList(payload.busywork.map((idea) => idea.text))}
     ${mailHeading("What’s always human")}
     ${mailList(payload.alwaysHuman.map((idea) => idea.text))}
     ${mailHeading("Your robot tasks")}
     ${mailList(robotLines)}
     ${mailHeading("Your superhuman moments")}
     ${mailList(superhumanLines)}
     ${mailHeading("Who you would hire")}
     ${mailList(hireLines)}
     ${cta}`;

  const text = [
    `Hi ${opts.firstName},`,
    "",
    "Here are the ideas you entered in End Your Busywork.",
    "",
    "YOUR HIGH-VALUE WORK",
    payload.highValue.map((i) => `- ${i.text}`).join("\n") || "None",
    "",
    "YOUR BUSYWORK",
    payload.busywork.map((i) => `- ${i.text}`).join("\n") || "None",
    "",
    "WHAT’S ALWAYS HUMAN",
    payload.alwaysHuman.map((i) => `- ${i.text}`).join("\n") || "None",
    "",
    "YOUR ROBOT TASKS",
    robotLines.map((i) => `- ${i}`).join("\n") || "None",
    "",
    "YOUR SUPERHUMAN MOMENTS",
    superhumanLines.map((i) => `- ${i}`).join("\n") || "None",
    "",
    "WHO YOU WOULD HIRE",
    hireLines.map((i) => `- ${i}`).join("\n") || "None",
    "",
    opts.contactUrl ? `Turn my best idea into an AI agent:\n${opts.contactUrl}` : "",
    opts.exploreUrl ? `Explore more:\n${opts.exploreUrl}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { html, text };
}

export function resultsEmailHtml(opts: {
  firstName: string;
  payload: BusyworkPayload;
  robotHoursPerWeek: number;
  contactUrl: string;
  exploreUrl: string;
  origin: string;
}): { subject: string; html: string; text: string } {
  const body = resultsBody(opts);
  return {
    subject: `${opts.firstName}, your End Your Busywork answers`,
    html: mailLayout({
      origin: opts.origin,
      title: "Your End Your Busywork answers",
      body: body.html,
    }),
    text: `${body.text}\n\n${opts.origin}`,
  };
}

export function teamEmailHtml(opts: {
  firstName: string;
  email: string;
  payload: BusyworkPayload;
  robotHoursPerWeek: number;
  origin: string;
}): { subject: string; html: string; text: string } {
  const body = resultsBody({
    firstName: opts.firstName,
    payload: opts.payload,
    robotHoursPerWeek: opts.robotHoursPerWeek,
  });
  return {
    subject: `[ai.neck] End Your Busywork — ${opts.firstName} (${opts.email})`,
    html: mailLayout({
      origin: opts.origin,
      title: "New End Your Busywork submission",
      body: `<p style="margin:0 0 16px;">From <strong style="color:#02376b;">${escapeHtml(opts.firstName)}</strong> &lt;${escapeHtml(opts.email)}&gt;</p>${body.html}`,
    }),
    text: `New End Your Busywork submission\nName: ${opts.firstName}\nEmail: ${opts.email}\n\n${body.text}\n\n${opts.origin}`,
  };
}
