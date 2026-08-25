import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "BIM MEP Estimate — ai.neck sales estimator";

export default function Image() {
  return ogImage(
    "Price the BIM scope before the formal bid.",
    "ESTIMATE · STANDARD MEP + ADVANCED",
  );
}
