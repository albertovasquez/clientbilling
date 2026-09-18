import { setInvoiceStatusAction } from "@/app/app/actions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

type Props = {
  invoiceId: string;
  status: string;
};

export function InvoiceStatusActions({ invoiceId, status }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="sent" />
          <Button type="submit" variant="outline">
            Mark as sent
          </Button>
        </form>
      ) : null}
      {status !== "paid" && status !== "void" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="paid" />
          <Button type="submit">Mark as paid</Button>
        </form>
      ) : null}
      {status !== "void" ? (
        <form action={setInvoiceStatusAction} className="flex w-full flex-wrap items-end gap-2 sm:w-auto">
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="void" />
          <div className="grid min-w-[14rem] flex-1 gap-1.5">
            <Label htmlFor="voidReason">Void reason</Label>
            <Input
              id="voidReason"
              name="reason"
              required
              maxLength={500}
              placeholder="Duplicate, wrong client, canceled work"
            />
          </div>
          <Button type="submit" variant="ghost">
            Void
          </Button>
        </form>
      ) : null}
    </div>
  );
}
