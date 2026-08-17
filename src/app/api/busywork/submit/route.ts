import { jsonNoStore } from "@/lib/http";
import { submitBusywork } from "@/lib/busywork/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let emailCopy = false;
  try {
    const body = (await request.json()) as { emailCopy?: unknown };
    emailCopy = body.emailCopy === true;
  } catch {
    emailCopy = false;
  }

  const result = await submitBusywork({ emailCopy });
  return jsonNoStore(result, result.ok ? 200 : 400);
}
