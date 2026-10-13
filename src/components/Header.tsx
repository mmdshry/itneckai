"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BusyworkEntryLink } from "@/components/busywork/BusyworkEntryLink";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";
import { SiteLink } from "@/components/SiteLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { withOrigin } from "@/lib/hosts";
import { headerNav } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ marketingOrigin }: { marketingOrigin?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const hrefFor = (path: string) => withOrigin(path, marketingOrigin);

  useEffect(() => {
    const onScroll = () => {
      const y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setScrolled(y > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = () =>
      drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 print:hidden ${
        scrolled || open
          ? "site-header--scrolled border-line"
          : "border-transparent bg-transparent"
      }`}
      style={
        scrolled || open
          ? {
              backgroundColor: "var(--header-scrolled-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }
          : undefined
      }
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <SiteLink
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Ai.neck — home"
        >
          <Mascot />
          <Logo />
        </SiteLink>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-6">
            {headerNav.map((item) => {
              const active = !marketingOrigin && isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <SiteLink
                    href={hrefFor(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm transition-colors hover:text-cyan ${
                      active ? "text-cyan" : "text-navy/80"
                    }`}
                  >
                    {item.label}
                  </SiteLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <BusyworkEntryLink
            from="header-cta"
            origin={marketingOrigin}
            className="hidden min-h-11 items-center rounded-md bg-amber px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            End Your Busy Work
          </BusyworkEntryLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={drawerRef}
          id="mobile-nav"
          className="site-header--scrolled border-t border-line lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col">
              {headerNav.map((item) => {
                const active = !marketingOrigin && isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <SiteLink
                      href={hrefFor(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center border-b border-line/50 text-base ${
                        active ? "text-cyan" : "text-navy"
                      }`}
                    >
                      {item.label}
                    </SiteLink>
                  </li>
                );
              })}
              <li className="pt-4">
                <BusyworkEntryLink
                  from="header-cta"
                  origin={marketingOrigin}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-white"
                >
                  End Your Busy Work
                </BusyworkEntryLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
