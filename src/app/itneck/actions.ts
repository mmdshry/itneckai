"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { itneckSite } from "@/lib/itneck/site";
import {
  itneckContactSchema,
  type ItneckContactInput,
} from "@/lib/itneck/contact-schema";

export type FormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

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

async function getIp(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitItneckContact(
  input: unknown,
): Promise<FormResult> {
  const parsed = itneckContactSchema.safeParse(input);
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

  const data: ItneckContactInput = parsed.data;
  if (data.website) return { ok: true };

  if (isRateLimited(await getIp())) {
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
      error: `We couldn't send your message right now. Please email us directly at ${itneckSite.email}.`,
    };
  }

  const html = `
    <h2>New contact request — ITneck</h2>
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
        process.env.CONTACT_FROM_EMAIL ??
        "ITneck Website <onboarding@resend.dev>",
      to: [itneckSite.email],
      replyTo: data.workEmail,
      subject: `[ITneck] ${data.topic} — ${data.fullName} (${data.company})`,
      html,
      text: `Name: ${data.fullName}\nEmail: ${data.workEmail}\nCompany: ${data.company}\nPhone: ${data.phone || "—"}\nTopic: ${data.topic}\n\n${data.message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return {
        ok: false,
        error: `We couldn't send your message right now. Please email us directly at ${itneckSite.email}.`,
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("Contact form send failed:", err);
    return {
      ok: false,
      error: `We couldn't send your message right now. Please email us directly at ${itneckSite.email}.`,
    };
  }
}

const emailSchema = z.string().trim().email().max(200);

export async function subscribeTechTalk(email: unknown): Promise<FormResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (isRateLimited(`techtalk:${await getIp()}`)) {
    return {
      ok: false,
      error: "Too many subscriptions from this connection. Please try again later.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured; TechTalk signup not sent.");
    return {
      ok: false,
      error: `We couldn't process your subscription. Please email us at ${itneckSite.email}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ??
        "ITneck Website <onboarding@resend.dev>",
      to: [itneckSite.email],
      subject: `[ITneck TechTalk] New subscriber — ${parsed.data}`,
      html: `<p>New TechTalk subscriber: <strong>${escapeHtml(parsed.data)}</strong></p>`,
      text: `New TechTalk subscriber: ${parsed.data}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return {
        ok: false,
        error: `We couldn't process your subscription. Please email us at ${itneckSite.email}.`,
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("TechTalk signup failed:", err);
    return {
      ok: false,
      error: `We couldn't process your subscription. Please email us at ${itneckSite.email}.`,
    };
  }
}
