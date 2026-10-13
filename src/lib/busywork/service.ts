import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { BUSYWORK_PATH, sections } from "@/lib/busywork/copy";
import { magicLinkEmailHtml, resultsEmailHtml, teamEmailHtml } from "@/lib/busywork/email";
import { buildBusyWorkMap, type BusyWorkMap } from "@/lib/busywork/map";
import { isRateLimited } from "@/lib/busywork/rate-limit";
import {
  getLastSubmitContentHash,
  getRecordBySessionId,
  markSubmitted,
  recordEvent,
  savePayload,
  upsertJoin,
  type BusyworkRecord,
} from "@/lib/busywork/repo";
import {
  addAlwaysHumanSchema,
  addCapacitySchema,
  addWorkflowSchema,
  contextInputSchema,
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
    unchangedSinceSubmit: isUnchangedByTimestamp(record),
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
      error: "We couldn’t load your assessment. Please try the email link again.",
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
      console.info("[End Your Busy Work] magic link:", url);
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
      error: `We couldn’t start the assessment right now. Please email us at ${site.email}.`,
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
    case "workflows": {
      const parsed = addWorkflowSchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please check the workflow and the time it takes.",
          fieldErrors: fieldErrorsFromZod(parsed.error.issues),
        };
      }
      next.workflows = [...next.workflows, { id, ...parsed.data }];
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
    case "capacity": {
      const parsed = addCapacitySchema.safeParse(input);
      if (!parsed.success) {
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Please add a bit more detail.",
        };
      }
      next.capacity = [...next.capacity, { id, text: parsed.data.text }];
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
    workflows: [before.workflows.length, after.workflows.length],
    alwaysHuman: [before.alwaysHuman.length, after.alwaysHuman.length],
    capacity: [before.capacity.length, after.capacity.length],
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
    workflows:
      kind === "workflows"
        ? record.payload.workflows.filter((idea) => idea.id !== id)
        : record.payload.workflows,
    alwaysHuman:
      kind === "alwaysHuman"
        ? record.payload.alwaysHuman.filter((idea) => idea.id !== id)
        : record.payload.alwaysHuman,
    capacity:
      kind === "capacity"
        ? record.payload.capacity.filter((idea) => idea.id !== id)
        : record.payload.capacity,
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

function payloadContentHash(payload: BusyworkPayload): string {
  const canon = {
    workflows: payload.workflows.map((idea) => [
      idea.text,
      idea.hours ?? null,
      idea.frequency,
      idea.friction,
      idea.prompt ?? "",
      idea.people,
      idea.frustration,
      idea.judgment,
    ]),
    alwaysHuman: payload.alwaysHuman.map((idea) => idea.text),
    capacity: payload.capacity.map((idea) => idea.text),
    context: [payload.context.teamSize ?? null, payload.context.hourlyCost ?? null],
  };
  return createHash("sha256").update(JSON.stringify(canon)).digest("hex").slice(0, 16);
}

function timestampMs(value: Date | number | string | null | undefined): number | null {
  if (value == null) return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) return asNumber;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function isUnchangedByTimestamp(record: BusyworkRecord): boolean {
  if (record.status !== "submitted") return false;
  const submittedAtMs = timestampMs(record.submittedAt);
  const updatedAtMs = timestampMs(record.updatedAt);
  if (submittedAtMs == null) return false;
  if (updatedAtMs == null) return true;
  return updatedAtMs <= submittedAtMs + 5;
}

async function isDuplicateUnchangedSubmit(
  record: BusyworkRecord,
  contentHash: string,
): Promise<boolean> {
  if (record.status !== "submitted") return false;
  const lastHash = await getLastSubmitContentHash(record.sessionId);
  if (lastHash && lastHash === contentHash) return true;
  return isUnchangedByTimestamp(record);
}

