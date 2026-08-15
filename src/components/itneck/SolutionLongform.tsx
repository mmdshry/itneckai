import Link from "next/link";
import { DualCtas } from "@/components/itneck/DualCtas";
import { SolutionToc } from "@/components/itneck/SolutionToc";
import { Eyebrow } from "@/components/ui";
import {
  solutionToc,
  type SolutionPage,
  type SolutionSection,
} from "@/lib/itneck/solutions";

function SectionBody({ section }: { section: SolutionSection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      {section.title ? (
        <h2 className="font-display text-3xl font-semibold tracking-tight text-cloud md:text-4xl">
          {section.title}
        </h2>
      ) : null}
      {section.paragraphs?.map((p, i) => (
        <p key={`${section.id}-p-${i}`} className="mt-5 text-lg leading-relaxed text-graphite">
          {p}
        </p>
      ))}
      {section.listIntro ? (
        <p className="mt-5 text-lg leading-relaxed text-graphite">
          {section.listIntro}
        </p>
      ) : null}
      {section.items && section.items.length > 0 ? (
        <ul className="mt-6 space-y-2.5">
          {section.items.map((item, i) => (
            <li key={`${section.id}-i-${i}`} className="flex gap-3 text-graphite">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
                aria-hidden
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.steps && section.steps.length > 0 ? (
        <ol className="mt-8 space-y-8">
          {section.steps.map((step, i) => (
            <li key={step.title}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-cloud">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-graphite">{step.body}</p>
            </li>
          ))}
        </ol>
      ) : null}
      {section.afterItems?.map((p, i) => (
        <p key={`${section.id}-a-${i}`} className="mt-5 text-lg leading-relaxed text-graphite">
          {p}
        </p>
      ))}
      {section.result ? (
        <blockquote className="mt-8 border-l-2 border-amber pl-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
            The Result
          </p>
          <p className="mt-2 font-display text-xl font-semibold leading-snug text-cloud md:text-2xl">
            {section.result}
          </p>
        </blockquote>
      ) : null}
      {section.crosslink ? (
        <p className="mt-8">
          <Link
            href={section.crosslink.href}
            className="text-base font-medium text-navy underline decoration-line underline-offset-4 hover:text-cyan hover:decoration-cyan"
          >
            {section.crosslink.label}
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export function SolutionLongform({ page }: { page: SolutionPage }) {
  const toc = solutionToc(page);

  return (
    <article>
      <header className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
          <p className="text-sm text-graphite">
            <Link href="/itneck/solutions" className="hover:text-cyan">
              Solutions
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-navy">{page.title}</span>
          </p>
          <div className="mt-8">
            <Eyebrow>{page.navLabel}</Eyebrow>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-cloud md:text-6xl">
            {page.hero.title}
          </h1>
          <div className="mt-8 max-w-3xl space-y-5">
            {page.hero.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-graphite">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10">
            <DualCtas
              primary={page.hero.primaryCta}
              secondary={page.hero.secondaryCta}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 md:py-24">
        <div className="lg:block">
          <SolutionToc items={toc} />
        </div>
        <div className="space-y-16 md:space-y-24">
          {page.sections.map((section) => (
            <SectionBody key={section.id} section={section} />
          ))}
        </div>
      </div>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-cloud md:text-5xl">
            {page.closing.title}
          </h2>
          {page.closing.paragraphs.map((p, i) => (
            <p
              key={i}
              className="mt-5 max-w-3xl text-lg leading-relaxed text-graphite"
            >
              {p}
            </p>
          ))}
          <div className="mt-10">
            <DualCtas
              primary={page.closing.primaryCta}
              secondary={page.closing.secondaryCta}
            />
          </div>
        </div>
      </section>
    </article>
  );
}
