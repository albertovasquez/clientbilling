import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { assertDatabase, prisma } from "@/lib/db";

export async function requireUser() {
  assertDatabase();
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/app/sign-in");
  }
  return session.user;
}

export async function getBusinessForUser(userId: string) {
  return prisma.businessProfile.findUnique({ where: { userId } });
}

export async function requireBusiness(userId: string) {
  const business = await getBusinessForUser(userId);
  if (!business) {
    redirect("/app/settings?setup=1");
  }
  return business;
}
