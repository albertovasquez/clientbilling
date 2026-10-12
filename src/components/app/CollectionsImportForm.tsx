"use client";

import { useActionState } from "react";
import { importAccountsAction, type ImportState } from "@/app/app/collections-actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";

const initial: ImportState = {};

export function CollectionsImportForm() {
  const [state, formAction, pending] = useActionState(importAccountsAction, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-1.5">
        <Label htmlFor="file">CSV file</Label>
        <Input id="file" name="file" type="file" accept=".csv,text/csv" />
        <p className="text-small text-ink-soft">
          Columns: name, company, email, amount, and either invoice_date (YYYY-MM-DD) or age (for example 90 days or 2 years).
          Description is optional. Up to 500 rows.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="csvText">Or paste CSV</Label>
        <Textarea
          id="csvText"
          name="csvText"
          rows={4}
          placeholder={"name,company,email,amount,invoice_date,description\nAna Ruiz,Acme LLC,ana@acme.com,1200,2026-06-30,Website build"}
        />
      </div>
      <label className="flex items-start gap-3 text-small">
        <input type="checkbox" name="businessDebtAttest" required className="mt-1" />
        <span>
          I confirm every account is a business debt: money a company owes my business for goods or services. No personal,
          family, or household debts.
        </span>
      </label>

      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.imported ? (
        <Alert>
          <AlertDescription>
            Imported {state.imported} account{state.imported === 1 ? "" : "s"}. Answer the questions on each one next.
          </AlertDescription>
        </Alert>
      ) : null}
      {state.rowErrors?.length ? (
        <div className="text-small text-ink-soft">
          <p className="font-semibold text-ink">Skipped rows</p>
          <ul className="mt-1 list-disc pl-5">
            {state.rowErrors.slice(0, 50).map((e) => (
              <li key={e.row}>
                Row {e.row}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Importing" : "Import accounts"}
      </Button>
    </form>
  );
}
