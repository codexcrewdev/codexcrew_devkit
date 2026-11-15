import type { LucideIcon } from "lucide-react";

export type ToolCategory =
  | "formatting"
  | "api"
  | "security"
  | "encoding"
  | "generators"
  | "converters";

export interface DevTool {
  id: string;
  name: string;
  description: string;
  href: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  featured?: boolean;
}