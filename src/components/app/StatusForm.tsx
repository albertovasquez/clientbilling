import { setInvoiceStatusAction } from "@/app/app/actions";
import { Button } from "@/components/shadcn/button";

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
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="void" />
          <Button type="submit" variant="ghost">
            Void
          </Button>
        </form>
      ) : null}
    </div>
  );
}
