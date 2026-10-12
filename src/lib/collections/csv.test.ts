import { describe, expect, it } from "vitest";
import { ageBucket, importAccountsCsv, parseAge, parseAmountToCents, parseCsv, parseDate } from "./csv";

const now = new Date(Date.UTC(2026, 9, 12));

describe("parseCsv", () => {
  it("handles quotes, escaped quotes, embedded commas and CRLF", () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\r\n')).toEqual([["a", "b"], ["x, y", 'say "hi"']]);
  });
  it("strips BOM and blank lines", () => {
    expect(parseCsv("\uFEFFa\n\n1\n")).toEqual([["a"], ["1"]]);
  });
});

describe("field parsers", () => {
  it("parses amounts", () => {
    expect(parseAmountToCents("$1,234.5")).toBe(123450);
    expect(parseAmountToCents("10")).toBe(1000);
    expect(parseAmountToCents("abc")).toBeNull();
    expect(parseAmountToCents("1.234")).toBeNull();
  });
  it("parses dates and rejects impossible ones", () => {
    expect(parseDate("2026-01-31")?.toISOString().slice(0, 10)).toBe("2026-01-31");
    expect(parseDate("2/3/2026")?.toISOString().slice(0, 10)).toBe("2026-02-03");
    expect(parseDate("2026-02-30")).toBeNull();
  });
  it("parses ages", () => {
    expect(parseAge("45")).toBe(45);
    expect(parseAge("6 months")).toBe(180);
    expect(parseAge("2 years")).toBe(730);
    expect(parseAge("soon")).toBeNull();
  });
  it("buckets ages", () => {
    expect(ageBucket(10)).toBe("0 to 30 days");
    expect(ageBucket(400)).toBe("1 to 3 years");
    expect(ageBucket(null)).toBe("Unknown");
  });
});

describe("importAccountsCsv", () => {
  it("imports valid rows with aliases and computes age from invoice date", () => {
    const csv = "Name,Company Name,Email,Amount Owed,Invoice Date,Notes\nAna,Acme LLC,ANA@acme.com,\"$1,200.00\",2026-09-12,Website build\n";
    const { accounts, errors } = importAccountsCsv(csv, now);
    expect(errors).toEqual([]);
    expect(accounts[0]).toMatchObject({ debtorName: "Ana", company: "Acme LLC", email: "ana@acme.com", amountCents: 120000, ageDays: 30, description: "Website build" });
  });
  it("accepts an age column instead of a date", () => {
    const { accounts } = importAccountsCsv("name,company,email,amount,age\nBo,Co Inc,bo@co.com,50,2 years\n", now);
    expect(accounts[0].ageDays).toBe(730);
    expect(accounts[0].invoiceDate).toBeNull();
  });
  it("reports row errors without dropping good rows", () => {
    const csv = "name,company,email,amount,age\nA,,a@x.com,10,5\nB,B Co,bad,0,5\nC,C Co,c@c.com,10,5\n";
    const { accounts, errors } = importAccountsCsv(csv, now);
    expect(accounts).toHaveLength(1);
    expect(errors.map((e) => e.row)).toEqual([2, 3]);
    expect(errors[0].message).toContain("company");
    expect(errors[1].message).toContain("email");
  });
  it("requires core columns and an age source", () => {
    expect(importAccountsCsv("name,email\nA,a@a.com\n", now).errors[0].message).toContain("company");
    expect(importAccountsCsv("name,company,email,amount\nA,B,a@a.com,1\n", now).errors[0].message).toContain("invoice_date");
  });
  it("rejects future invoice dates", () => {
    expect(importAccountsCsv("name,company,email,amount,invoice_date\nA,B,a@a.com,1,2027-01-01\n", now).errors[0].message).toContain("future");
  });
});
