"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TurnstileField,
  type TurnstileFieldHandle,
} from "@/components/TurnstileField";
import { joinBusywork } from "@/lib/api-client";
import { joinCopy } from "@/lib/busywork/copy";
import { joinSchema, type JoinInput } from "@/lib/busywork/schema";
import { errorClass, inputClass, labelClass, primaryButtonClass } from "./styles";

export function JoinForm({
  onSent,
  siteKey,
}: {
  onSent: (email: string, devLink?: string) => void;
  siteKey: string;
}) {
  const [formError, setFormError] = useState<string>();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileFieldHandle>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JoinInput>({
    resolver: zodResolver(joinSchema),
    defaultValues: { firstName: "", email: "", consent: false, website: "" },
  });

  async function onSubmit(values: JoinInput) {
    setFormError(undefined);
    const result = await joinBusywork({ ...values, turnstileToken });
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof JoinInput, {
            type: "server",
            message: messages[0],
          });
        }
      }
      setFormError(result.error);
      turnstileRef.current?.reset();
      return;
    }
    onSent(result.email, result.devLink);
  }

  const captchaBlocking = Boolean(siteKey) && !turnstileToken;

  return (
    <div className="max-w-lg">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        Join
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy">
        {joinCopy.title}
      </h1>
      <p className="mt-4 text-graphite">{joinCopy.body}</p>

      <form className="relative mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Full Name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.firstName}
            className={inputClass}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className={errorClass}>{errors.firstName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputClass}
            {...register("email")}
          />
          {errors.email ? <p className={errorClass}>{errors.email.message}</p> : null}
        </div>

        <div className="flex gap-3">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-line text-amber"
            {...register("consent")}
          />
          <label htmlFor="consent" className="text-sm text-graphite">
            {joinCopy.consent}{" "}
            <Link href="/privacy" className="text-navy underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.consent ? <p className={errorClass}>{errors.consent.message}</p> : null}

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {siteKey ? (
          <TurnstileField
            ref={turnstileRef}
            siteKey={siteKey}
            onToken={setTurnstileToken}
            onLoadError={() =>
              setFormError("Could not load verification. Refresh and try again.")
            }
          />
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || captchaBlocking}
          className={primaryButtonClass}
        >
          {isSubmitting ? "Sending link…" : "Join"}
        </button>

        {formError ? (
          <p className="rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {formError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
