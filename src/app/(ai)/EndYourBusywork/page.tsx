import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { BusyworkExperience } from "@/components/busywork/BusyworkExperience";
import { Section } from "@/components/ui";
import { BUSYWORK_PATH, experience } from "@/lib/busywork/copy";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "End Your Busywork",
  description: experience.supporting,
  alternates: { canonical: absoluteUrl(BUSYWORK_PATH) },
  openGraph: {
    title: "End Your Busywork | ai.neck",
    description: experience.supporting,
    url: absoluteUrl(BUSYWORK_PATH),
  },
};

export default function EndYourBusyworkPage() {
  return (
    <>
      <Section className="pt-28 md:pt-32">
        <Suspense
          fallback={
            <p className="text-sm text-graphite" aria-live="polite">
              Loading your workshop…
            </p>
          }
        >
          <BusyworkExperience />
        </Suspense>
      </Section>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "End Your Busywork", path: BUSYWORK_PATH },
        ])}
      />
    </>
  );
}
