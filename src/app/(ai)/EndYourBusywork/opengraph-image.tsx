import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "End Your Busy Work — Ai.neck Busy Work Map";

export default function Image() {
  return ogImage(
    "Find the work that should not require people.",
    "END YOUR BUSY WORK",
  );
}
