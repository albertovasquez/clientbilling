import { setInvoiceStatusAction } from "@/app/app/actions";
import { buttonClass } from "@/components/ui";

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
          <button type="submit" className={buttonClass("secondary", "md")}>
            Mark as sent
          </button>
        </form>
      ) : null}
      {status !== "paid" && status !== "void" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="paid" />
          <button type="submit" className={buttonClass("primary", "md")}>
            Mark as paid
          </button>
        </form>
      ) : null}
      {status !== "void" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value="void" />
          <button type="submit" className={buttonClass("quiet", "md")}>
            Void
          </button>
        </form>
      ) : null}
    </div>
  );
}
