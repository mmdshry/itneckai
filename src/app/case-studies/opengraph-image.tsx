import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck case studies";

export default function Image() {
  return ogImage("Proof over promises.", "CASE STUDIES");
}
