import { createMcpHandler } from "mcp-handler";
import { authenticateApiRequest } from "@/lib/api-keys";
import { apiError } from "@/lib/api-response";
import { mcpAuthStore } from "@/lib/mcp/auth-context";
import { registerInvoiceTools } from "@/lib/mcp/tools";

/**
 * Remote MCP endpoint (decision 0027). Authenticate with the same Bearer API
 * keys as /api/v1. Tools call the shared invoice services.
 */
const mcpHandler = createMcpHandler(
  (server) => {
    registerInvoiceTools(server);
  },
  {
    serverInfo: { name: "clientbilling", version: "1.0.0" },
  },
);

async function handle(req: Request): Promise<Response> {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return apiError(auth.status, auth.error);
  return mcpAuthStore.run(auth, () => mcpHandler(req));
}

export { handle as GET, handle as POST, handle as DELETE };
