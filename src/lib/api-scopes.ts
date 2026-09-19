/**
 * API key scopes (decision 0026 / epic #34).
 */

export const API_SCOPES = [
  "invoice:read",
  "invoice:write",
  "invoice:send",
  "invoice:void",
  "reminder:send",
  "payment:read",
  "payment:record",
  "cost:read",
  "proof:read",
] as const;

export type ApiScope = (typeof API_SCOPES)[number];

export const ALL_SCOPES_STRING = API_SCOPES.join(" ");

export function parseScopes(raw: string | null | undefined): Set<ApiScope> {
  const out = new Set<ApiScope>();
  for (const part of (raw ?? "").split(/\s+/)) {
    if ((API_SCOPES as readonly string[]).includes(part)) out.add(part as ApiScope);
  }
  return out;
}

export function hasScope(scopes: Set<ApiScope>, required: ApiScope): boolean {
  return scopes.has(required);
}

export function scopeError(required: ApiScope): string {
  return `API key is missing scope ${required}`;
}
