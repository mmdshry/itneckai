import { jsonNoStore } from "@/lib/http";
import { trackBusyworkEvent } from "@/lib/busywork/service";
import { eventNameSchema } from "@/lib/busywork/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ ok: true });
  }

  if (typeof body === "object" && body && "name" in body) {
    const parsed = eventNameSchema.safeParse((body as { name: unknown }).name);
    if (parsed.success) {
      const meta =
        "meta" in body && typeof (body as { meta?: unknown }).meta === "object"
          ? ((body as { meta?: Record<string, unknown> }).meta ?? undefined)
          : undefined;
      await trackBusyworkEvent(parsed.data, meta);
    }
  }

  return jsonNoStore({ ok: true });
}
