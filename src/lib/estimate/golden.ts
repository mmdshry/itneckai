import type { CellObject, WorkBook } from "xlsx";
import { calculateAdvance } from "./advance";
import { defaultAdvanceInputs, defaultStandardInputs } from "./defaults";
import { evaluateDocument, engineNumber, engineText } from "./engine";
import {
  RESULTS_SHEET,
  SCHEMA_MARKER,
  SCHEMA_SHEET,
  a1,
  formulaToExcel,
  quoteSheetName,
} from "./excelFormula";
import { buildEstimateWorkbookData, buildInputListValidationsXml, rowContext, scalarContext } from "./export";
import { factoryDocument } from "./factory";
import { parseEstimateWorkbook } from "./importExcel";
import { asRowArray } from "./schema";
import { calculateStandard } from "./standard";

function close(actual: number, expected: number, label: string, eps = 1e-6) {
  if (Math.abs(actual - expected) > eps) {
    throw new Error(`${label}: got ${actual}, expected ${expected}`);
  }
}

function eq(actual: string, expected: string, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: got "${actual}", expected "${expected}"`);
  }
}

export function runGoldenChecks() {
  const standardDoc = factoryDocument("standard");
  const standard = evaluateDocument(standardDoc);
  if (Object.keys(standard.errors).length) {
    throw new Error(`Standard formulas: ${JSON.stringify(standard.errors)}`);
  }
  const oracle = calculateStandard(defaultStandardInputs);
  close(engineNumber(standard, "recommendedBid"), oracle.recommendedBid, "standard bid");
  close(engineNumber(standard, "estimatedHours"), oracle.estimatedHours, "standard hours");
  close(engineNumber(standard, "totalPerSf"), oracle.totalPerSf, "standard $/SF");
  close(engineNumber(standard, "laborExpense"), oracle.laborExpense, "labor expense");
  eq(engineText(standard, "pmGuardrail"), oracle.pmGuardrail, "guardrail");
  eq(engineText(standard, "confidence"), oracle.confidence, "confidence");

  const electrical = factoryDocument("standard");
  const trades = asRowArray(electrical.values.trades).map((row) =>
    row.name === "Electrical" ? { ...row, included: true } : row,
  );
  electrical.values.trades = trades;
  const electricalResult = evaluateDocument(electrical);
  const electricalOracle = calculateStandard({
    ...defaultStandardInputs,
    included: { ...defaultStandardInputs.included, Electrical: "Yes" },
  });
  close(
    engineNumber(electricalResult, "recommendedBid"),
    electricalOracle.recommendedBid,
    "electrical bid",
  );

  const escalate = factoryDocument("standard");
  escalate.values.complexity = "High";
  const escalateResult = evaluateDocument(escalate);
  const escalateOracle = calculateStandard({
    ...defaultStandardInputs,
    complexity: "High",
  });
  close(engineNumber(escalateResult, "recommendedBid"), escalateOracle.recommendedBid, "high bid");
  eq(engineText(escalateResult, "pmGuardrail"), escalateOracle.pmGuardrail, "high guardrail");

  const advanceDoc = factoryDocument("advance");
  const advance = evaluateDocument(advanceDoc);
  if (Object.keys(advance.errors).length) {
    throw new Error(`Advance formulas: ${JSON.stringify(advance.errors)}`);
  }
  const advanceOracle = calculateAdvance(defaultAdvanceInputs);
  close(engineNumber(advance, "grandTotal"), advanceOracle.grandTotal, "advance total");
  close(engineNumber(advance, "totalHours"), advanceOracle.totalHours, "advance hours");
  close(engineNumber(advance, "modelingTotal"), advanceOracle.modelingTotal, "modeling");
  close(engineNumber(advance, "coordinationTotal"), advanceOracle.coordinationTotal, "coordination");
  close(engineNumber(advance, "blendedRate"), advanceOracle.blendedRate, "blended rate");

  runExcelExportChecks();
}

function workbookFromData(data: ReturnType<typeof buildEstimateWorkbookData>): WorkBook {
  return {
    SheetNames: data.sheets.map((sheet) => sheet.name),
    Sheets: Object.fromEntries(data.sheets.map((sheet) => [sheet.name, sheet.ws])),
    Workbook: { Names: data.names },
  };
}

function runExcelExportChecks() {
  const doc = factoryDocument("standard");
  const result = evaluateDocument(doc);
  const data = buildEstimateWorkbookData(doc, result, {
    id: "check",
    name: "check",
    kind: "quote",
    savedAt: new Date().toISOString(),
    sourceMode: "standard",
    schema: doc.schema,
    values: doc.values,
  });
  const bidRow = data.layout.resultRows.recommendedBid;
  if (!bidRow) throw new Error("recommendedBid missing from Results");
  const results = data.sheets.find((sheet) => sheet.name === RESULTS_SHEET)?.ws;
  const bid = results?.[a1(1, bidRow)] as CellObject | undefined;
  if (!bid?.f) throw new Error("recommendedBid has no Excel formula");
  if (!/^SUM\(/i.test(bid.f)) throw new Error(`recommendedBid formula: ${bid.f}`);
  close(typeof bid.v === "number" ? bid.v : NaN, engineNumber(result, "recommendedBid"), "xlsx cached bid");

  const spec = data.layout.repeaters.trades;
  const ctx = scalarContext(data.layout);
  const col = a1(spec.colIndex.price, spec.firstDataRow).replace(/\d+$/, "");
  const expectedSum = `SUM(${quoteSheetName(spec.sheet)}!${col}${spec.firstDataRow}:${col}${spec.lastDataRow})`;
  eq(formulaToExcel("SUM(trades.price)", ctx), expectedSum, "SUM trades.price");

  const rowFormula = formulaToExcel(
    "IF(included, basePerSf * combinedFactor, 0)",
    rowContext(data.layout, "trades", spec.firstDataRow),
  );
  if (!rowFormula.includes(a1(spec.colIndex.included, spec.firstDataRow))) {
    throw new Error(`row formula missing included: ${rowFormula}`);
  }
  if (!rowFormula.includes("combinedFactor")) {
    throw new Error(`row formula missing combinedFactor: ${rowFormula}`);
  }

  const guard = formulaToExcel(
    'IF(OR(AND(lod.id == "350", complexity.id == "High"), COUNTIF(trades.included, true) >= 3), "Escalate to PM", "Sales can price")',
    ctx,
  );
  if (!guard.includes("lod_id") || !guard.includes("COUNTIF(")) {
    throw new Error(`guardrail translation: ${guard}`);
  }

  const schemaSheet = data.sheets.find((sheet) => sheet.name === SCHEMA_SHEET)?.ws;
  const marker = schemaSheet?.A1 as CellObject | undefined;
  eq(String(marker?.v ?? ""), SCHEMA_MARKER, "schema marker");

  const imported = parseEstimateWorkbook(workbookFromData(data), doc);
  if (!imported?.values) throw new Error("xlsx import failed");
  eq(imported.id, "check", "schema json roundtrip");
  close(Number(imported.values.squareFootage), Number(doc.values.squareFootage), "import SF");
  const importedTrades = asRowArray(imported.values.trades);
  const originalTrades = asRowArray(doc.values.trades);
  eq(String(importedTrades.length), String(originalTrades.length), "import trade count");
  eq(String(importedTrades[0]?.name ?? ""), String(originalTrades[0]?.name ?? ""), "import first trade");
  eq(String(imported.values.lod ?? ""), String(doc.values.lod ?? ""), "import lod");
  if (importedTrades.find((row) => row.name === "Plumbing")?.included !== true) {
    throw new Error("import plumbing included");
  }

  const tradesWs = data.sheets.find((sheet) => sheet.name === spec.sheet)?.ws;
  const padRow = spec.firstDataRow + spec.dataCount;
  const hoursPad = tradesWs?.[a1(spec.colIndex.hours, padRow)] as CellObject | undefined;
  if (hoursPad?.t !== "n" || hoursPad.v !== 0 || !hoursPad.f) {
    throw new Error(`pad hours cache: ${JSON.stringify(hoursPad)}`);
  }
  const pricePad = tradesWs?.[a1(spec.colIndex.price, padRow)] as CellObject | undefined;
  if (pricePad?.t !== "n" || pricePad.v !== 0 || !pricePad.f) {
    throw new Error(`pad price cache: ${JSON.stringify(pricePad)}`);
  }

  const lists = buildInputListValidationsXml(data.layout);
  if (!lists.includes('type="list"')) throw new Error("select list validation missing");
  const lodSqref = `sqref="${a1(1, data.layout.inputRows.lod)}"`;
  if (!lists.includes(lodSqref)) throw new Error(`lod dropdown ${lists}`);
  if (!lists.includes("Lookups!")) throw new Error("lookup list range missing");

  const sfCell = data.sheets.find((sheet) => sheet.name === "Inputs")?.ws?.[
    a1(1, data.layout.inputRows.squareFootage)
  ] as CellObject | undefined;
  eq(String(sfCell?.z ?? ""), "#,##0", "SF number format");

  for (const field of doc.schema.fields) {
    if (field.type === "computed" && field.formula) {
      const cell = results?.[a1(1, data.layout.resultRows[field.id])] as CellObject | undefined;
      if (!cell?.f) throw new Error(`${field.id} has no Excel formula`);
      formulaToExcel(field.formula, ctx);
    }
    if (field.type === "repeater") {
      for (const item of field.itemFields ?? []) {
        if (item.type !== "computed" || !item.formula) continue;
        formulaToExcel(item.formula, rowContext(data.layout, field.id, spec.firstDataRow));
      }
    }
  }

  const guardField = doc.schema.fields.find((field) => field.id === "pmGuardrail");
  if (!guardField?.formula) throw new Error("pmGuardrail formula missing");
  const factoryGuard = formulaToExcel(guardField.formula, ctx);
  if (!factoryGuard.includes("lod_id") || !factoryGuard.includes("COUNTIF(")) {
    throw new Error(`factory guardrail translation: ${factoryGuard}`);
  }

  const mutated = workbookFromData(data);
  const sfRow = data.layout.inputRows.squareFootage;
  mutated.Sheets.Inputs[a1(1, sfRow)] = { t: "n", v: 12000 };
  const edited = parseEstimateWorkbook(mutated, doc);
  close(Number(edited?.values?.squareFootage), 12000, "import edited SF");
  const editedDoc = { schema: imported.schema, values: edited?.values ?? imported.values };
  close(engineNumber(evaluateDocument(editedDoc), "recommendedBid"), 3532.8 * (12000 / 8000), "recalc after SF import", 0.05);

  const advanceDoc = factoryDocument("advance");
  const advanceResult = evaluateDocument(advanceDoc);
  const advanceData = buildEstimateWorkbookData(advanceDoc, advanceResult, {
    id: "adv",
    name: "adv",
    kind: "quote",
    savedAt: new Date().toISOString(),
    sourceMode: "advance",
    schema: advanceDoc.schema,
    values: advanceDoc.values,
  });
  const totalRow = advanceData.layout.resultRows.grandTotal;
  const advanceResults = advanceData.sheets.find((sheet) => sheet.name === RESULTS_SHEET)?.ws;
  const total = advanceResults?.[a1(1, totalRow)] as CellObject | undefined;
  if (!total?.f) throw new Error("grandTotal has no Excel formula");
  close(
    typeof total.v === "number" ? total.v : NaN,
    engineNumber(advanceResult, "grandTotal"),
    "xlsx cached advance total",
  );
  const advanceCtx = scalarContext(advanceData.layout);
  for (const field of advanceDoc.schema.fields) {
    if (field.type === "computed" && field.formula) {
      const cell = advanceResults?.[a1(1, advanceData.layout.resultRows[field.id])] as
        | CellObject
        | undefined;
      if (!cell?.f) throw new Error(`advance ${field.id} has no Excel formula`);
      formulaToExcel(field.formula, advanceCtx);
    }
  }
  const advanceImported = parseEstimateWorkbook(workbookFromData(advanceData), advanceDoc);
  eq(advanceImported?.id ?? "", "adv", "advance schema json roundtrip");
  close(
    Number(advanceImported?.values?.squareFootage),
    Number(advanceDoc.values.squareFootage),
    "advance import SF",
  );

  const advanceTrades = advanceData.layout.repeaters.trades;
  const advanceTradesWs = advanceData.sheets.find((sheet) => sheet.name === advanceTrades.sheet)?.ws;
  const advancePad = advanceTrades.firstDataRow + advanceTrades.dataCount;
  const advanceHoursPad = advanceTradesWs?.[a1(advanceTrades.colIndex.hours, advancePad)] as
    | CellObject
    | undefined;
  if (advanceHoursPad?.t !== "n" || advanceHoursPad.v !== 0 || !advanceHoursPad.f) {
    throw new Error(`advance pad hours cache: ${JSON.stringify(advanceHoursPad)}`);
  }
  const hoursPerSf = advanceTradesWs?.[a1(advanceTrades.colIndex.hoursPerSf, advanceTrades.firstDataRow)] as
    | CellObject
    | undefined;
  eq(String(hoursPerSf?.z ?? ""), "0.0000", "hours/SF format");
  const meetingRate = advanceData.sheets.find((sheet) => sheet.name === "Inputs")?.ws?.[
    a1(1, advanceData.layout.inputRows.meetingRate)
  ] as CellObject | undefined;
  eq(String(meetingRate?.z ?? ""), "$#,##0.00", "meeting rate format");
  const advanceLists = buildInputListValidationsXml(advanceData.layout);
  if (!advanceLists.includes(`sqref="${a1(1, advanceData.layout.inputRows.lod)}"`)) {
    throw new Error(`advance lod dropdown ${advanceLists}`);
  }
}
