import { headers } from "next/headers";
import { BUSYWORK_PATH } from "@/lib/busywork/copy";
import { magicLinkEmailHtml, resultsEmailHtml, teamEmailHtml } from "@/lib/busywork/email";
import { buildOpportunityMap, type OpportunityMap } from "@/lib/busywork/map";
import { isRateLimited } from "@/lib/busywork/rate-limit";
import {
  getRecordBySessionId,
  markSubmitted,
  recordEvent,
  savePayload,
  upsertJoin,
  type BusyworkRecord,
} from "@/lib/busywork/repo";
import {
  addAlwaysHumanSchema,
  addBusyworkSchema,
  addHighValueSchema,
  addHireSchema,
  addRobotTaskSchema,
  addSuperhumanSchema,
  eventNameSchema,
  ideaCount,
  ideaKindSchema,
  joinSchema,
  type ActionFailure,
  type BusyworkEventName,
  type BusyworkPayload,
  type IdeaKind,
  type PublicSession,
} from "@/lib/busywork/schema";
import { readSessionId } from "@/lib/busywork/session";
import { mailToSupport, sendMail, smtpConfigured } from "@/lib/mail/smtp";
import { requestOrigin } from "@/lib/request-origin";
import { absoluteUrl, site } from "@/lib/site";

function toPublic(record: BusyworkRecord): PublicSession {
  return {
    firstName: record.firstName,
    email: record.email,
    payload: record.payload,
    status: record.status,
  };
}

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

async function clientKey(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isFailure(value: BusyworkRecord | ActionFailure): value is ActionFailure {
  return "ok" in value && value.ok === false;
}

async function requireRecord(): Promise<BusyworkRecord | ActionFailure> {
  try {
    const sessionId = await readSessionId();
    if (!sessionId) {
      return { ok: false, error: "Please join with the email link to continue." };
    }
    const record = await getRecordBySessionId(sessionId);
    if (!record) {
      return { ok: false, error: "Please join with the email link to continue." };
    }
    return record;
  } catch (err) {
    console.error("Busywork session lookup failed:", err);
    return {
      ok: false,
      error: "We couldn’t load your workshop. Please try the email link again.",
    };
  }
}

export async function getBusyworkSession(): Promise<
  { ok: true; session: PublicSession | null } | ActionFailure
> {
  try {
    const sessionId = await readSessionId();
    if (!sessionId) return { ok: true, session: null };
    const record = await getRecordBySessionId(sessionId);
    return { ok: true, session: record ? toPublic(record) : null };
  } catch (err) {
    console.error("Busywork get session failed:", err);
    return { ok: true, session: null };
  }
}

export async function joinBusywork(
  input: unknown,
): Promise<{ ok: true; email: string; devLink?: string } | ActionFailure> {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields and try again.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const data = parsed.data;
  if (data.website) {
    return { ok: true, email: data.email };
  }

  const ip = await clientKey();
  if (isRateLimited(`join:${ip}`) || isRateLimited(`join-email:${data.email}`, 3)) {
    return {
      ok: false,
      error:
        "Too many sign-in links from this connection. Please wait a few minutes and try again.",
    };
  }

  try {
    const { record, token } = await upsertJoin({
      firstName: data.firstName,
      email: data.email,
    });
    const origin = await requestOrigin();
    const url = `${absoluteUrl(BUSYWORK_PATH, origin)}/auth?token=${encodeURIComponent(token)}`;
    const message = magicLinkEmailHtml({
      firstName: record.firstName,
      url,
      origin,
    });

    const sent = smtpConfigured()
      ? await sendMail({
          to: record.email,
          subject: message.subject,
          html: message.html,
          text: message.text,
        })
      : { ok: false as const, error: "Email is not configured." };

    if (!sent.ok && process.env.NODE_ENV !== "development") {
      return {
        ok: false,
        error: `We couldn’t email your link. Please try again, or write us at ${site.email}.`,
      };
    }

    await recordEvent({
      sessionId: record.sessionId,
      name: "contact_capture",
    });

    if (process.env.NODE_ENV === "development") {
      console.info("[End Your Busywork] magic link:", url);
    }

    return {
      ok: true,
      email: record.email,
      ...(process.env.NODE_ENV === "development" ? { devLink: url } : {}),
    };
  } catch (err) {
    console.error("Busywork join failed:", err);
    return {
      ok: false,
      error: `We couldn’t start the workshop right now. Please email us at ${site.email}.`,
    };
  }
}

export async function addBusyworkIdea(
  kind: IdeaKind,
  input: unknown,
): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  const kindParsed = ideaKindSchema.safeParse(kind);
  if (!kindParsed.success) {
    return { ok: false, error: "Unknown idea type." };
  }

  const recordOrError = await requireRecord();
  if (isFailure(recordOrError)) return recordOrError;
  const record = recordOrError;

  const id = crypto.randomUUID();
  const next: BusyworkPayload = { ...record.payload };
  const before = ideaCount(record.payload);

  switch (kindParsed.data) {
    case "highValue": {
      const parsed = addHighValueSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please add a bit more detail.",
        };
      }
      next.highValue = [...next.highValue, { id, text: parsed.data.text }];
      break;
    }
    case "busywork": {
      const parsed = addBusyworkSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please add a bit more detail.",
        };
      }
      next.busywork = [...next.busywork, { id, text: parsed.data.text }];
      break;
    }
    case "alwaysHuman": {
      const parsed = addAlwaysHumanSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please add a bit more detail.",
        };
      }
      next.alwaysHuman = [...next.alwaysHuman, { id, text: parsed.data.text }];
      break;
    }
    case "robotTasks": {
      const parsed = addRobotTaskSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please check the task and hours.",
          fieldErrors: fieldErrorsFromZod(parsed.error.issues),
        };
      }
      next.robotTasks = [...next.robotTasks, { id, ...parsed.data }];
      break;
    }
    case "superhuman": {
      const parsed = addSuperhumanSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please check the task and times.",
          fieldErrors: fieldErrorsFromZod(parsed.error.issues),
        };
      }
      next.superhuman = [...next.superhuman, { id, ...parsed.data }];
      break;
    }
    case "hire": {
      const parsed = addHireSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error:
            parsed.error.issues[0]?.message ??
            "Please add the role and how you’d measure it.",
        };
      }
      next.hire = [...next.hire, { id, ...parsed.data }];
      break;
    }
  }

  try {
    const saved = await savePayload(record.sessionId, next);
    if (!saved) return { ok: false, error: "Could not save that idea. Please try again." };

    if (before === 0 || sectionJustCompleted(record.payload, saved.payload, kindParsed.data)) {
      await recordEvent({
        sessionId: record.sessionId,
        name: "section_completed",
        meta: { section: kindParsed.data },
      });
    }

    return { ok: true, session: toPublic(saved) };
  } catch (err) {
    console.error("Busywork add idea failed:", err);
    return { ok: false, error: "Could not save that idea. Please try again." };
  }
}

