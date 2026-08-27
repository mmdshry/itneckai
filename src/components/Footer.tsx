import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import {InstagramIcon, LinkedInIcon} from "@/components/icons";
import {Logo} from "@/components/Logo";
import {NapBlock} from "@/components/NapBlock";
import { SiteLink } from "@/components/SiteLink";
import { withOrigin } from "@/lib/hosts";
import {footerNav, site} from "@/lib/site";

export function Footer({ marketingOrigin }: { marketingOrigin?: string }) {
  const homeHref = withOrigin("/", marketingOrigin);
  return (
    <footer className="border-t border-line bg-page print:hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <SiteLink href={homeHref} aria-label="ai.neck — home" className="inline-flex">
            <Logo />
          </SiteLink>
          <p className="mt-4 max-w-xs text-sm text-graphite">{site.tagline}</p>
          <ul className="mt-6 flex gap-3">
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ai.neck on Instagram (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-navy/30 hover:text-navy"
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ai.neck on LinkedIn (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-navy/30 hover:text-navy"
              >
                <LinkedInIcon />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
            Site
          </h2>
          <ul className="mt-4 space-y-1">
            {footerNav.map((item) => (
              <li key={item.href}>
                {item.href === "/EndYourBusywork" ? (
                  <BusyworkEntryLink
                    from="footer"
                    origin={marketingOrigin}
                    className="inline-flex min-h-9 items-center text-sm text-graphite transition-colors hover:text-navy"
                  >
                    {item.label}
                  </BusyworkEntryLink>
                ) : (
                  <SiteLink
                    href={withOrigin(item.href, marketingOrigin)}
                    className="inline-flex min-h-9 items-center text-sm text-graphite transition-colors hover:text-navy"
                  >
                    {item.label}
                  </SiteLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
            Contact
          </h2>
          <NapBlock className="mt-4" />
        </div>
      </div>
      <div className="border-t border-line">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-graphite sm:px-6">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
