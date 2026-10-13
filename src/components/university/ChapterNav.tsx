"use client";

import { useEffect, useState } from "react";
import { guideChapters } from "@/lib/education/enterprise-guide";

export function ChapterNav() {
  const [active, setActive] = useState<string>(guideChapters[0].id);

  useEffect(() => {
    const nodes = guideChapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => node !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Guide chapters"
      className="sticky top-16 z-40 border-b border-line bg-page/95 backdrop-blur"
    >
      <ol className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {guideChapters.map((chapter, index) => {
          const current = active === chapter.id;
          return (
            <li key={chapter.id} className="shrink-0">
              <a
                href={`#${chapter.id}`}
                aria-current={current ? "location" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                  current
                    ? "bg-surface text-cyan"
                    : "text-navy hover:bg-surface hover:text-cyan"
                }`}
              >
                <span className="font-mono text-[10px] tracking-widest">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {chapter.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
