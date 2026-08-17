import { jsonNoStore } from "@/lib/http";
import { getBusyworkSession } from "@/lib/busywork/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getBusyworkSession();
  return jsonNoStore(result, result.ok ? 200 : 400);
}
