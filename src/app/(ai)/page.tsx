import type { Metadata } from "next";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { SiteLink } from "@/components/SiteLink";
import { WorkflowScene } from "@/components/WorkflowScene";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Ai.neck | End Your Busy Work" },
  description: site.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Ai.neck | End Your Busy Work",
    description: site.description,
    url: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col pt-16 md:h-dvh md:overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 py-6 pb-28 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:pb-6">
        <div className="max-w-xl lg:max-w-md xl:max-w-lg">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            End Your Busy Work.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-graphite sm:text-lg">
            Your best people should not spend their day copying information,
            chasing updates, rebuilding reports, searching for answers, or
            repeating the same work.
          </p>
          <p className="mt-4 text-base leading-relaxed text-navy sm:text-lg">
            We find where your business is losing time, then use AI and
            automation to give that time back.
          </p>
          <p className="mt-4 text-sm text-graphite">
            Less repetition. More capacity. More time for customers, growth,
            and work that matters.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <BusyworkEntryLink
              from="home"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              End Your Busy Work
            </BusyworkEntryLink>
            <SiteLink
              href="/how-it-works"
              className="inline-flex min-h-12 items-center text-sm font-medium text-navy underline decoration-line underline-offset-4 hover:text-cyan hover:decoration-cyan"
            >
              See How It Works
            </SiteLink>
          </div>
        </div>
        <WorkflowScene className="mx-auto max-w-md lg:max-w-none lg:flex-1" />
      </div>
      <div className="shrink-0 border-t border-line">
        <p className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-xs text-graphite sm:px-6">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <SiteLink href="/contact" className="hover:text-navy">
            Contact
          </SiteLink>
          <SiteLink href="/privacy" className="hover:text-navy">
            Privacy
          </SiteLink>
        </p>
      </div>
    </div>
  );
}
