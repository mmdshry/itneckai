import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Industries served by ai.neck";

export default function Image() {
  return ogImage(
    "If your business runs on Microsoft 365, we speak your language.",
    "INDUSTRIES"
  );
}
