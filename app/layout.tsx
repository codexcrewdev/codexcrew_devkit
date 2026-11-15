
import type { Metadata, Viewport } from "next";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "CodeXcrew DevKit — Developer Tools. Simplified.",
    template: "%s | CodeXcrew DevKit",
  },
  description:
    "A free collection of practical developer tools. Format JSON, test APIs, decode JWTs, generate hashes and more.",
  applicationName: "CodeXcrew DevKit",
  keywords: [
    "developer tools",
    "JSON formatter",
    "API tester",
    "JWT decoder",
    "hash generator",
    "regex tester",
    "Base64 converter",
    "CSV JSON converter",
  ],
  authors: [{ name: "CodeXcrew" }],
  creator: "CodeXcrew",
  metadataBase: new URL("https://devkit.codexcrew.in"),
  openGraph: {
    title: "CodeXcrew DevKit",
    description: "Developer tools. Simplified.",
    siteName: "CodeXcrew DevKit",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
