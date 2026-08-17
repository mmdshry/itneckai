"use client";

import { MailIcon } from "@/components/icons";

export function CheckEmail({
  email,
  devLink,
}: {
  email: string;
  devLink?: string;
}) {
  return (
    <div className="max-w-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Check your email
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy">
        Your workshop link is on the way.
      </h1>
      <p className="mt-4 flex items-start gap-2 text-graphite">
        <MailIcon className="mt-0.5 shrink-0 text-cyan" />
        <span>
          We sent a private sign-in link to <strong className="text-navy">{email}</strong>.
          It expires in 20 minutes. Open it to continue — no password needed.
        </span>
      </p>
      {devLink ? (
        <p className="mt-6 rounded-md border border-line bg-surface px-4 py-3 text-sm text-navy">
          Development only:{" "}
          <a href={devLink} className="underline underline-offset-4">
            open the magic link
          </a>
        </p>
      ) : null}
    </div>
  );
}
