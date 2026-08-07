"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {CheckIcon} from "@/components/icons";
import {type ContactInput, contactSchema, helpTopics,} from "@/lib/contact-schema";
import {site} from "@/lib/site";
import {submitContact} from "./actions";

type Status = { state: "idle" | "sending" | "success" | "error"; message?: string };

const inputClasses =
  "mt-1.5 w-full rounded-md border border-line bg-page px-3.5 py-3 text-sm text-navy placeholder:text-ink-muted aria-[invalid=true]:border-red-500";
const labelClasses = "block text-sm font-medium text-navy";
const errorClasses = "mt-1.5 text-sm text-red-600";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setStatus({ state: "sending" });
    const result = await submitContact(values);
    if (result.ok) {
      reset();
      setStatus({
        state: "success",
        message:
          "Thanks — your message has been sent. We typically reply within one business day.",
      });
    } else {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactInput, {
            type: "server",
            message: messages[0],
          });
        }
      }
      setStatus({ state: "error", message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClasses}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={inputClasses}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" className={errorClasses}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="workEmail" className={labelClasses}>
            Work Email
          </label>
          <input
            id="workEmail"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.workEmail}
            aria-describedby={errors.workEmail ? "workEmail-error" : undefined}
            className={inputClasses}
            {...register("workEmail")}
          />
          {errors.workEmail && (
            <p id="workEmail-error" className={errorClasses}>
              {errors.workEmail.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="company" className={labelClasses}>
            Company
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={inputClasses}
            {...register("company")}
          />
          {errors.company && (
            <p id="company-error" className={errorClasses}>
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone <span className="font-normal text-graphite">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClasses}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="phone-error" className={errorClasses}>
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="topic" className={labelClasses}>
            What do you need help with?
          </label>
          <select
            id="topic"
            aria-invalid={!!errors.topic}
            aria-describedby={errors.topic ? "topic-error" : undefined}
            className={inputClasses}
            defaultValue=""
            {...register("topic")}
          >
            <option value="" disabled>
              Choose an option
            </option>
            {helpTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic && (
            <p id="topic-error" className={errorClasses}>
              {errors.topic.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={inputClasses}
            {...register("message")}
          />
          {errors.message && (
            <p id="message-error" className={errorClasses}>
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Honeypot — hidden from real users, tempting to bots */}
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
      </div>

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
          {status.state === "sending" ? "Sending…" : "Request a working session"}
      </button>

      {/* Screen readers are told about success/error via this polite live region */}
      <div aria-live="polite" role="status">
        {status.state === "success" && (
          <p className="mt-5 flex items-start gap-2 rounded-md border border-cyan/40 bg-cyan/5 px-4 py-3 text-sm text-navy">
            <CheckIcon className="mt-0.5 shrink-0 text-cyan" />
            {status.message}
          </p>
        )}
        {status.state === "error" && (
          <p className="mt-5 rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {status.message}{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
