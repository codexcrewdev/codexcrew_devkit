import type { Metadata } from "next";
import UrlWorkspace from "@/features/encoding/components/UrlWorkspace";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder | CodeXcrew DevKit",
  description:
    "Encode and decode URLs and URL components instantly with CodeXcrew DevKit. Free, fast and private browser-based URL encoding.",
};

export default function UrlEncoderPage() {
  return <UrlWorkspace />;
}