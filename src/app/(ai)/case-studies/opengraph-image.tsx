import {ogImage, ogSize} from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "ai.neck documented Copilot Studio patterns";

export default function Image() {
    return ogImage("Documented patterns, not invented metrics.", "PATTERNS");
}
