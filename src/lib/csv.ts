const DEFAULT_CSV_MIME_TYPE = "text/csv;charset=utf-8;";

export function escapeCsvValue(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function buildDatedCsvFilename(prefix: string, date = new Date()): string {
  return `${prefix}-${date.toISOString().split("T")[0]}.csv`;
}

export function dateOnlyIsoString(date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function downloadCsvFile(
  headers: readonly string[],
  rows: ReadonlyArray<readonly unknown[]>,
  filename: string,
  mimeType = DEFAULT_CSV_MIME_TYPE
): void {
  if (headers.length === 0) return;

  const csvRows = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportRecordsToCsv(data: Array<Record<string, unknown>>, filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0] ?? {});
  const rows = data.map((row) => headers.map((header) => row[header]));
  downloadCsvFile(headers, rows, filename, "text/csv");
}
