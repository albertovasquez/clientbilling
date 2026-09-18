import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicAppPaths = new Set(["/app/sign-in", "/app/sign-up"]);

export async function middleware(req: NextRequest) {
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

  // Prefer whichever Auth.js v5 cookie is actually present; fall back to
  // protocol detection (Vercel production is HTTPS).
  const cookieName = req.cookies.has(secureCookieName)
    ? secureCookieName
    : req.cookies.has(insecureCookieName)
      ? insecureCookieName
      : req.nextUrl.protocol === "https:"
        ? secureCookieName
        : insecureCookieName;

  const token = await getToken({
    req,
    secret,
    cookieName,
    salt: cookieName,
  });

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

