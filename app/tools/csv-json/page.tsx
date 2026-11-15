
import type { Metadata } from "next";
import CsvJsonWorkspace from "@/features/data-converter/components/CsvJsonWorkspace";

export const metadata: Metadata = {
  title: "CSV to JSON Converter | CodeXcrew DevKit",
  description:
    "Convert CSV to JSON and JSON to CSV instantly. Free online data converter with delimiter support and local browser processing.",
};

export default function CsvJsonPage() {
  return <CsvJsonWorkspace />;
}
