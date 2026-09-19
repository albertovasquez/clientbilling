import { createHash, randomBytes } from "node:crypto";

/**
 * Billing event hashes (decision 0025). Matches the research formula:
 * payloadHash = SHA256(nonce, canonical); eventHash = SHA256(previous, payload, sequence).
 */

export function sha256Hex(parts: string[]): string {
  const h = createHash("sha256");
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) h.update("\n");
    h.update(parts[i]!, "utf8");
  }
  return h.digest("hex");
}

export function newNonce(): string {
  return randomBytes(16).toString("base64url");
}

export function payloadHash(nonce: string, canonical: string): string {
  return sha256Hex([nonce, canonical]);
}

export function eventHash(previousHash: string, payload: string, sequence: number): string {
  return sha256Hex([previousHash, payload, String(sequence)]);
}
