import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CheckIcon, productIcons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Section } from "@/components/ui";
import { getProduct } from "@/lib/copilot-agents";
import { getIndustry, industries } from "@/lib/industries";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  const path = `/industries/${industry.slug}`;
  return {
    title: { absolute: industry.title },
    description: industry.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: industry.title,
      description: industry.metaDescription,
      url: absoluteUrl(path),
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const path = `/industries/${industry.slug}`;
  const others = industries.filter((i) => i.slug !== industry.slug);
  const related = industry.relatedProducts
    .map((productSlug) => getProduct(productSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-graphite">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/industries" className="hover:text-cyan">
                Industries
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cyan">
              {industry.name}
            </li>
          </ol>
        </nav>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-cyan">
          {industry.short} · {industry.buyer}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
          {industry.headline}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-graphite">
          {industry.intro}
        </p>
      </Section>

      <Section className="pt-0" aria-label={`${industry.name} focus areas`}>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
          Where we focus in {industry.name}
        </h2>
        <div className="mt-10 divide-y divide-line">
          {industry.focusAreas.map((area) => (
            <article key={area.name} className="py-8 first:pt-0 last:pb-0">
              <h3 className="font-display text-lg font-semibold text-navy">
                {area.name}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-graphite">
                {area.detail}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        className="pt-0"
        aria-label={`Documented agent patterns for ${industry.name}`}
      >
        <h2 className="font-display text-2xl font-semibold tracking-tight text-navy md:text-3xl">
          Priority Copilot Studio patterns for {industry.name}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-graphite">
          These are the highest-leverage starting patterns for {industry.name}{" "}
          — not a technical ceiling. Each maps to capabilities Microsoft
          documents for Copilot Studio, Microsoft Graph grounding, Teams,
          SharePoint, Outlook, and Power Automate. No invented client names or
          metrics.
        </p>
        <div className="mt-10 divide-y divide-line">
          {industry.agentPatterns.map((pattern) => (
            <article key={pattern.name} className="py-8 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-navy">
                  {pattern.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {pattern.groundedIn}
                </p>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-graphite">
                {pattern.detail}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pt-0" aria-label="How we help">
        <h2 className="font-display text-xl font-semibold text-navy">
          How we help
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {industry.howWeHelp.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckIcon className="mt-1 shrink-0 text-cyan" />
              <span className="text-sm text-navy/90">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section className="pt-0" aria-label="Related Copilot agents">
          <h2 className="font-mono text-xs uppercase tracking-widest text-graphite">
            Related Copilot Studio agent solutions
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-graphite">
            Priority Microsoft 365 surfaces for this industry — other surfaces
            remain available when the workflow needs them.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {related.map((product) => {
              const Icon = productIcons[product.icon];
              return (
                <li key={product.slug}>
                  <Link
                    href={`/solutions/microsoft-copilot-agents/${product.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-navy transition-colors hover:text-cyan"
                  >
                    <Icon width={16} height={16} />
                    {product.name}
                    <ArrowRightIcon />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section className="pt-0" aria-label="Other industries">
        <h2 className="font-mono text-xs uppercase tracking-widest text-graphite">
          Other industries
        </h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {others.map((i) => (
            <li key={i.slug}>
              <Link
                href={`/industries/${i.slug}`}
                className="inline-flex min-h-11 items-center gap-2 text-sm text-navy transition-colors hover:text-cyan"
              >
                {i.name}
                <ArrowRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner
        heading={`Ready to map an agent to ${industry.name}?`}
      />
      <JsonLd
        data={serviceSchema({
          name: `${industry.name} Copilot Agent Development`,
          description: industry.metaDescription,
          path,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path },
        ])}
      />
    </>
  );
}
