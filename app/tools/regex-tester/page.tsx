import type { Metadata } from "next";
import RegexWorkspace from "@/features/regex/components/RegexWorkspace";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test regular expressions with live match highlighting, capture groups and detailed results using CodeXcrew DevKit.",
};

export default function RegexTesterPage() {
  return <RegexWorkspace />;
}