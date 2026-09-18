import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Auth gate for /app (Next 16 calls this file proxy; it was middleware).
 * Only reads the Auth.js JWT cookie. Never imports Prisma.
 */
const publicAppPaths = new Set(["/app/sign-in", "/app/sign-up", "/app/reset", "/app/reset/confirm"]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }
  if (publicAppPaths.has(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const secureCookieName = "__Secure-authjs.session-token";
  const insecureCookieName = "authjs.session-token";

  const cookieName = req.cookies.has(secureCookieName)
    ? secureCookieName
    : req.cookies.has(insecureCookieName)
      ? insecureCookieName
      : req.nextUrl.protocol === "https:"
        ? secureCookieName
        : insecureCookieName;

  let token: unknown = null;
  try {
    token = await getToken({ req, secret, cookieName, salt: cookieName });
  } catch (error) {
    // A missing or rotated secret must fail closed, not with a 500.
    console.error("[proxy] token check failed", error instanceof Error ? error.message : error);
    token = null;
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/app/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
