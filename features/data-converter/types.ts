
export type ConversionMode = "csv-to-json" | "json-to-csv";

export type CsvDelimiter = "auto" | "," | ";" | "\t" | "|";

export interface ConversionResult {
  output: string;
  rows: number;
  columns: number;
  mode: ConversionMode;
}
