import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt =
  "ITneck AI — AI That Works Inside the Tools You Already Use.";

export default function Image() {
  return ogImage("AI That Works Inside the Tools You Already Use.");
}
