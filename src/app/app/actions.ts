"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { newPublicInvoiceId } from "@/lib/invoices/ids";
import { assertDatabase, prisma } from "@/lib/db";
import { computeInvoiceTotals, dollarsToCents, percentToBps } from "@/lib/money";
import { requireBusiness, requireUser } from "@/lib/session";

const signUpSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  businessName: z.string().min(1).max(160),
});

export type ActionState = { error?: string; ok?: boolean };

export async function signUpAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    assertDatabase();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Database not configured" };
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    businessName: formData.get("businessName"),
  });
  if (!parsed.success) {
    return { error: "Check your name, email, business name, and password (8+ characters)." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Sign in instead." };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name.trim(),
      passwordHash,
      business: {
        create: {
          name: parsed.data.businessName.trim(),
          email,
        },
      },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/app",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try signing in." };
    }
    throw error;
  }
  return { ok: true };
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/app");
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  try {
    assertDatabase();
    await signIn("credentials", {
      email,
      password,
      redirectTo: next.startsWith("/app") ? next : "/app",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return { ok: true };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

const businessSchema = z.object({
  name: z.string().min(1).max(160),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  address1: z.string().max(160).optional(),
  address2: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  postalCode: z.string().max(20).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateBusinessAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    address1: formData.get("address1") || undefined,
    address2: formData.get("address2") || undefined,
    city: formData.get("city") || undefined,
    state: formData.get("state") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    logoUrl: formData.get("logoUrl") || "",
  });
  if (!parsed.success) {
    return { error: "Check the business profile fields." };
  }

  const data = {
    name: parsed.data.name.trim(),
    email: parsed.data.email.toLowerCase().trim(),
    phone: parsed.data.phone?.trim() || null,
    address1: parsed.data.address1?.trim() || null,
    address2: parsed.data.address2?.trim() || null,
    city: parsed.data.city?.trim() || null,
    state: parsed.data.state?.trim() || null,
    postalCode: parsed.data.postalCode?.trim() || null,
    logoUrl: parsed.data.logoUrl?.trim() || null,
  };

  await prisma.businessProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });

  revalidatePath("/app");
  revalidatePath("/app/settings");
  return { ok: true };
}

const clientSchema = z.object({
  name: z.string().min(1).max(160),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  address1: z.string().max(160).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  postalCode: z.string().max(20).optional(),
  notes: z.string().max(4000).optional(),
});

function clientFromForm(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
    address1: formData.get("address1") || undefined,
    city: formData.get("city") || undefined,
    state: formData.get("state") || undefined,
    postalCode: formData.get("postalCode") || undefined,
    notes: formData.get("notes") || undefined,
  });
}

export async function createClientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = clientFromForm(formData);
  if (!parsed.success) {
    return { error: "Client name is required. Email must be valid if provided." };
  }
  await prisma.client.create({
    data: {
      userId: user.id,
      name: parsed.data.name.trim(),
      email: parsed.data.email?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
      company: parsed.data.company?.trim() || null,
      address1: parsed.data.address1?.trim() || null,
      city: parsed.data.city?.trim() || null,
      state: parsed.data.state?.trim() || null,
      postalCode: parsed.data.postalCode?.trim() || null,
      notes: parsed.data.notes?.trim() || null,
    },
  });
  revalidatePath("/app/clients");
  redirect("/app/clients");
}

export async function updateClientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = clientFromForm(formData);
  if (!id || !parsed.success) {
    return { error: "Could not update client." };
  }
  const existing = await prisma.client.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { error: "Client not found." };

  await prisma.client.update({
    where: { id },
    data: {
      name: parsed.data.name.trim(),
      email: parsed.data.email?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
      company: parsed.data.company?.trim() || null,
      address1: parsed.data.address1?.trim() || null,
      city: parsed.data.city?.trim() || null,
      state: parsed.data.state?.trim() || null,
      postalCode: parsed.data.postalCode?.trim() || null,
      notes: parsed.data.notes?.trim() || null,
    },
  });
  revalidatePath("/app/clients");
  redirect("/app/clients");
}

export async function deleteClientAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.client.findFirst({ where: { id, userId: user.id } });
  if (!existing) return;
  const invoiceCount = await prisma.invoice.count({ where: { clientId: id } });
  if (invoiceCount > 0) {
    throw new Error("Cannot delete a client that has invoices.");
  }
  await prisma.client.delete({ where: { id } });
  revalidatePath("/app/clients");
  redirect("/app/clients");
}

function parseLineItems(formData: FormData) {
  const descriptions = formData.getAll("line_description").map(String);
  const quantities = formData.getAll("line_quantity").map(String);
  const prices = formData.getAll("line_unit_price").map(String);
  const lines: { description: string; quantity: number; unitPriceCents: number }[] = [];
  for (let i = 0; i < descriptions.length; i++) {
    const description = descriptions[i]?.trim() ?? "";
    if (!description) continue;
    const quantity = Number(quantities[i] ?? "1");
    const unitPriceCents = dollarsToCents(prices[i] ?? "0");
    if (!Number.isFinite(quantity) || quantity <= 0) continue;
    lines.push({ description, quantity, unitPriceCents });
  }
  return lines;
}

