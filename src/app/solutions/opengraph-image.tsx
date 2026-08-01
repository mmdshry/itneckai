import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck — AI Solutions for Business";

export default function Image() {
  return ogImage("AI solutions for the problems you actually have.", "SOLUTIONS");
}
