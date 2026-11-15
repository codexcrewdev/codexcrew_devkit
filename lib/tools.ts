import {
  Braces,
  Code2,
  ShieldCheck,
  Fingerprint,
  Regex,
  Link,
  Binary,
  Hash,
  Clock,
  FileJson,
  Globe,
} from "lucide-react";

import type { DevTool, ToolCategory } from "@/types/tool";

export const categories: {
  id: ToolCategory;
  name: string;
  description: string;
}[] = [
  {
    id: "formatting",
    name: "Formatting",
    description: "Format, validate and organize your data.",
  },
  {
    id: "api",
    name: "API Development",
    description: "Build and test API requests.",
  },
  {
    id: "security",
    name: "Security",
    description: "Inspect tokens and generate secure hashes.",
  },
  {
    id: "encoding",
    name: "Encoding",
    description: "Encode and decode common data formats.",
  },
  {
    id: "generators",
    name: "Generators",
    description: "Generate useful developer values.",
  },
  {
    id: "converters",
    name: "Converters",
    description: "Convert data between different formats.",
  },
];

export const tools: DevTool[] = [
  {
    id: "json",
    name: "JSON Toolkit",
    description: "Format, validate and minify JSON data.",
    href: "/tools/json",
    category: "formatting",
    icon: Braces,
    keywords: ["json", "formatter", "validator", "minifier", "beautify"],
    featured: true,
  },
  {
    id: "api-tester",
    name: "API Tester",
    description: "Send HTTP requests and inspect API responses.",
    href: "/tools/api-tester",
    category: "api",
    icon: Globe,
    keywords: ["api", "http", "rest", "get", "post", "request"],
    featured: true,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JWT header and payload.",
    href: "/tools/jwt-decoder",
    category: "security",
    icon: ShieldCheck,
    keywords: ["jwt", "token", "decode", "authentication"],
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA hashes from text.",
    href: "/tools/hash-generator",
    category: "security",
    icon: Fingerprint,
    keywords: ["hash", "sha256", "sha384", "sha512", "crypto"],
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions against sample text.",
    href: "/tools/regex-tester",
    category: "formatting",
    icon: Regex,
    keywords: ["regex", "regexp", "regular expression", "pattern"],
  },
  {
    id: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Encode and decode URL components.",
    href: "/tools/url-encoder",
    category: "encoding",
    icon: Link,
    keywords: ["url", "uri", "encode", "decode", "percent encoding"],
  },
  {
    id: "base64",
    name: "Base64 Converter",
    description: "Encode and decode Base64 strings.",
    href: "/tools/base64",
    category: "encoding",
    icon: Binary,
    keywords: ["base64", "encode", "decode", "binary"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique UUID v4 identifiers.",
    href: "/tools/uuid-generator",
    category: "generators",
    icon: Hash,
    keywords: ["uuid", "guid", "unique id", "identifier"],
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps into readable dates.",
    href: "/tools/timestamp-converter",
    category: "converters",
    icon: Clock,
    keywords: ["timestamp", "unix", "epoch", "date", "time"],
  },
  {
    id: "csv-json",
    name: "CSV / JSON Converter",
    description: "Convert CSV data to JSON and JSON to CSV.",
    href: "/tools/csv-json",
    category: "converters",
    icon: FileJson,
    keywords: ["csv", "json", "convert", "spreadsheet", "data"],
    featured: true,
  },
];

export function getToolById(id: string) {
  return tools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function searchTools(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return tools;

  return tools.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}