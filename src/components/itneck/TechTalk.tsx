"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { itneckSite } from "@/lib/itneck/site";
import { subscribeTechTalk } from "@/app/itneck/actions";

export function TechTalk() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const result = await subscribeTechTalk(email);
    if (result.ok) {
      setEmail("");
      setStatus("success");
      setMessage(
        "Check your inbox or spam folder to confirm your subscription.",
      );
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  return (
    <section
      aria-label="TechTalk newsletter"
      className="border-t border-line bg-surface"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          TechTalk
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-cloud md:text-3xl">
          Get monthly IT insights, tech trends, and updates—straight to your
          inbox.
        </h2>
        <p className="mt-3 text-sm text-graphite">
          We don&apos;t spam! Read our{" "}
          <Link
            href="/itneck/privacy"
            className="underline decoration-line underline-offset-4 hover:text-cyan"
          >
            privacy policy
          </Link>{" "}
          for more info.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          noValidate
        >
          <label htmlFor="techtalk-email" className="sr-only">
            Email Address
          </label>
          <input
            id="techtalk-email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 flex-1 rounded-md border border-line bg-page px-3.5 text-sm text-navy placeholder:text-ink-muted"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Let's keep in touch"}
          </button>
        </form>
        <div aria-live="polite" role="status">
          {status === "success" && (
            <p className="mt-4 flex items-start gap-2 text-sm text-navy">
              <CheckIcon className="mt-0.5 shrink-0 text-cyan" />
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-600">
              {message}{" "}
              <a
                href={`mailto:${itneckSite.email}`}
                className="underline underline-offset-4"
              >
                {itneckSite.email}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
