import type { Metadata } from "next";
import UuidWorkspace from "@/features/uuid/components/UuidWorkspace";

export const metadata: Metadata = {
  title: "UUID Generator | CodeXcrew DevKit",
  description:
    "Generate secure UUID v4 identifiers in bulk and validate UUID formats with CodeXcrew DevKit. Free, fast and browser-based.",
};

export default function UuidGeneratorPage() {
  return <UuidWorkspace />;
}