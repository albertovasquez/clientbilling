import { AsyncLocalStorage } from "node:async_hooks";
import type { ApiAuth } from "@/lib/api-keys";

export type McpAuth = Extract<ApiAuth, { ok: true }>;

/** Request-scoped API auth for MCP tool handlers. */
export const mcpAuthStore = new AsyncLocalStorage<McpAuth>();

export function requireMcpAuth(): McpAuth {
  const auth = mcpAuthStore.getStore();
  if (!auth) throw new Error("MCP request is not authenticated");
  return auth;
}
