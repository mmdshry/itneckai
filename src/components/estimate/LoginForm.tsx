"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from "@/components/TurnstileField";

const inputClass =
  "mt-1.5 w-full rounded-md border border-line bg-page px-3.5 py-3 text-sm text-navy placeholder:text-ink-muted aria-[invalid=true]:border-red-500";
const labelClass = "block text-sm font-medium text-navy";

export function LoginForm({ siteKey }: { siteKey: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? undefined;
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileFieldHandle>(null);

  function resetTurnstile() {
    turnstileRef.current?.reset();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/estimate/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(form.get("username") ?? ""),
          password: String(form.get("password") ?? ""),
          turnstileToken,
          next,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        next?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid credentials");
        resetTurnstile();
        return;
      }
      router.replace(data.next || "/estimate");
      router.refresh();
    } catch {
      setError("Invalid credentials");
      resetTurnstile();
    } finally {
      setPending(false);
    }
  }

  const captchaBlocking = Boolean(siteKey) && !turnstileToken;

  return (
    <div className="max-w-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Restricted
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy">
        Sign in to the estimator
      </h1>
      <p className="mt-4 text-graphite">
        Enter your username and password to continue.
      </p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>
        {siteKey ? (
          <TurnstileField
            ref={turnstileRef}
            siteKey={siteKey}
            onToken={setTurnstileToken}
            onLoadError={() =>
              setError("Could not load verification. Refresh and try again.")
            }
          />
        ) : null}
        {error ? (
          <p className="rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending || captchaBlocking}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
