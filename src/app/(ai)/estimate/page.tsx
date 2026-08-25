import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Eyebrow, Section } from "@/components/ui";
import { parseEstimateMode } from "@/lib/estimate/format";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const EstimateApp = dynamic(
  () =>
    import("@/components/estimate/EstimateApp").then((mod) => mod.EstimateApp),
  {
    loading: () => (
      <p className="mt-10 text-sm text-graphite" aria-live="polite">
        Loading estimator…
      </p>
    ),
  },
);

export const metadata: Metadata = {
  title: "BIM MEP Estimate",
  description:
    "Sales-budget BIM MEP estimator: Standard $/SF pricing and Advanced hours-based bids with LOD, complexity, offshore, and PM guardrails. Not a formal bid.",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/estimate") },
  openGraph: {
    title: "BIM MEP Estimate | ai.neck",
    description:
      "Build a sales-budget BIM MEP number from square footage, trades, LOD, and complexity — Standard or Advanced.",
    url: absoluteUrl("/estimate"),
  },
};

export default async function EstimatePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = parseEstimateMode(params.mode);

  return (
    <>
      <Section className="pt-32 md:pt-40 print:m-0 print:max-w-none print:p-0">
        <div className="estimate-screen">
          <Eyebrow>BIM sales estimator</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
            Price the BIM scope before the formal bid.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-graphite">
            Fill the project inputs. The bid, $/SF, hours, and guardrails update
            as you go. This is sales-budget pricing — not a substitute for PM
            takeoff.
          </p>
        </div>
        <EstimateApp initialMode={initialMode} />
      </Section>
      <div className="estimate-no-print">
        <CtaBanner
          heading="Ready to turn this budget into a scoped BIM engagement?"
          href="/contact"
          ctaLabel="Book a working session"
        />
      </div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Estimate", path: "/estimate" },
        ])}
      />
    </>
  );
}
