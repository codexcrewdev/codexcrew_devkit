
import type { Metadata } from "next";
import Base64Workspace from "@/features/encoding/components/Base64Workspace";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder | CodeXcrew DevKit",
  description:
    "Encode and decode Base64 strings online with Unicode support. Free, fast and private browser-based Base64 utility.",
};

export default function Base64Page() {
  return <Base64Workspace />;
}
