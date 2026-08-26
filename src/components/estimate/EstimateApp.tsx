"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrintSummary } from "@/components/estimate/PrintSummary";
import { MobileBidBar, ResultsPanel } from "@/components/estimate/ResultsPanel";
import { SchemaEditor } from "@/components/estimate/SchemaEditor";
import {
  bidFromResult,
  perSfFromResult,
  SchemaForm,
  titleFromValues,
} from "@/components/estimate/SchemaForm";
import { TemplateBar } from "@/components/estimate/TemplateBar";
import { GhostCta } from "@/components/ui";
import { evaluateDocument } from "@/lib/estimate/engine";
import { estimatePrintTitle } from "@/lib/estimate/format";
import type { EstimateMode, FormDocument } from "@/lib/estimate/schema";
import { emptyDraft, loadDraft, saveDraft, type EstimateDraft } from "@/lib/estimate/storage";

export function EstimateApp({
  initialMode,
  standardHref = "/estimate",
  advanceHref = "/estimate?mode=advance",
  contactHref = "/contact",
}: {
  initialMode: EstimateMode;
  standardHref?: string;
  advanceHref?: string;
  contactHref?: string;
}) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<EstimateDraft>(() => emptyDraft(initialMode));
  const [customize, setCustomize] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [printedAt] = useState(() => new Date());
  const skipSave = useRef(true);

  useEffect(() => {
    setDraft(loadDraft(initialMode));
    setHydrated(true);
    if (process.env.NODE_ENV === "development") {
      void import("@/lib/estimate/golden").then((mod) => {
        try {
          mod.runGoldenChecks();
          (window as unknown as { __estimateGolden?: string }).__estimateGolden = "ok";
        } catch (error) {
          (window as unknown as { __estimateGolden?: string }).__estimateGolden =
            error instanceof Error ? error.message : "failed";
          console.error(error);
        }
      });
    }
  }, [initialMode]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const timer = window.setTimeout(() => saveDraft(draft), 400);
    return () => window.clearTimeout(timer);
  }, [draft, hydrated]);

  const mode = draft.activeMode;
  const doc = draft.documents[mode];
  const result = useMemo(() => evaluateDocument(doc), [doc]);
  const bid = bidFromResult(doc.schema, result);
  const perSf = perSfFromResult(doc.schema, result);
  const projectName = titleFromValues(doc.schema, doc.values);

  function setDocument(next: FormDocument) {
    setDirty(true);
    setDraft((current) => ({
      ...current,
      documents: { ...current.documents, [current.activeMode]: next },
    }));
  }

  function switchMode(next: EstimateMode) {
    setModeAndUrl(next);
  }

  function setModeAndUrl(next: EstimateMode) {
    setDraft((current) => ({ ...current, activeMode: next }));
    const href = next === "advance" ? advanceHref : standardHref;
    router.replace(href, { scroll: false });
  }

  function handlePrint() {
    const previous = document.title;
    document.title = estimatePrintTitle(projectName);
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  return (
    <>
      <div className="estimate-screen">
        <div className="estimate-no-print mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Estimator mode"
            className="grid grid-cols-2 rounded-md border border-line p-1"
          >
            {(
              [
                ["standard", "Standard MEP"],
                ["advance", "Advanced"],
              ] as const
            ).map(([id, label]) => {
              const selected = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`min-h-11 cursor-pointer rounded-md px-4 text-sm font-medium transition-colors ${
                    selected ? "bg-amber text-white" : "text-navy hover:bg-surface"
                  }`}
                  onClick={() => switchMode(id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors ${
                customize
                  ? "border-amber bg-amber text-white"
                  : "border-navy/20 text-navy hover:border-navy/40 hover:bg-surface"
              }`}
              onClick={() => setCustomize((value) => !value)}
            >
              {customize ? "Done customizing" : "Customize form"}
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-navy/20 px-4 text-sm font-medium text-navy transition-colors hover:border-navy/40 hover:bg-surface"
              onClick={handlePrint}
            >
              Print summary
            </button>
          </div>
        </div>

        <div className="estimate-no-print mt-4">
          <TemplateBar
            mode={mode}
            document={doc}
            result={result}
            projectName={projectName}
            dirty={dirty}
            onChange={setDocument}
            onResetDirty={() => setDirty(false)}
          />
        </div>

        <p className="mt-6 max-w-2xl text-sm text-graphite">
          {doc.schema.description}
        </p>

        {customize ? <SchemaEditor document={doc} onChange={setDocument} /> : null}

        <div className="mt-10 grid items-start gap-8 pb-36 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <SchemaForm
            document={doc}
            result={result}
            customize={customize}
            onChange={setDocument}
          />
          <div className="lg:sticky lg:top-24">
            <ResultsPanel schema={doc.schema} values={doc.values} result={result} />
            <div className="estimate-no-print mt-4 hidden lg:block">
              <GhostCta href={contactHref} className="w-full">
                Book a working session
              </GhostCta>
            </div>
          </div>
        </div>

        <MobileBidBar bid={bid} perSf={perSf} />
      </div>

      <PrintSummary
        schema={doc.schema}
        values={doc.values}
        result={result}
        printedAt={printedAt}
      />
    </>
  );
}