export async function createInvoiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const business = await requireBusiness(user.id);
  const clientId = String(formData.get("clientId") ?? "");
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: user.id },
  });
  if (!client) return { error: "Pick a client." };

  const lines = parseLineItems(formData);
  if (lines.length === 0) {
    return { error: "Add at least one line item." };
  }

  const taxRateBps = percentToBps(String(formData.get("taxRate") ?? "0"));
  const totals = computeInvoiceTotals(lines, taxRateBps);
  const dueRaw = String(formData.get("dueDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const publicId = newPublicInvoiceId();
  const number = String(business.nextInvoiceNumber);

  const invoice = await prisma.$transaction(async (tx) => {
    const created = await tx.invoice.create({
      data: {
        publicId,
        userId: user.id,
        clientId: client.id,
        number,
        status: "draft",
        dueDate: dueRaw ? new Date(dueRaw) : null,
        notes,
        taxRateBps,
        ...totals,
        lineItems: {
          create: lines.map((line, index) => ({
            description: line.description,
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
            sortOrder: index,
          })),
        },
        events: {
          create: { type: "created", meta: "draft" },
        },
      },
    });
    await tx.businessProfile.update({
      where: { id: business.id },
      data: { nextInvoiceNumber: business.nextInvoiceNumber + 1 },
    });
    return created;
  });

  revalidatePath("/app");
  redirect(`/app/invoices/${invoice.id}`);
}

export async function updateInvoiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: { lineItems: true },
  });
  if (!invoice) return { error: "Invoice not found." };
  if (invoice.status === "paid" || invoice.status === "void") {
    return { error: "Paid or void invoices cannot be edited." };
  }

  const clientId = String(formData.get("clientId") ?? invoice.clientId);
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: user.id },
  });
  if (!client) return { error: "Pick a client." };

  const lines = parseLineItems(formData);
  if (lines.length === 0) return { error: "Add at least one line item." };

  const taxRateBps = percentToBps(String(formData.get("taxRate") ?? "0"));
  const totals = computeInvoiceTotals(lines, taxRateBps);
  const dueRaw = String(formData.get("dueDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  await prisma.$transaction(async (tx) => {
    await tx.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
    await tx.invoice.update({
      where: { id },
      data: {
        clientId: client.id,
        dueDate: dueRaw ? new Date(dueRaw) : null,
        notes,
        taxRateBps,
        ...totals,
        lineItems: {
          create: lines.map((line, index) => ({
            description: line.description,
            quantity: line.quantity,
            unitPriceCents: line.unitPriceCents,
            sortOrder: index,
          })),
        },
        events: {
          create: { type: "updated" },
        },
      },
    });
  });

  revalidatePath(`/app/invoices/${id}`);
  revalidatePath(`/i/${invoice.publicId}`);
  redirect(`/app/invoices/${id}`);
}

export async function setInvoiceStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "sent"
    | "paid"
    | "void"
    | "draft";
  if (!["sent", "paid", "void", "draft"].includes(status)) return;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
  });
  if (!invoice) return;

  const now = new Date();
  await prisma.invoice.update({
    where: { id },
    data: {
      status,
      sentAt: status === "sent" ? (invoice.sentAt ?? now) : invoice.sentAt,
      paidAt: status === "paid" ? now : status === "void" ? invoice.paidAt : null,
      voidedAt: status === "void" ? now : null,
      events: {
        create: { type: `status_${status}` },
      },
    },
  });

  revalidatePath(`/app/invoices/${id}`);
  revalidatePath(`/i/${invoice.publicId}`);
  revalidatePath("/app");
  redirect(`/app/invoices/${id}`);
}

export async function connectQuantumStubAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const business = await requireBusiness(user.id);
  const label = String(formData.get("quantumMerchantLabel") ?? "").trim();
  const ref = String(formData.get("quantumGwLoginRef") ?? "").trim();
  if (!label) {
    return { error: "Add a merchant label so you can recognize this connection." };
  }

  await prisma.businessProfile.update({
    where: { id: business.id },
    data: {
      quantumConnected: true,
      quantumMerchantLabel: label.slice(0, 120),
      // Store only a non-secret reference label (e.g. "acct-display-name"), never passwords or RestrictKeys.
      quantumGwLoginRef: ref ? ref.slice(0, 120) : null,
    },
  });

  revalidatePath("/app/settings/payments");
  return { ok: true };
}

export async function disconnectQuantumAction() {
  const user = await requireUser();
  const business = await requireBusiness(user.id);
  await prisma.businessProfile.update({
    where: { id: business.id },
    data: {
      quantumConnected: false,
      quantumMerchantLabel: null,
      quantumGwLoginRef: null,
    },
  });
  revalidatePath("/app/settings/payments");
  redirect("/app/settings/payments");
}
