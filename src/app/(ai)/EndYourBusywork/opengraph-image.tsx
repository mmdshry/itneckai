import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "End Your Busywork — ai.neck AI Opportunity Map";

export default function Image() {
  return ogImage(
    "Find the work AI should handle — and protect the work only humans should do.",
    "END YOUR BUSYWORK",
  );
}
