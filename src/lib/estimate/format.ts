const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const hoursFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

export function formatUsd(value: number, whole = false): string {
  return (whole ? usdWhole : usd).format(value);
}

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

export function formatHours(value: number): string {
  const rounded = Math.abs(value - Math.round(value)) < 1e-9 ? Math.round(value) : value;
  return `${hoursFmt.format(rounded)} hr`;
}

export function formatPerSf(value: number): string {
  return `${usd.format(value)}/SF`;
}

export function formatFactor(value: number): string {
  return `×${value.toFixed(2).replace(/\.?0+$/, "") || "0"}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function parseEstimateMode(raw?: string | null): "standard" | "advance" {
  if (raw === "advance" || raw === "advanced") return "advance";
  return "standard";
}

export function formatEstimateValue(
  format: "usd" | "hours" | "perSf" | "number" | "text" | "percent" | "factor" | "boolean" | undefined,
  value: unknown,
): string {
  if (value == null) return "—";
  if (format === "usd" && typeof value === "number") return formatUsd(value);
  if (format === "hours" && typeof value === "number") return formatHours(value);
  if (format === "perSf" && typeof value === "number") return formatPerSf(value);
  if (format === "factor" && typeof value === "number") return formatFactor(value);
  if (format === "percent" && typeof value === "number") return formatPercent(value);
  if (format === "number" && typeof value === "number") return formatNumber(value);
  if (format === "boolean") return value ? "Yes" : "No";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return formatNumber(value);
  return String(value);
}

export function estimatePrintTitle(projectName: string): string {
  const slug = (projectName.trim() || "Untitled")
    .replace(/[^a-zA-Z0-9\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return `${slug || "Untitled"}-BIM-estimate`;
}
