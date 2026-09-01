import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/estimate/LoginForm";
import { Section } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() ?? "";
  return (
    <Section className="pt-32 md:pt-40">
      <Suspense
        fallback={
          <p className="text-sm text-graphite" aria-live="polite">
            Loading sign-in…
          </p>
        }
      >
        <LoginForm siteKey={siteKey} />
      </Suspense>
    </Section>
  );
}
