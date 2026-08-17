import { clientIp, jsonNoStore } from "@/lib/http";
import { submitAiContact } from "@/lib/contact/submit";

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

  const result = await submitAiContact(body, clientIp(request));
  return jsonNoStore(result, result.ok ? 200 : 400);
}
