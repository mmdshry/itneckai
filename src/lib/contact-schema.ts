import { z } from "zod";

// Avoid Zod's `new Function` JIT probe, which our strict CSP (no
// 'unsafe-eval') would flag as a violation in the browser console.
z.config({ jitless: true });

export const helpTopics = [
  "Microsoft Copilot Agents",
  "SharePoint",
  "Teams",
  "OneDrive",
  "Microsoft 365",
  "Outlook",
  "Other AI Solution",
  "Not sure yet",
] as const;

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name must be under 100 characters."),
  workEmail: z
    .string()
    .trim()
    .email("Please enter a valid work email address.")
    .max(200, "Email must be under 200 characters."),
  company: z
    .string()
    .trim()
    .min(2, "Please enter your company name.")
    .max(150, "Company must be under 150 characters."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be under 30 characters.")
    .regex(/^[\d\s()+.\-]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  topic: z.enum(helpTopics, {
    error: "Please choose what you need help with.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a bit more (at least 10 characters).")
    .max(5000, "Message must be under 5,000 characters."),
  /** Honeypot — must stay empty; bots that fill it are silently dropped. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
