import Link from "next/link";
import {footerNav, site} from "@/lib/site";
import {InstagramIcon, LinkedInIcon} from "@/components/icons";
import {Logo} from "@/components/Logo";
import {NapBlock} from "@/components/NapBlock";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/" aria-label="ITneck AI — home" className="inline-flex">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-graphite">{site.tagline}</p>
          <ul className="mt-6 flex gap-3">
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ITneck AI on Instagram (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-cyan hover:text-cyan"
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ITneck AI on LinkedIn (opens in a new tab)"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-graphite transition-colors hover:border-cyan hover:text-cyan"
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
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-sm text-graphite transition-colors hover:text-cyan"
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
          <NapBlock className="mt-4" />
        </div>
      </div>
      <div className="border-t border-line/50">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-graphite sm:px-6">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
