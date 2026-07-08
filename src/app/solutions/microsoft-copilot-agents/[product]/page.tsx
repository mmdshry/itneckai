import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CheckIcon, productIcons } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner, Section } from "@/components/ui";
import { copilotProducts, getProduct } from "@/lib/copilot-agents";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ product: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return copilotProducts.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const path = `/solutions/microsoft-copilot-agents/${product.slug}`;
  return {
    title: { absolute: product.title },
    description: product.metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: product.title,
      description: product.metaDescription,
      url: absoluteUrl(path),
    },
  };
}

export default async function CopilotProductPage({ params }: Props) {
  const { product: slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const Icon = productIcons[product.icon];
  const path = `/solutions/microsoft-copilot-agents/${product.slug}`;
  const others = copilotProducts.filter((p) => p.slug !== product.slug);

  return (
    <>
      <Section className="pt-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-graphite">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/solutions" className="hover:text-cyan">
                Solutions
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/solutions/microsoft-copilot-agents"
                className="hover:text-cyan"
              >
                Microsoft Copilot Agents
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cyan">
              {product.name}
            </li>
          </ol>
        </nav>

        <p className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan">
          <Icon width={16} height={16} /> {product.short} · Connected
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-cloud md:text-5xl">
          {product.headline}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-graphite">
          {product.whatWeBuild}
        </p>
      </Section>

      <Section className="pt-0" aria-label={`What we build for ${product.name}`}>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-cloud md:text-3xl">
          What we build for {product.name}
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {product.useCases.map((uc) => (
            <article
              key={uc.name}
              className="rounded-lg border border-line bg-surface/50 p-6"
            >
              <h3 className="font-display text-lg font-semibold text-cloud">
                {uc.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {uc.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-cyan/40 bg-surface p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-cloud">
            What changes for your team
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {product.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3">
                <CheckIcon className="mt-1 shrink-0 text-cyan" />
                <span className="text-sm text-cloud/90">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Other Copilot agent solutions" className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-graphite">
            Copilot agents for other Microsoft apps
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/solutions/microsoft-copilot-agents/${p.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 text-sm text-cloud/90 transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  {p.name}
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBanner
        heading={`Ready to put an agent inside ${product.name}?`}
      />
      <JsonLd
        data={serviceSchema({
          name: `${product.name} Copilot Agent Development`,
          description: product.metaDescription,
          path,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          {
            name: "Microsoft Copilot Agents",
            path: "/solutions/microsoft-copilot-agents",
          },
          { name: product.name, path },
        ])}
      />
    </>
  );
}
