import Link from "next/link";
import { Eyebrow, GhostCta, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section className="pt-32 md:pt-40">
      <Eyebrow>404 · Signal lost</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
        This page isn&apos;t connected to the graph.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-graphite">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try
        the{" "}
        <Link
          href="/"
          className="text-cyan underline decoration-line underline-offset-4 hover:decoration-cyan"
        >
          home page
        </Link>{" "}
        or head straight to our solutions.
      </p>
      <div className="mt-8">
        <GhostCta href="/solutions">Browse Solutions</GhostCta>
      </div>
    </Section>
  );
}
