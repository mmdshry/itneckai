"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ItneckLogo } from "@/components/itneck/Logo";
import { itneckHeaderNav } from "@/lib/itneck/site";
import { solutionHubs } from "@/lib/itneck/solutions";

export function ItneckHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLLIElement>(null);
  const solutionsPanelId = useId();
  const mobileSolutionsId = useId();

  const solutionsActive =
    pathname === "/itneck/solutions" ||
    pathname.startsWith("/itneck/solutions/");

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
    setMobileSolutionsOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
    setMobileSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!solutionsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSolutionsOpen(false);
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (
        solutionsRef.current &&
        !solutionsRef.current.contains(e.target as Node)
      ) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [solutionsOpen]);

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
          href="/itneck"
          className="flex shrink-0 items-center gap-2"
          aria-label="ITneck — home"
        >
          <ItneckLogo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {itneckHeaderNav.map((item) => {
              if ("mega" in item && item.mega) {
                return (
                  <li
                    key={item.href}
                    ref={solutionsRef}
                    className="relative"
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                    onBlur={(e) => {
                      if (
                        !e.currentTarget.contains(
                          e.relatedTarget as Node | null,
                        )
                      ) {
                        setSolutionsOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={solutionsOpen}
                      aria-controls={solutionsPanelId}
                      aria-current={solutionsActive ? "page" : undefined}
                      className={`text-sm transition-colors hover:text-cyan ${
                        solutionsActive ? "text-cyan" : "text-navy/80"
                      }`}
                      onClick={() => setSolutionsOpen((v) => !v)}
                      onFocus={() => setSolutionsOpen(true)}
                    >
                      {item.label}
                    </button>
                    {solutionsOpen && (
                      <div
                        id={solutionsPanelId}
                        role="region"
                        aria-label="Solutions"
                        className="absolute left-1/2 top-full z-50 w-[min(90vw,52rem)] -translate-x-1/2 pt-2"
                      >
                        <div className="rounded-md border border-line bg-page p-4 shadow-sm">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {solutionHubs.map((hub) => (
                              <div key={hub.slug}>
                                <Link
                                  href={`/itneck/solutions/${hub.slug}`}
                                  className="text-sm font-semibold text-navy hover:text-cyan"
                                  onClick={() => setSolutionsOpen(false)}
                                >
                                  {hub.navLabel}
                                </Link>
                                <ul className="mt-2 space-y-1">
                                  {hub.leaves.slice(0, 4).map((leaf) => (
                                    <li key={leaf.slug}>
                                      <Link
                                        href={`/itneck/solutions/${hub.slug}/${leaf.slug}`}
                                        className="block text-xs text-graphite hover:text-cyan"
                                        onClick={() => setSolutionsOpen(false)}
                                      >
                                        {leaf.title}
                                        {leaf.badge ? (
                                          <span className="ml-1 font-mono uppercase text-[10px] text-amber">
                                            {leaf.badge}
                                          </span>
                                        ) : null}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 border-t border-line pt-3">
                            <Link
                              href="/itneck/solutions"
                              className="text-sm font-medium text-navy hover:text-cyan"
                              onClick={() => setSolutionsOpen(false)}
                            >
                              View all solutions
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }

              const active =
                item.href === "/itneck"
                  ? pathname === "/itneck"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm transition-colors hover:text-cyan ${
                      active ? "text-cyan" : "text-navy/80"
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
            href="/itneck/contact"
            className="hidden min-h-11 items-center rounded-md bg-amber px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Contact us
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="itneck-mobile-nav"
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
          id="itneck-mobile-nav"
          className="border-t border-line site-header--scrolled lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto max-w-6xl px-4 py-4 sm:px-6"
          >
            <ul className="flex flex-col">
              {itneckHeaderNav.map((item) => {
                if ("mega" in item && item.mega) {
                  return (
                    <li key={item.href} className="border-b border-line/50">
                      <button
                        type="button"
                        aria-expanded={mobileSolutionsOpen}
                        aria-controls={mobileSolutionsId}
                        className={`flex min-h-11 w-full items-center justify-between text-base ${
                          solutionsActive ? "text-cyan" : "text-navy"
                        }`}
                        onClick={() => setMobileSolutionsOpen((v) => !v)}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={`font-mono text-xs transition-transform ${
                            mobileSolutionsOpen ? "rotate-90" : ""
                          }`}
                        >
                          ›
                        </span>
                      </button>
                      {mobileSolutionsOpen && (
                        <ul id={mobileSolutionsId} className="pb-3 pl-3">
                          <li>
                            <Link
                              href="/itneck/solutions"
                              className="flex min-h-11 items-center text-sm text-navy/80"
                            >
                              All solutions
                            </Link>
                          </li>
                          {solutionHubs.map((hub) => (
                            <li key={hub.slug}>
                              <Link
                                href={`/itneck/solutions/${hub.slug}`}
                                className="flex min-h-11 items-center text-sm font-medium text-navy"
                              >
                                {hub.navLabel}
                              </Link>
                              <ul className="pl-3">
                                {hub.leaves.map((leaf) => (
                                  <li key={leaf.slug}>
                                    <Link
                                      href={`/itneck/solutions/${hub.slug}/${leaf.slug}`}
                                      className="flex min-h-10 items-center text-sm text-navy/80"
                                    >
                                      {leaf.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                const active =
                  item.href === "/itneck"
                    ? pathname === "/itneck"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center border-b border-line/50 text-base ${
                        active ? "text-cyan" : "text-navy"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-4">
                <Link
                  href="/itneck/contact"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-amber px-4 text-sm font-semibold text-white"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
