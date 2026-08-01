"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

type Theme = "light" | "dark";

function resolveTheme(stored: string | null): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = resolveTheme(localStorage.getItem("theme"));
    applyTheme(resolved);
    setTheme(resolved);
    setReady(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      if (!localStorage.getItem("theme")) {
        const next = mq.matches ? "dark" : "light";
        applyTheme(next);
        setTheme(next);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "theme") return;
      const next = resolveTheme(e.newValue);
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener("change", onScheme);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onScheme);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line text-navy transition-colors hover:border-navy/30"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={theme === "dark"}
    >
      {!ready ? (
        <span className="h-5 w-5" aria-hidden="true" />
      ) : theme === "dark" ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}
