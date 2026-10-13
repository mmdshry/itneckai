import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Team — Ai.neck";

export default function Image() {
  return ogImage(
    "Technology should understand the business before it tries to change it.",
    "TEAM",
  );
}
