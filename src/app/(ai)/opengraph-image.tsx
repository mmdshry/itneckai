import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Ai.neck — End Your Busy Work";

export default function Image() {
  return ogImage("End Your Busy Work.", "END YOUR BUSY WORK");
}
