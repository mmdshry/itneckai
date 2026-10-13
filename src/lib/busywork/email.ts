import { categoryCopy } from "./copy";
import type { BusyWorkMap } from "./map";
import { formatUsd } from "./score";
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
  const subject = `${opts.firstName}, your End Your Busy Work link`;
  const html = mailLayout({
    origin: opts.origin,
    title: "Continue your assessment",
    body: `<p style="margin:0 0 12px;">Hi ${escapeHtml(opts.firstName)},</p>
     <p style="margin:0 0 12px;">Use this private link to start — or pick up where you left off. It expires in 20 minutes.</p>
     ${mailButton(opts.url, "Continue End Your Busy Work")}
     <p style="margin:16px 0 0;">If you didn’t request this, you can ignore the email.</p>`,
  });
  const text = `Hi ${opts.firstName},\n\nContinue End Your Busy Work:\n${opts.url}\n\nThis link expires in 20 minutes.\n\n${opts.origin}\n`;
  return { subject, html, text };
}

function workflowLines(map: BusyWorkMap, forTeam: boolean): string[] {
  return map.rows.map((row) => {
    const category = `${categoryCopy[row.category].name} (${row.score})`;
    const line = `${row.workflow} | ${row.effort} | ${row.problem} | ${row.solution} | ${row.impact} | ${category}`;
    if (!forTeam) return line;
    const scores = row.scores;
    return `${line} | time ${scores.time}/5, frequency ${scores.frequency}/5, cost ${scores.cost}/5, friction ${scores.friction}/5, potential ${scores.potential}/5`;
  });
}

function roiLines(map: BusyWorkMap): string[] {
  const { roi } = map;
  const lines = [
    `About ${roi.currentHoursPerMonth} person-hours a month in the measured workflows.`,
    `About ${roi.recoverableHoursPerMonth} hours a month look recoverable (${roi.recoverableHoursPerYear} a year).`,
    `About ${formatUsd(roi.annualCapacityValue)} of annual capacity at ${formatUsd(roi.hourlyCost)} per hour. That is capacity, not a guaranteed payroll saving.`,
  ];
  if (
    roi.teamSize != null &&
    roi.illustrationHoursPerYear != null &&
    roi.illustrationValue != null
  ) {
    lines.push(
      `If each of ${roi.teamSize} people got 3 hours a week back: ${roi.illustrationHoursPerYear} hours a year, about ${formatUsd(roi.illustrationValue)}.`,
    );
  }
  return lines;
}

function resultsBody(opts: {
  firstName: string;
  payload: BusyworkPayload;
  map: BusyWorkMap;
  contactUrl?: string;
  exploreUrl?: string;
  forTeam?: boolean;
}): { html: string; text: string } {
  const { payload } = opts;
  const lines = workflowLines(opts.map, opts.forTeam === true);
  const capacity = roiLines(opts.map);

  const cta =
    opts.contactUrl && opts.exploreUrl
      ? `${mailButton(opts.contactUrl, "Review this map with us")}
     <p style="margin:16px 0 0;"><a href="${escapeHtml(opts.exploreUrl)}" style="color:#02376b;">See How It Works</a></p>`
      : "";

  const teamNote = opts.forTeam
    ? `<p style="margin:16px 0 0;">Preliminary categories from the assessment. Confirm time, frequency, cost, friction, and automation potential after reviewing the work. Do not treat the hour total as guaranteed payroll savings.</p>`
    : `<p style="margin:16px 0 0;">These categories are preliminary. We confirm them after we see the work.</p>`;

  const html = `<p style="margin:0 0 12px;">Hi ${escapeHtml(opts.firstName)},</p>
     <p style="margin:0 0 16px;">Here is the Busy Work Map from End Your Busy Work.</p>
     ${mailHeading("Recovered capacity")}
     ${mailList(capacity)}
     ${mailHeading("Workflows")}
     ${mailList(lines)}
     ${mailHeading("What should stay human")}
     ${mailList(payload.alwaysHuman.map((idea) => idea.text))}
     ${mailHeading("What the team would do with the time back")}
     ${mailList(payload.capacity.map((idea) => idea.text))}
     ${teamNote}
     ${cta}`;

  const text = [
    `Hi ${opts.firstName},`,
    "",
    "Here is the Busy Work Map from End Your Busy Work.",
    "",
    "RECOVERED CAPACITY",
    capacity.map((line) => `- ${line}`).join("\n"),
    "",
    "WORKFLOWS",
    "Workflow | Current effort | Problem | Potential solution | Business impact | Category",
    lines.map((line) => `- ${line}`).join("\n") || "None",
    "",
    "WHAT SHOULD STAY HUMAN",
    payload.alwaysHuman.map((idea) => `- ${idea.text}`).join("\n") || "None",
    "",
    "WHAT THE TEAM WOULD DO WITH THE TIME BACK",
    payload.capacity.map((idea) => `- ${idea.text}`).join("\n") || "None",
    "",
    opts.forTeam
      ? "Preliminary categories from the assessment. Confirm after reviewing the work. Do not treat the hour total as guaranteed payroll savings."
      : "These categories are preliminary. We confirm them after we see the work.",
    opts.contactUrl ? `Review this map with us:\n${opts.contactUrl}` : "",
    opts.exploreUrl ? `See How It Works:\n${opts.exploreUrl}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { html, text };
}

export function resultsEmailHtml(opts: {
  firstName: string;
  payload: BusyworkPayload;
  map: BusyWorkMap;
  contactUrl: string;
  exploreUrl: string;
  origin: string;
}): { subject: string; html: string; text: string } {
  const body = resultsBody(opts);
  return {
    subject: `${opts.firstName}, your End Your Busy Work map`,
    html: mailLayout({
      origin: opts.origin,
      title: "Your Busy Work Map",
      body: body.html,
    }),
    text: `${body.text}\n\n${opts.origin}`,
  };
}

export function teamEmailHtml(opts: {
  firstName: string;
  email: string;
  payload: BusyworkPayload;
  map: BusyWorkMap;
  origin: string;
}): { subject: string; html: string; text: string } {
  const body = resultsBody({
    firstName: opts.firstName,
    payload: opts.payload,
    map: opts.map,
    forTeam: true,
  });
  return {
    subject: `[Ai.neck] End Your Busy Work — ${opts.firstName} (${opts.email})`,
    html: mailLayout({
      origin: opts.origin,
      title: "New Busy Work Map",
      body: `<p style="margin:0 0 16px;">From <strong style="color:#02376b;">${escapeHtml(opts.firstName)}</strong> &lt;${escapeHtml(opts.email)}&gt;</p>${body.html}`,
    }),
    text: `New End Your Busy Work submission\nName: ${opts.firstName}\nEmail: ${opts.email}\n\n${body.text}\n\n${opts.origin}`,
  };
}