function sectionJustCompleted(
  before: BusyworkPayload,
  after: BusyworkPayload,
  kind: IdeaKind,
): boolean {
  const counts: Record<IdeaKind, [number, number]> = {
    highValue: [before.highValue.length, after.highValue.length],
    busywork: [before.busywork.length, after.busywork.length],
    alwaysHuman: [before.alwaysHuman.length, after.alwaysHuman.length],
    robotTasks: [before.robotTasks.length, after.robotTasks.length],
    superhuman: [before.superhuman.length, after.superhuman.length],
    hire: [before.hire.length, after.hire.length],
  };
  const [prev, next] = counts[kind];
  return prev === 0 && next > 0;
}

export async function removeBusyworkIdea(
  kind: IdeaKind,
  id: string,
): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  const kindParsed = ideaKindSchema.safeParse(kind);
  if (!kindParsed.success) return { ok: false, error: "Unknown idea type." };

  const recordOrError = await requireRecord();
  if (isFailure(recordOrError)) return recordOrError;
  const record = recordOrError;

  const next: BusyworkPayload = {
    ...record.payload,
    highValue:
      kind === "highValue"
        ? record.payload.highValue.filter((idea) => idea.id !== id)
        : record.payload.highValue,
    busywork:
      kind === "busywork"
        ? record.payload.busywork.filter((idea) => idea.id !== id)
        : record.payload.busywork,
    alwaysHuman:
      kind === "alwaysHuman"
        ? record.payload.alwaysHuman.filter((idea) => idea.id !== id)
        : record.payload.alwaysHuman,
    robotTasks:
      kind === "robotTasks"
        ? record.payload.robotTasks.filter((idea) => idea.id !== id)
        : record.payload.robotTasks,
    superhuman:
      kind === "superhuman"
        ? record.payload.superhuman.filter((idea) => idea.id !== id)
        : record.payload.superhuman,
    hire:
      kind === "hire" ? record.payload.hire.filter((idea) => idea.id !== id) : record.payload.hire,
  };

  try {
    const saved = await savePayload(record.sessionId, next);
    if (!saved) return { ok: false, error: "Could not remove that idea." };
    return { ok: true, session: toPublic(saved) };
  } catch (err) {
    console.error("Busywork remove idea failed:", err);
    return { ok: false, error: "Could not remove that idea." };
  }
}

