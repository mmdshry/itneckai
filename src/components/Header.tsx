"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useCallback, useEffect, useId, useRef, useState} from "react";
import {CloseIcon, MenuIcon} from "@/components/icons";
import {Logo} from "@/components/Logo";
import {ThemeToggle} from "@/components/ThemeToggle";
import {industries} from "@/lib/industries";
import {headerNav} from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
    const [industriesOpen, setIndustriesOpen] = useState(false);
    const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
    const industriesRef = useRef<HTMLLIElement>(null);
    const industriesPanelId = useId();
    const mobileIndustriesId = useId();

    const industriesActive =
        pathname === "/industries" || pathname.startsWith("/industries/");

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
      setMobileIndustriesOpen(false);
    toggleRef.current?.focus();
  }, []);

    // Close the drawer / flyout on route change without stealing focus
  useEffect(() => {
    setOpen(false);
      setIndustriesOpen(false);
      setMobileIndustriesOpen(false);
  }, [pathname]);

    // Escape + click-outside for desktop Industries flyout
    useEffect(() => {
        if (!industriesOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                setIndustriesOpen(false);
            }
        };
        const onPointerDown = (e: MouseEvent) => {
            if (
                industriesRef.current &&
                !industriesRef.current.contains(e.target as Node)
            ) {
                setIndustriesOpen(false);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onPointerDown);
        };
    }, [industriesOpen]);

  // Focus trap + Escape while the drawer is open
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusables = () =>
      drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
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
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="ai.neck — home"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6">
              {headerNav.map((item) => {
                  if (item.href === "/industries") {
                      return (
                          <li
                              key={item.href}
                              ref={industriesRef}
                              className="relative"
                              onMouseEnter={() => setIndustriesOpen(true)}
                              onMouseLeave={() => setIndustriesOpen(false)}
                              onBlur={(e) => {
                                  if (
                                      !e.currentTarget.contains(e.relatedTarget as Node | null)
                                  ) {
                                      setIndustriesOpen(false);
                                  }
                              }}
                          >
                              <button
                                  type="button"
                                  aria-expanded={industriesOpen}
                                  aria-controls={industriesPanelId}
                                  aria-current={industriesActive ? "page" : undefined}
                                  className={`text-sm transition-colors hover:text-cyan ${
                                      industriesActive ? "text-cyan" : "text-navy/80"
                                  }`}
                                  onClick={() => setIndustriesOpen((v) => !v)}
                                  onFocus={() => setIndustriesOpen(true)}
                              >
                                  {item.label}
                              </button>
                              {industriesOpen && (
                                  <div
                                      id={industriesPanelId}
                                      role="region"
                                      aria-label="Industries"
                                      className="absolute left-0 top-full z-50 min-w-[16rem] pt-2"
                                  >
                                      <div className="rounded-md border border-line bg-page py-2 shadow-sm">
                                          <ul>
                                              {industries.map((industry) => {
                                                  const href = `/industries/${industry.slug}`;
                                                  const active = pathname === href;
                                                  return (
                                                      <li key={industry.slug}>
                                                          <Link
                                                              href={href}
                                                              aria-current={active ? "page" : undefined}
                                                              className={`block px-4 py-2.5 text-sm transition-colors hover:bg-surface hover:text-cyan ${
                                                                  active ? "text-cyan" : "text-navy/90"
                                                              }`}
                                                              onClick={() => setIndustriesOpen(false)}
                                                          >
                                                              {industry.name}
                                                          </Link>
                                                      </li>
                                                  );
                                              })}
                                          </ul>
                                          <div className="mt-1 border-t border-line px-4 py-2.5">
                                              <Link
                                                  href="/industries"
                                                  className="text-sm font-medium text-navy hover:text-cyan"
                                                  onClick={() => setIndustriesOpen(false)}
                                              >
                                                  View all industries
                                              </Link>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </li>
                      );
                  }

                  return (
                      <li key={item.href}>
                          <Link
                              href={item.href}
                              aria-current={pathname === item.href ? "page" : undefined}
                              className={`text-sm transition-colors hover:text-cyan ${
                                  pathname === item.href ? "text-cyan" : "text-navy/80"
                              }`}
                          >
                              {item.label}
                          </Link>
                      </li>
                  );
              })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-md bg-amber px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
              Book a working session
          </Link>
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
          className="border-t border-line site-header--scrolled lg:hidden"
        >
            <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col">
                {headerNav.map((item) => {
                    if (item.href === "/industries") {
                        return (
                            <li key={item.href} className="border-b border-line/50">
                                <button
                                    type="button"
                                    aria-expanded={mobileIndustriesOpen}
                                    aria-controls={mobileIndustriesId}
                                    className={`flex min-h-11 w-full items-center justify-between text-base ${
                                        industriesActive ? "text-cyan" : "text-navy"
                                    }`}
                                    onClick={() => setMobileIndustriesOpen((v) => !v)}
                                >
                                    {item.label}
                                    <span
                                        aria-hidden="true"
                                        className={`font-mono text-xs transition-transform ${
                                            mobileIndustriesOpen ? "rotate-90" : ""
                                        }`}
                                    >
                          ›
                        </span>
                                </button>
                                {mobileIndustriesOpen && (
                                    <ul id={mobileIndustriesId} className="pb-3 pl-3">
                                        <li>
                                            <Link
                                                href="/industries"
                                                aria-current={
                                                    pathname === "/industries" ? "page" : undefined
                                                }
                                                className={`flex min-h-11 items-center text-sm ${
                                                    pathname === "/industries"
                                                        ? "text-cyan"
                                                        : "text-navy/80"
                                                }`}
                                            >
                                                All industries
                                            </Link>
                                        </li>
                                        {industries.map((industry) => {
                                            const href = `/industries/${industry.slug}`;
                                            const active = pathname === href;
                                            return (
                                                <li key={industry.slug}>
                                                    <Link
                                                        href={href}
                                                        aria-current={active ? "page" : undefined}
                                                        className={`flex min-h-11 items-center text-sm ${
                                                            active ? "text-cyan" : "text-navy/80"
                                                        }`}
                                                    >
                                                        {industry.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    }

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={`flex min-h-11 items-center border-b border-line/50 text-base ${
                                    pathname === item.href ? "text-cyan" : "text-navy"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
              <li className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-white"
                >
                    Book a working session
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
