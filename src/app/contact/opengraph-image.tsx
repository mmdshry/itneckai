import {ogImage, ogSize} from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Contact ai.neck — Book a working session";

export default function Image() {
    return ogImage("Tell us what's not working yet.", "CONTACT · WORKING SESSION");
}
