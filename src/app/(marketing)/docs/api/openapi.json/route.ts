import { readFileSync } from "node:fs";
import path from "node:path";

/** Serves the hand-maintained OpenAPI 3.1 document (decision 0026). */
export async function GET() {
  const file = path.join(process.cwd(), "docs/agents/openapi-v1.json");
  const body = readFileSync(file, "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
