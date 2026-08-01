import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck — Microsoft Copilot Agent Development";

export default function Image() {
  return ogImage(
    "Copilot agents that live inside your Microsoft 365 stack.",
    "MICROSOFT COPILOT AGENTS"
  );
}
