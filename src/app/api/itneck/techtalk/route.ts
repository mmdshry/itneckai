import { clientIp, jsonNoStore } from "@/lib/http";
import { subscribeTechTalk } from "@/lib/itneck/submit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  const email =
    typeof body === "object" && body && "email" in body
      ? (body as { email: unknown }).email
      : body;
  const result = await subscribeTechTalk(email, clientIp(request));
  return jsonNoStore(result, result.ok ? 200 : 400);
}
