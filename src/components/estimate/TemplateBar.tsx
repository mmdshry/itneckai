"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  downloadExcel,
  downloadJson,
  excelFileName,
  templateFileName,
} from "@/lib/estimate/export";
import { isExcelFile, parseEstimateWorkbook } from "@/lib/estimate/importExcel";
import type { EngineResult } from "@/lib/estimate/engine";
import {
  factoryForMode,
  loadTemplates,
  newTemplateId,
  parseImportedTemplate,
  saveTemplates,
  type SavedTemplate,
  type TemplateKind,
} from "@/lib/estimate/storage";
import {
  clearedValues,
  cloneJson,
  mergeRateCardValues,
  schemaWithValueDefaults,
  type EstimateMode,
  type FormDocument,
} from "@/lib/estimate/schema";
import { inputClass } from "./fields";

type SaveDestination = "browser" | "device";

export function TemplateBar({
  mode,
  document: doc,
  result,
  projectName,
  dirty,
  onChange,
  onResetDirty,
}: {
  mode: EstimateMode;
  document: FormDocument;
  result: EngineResult;
  projectName: string;
  dirty: boolean;
  onChange: (next: FormDocument) => void;
  onResetDirty: () => void;
}) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<TemplateKind>("quote");
  const [destination, setDestination] = useState<SaveDestination>("browser");
  const [fileError, setFileError] = useState("");
  const [exporting, setExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(
    () => [...templates].sort((a, b) => b.savedAt.localeCompare(a.savedAt)),
    [templates],
  );

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  function persist(next: SavedTemplate[]) {
    setTemplates(next);
    saveTemplates(next);
  }

  function confirmReplace(): boolean {
    if (!dirty) return true;
    return window.confirm("Replace the current form? Unsaved edits stay in this browser draft only if you cancel.");
  }

  function makeTemplate(trimmed: string): SavedTemplate {
    return {
      id: newTemplateId(),
      name: trimmed,
      kind,
      savedAt: new Date().toISOString(),
      sourceMode: mode,
      schema:
        kind === "rate-card"
          ? schemaWithValueDefaults(doc.schema, doc.values)
          : cloneJson(doc.schema),
      values: kind === "quote" ? cloneJson(doc.values) : undefined,
    };
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const template = makeTemplate(trimmed);
    if (destination === "device") {
      downloadJson(templateFileName(trimmed, kind), template);
    } else {
      persist([template, ...templates]);
    }
    setName("");
    setSaveOpen(false);
    onResetDirty();
  }

  function handleLoad(template: SavedTemplate) {
    if (!confirmReplace()) return;
    if (template.kind === "quote" && template.values) {
      onChange({ schema: cloneJson(template.schema), values: cloneJson(template.values) });
    } else {
      const schema = cloneJson(template.schema);
      onChange({ schema, values: mergeRateCardValues(schema, doc.values) });
    }
    setLoadOpen(false);
    setFileError("");
    onResetDirty();
  }

  async function handleOpenFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      let template: SavedTemplate | null = null;
      if (isExcelFile(file)) {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
        template = parseEstimateWorkbook(workbook, doc);
      } else {
        template = parseImportedTemplate(JSON.parse(await file.text()) as unknown);
      }
      if (!template) {
        setFileError("That file is not a valid estimate template.");
        return;
      }
      handleLoad(template);
    } catch {
      setFileError("That file could not be opened.");
    }
  }

  function handleReset() {
    if (!window.confirm("Reset this tab to the factory Excel model?")) return;
    onChange(factoryForMode(mode));
    onResetDirty();
  }

  function handleClear() {
    if (!window.confirm("Clear project values? Trades and formulas stay.")) return;
    onChange({ schema: doc.schema, values: clearedValues(doc.schema) });
  }

  async function handleExportExcel() {
    if (exporting) return;
    setExporting(true);
    try {
      await downloadExcel(excelFileName(projectName), doc, result, {
        id: newTemplateId(),
        name: projectName.trim() || doc.schema.name,
        kind: "quote",
        savedAt: new Date().toISOString(),
        sourceMode: mode,
        schema: cloneJson(doc.schema),
        values: cloneJson(doc.values),
      });
    } catch (error) {
      console.error(error);
      window.alert("Could not export Excel. Try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="estimate-no-print flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
        onClick={() => setSaveOpen((open) => !open)}
      >
        Save template
      </button>
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
        onClick={() => {
          setLoadOpen((open) => !open);
          setFileError("");
        }}
      >
        Load
      </button>
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
        onClick={() => void handleExportExcel()}
        disabled={exporting}
      >
        {exporting ? "Exporting…" : "Export Excel"}
      </button>
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        type="button"
        className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
        onClick={handleClear}
      >
        Clear
      </button>

      {saveOpen ? (
        <div className="w-full rounded-md border border-line bg-page p-4">
          <p className="text-sm font-medium text-navy">Save as template</p>
          <input
            className={`mt-2 ${inputClass}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Template name"
          />
          <fieldset className="mt-3 grid gap-2 text-sm text-navy">
            <legend className="sr-only">Template type</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tpl-kind"
                checked={kind === "quote"}
                onChange={() => setKind("quote")}
              />
              Quote — schema and filled values
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tpl-kind"
                checked={kind === "rate-card"}
                onChange={() => setKind("rate-card")}
              />
              Rate card — trades, options, and formulas only
            </label>
          </fieldset>
          <fieldset className="mt-3 grid gap-2 text-sm text-navy">
            <legend className="text-sm font-medium text-navy">Save to</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tpl-dest"
                checked={destination === "browser"}
                onChange={() => setDestination("browser")}
              />
              This browser
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tpl-dest"
                checked={destination === "device"}
                onChange={() => setDestination("device")}
              />
              This device — download JSON
            </label>
          </fieldset>
          <button
            type="button"
            className="mt-3 min-h-11 cursor-pointer rounded-md bg-amber px-4 text-sm font-medium text-white"
            onClick={handleSave}
          >
            {destination === "device" ? "Download JSON" : "Save to this browser"}
          </button>
        </div>
      ) : null}

      {loadOpen ? (
        <div className="w-full rounded-md border border-line bg-page p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-navy">Saved templates</p>
            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-md border border-navy/20 px-3 text-sm font-medium text-navy hover:bg-surface"
              onClick={() => fileRef.current?.click()}
            >
              Open file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,.xlsx,.xlsm,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              onChange={(event) => void handleOpenFile(event)}
            />
          </div>
          {fileError ? <p className="mt-2 text-sm text-red-600">{fileError}</p> : null}
          {sorted.length === 0 ? (
            <p className="mt-2 text-sm text-graphite">No templates in this browser yet.</p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {sorted.map((template) => (
                <li
                  key={template.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{template.name}</p>
                    <p className="text-xs text-graphite">
                      {template.kind === "quote" ? "Quote" : "Rate card"} ·{" "}
                      {new Date(template.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="cursor-pointer text-sm font-medium text-navy underline-offset-2 hover:underline"
                      onClick={() => handleLoad(template)}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-red-600"
                      onClick={() => persist(templates.filter((item) => item.id !== template.id))}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