export async function saveBusyworkContext(
  input: unknown,
): Promise<{ ok: true; session: PublicSession } | ActionFailure> {
  const parsed = contextInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the team size and hourly cost, or leave them blank.",
    };
  }

  const recordOrError = await requireRecord();
  if (isFailure(recordOrError)) return recordOrError;
  const record = recordOrError;

  const context = { ...record.payload.context };
  if (parsed.data.teamSize == null) delete context.teamSize;
  else context.teamSize = parsed.data.teamSize;
  if (parsed.data.hourlyCost == null) delete context.hourlyCost;
  else context.hourlyCost = parsed.data.hourlyCost;

  try {
    const saved = await savePayload(record.sessionId, { ...record.payload, context });
    if (!saved) return { ok: false, error: "Could not save that. Please try again." };
    return { ok: true, session: toPublic(saved) };
  } catch (err) {
    console.error("Busywork context save failed:", err);
    return { ok: false, error: "Could not save that. Please try again." };
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
      error: "Add at least one workflow before submitting.",
    };
  }

  if (await isDuplicateUnchangedSubmit(record, payloadContentHash(record.payload))) {
    return {
      ok: false,
      error: sections.map.alreadySubmitted,
    };
  }

  const ip = await clientKey();
  if (isRateLimited(`submit:${ip}`, 8) || isRateLimited(`submit-email:${record.email}`, 8)) {
    return {
      ok: false,
      error: "Too many submissions from this connection. Please wait a few minutes.",
    };
  }

  const map = buildBusyWorkMap(record.payload);
  const origin = await requestOrigin();
  const contactUrl = `${absoluteUrl("/contact", origin)}?topic=${encodeURIComponent("End Your Busywork")}&source=busywork`;
  const exploreUrl = absoluteUrl("/how-it-works", origin);
  const visitor = resultsEmailHtml({
    firstName: record.firstName,
    payload: record.payload,
    map,
    contactUrl,
    exploreUrl,
    origin,
  });
  const team = teamEmailHtml({
    firstName: record.firstName,
    email: record.email,
    payload: record.payload,
    map,
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
    console.error("Busywork team email failed:", teamSend.error);
    return {
      ok: false,
      error: `We couldn’t notify our team. Please try again, or write us at ${site.email}.`,
    };
  }
  if (teamSend.messageId) {
    console.info("Busywork team email sent:", teamSend.messageId);
  }

  if (opts?.emailCopy) {
    const visitorSend = await sendMail({
      to: record.email,
      subject: visitor.subject,
      html: visitor.html,
      text: visitor.text,
    });
    if (!visitorSend.ok) {
      console.error("Busywork visitor email failed:", visitorSend.error);
    } else if (visitorSend.messageId) {
      console.info("Busywork visitor email sent:", visitorSend.messageId);
    }
  }

  try {
    const saved = await markSubmitted(record.sessionId);
    await recordEvent({
      sessionId: record.sessionId,
      name: "successful_submit",
      meta: { contentHash: payloadContentHash(record.payload) },
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

async function postWebhook(record: BusyworkRecord, map: BusyWorkMap) {
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
        workflows: record.payload.workflows,
        always_human: record.payload.alwaysHuman.map((idea) => idea.text),
        capacity: record.payload.capacity.map((idea) => idea.text),
        hours_per_month: map.hoursPerMonth,
        context: record.payload.context,
        rows: map.rows.map((row) => ({
          workflow: row.workflow,
          effort: row.effort,
          problem: row.problem,
          solution: row.solution,
          impact: row.impact,
          category: row.category,
          score: row.score,
          scores: row.scores,
          hours_per_month: row.hoursPerMonth,
        })),
        roi: map.roi,
        // Previous field names, filled from the current map so an existing
        // webhook listener still receives the workflows.
        HighValue: record.payload.capacity.map((idea) => idea.text),
        Busywork: record.payload.workflows.map((idea) => idea.text),
        robot_task: record.payload.workflows.map((idea) => idea.text),
        robot_hours: record.payload.workflows.map((idea) => idea.hours ?? null),
        Superhuman: [],
        prep_time: [],
        performance_time: [],
        hire_idea: [],
        responsibilities: [],
        kpi: [],
        robot_hours_per_week: null,
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
