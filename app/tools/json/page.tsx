
import type { Metadata } from "next";
import JsonWorkspace from "@/features/json/components/JsonWorkspace";

export const metadata: Metadata = {
  title: "JSON Formatter, Validator & Minifier",
  description:
    "Free online JSON formatter, validator and minifier. Process JSON securely in your browser with CodeXcrew DevKit.",
};

export default function JsonToolPage() {
  return <JsonWorkspace />;
}
