import { jsonNoStore } from "@/lib/http";
import { joinBusywork } from "@/lib/busywork/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore(
      { ok: false, error: "Please correct the highlighted fields and try again." },
      400,
    );
  }

  const result = await joinBusywork(body);
  return jsonNoStore(result, result.ok ? 200 : 400);
}
