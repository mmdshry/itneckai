import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "About ITneck AI — San Diego, California";

export default function Image() {
  return ogImage("Making AI actually useful inside the software you already run on.", "ABOUT ITNECK AI");
}
