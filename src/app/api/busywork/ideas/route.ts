import { jsonNoStore } from "@/lib/http";
import { addBusyworkIdea, removeBusyworkIdea } from "@/lib/busywork/service";
import { ideaKindSchema } from "@/lib/busywork/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ ok: false, error: "Could not save that idea." }, 400);
  }

  if (typeof body !== "object" || !body) {
    return jsonNoStore({ ok: false, error: "Could not save that idea." }, 400);
  }

  const payload = body as { action?: unknown; kind?: unknown; input?: unknown; id?: unknown };
  const kind = ideaKindSchema.safeParse(payload.kind);
  if (!kind.success) {
    return jsonNoStore({ ok: false, error: "Unknown idea type." }, 400);
  }

  if (payload.action === "remove") {
    if (typeof payload.id !== "string") {
      return jsonNoStore({ ok: false, error: "Could not remove that idea." }, 400);
    }
    const result = await removeBusyworkIdea(kind.data, payload.id);
    return jsonNoStore(result, result.ok ? 200 : 400);
  }

  const result = await addBusyworkIdea(kind.data, payload.input);
  return jsonNoStore(result, result.ok ? 200 : 400);
}
