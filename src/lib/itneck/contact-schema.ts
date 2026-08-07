import { z } from "zod";

z.config({ jitless: true });

export const itneckHelpTopics = [
  "Managed IT Services (MSP)",
  "Cybersecurity / MSSP",
  "Cloud / Microsoft 365",
  "Mobile Device Management",
  "Network / Firewall",
  "AI Services",
  "Hardware & Software",
  "Support / Existing Client",
  "Other",
  "Not sure yet",
] as const;

export const itneckContactSchema = z.object({
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
  topic: z.enum(itneckHelpTopics, {
    error: "Please choose what you need help with.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a bit more (at least 10 characters).")
    .max(5000, "Message must be under 5,000 characters."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ItneckContactInput = z.infer<typeof itneckContactSchema>;
