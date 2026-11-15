
import type { Metadata } from "next";
import ApiWorkspace from "@/features/api-tester/components/ApiWorkspace";

export const metadata: Metadata = {
  title: "API Tester",
  description:
    "Test REST APIs with GET, POST, PUT, PATCH and DELETE requests. Inspect response bodies, headers, status codes and timing with CodeXcrew DevKit.",
};

export default function ApiTesterPage() {
  return <ApiWorkspace />;
}
