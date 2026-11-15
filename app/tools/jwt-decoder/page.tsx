import type { Metadata } from "next";
import JwtDecoder from "@/features/jwt/components/JwtDecoder";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode JSON Web Tokens and inspect JWT headers, payloads, registered claims, and timestamps with CodeXcrew DevKit. Process tokens locally in your browser.",
};

export default function JwtDecoderPage() {
  return <JwtDecoder />;
}