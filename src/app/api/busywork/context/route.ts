import { saveBusyworkContext } from "@/lib/busywork/service";
import { jsonNoStore } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ ok: false, error: "Could not save that." }, 400);
  }

  const result = await saveBusyworkContext(body);
  return jsonNoStore(result, result.ok ? 200 : 400);
}
