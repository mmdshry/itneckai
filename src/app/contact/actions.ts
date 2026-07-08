"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { site } from "@/lib/site";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Naive in-memory rate limit: max 5 submissions per IP per 10 minutes.
 * Sufficient for a single-region marketing site; swap for Upstash/Vercel KV
 * if the site ever runs on multiple serverless instances and abuse appears.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    submissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function submitContact(input: unknown): Promise<ContactResult> {
  // Server-side re-validation — never trust client-only validation.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return {
      ok: false,
      error: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot filled → pretend success so bots learn nothing.
  if (data.website) {
    return { ok: true };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      ok: false,
      error:
        "Too many messages from this connection. Please wait a few minutes and try again, or email us directly.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured; contact email not sent.");
    return {
      ok: false,
      error: `We couldn't send your message right now. Please email us directly at ${site.email}.`,
    };
  }

  const html = `
    <h2>New consultation request — itneck.com</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(data.fullName)}</td></tr>
      <tr><td><strong>Work email</strong></td><td>${escapeHtml(data.workEmail)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(data.company)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone || "—")}</td></tr>
      <tr><td><strong>Topic</strong></td><td>${escapeHtml(data.topic)}</td></tr>
    </table>
    <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ?? "ITneck AI Website <onboarding@resend.dev>",
      to: [site.email],
      replyTo: data.workEmail,
      subject: `[itneck.com] ${data.topic} — ${data.fullName} (${data.company})`,
      html,
      text: `Name: ${data.fullName}\nEmail: ${data.workEmail}\nCompany: ${data.company}\nPhone: ${data.phone || "—"}\nTopic: ${data.topic}\n\n${data.message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return {
        ok: false,
        error: `We couldn't send your message right now. Please email us directly at ${site.email}.`,
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("Contact form send failed:", err);
    return {
      ok: false,
      error: `We couldn't send your message right now. Please email us directly at ${site.email}.`,
    };
  }
}
