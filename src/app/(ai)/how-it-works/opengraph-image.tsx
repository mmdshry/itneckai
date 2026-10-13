import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "How It Works — Ai.neck";

export default function Image() {
  return ogImage(
    "We do not start with AI. We start with your business.",
    "HOW IT WORKS",
  );
}
