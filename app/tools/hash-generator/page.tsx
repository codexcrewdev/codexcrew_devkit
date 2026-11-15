import type { Metadata } from "next";
import HashWorkspace from "@/features/hash/components/HashWorkspace";

export const metadata: Metadata = {
  title: "Hash Generator",
  description:
    "Generate SHA-256, SHA-384 and SHA-512 hashes instantly. A free online hash generator by CodeXcrew DevKit.",
};

export default function HashGeneratorPage() {
  return <HashWorkspace />;
}