import { headers } from "next/headers";
import { SiteLink } from "@/components/SiteLink";
import { Eyebrow, GhostCta, Section } from "@/components/ui";
import { marketingOriginForHost, withOrigin } from "@/lib/hosts";

export default async function NotFound() {
  const host = (await headers()).get("host");
  const marketingOrigin = marketingOriginForHost(host);
  const howHref = withOrigin("/how-it-works", marketingOrigin);

  return (
    <Section className="pt-32 md:pt-40">
      <Eyebrow>404 · Signal lost</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
        This page isn&apos;t connected to the graph.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-graphite">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try
        the{" "}
        <SiteLink
          href="/"
          className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
        >
          home page
        </SiteLink>{" "}
        or see how the work gets done.
      </p>
      <div className="mt-8">
        <GhostCta href={howHref}>See How It Works</GhostCta>
      </div>
    </Section>
  );
}
