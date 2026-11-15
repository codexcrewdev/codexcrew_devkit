import type { Metadata } from "next";
import TimestampWorkspace from "@/features/timestamp/components/TimestampWorkspace";

export const metadata: Metadata = {
  title: "Timestamp Converter | CodeXcrew DevKit",
  description:
    "Convert Unix timestamps to readable dates and dates to Unix timestamps. Supports seconds, milliseconds, UTC and local time.",
};

export default function TimestampConverterPage() {
  return <TimestampWorkspace />;
}