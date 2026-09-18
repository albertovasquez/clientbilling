import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(alphabet, 12);

/** Public invoice id used in /i/[publicId]. Not sequential. */
export function newPublicInvoiceId(): string {
  return nano();
}
