import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Ai.neck University";

export default function Image() {
  return ogImage(
    "Practical ideas for doing less busy work.",
    "AI.NECK UNIVERSITY",
  );
}
