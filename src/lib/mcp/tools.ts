import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { hasScope } from "@/lib/api-scopes";
import { serializeActor } from "@/lib/billing/actor";
import { prisma } from "@/lib/db";
import { sendInvoiceEmail, sendInvoiceReminder } from "@/lib/invoices/email";
import { recordPayment, serializePayment } from "@/lib/invoices/payments";
import {
  createInvoice,
  parseDueDate,
  parseLines,
  serializeInvoice,
} from "@/lib/invoices/service";
import { percentToBps } from "@/lib/money";
import { bankTransferSnapshot, cdgOnlineSnapshots, paymentCosts } from "@/lib/payment-costs";
import { requireMcpAuth } from "@/lib/mcp/auth-context";
import { fingerprintArgs, withMcpIdempotency } from "@/lib/mcp/idempotent";
import { CDG_CHECKED } from "@/lib/cdg";
import { allowSandboxWrite } from "@/lib/mcp/sandbox";

function text(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function deny(message: string) {
  return text({ error: message });
}

/**
 * Register the V1 MCP tools over the shared invoice services (decision 0027).
 */
export function registerInvoiceTools(server: McpServer) {
  server.registerTool(
    "list_invoices",
    {
      title: "List invoices",
      description: "List invoices for the authenticated account, newest first.",
      inputSchema: z.object({
        status: z
          .enum(["draft", "sent", "viewed", "overdue", "paid", "void"])
          .optional()
          .describe("Optional status filter"),
      }),
    },
    async ({ status }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "invoice:read")) return deny("Missing scope invoice:read");
      const invoices = await prisma.invoice.findMany({
        where: { userId: auth.userId, ...(status ? { status } : {}) },
        include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return text({ invoices: invoices.map(serializeInvoice), actor: serializeActor(auth.actor) });
    },
  );

  server.registerTool(
    "get_invoice",
    {
      title: "Get invoice",
      description: "Fetch one invoice by id.",
      inputSchema: z.object({ id: z.string().min(1) }),
    },
    async ({ id }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "invoice:read")) return deny("Missing scope invoice:read");
      const invoice = await prisma.invoice.findFirst({
        where: { id, userId: auth.userId },
        include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
      });
      if (!invoice) return deny("Invoice not found");
      return text({ invoice: serializeInvoice(invoice), actor: serializeActor(auth.actor) });
    },
  );

  server.registerTool(
    "create_invoice",
    {
      title: "Create invoice",
      description: "Create a draft invoice. Requires idempotencyKey.",
      inputSchema: z.object({
        idempotencyKey: z.string().min(1).max(256),
        clientId: z.string().optional(),
        newClient: z
          .object({ name: z.string().min(1).max(160), email: z.string().email().optional().nullable() })
          .optional(),
        lines: z
          .array(
            z.object({
              description: z.string(),
              quantity: z.union([z.number(), z.string()]).optional(),
              unitPrice: z.union([z.number(), z.string()]),
            }),
          )
          .min(1),
        taxRate: z.union([z.number(), z.string()]).optional(),
        dueDate: z.string().optional().nullable(),
        notes: z.string().max(4000).optional().nullable(),
      }),
    },
    async (input) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "invoice:write")) return deny("Missing scope invoice:write");
      const sandbox = await allowSandboxWrite(auth.userId, auth.keyKind);
      if (!sandbox.ok) return deny(sandbox.error);

      const { idempotencyKey, ...args } = input;
      const out = await withMcpIdempotency(auth, "create_invoice", idempotencyKey, fingerprintArgs(args), async () => {
        const lines = parseLines(
          input.lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice })),
        );
        if (!lines.ok) return { ok: false as const, error: lines.error };

        const result = await createInvoice({
          userId: auth.userId,
          clientId: input.clientId ?? null,
          newClient: input.newClient
            ? { name: input.newClient.name, email: input.newClient.email?.toLowerCase() ?? null }
            : null,
          lines: lines.lines,
          taxRateBps: percentToBps(input.taxRate ?? 0),
          dueDate: parseDueDate(input.dueDate),
          notes: input.notes?.trim().slice(0, 4000) || null,
          source: "api",
          actor: auth.actor,
        });
        if (!result.ok) return { ok: false as const, error: result.error };
        const full = await prisma.invoice.findUniqueOrThrow({
          where: { id: result.invoice.id },
          include: { client: { select: { id: true, name: true, email: true } }, lineItems: { orderBy: { sortOrder: "asc" } } },
        });
        return {
          ok: true as const,
          body: {
            invoice: serializeInvoice(full),
            actor: serializeActor(auth.actor),
            request: { idempotencyKey },
          },
        };
      });
      if (!out.ok) return deny(out.error);
      return text(out.body);
    },
  );

  server.registerTool(
    "send_invoice",
    {
      title: "Send invoice",
      description: "Email an invoice to the client on file.",
      inputSchema: z.object({
        id: z.string().min(1),
        idempotencyKey: z.string().min(1).max(256),
      }),
    },
    async ({ id, idempotencyKey }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "invoice:send")) return deny("Missing scope invoice:send");
      const sandbox = await allowSandboxWrite(auth.userId, auth.keyKind);
      if (!sandbox.ok) return deny(sandbox.error);
      const out = await withMcpIdempotency(auth, "send_invoice", idempotencyKey, fingerprintArgs({ id }), async () => {
        const result = await sendInvoiceEmail(auth.userId, id, auth.actor);
        if (!result.ok) return { ok: false as const, error: result.error };
        return {
          ok: true as const,
          body: { ok: true, to: result.to, actor: serializeActor(auth.actor), request: { idempotencyKey } },
        };
      });
      if (!out.ok) return deny(out.error);
      return text(out.body);
    },
  );

  server.registerTool(
    "send_reminder",
    {
      title: "Send reminder",
      description: "Send a payment reminder for an open invoice.",
      inputSchema: z.object({
        id: z.string().min(1),
        idempotencyKey: z.string().min(1).max(256),
      }),
    },
    async ({ id, idempotencyKey }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "reminder:send")) return deny("Missing scope reminder:send");
      const sandbox = await allowSandboxWrite(auth.userId, auth.keyKind);
      if (!sandbox.ok) return deny(sandbox.error);
      const out = await withMcpIdempotency(auth, "send_reminder", idempotencyKey, fingerprintArgs({ id }), async () => {
        const result = await sendInvoiceReminder(auth.userId, id, auth.actor);
        if (!result.ok) return { ok: false as const, error: result.error };
        return {
          ok: true as const,
          body: { ok: true, to: result.to, actor: serializeActor(auth.actor), request: { idempotencyKey } },
        };
      });
      if (!out.ok) return deny(out.error);
      return text(out.body);
    },
  );

  server.registerTool(
    "record_payment",
    {
      title: "Record payment",
      description: "Record money received against an invoice. Does not move funds.",
      inputSchema: z.object({
        invoiceId: z.string().min(1),
        amountCents: z.number().int().positive(),
        method: z.enum(["cash", "check", "bank_transfer", "card", "other"]).optional(),
        paidOn: z.string().optional(),
        note: z.string().max(500).optional(),
        idempotencyKey: z.string().min(1).max(256),
      }),
    },
    async (input) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "payment:record")) return deny("Missing scope payment:record");
      const sandbox = await allowSandboxWrite(auth.userId, auth.keyKind);
      if (!sandbox.ok) return deny(sandbox.error);
      const { idempotencyKey, ...args } = input;
      const out = await withMcpIdempotency(auth, "record_payment", idempotencyKey, fingerprintArgs(args), async () => {
        const result = await recordPayment(
          auth.userId,
          input.invoiceId,
          {
            amountCents: input.amountCents,
            method: input.method ?? null,
            paidOn: input.paidOn ?? null,
            note: input.note ?? null,
          },
          "api",
          auth.actor,
        );
        if (!result.ok) return { ok: false as const, error: result.error };
        return {
          ok: true as const,
          body: {
            payment: serializePayment(result.payment),
            actor: serializeActor(auth.actor),
            request: { idempotencyKey },
          },
        };
      });
      if (!out.ok) return deny(out.error);
      return text(out.body);
    },
  );

  server.registerTool(
    "get_payment_costs",
    {
      title: "Get payment costs",
      description: "Estimate known fees and nets for an amount using published CDG rates and an ACH example.",
      inputSchema: z.object({
        amountCents: z.number().int().nonnegative(),
      }),
    },
    async ({ amountCents }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "cost:read")) return deny("Missing scope cost:read");
      const snapshots = [
        ...cdgOnlineSnapshots(),
        bankTransferSnapshot(100, { example: true, asOf: CDG_CHECKED }),
      ];
      return text({ amountCents, costs: paymentCosts(amountCents, snapshots), actor: serializeActor(auth.actor) });
    },
  );

  server.registerTool(
    "verify_record",
    {
      title: "Verify record",
      description: "Verify an invoice billing record. Anchoring ships later; returns pending until then.",
      inputSchema: z.object({
        invoiceId: z.string().min(1),
      }),
    },
    async ({ invoiceId }) => {
      const auth = requireMcpAuth();
      if (!hasScope(auth.scopes, "proof:read")) return deny("Missing scope proof:read");
      const invoice = await prisma.invoice.findFirst({
        where: { id: invoiceId, userId: auth.userId },
        select: { id: true, number: true },
      });
      if (!invoice) return deny("Invoice not found");
      return text({
        status: "pending",
        reason: "Anchoring ships in week 7",
        invoiceId: invoice.id,
        number: invoice.number,
        actor: serializeActor(auth.actor),
      });
    },
  );
}
