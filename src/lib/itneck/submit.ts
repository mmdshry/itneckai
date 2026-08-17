import { z } from "zod";
import {
  itneckContactSchema,
  type ItneckContactInput,
} from "@/lib/itneck/contact-schema";
import { itneckSite } from "@/lib/itneck/site";
import { isRateLimited } from "@/lib/busywork/rate-limit";
import {
  itneckContactConfirmationEmail,
  itneckContactTeamEmail,
  techtalkTeamEmail,
} from "@/lib/mail/contact";
import { mailToSupport, sendMail } from "@/lib/mail/smtp";

export type FormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitItneckContact(
  input: unknown,
  ip: string,
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

  if (isRateLimited(`itneck-contact:${ip}`)) {
    return {
      ok: false,
      error:
        "Too many messages from this connection. Please wait a few minutes and try again, or email us directly.",
    };
  }

  const team = itneckContactTeamEmail({
    fullName: data.fullName,
    workEmail: data.workEmail,
    company: data.company,
    phone: data.phone,
    topic: data.topic,
    message: data.message,
  });
  const confirm = itneckContactConfirmationEmail({ fullName: data.fullName });

  const teamSend = await sendMail({
    to: mailToSupport(),
    subject: team.subject,
    html: team.html,
    text: team.text,
    replyTo: data.workEmail,
  });
  if (!teamSend.ok) {
    return {
      ok: false,
      error: `We couldn't send your message right now. Please email us directly at ${itneckSite.email}.`,
    };
  }

  const visitorSend = await sendMail({
    to: data.workEmail,
    subject: confirm.subject,
    html: confirm.html,
    text: confirm.text,
  });
  if (!visitorSend.ok) {
    console.error("ITneck confirmation email failed:", visitorSend.error);
  }

  return { ok: true };
}

const emailSchema = z.string().trim().email().max(200);

export async function subscribeTechTalk(
  email: unknown,
  ip: string,
): Promise<FormResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (isRateLimited(`techtalk:${ip}`)) {
    return {
      ok: false,
      error: "Too many subscriptions from this connection. Please try again later.",
    };
  }

  const team = techtalkTeamEmail(parsed.data);
  const sent = await sendMail({
    to: mailToSupport(),
    subject: team.subject,
    html: team.html,
    text: team.text,
  });
  if (!sent.ok) {
    return {
      ok: false,
      error: `We couldn't process your subscription. Please email us at ${itneckSite.email}.`,
    };
  }
  return { ok: true };
}
