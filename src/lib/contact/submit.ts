import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { isRateLimited } from "@/lib/busywork/rate-limit";
import {
  contactConfirmationEmail,
  contactTeamEmail,
} from "@/lib/mail/contact";
import { mailToSupport, sendMail } from "@/lib/mail/smtp";
import { site } from "@/lib/site";

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitAiContact(
  input: unknown,
  ip: string,
): Promise<ContactResult> {
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

  const data: ContactInput = parsed.data;
  if (data.website) return { ok: true };

  if (isRateLimited(`contact:${ip}`)) {
    return {
      ok: false,
      error:
        "Too many messages from this connection. Please wait a few minutes and try again, or email us directly.",
    };
  }

  const team = contactTeamEmail({
    fullName: data.fullName,
    workEmail: data.workEmail,
    company: data.company,
    phone: data.phone,
    topic: data.topic,
    message: data.message,
  });
  const confirm = contactConfirmationEmail({ fullName: data.fullName });

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
      error: `We couldn't send your message right now. Please email us directly at ${site.email}.`,
    };
  }

  const visitorSend = await sendMail({
    to: data.workEmail,
    subject: confirm.subject,
    html: confirm.html,
    text: confirm.text,
  });
  if (!visitorSend.ok) {
    console.error("Contact confirmation email failed:", visitorSend.error);
  }

  return { ok: true };
}
