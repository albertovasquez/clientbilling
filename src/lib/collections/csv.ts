/**
 * CSV import for collections accounts (decision 0020). Pure functions, no I/O,
 * so they are unit tested and reusable by a future API or MCP tool.
 */

export const MAX_IMPORT_ROWS = 500;
export const MAX_AMOUNT_CENTS = 100_000_000_00; // 100 million in the account currency

export type ParsedAccount = {
  debtorName: string;
  company: string;
  email: string;
  amountCents: number;
  invoiceDate: Date | null;
  ageDays: number | null;
  description: string | null;
};

export type RowError = { row: number; message: string };

export type ImportResult = { accounts: ParsedAccount[]; errors: RowError[] };

/** Accepted header spellings, normalized to lowercase with spaces and dashes as underscores. */
const headerAliases: Record<keyof ParsedAccount | "age", string[]> = {
  debtorName: ["name", "debtor", "debtor_name", "contact", "contact_name"],
  company: ["company", "business", "company_name", "business_name"],
  email: ["email", "email_address", "contact_email"],
  amountCents: ["amount", "amount_owed", "balance", "owed"],
  invoiceDate: ["invoice_date", "date", "due_date"],
  ageDays: ["age_days", "days_overdue", "days_past_due"],
  age: ["age"],
  description: ["description", "notes", "memo", "details"],
};

/** RFC 4180 style parser: quoted fields, escaped quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function parseAmountToCents(raw: string): number | null {
  const cleaned = raw.trim().replace(/[$,\s]/g, "").replace(/^USD/i, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, frac = ""] = cleaned.split(".");
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"));
}

/** Accepts YYYY-MM-DD or M/D/YYYY. Returns null for anything else or impossible dates. */
export function parseDate(raw: string): Date | null {
  const s = raw.trim();
  let y: number, m: number, d: number;
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else {
    match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    [m, d, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

/** "45", "45 days", "3 months", "2 years" to days. */
export function parseAge(raw: string): number | null {
  const match = raw.trim().toLowerCase().match(/^(\d+)\s*(d|day|days|m|mo|month|months|y|yr|year|years)?$/);
  if (!match) return null;
  const n = Number(match[1]);
  const unit = match[2] ?? "days";
  if (unit.startsWith("y")) return n * 365;
  if (unit.startsWith("m")) return n * 30;
  return n;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function daysSince(date: Date, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86_400_000));
}

export function importAccountsCsv(text: string, now: Date = new Date()): ImportResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { accounts: [], errors: [{ row: 0, message: "The file needs a header row and at least one account." }] };

  const headers = rows[0].map(normalizeHeader);
  const col = (key: keyof typeof headerAliases) => headers.findIndex((h) => headerAliases[key].includes(h));
  const idx = {
    debtorName: col("debtorName"),
    company: col("company"),
    email: col("email"),
    amount: col("amountCents"),
    invoiceDate: col("invoiceDate"),
    ageDays: col("ageDays") >= 0 ? col("ageDays") : col("age"),
    description: col("description"),
  };

  const missing = (["debtorName", "company", "email", "amount"] as const).filter((k) => idx[k] < 0);
  if (missing.length) {
    const labels = { debtorName: "name", company: "company", email: "email", amount: "amount" };
    return { accounts: [], errors: [{ row: 1, message: `Missing column: ${missing.map((m) => labels[m]).join(", ")}.` }] };
  }
  if (idx.invoiceDate < 0 && idx.ageDays < 0) {
    return { accounts: [], errors: [{ row: 1, message: "Add an invoice_date or age column so we know how old each debt is." }] };
  }
  if (rows.length - 1 > MAX_IMPORT_ROWS) {
    return { accounts: [], errors: [{ row: 0, message: `Import at most ${MAX_IMPORT_ROWS} accounts at a time.` }] };
  }

  const accounts: ParsedAccount[] = [];
  const errors: RowError[] = [];
  rows.slice(1).forEach((cells, i) => {
    const rowNum = i + 2; // 1-based, header is row 1
    const get = (j: number) => (j >= 0 ? (cells[j] ?? "").trim() : "");
    const debtorName = get(idx.debtorName).slice(0, 200);
    const company = get(idx.company).slice(0, 200);
    const email = get(idx.email).toLowerCase();
    const problems: string[] = [];
    if (!debtorName) problems.push("name is empty");
    if (!company) problems.push("company is empty (collections is business debts only)");
    if (!emailPattern.test(email)) problems.push("email is not valid");
    const amountCents = parseAmountToCents(get(idx.amount));
    if (amountCents === null || amountCents <= 0) problems.push("amount must be a positive number");
    else if (amountCents > MAX_AMOUNT_CENTS) problems.push("amount is too large");

    let invoiceDate: Date | null = null;
    let ageDays: number | null = null;
    const rawDate = get(idx.invoiceDate);
    const rawAge = get(idx.ageDays);
    if (rawDate) {
      invoiceDate = parseDate(rawDate);
      if (!invoiceDate) problems.push("invoice date must be YYYY-MM-DD or M/D/YYYY");
      else if (invoiceDate.getTime() > now.getTime()) problems.push("invoice date is in the future");
      else ageDays = daysSince(invoiceDate, now);
    } else if (rawAge) {
      ageDays = parseAge(rawAge);
      if (ageDays === null) problems.push("age must look like 45, 45 days, 6 months, or 2 years");
    } else {
      problems.push("needs an invoice date or an age");
    }

    if (problems.length) {
      errors.push({ row: rowNum, message: problems.join("; ") });
      return;
    }
    accounts.push({
      debtorName,
      company,
      email,
      amountCents: amountCents!,
      invoiceDate,
      ageDays,
      description: get(idx.description).slice(0, 2000) || null,
    });
  });
  return { accounts, errors };
}

/** Age bucket label used in the accounts list and, later, for playbook assignment. */
export function ageBucket(ageDays: number | null): string {
  if (ageDays === null) return "Unknown";
  if (ageDays <= 30) return "0 to 30 days";
  if (ageDays <= 90) return "31 to 90 days";
  if (ageDays <= 180) return "91 to 180 days";
  if (ageDays <= 365) return "181 to 365 days";
  if (ageDays <= 365 * 3) return "1 to 3 years";
  return "Over 3 years";
}
