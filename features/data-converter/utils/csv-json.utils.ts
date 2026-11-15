
import Papa from "papaparse";
import type { CsvDelimiter, ConversionResult } from "../types";

export function convertCsvToJson(
  input: string,
  delimiter: CsvDelimiter
): ConversionResult {
  if (!input.trim()) {
    throw new Error("Please enter CSV data before converting.");
  }

  const parsed = Papa.parse<Record<string, string>>(input, {
    header: true,
    delimiter: delimiter === "auto" ? "" : delimiter,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(
      `CSV parsing error: ${firstError.message} (row ${firstError.row ?? 0}).`
    );
  }

  const fields = parsed.meta.fields ?? [];

  if (fields.length === 0) {
    throw new Error("No CSV headers found. Add a header row first.");
  }

  if (fields.some((field) => !field.trim())) {
    throw new Error("CSV contains an empty column header.");
  }

  if (new Set(fields).size !== fields.length) {
    throw new Error("CSV contains duplicate column headers.");
  }

  if (parsed.data.length === 0) {
    throw new Error("No CSV data rows found.");
  }

  return {
    output: JSON.stringify(parsed.data, null, 2),
    rows: parsed.data.length,
    columns: fields.length,
    mode: "csv-to-json",
  };
}

export function convertJsonToCsv(input: string): ConversionResult {
  if (!input.trim()) {
    throw new Error("Please enter JSON data before converting.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Invalid JSON: ${error.message}`
        : "Unable to parse JSON."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON input must be an array of objects.");
  }

  if (parsed.length === 0) {
    throw new Error("The JSON array is empty.");
  }

  if (
    !parsed.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item)
    )
  ) {
    throw new Error(
      "Every item in the JSON array must be an object."
    );
  }

  const records = parsed as Record<string, unknown>[];

  const headers = Array.from(
    new Set(records.flatMap((record) => Object.keys(record)))
  );

  if (headers.length === 0) {
    throw new Error("No object properties found to create CSV columns.");
  }

  const csv = Papa.unparse(records, {
    columns: headers,
    header: true,
    skipEmptyLines: true,
  });

  return {
    output: csv,
    rows: records.length,
    columns: headers.length,
    mode: "json-to-csv",
  };
}
