import Link from "next/link";
import { InstagramIcon, LinkedInIcon } from "@/components/icons";
import { ItneckLogo } from "@/components/itneck/Logo";
import { ItneckNapBlock } from "@/components/itneck/NapBlock";
import { itneckFooterNav, itneckSite } from "@/lib/itneck/site";

export function ItneckFooter() {
  return (
    <footer className="border-t border-line bg-page">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Link
            href="/itneck"
            aria-label="ITneck — home"
            className="inline-flex"
          >
            <ItneckLogo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-graphite">
            {itneckSite.tagline}
          </p>
          <ul className="mt-6 flex gap-3">
            <li>
              <a
                href={itneckSite.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ITneck on Instagram (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-navy/30 hover:text-navy"
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                href={itneckSite.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ITneck on LinkedIn (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-navy/30 hover:text-navy"
              >
                <LinkedInIcon />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
            Useful links
          </h2>
          <ul className="mt-4 space-y-1">
            {itneckFooterNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-sm text-graphite transition-colors hover:text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">
            Contact
          </h2>
          <ItneckNapBlock className="mt-4" />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-graphite sm:px-6">
          Created By ITneck Copyright © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
