"use server";

import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { createInvoice, parseDueDate, parseLines, setInvoiceStatus } from "@/lib/invoices/service";
import { isAdminEmail } from "@/lib/admin";
import { assertDatabase, prisma } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { computeInvoiceTotals, percentToBps } from "@/lib/money";
import { allow } from "@/lib/rate-limit";
import { requireBusiness, requireUser } from "@/lib/session";

const signUpSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  businessName: z.string().min(1).max(160),
});

export type ActionState = { error?: string; ok?: boolean };

async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

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

  const ip = await clientIp();
  if (!(await allow(`signup:${ip}`, 10, 3600))) {
    return { error: "Too many sign-ups from this network. Try again in an hour." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  // Admin addresses are created by the owner before ADMIN_EMAILS is set; nobody self-registers one (decision 0020).
  if (isAdminEmail(email)) {
    return { error: "This address is reserved. Sign in instead, or use a different email." };
  }
  const passwordHash = await hash(parsed.data.password, 12);
  let userId: string;
  try {
    const user = await prisma.user.create({
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
    userId = user.id;
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "An account with that email already exists. Sign in instead." };
    }
    throw error;
  }

  await recordEvent({ name: "signup", path: "/app/sign-up", userId });

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

/** Only same-origin app paths are safe redirect targets. */
function safeNext(raw: string): string {
  return /^\/app(\/[A-Za-z0-9_\-/?=&]*)?$/.test(raw) ? raw : "/app";
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/app"));
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  try {
    assertDatabase();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Database not configured" };
  }

  const ip = await clientIp();
  const [ipOk, emailOk] = await Promise.all([
    allow(`signin:ip:${ip}`, 30, 900),
    allow(`signin:email:${email}`, 10, 900),
  ]);
  if (!ipOk || !emailOk) {
    return { error: "Too many attempts. Wait 15 minutes and try again." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: next });
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
  logoUrl: z.string().url().max(500).refine((u) => u.startsWith("https://"), "Logo URL must start with https://").optional().or(z.literal("")),
  paymentInstructions: z.string().max(2000).optional(),
  payLinkUrl: z
    .string()
    .max(500)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), "Pay link must start with https://")
    .optional(),
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
    paymentInstructions: formData.get("paymentInstructions") || undefined,
    payLinkUrl: String(formData.get("payLinkUrl") ?? "").trim(),
  });
  if (!parsed.success) {
    const payLinkIssue = parsed.error.issues.find((i) => i.path[0] === "payLinkUrl");
    const logoIssue = parsed.error.issues.find((i) => i.path[0] === "logoUrl");
    return {
      error: payLinkIssue
        ? "The pay link must be a full https:// address."
        : logoIssue
          ? "The logo URL must be a full https:// address."
          : "Check the business profile fields.",
    };
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
    paymentInstructions: parsed.data.paymentInstructions?.trim() || null,
    payLinkUrl: parsed.data.payLinkUrl?.trim() || null,
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
      email: parsed.data.email?.trim().toLowerCase() || null,
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
      email: parsed.data.email?.trim().toLowerCase() || null,
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
  return parseLines(descriptions.map((description, i) => ({ description, quantity: quantities[i] ?? "1", unitPrice: prices[i] ?? "0" })));
}

export async function createInvoiceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  await requireBusiness(user.id);
  const clientIdRaw = String(formData.get("clientId") ?? "").trim();
  const useNewClient = !clientIdRaw || clientIdRaw === "__new__";

  let newClient: { name: string; email: string | null } | null = null;
  if (useNewClient) {
    const newClientName = String(formData.get("newClientName") ?? "").trim();
    const newClientEmailRaw = String(formData.get("newClientEmail") ?? "").trim().toLowerCase();
    if (!newClientName) {
      return { error: "Enter a client name, or pick an existing client." };
    }
    if (newClientEmailRaw && !z.string().email().safeParse(newClientEmailRaw).success) {
      return { error: "New client email must be a valid email address." };
    }
    newClient = { name: newClientName, email: newClientEmailRaw || null };
  }

  const parsedLines = parseLineItems(formData);
  if (!parsedLines.ok) return { error: parsedLines.error };

  const result = await createInvoice({
    userId: user.id,
    clientId: useNewClient ? null : clientIdRaw,
    newClient,
    lines: parsedLines.lines,
    taxRateBps: percentToBps(String(formData.get("taxRate") ?? "0")),
    dueDate: parseDueDate(String(formData.get("dueDate") ?? "")),
    notes: String(formData.get("notes") ?? "").trim().slice(0, 4000) || null,
    source: "app",
  });
  if (!result.ok) return { error: result.error };

  revalidatePath("/app");
  revalidatePath("/app/clients");
  redirect(`/app/invoices/${result.invoice.id}`);
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

  const parsedLines = parseLineItems(formData);
  if (!parsedLines.ok) return { error: parsedLines.error };
  const lines = parsedLines.lines;

  const taxRateBps = percentToBps(String(formData.get("taxRate") ?? "0"));
  if (taxRateBps < 0 || taxRateBps > 10_000) {
    return { error: "Tax rate must be between 0% and 100%." };
  }
  const totals = computeInvoiceTotals(lines, taxRateBps);
  if (totals.totalCents < invoice.paidCents) {
    return { error: "The total cannot be less than the amount already paid. Remove a payment first." };
  }
  const dueDate = parseDueDate(String(formData.get("dueDate") ?? ""));
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 4000) || null;

  await prisma.$transaction(async (tx) => {
    await tx.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
    await tx.invoice.update({
      where: { id },
      data: {
        clientId: client.id,
        dueDate,
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
        events: { create: { type: "updated" } },
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
  const status = String(formData.get("status") ?? "");
  const result = await setInvoiceStatus(user.id, id, status, "app");
  if (!result.ok) {
    if (result.code === "transition") redirect(`/app/invoices/${id}?error=transition`);
    return;
  }
  revalidatePath(`/app/invoices/${id}`);
  revalidatePath(`/i/${result.invoice.publicId}`);
  revalidatePath("/app");
  redirect(`/app/invoices/${id}`);
}