export async function submitBusywork(opts?: {
  emailCopy?: boolean;
}): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  const recordOrError = await requireRecord();
  if (isFailure(recordOrError)) return recordOrError;
  const record = recordOrError;

  if (ideaCount(record.payload) < 1) {
    return {
      ok: false,
      error: "Add at least one idea before submitting.",
    };
  }

  const ip = await clientKey();
  if (isRateLimited(`submit:${ip}`, 8) || isRateLimited(`submit-email:${record.email}`, 8)) {
    return {
      ok: false,
      error: "Too many submissions from this connection. Please wait a few minutes.",
    };
  }

  const map = buildOpportunityMap(record.payload);
  const origin = await requestOrigin();
  const contactUrl = `${absoluteUrl("/contact", origin)}?topic=${encodeURIComponent("End Your Busywork")}&source=busywork`;
  const exploreUrl = absoluteUrl("/solutions", origin);
  const visitor = resultsEmailHtml({
    firstName: record.firstName,
    payload: record.payload,
    robotHoursPerWeek: map.robotHoursPerWeek,
    contactUrl,
    exploreUrl,
    origin,
  });
  const team = teamEmailHtml({
    firstName: record.firstName,
    email: record.email,
    payload: record.payload,
    robotHoursPerWeek: map.robotHoursPerWeek,
    origin,
  });

  const teamSend = await sendMail({
    to: mailToSupport(),
    subject: team.subject,
    html: team.html,
    text: team.text,
    replyTo: record.email,
  });
  if (!teamSend.ok) {
    console.error("Busywork team copy failed:", teamSend.error);
    return {
      ok: false,
      error: `We couldn’t notify our team. Please try again, or write us at ${site.email}.`,
    };
  }

  if (opts?.emailCopy) {
    const visitorSend = await sendMail({
      to: record.email,
      subject: visitor.subject,
      html: visitor.html,
      text: visitor.text,
    });
    if (!visitorSend.ok) {
      console.error("Busywork visitor copy failed:", visitorSend.error);
    }
  }

  try {
    const saved = await markSubmitted(record.sessionId);
    await recordEvent({
      sessionId: record.sessionId,
      name: "successful_submit",
    });
    await postWebhook(saved ?? record, map);
    return {
      ok: true,
      session: toPublic(saved ?? record),
    };
  } catch (err) {
    console.error("Busywork submit persist failed:", err);
    return { ok: true, session: toPublic(record) };
  }
}

async function postWebhook(record: BusyworkRecord, map: OpportunityMap) {
  const url = process.env.BUSYWORK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: record.firstName,
        email: record.email,
        status: record.status,
        HighValue: record.payload.highValue.map((idea) => idea.text),
        Busywork: record.payload.busywork.map((idea) => idea.text),
        always_human: record.payload.alwaysHuman.map((idea) => idea.text),
        robot_task: record.payload.robotTasks.map((idea) => idea.text),
        robot_hours: record.payload.robotTasks.map((idea) => idea.hoursPerWeek),
        Superhuman: record.payload.superhuman.map((idea) => idea.text),
        prep_time: record.payload.superhuman.map((idea) => idea.prepMinutes),
        performance_time: record.payload.superhuman.map((idea) => idea.performanceMinutes),
        hire_idea: record.payload.hire.map((idea) => idea.responsibilities),
        responsibilities: record.payload.hire.map((idea) => idea.responsibilities),
        kpi: record.payload.hire.map((idea) => idea.kpi),
        robot_hours_per_week: map.robotHoursPerWeek,
      }),
    });
  } catch (err) {
    console.error("Busywork webhook failed:", err);
  }
}

export async function trackBusyworkEvent(
  name: BusyworkEventName,
  meta?: Record<string, unknown>,
): Promise<void> {
  const parsed = eventNameSchema.safeParse(name);
  if (!parsed.success) return;
  try {
    const sessionId = await readSessionId();
    await recordEvent({ sessionId, name: parsed.data, meta });
  } catch (err) {
    console.error("Busywork event failed:", err);
  }
}
