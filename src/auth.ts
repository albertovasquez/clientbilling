import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * A real bcrypt hash (cost 12) of a random string. Compared against when the
 * email is unknown so a miss costs the same time as a wrong password
 * (decision 0020).
 */
const DUMMY_HASH = "$2b$12$j1H8kNYId8za3//KZZT6..qxryQKDHv6yQZ5YWCaNAkbA8Y1DZhFi";

/** How often a live session re-reads the user's session version. */
const VERSION_CHECK_MS = 60_000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/app/sign-in",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        if (!process.env.DATABASE_URL) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });

        const ok = await compare(parsed.data.password, user?.passwordHash || DUMMY_HASH);
        if (!user?.passwordHash || !ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * The token carries the session version it was issued with. A password
     * reset bumps the user's version, and every token issued before it is
     * refused within a minute (decision 0020).
     */
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.sv = (user as { sessionVersion?: number }).sessionVersion ?? 0;
        token.svAt = Date.now();
        return token;
      }
      if (!token.sub) return token;
      const checkedAt = typeof token.svAt === "number" ? token.svAt : 0;
      if (Date.now() - checkedAt < VERSION_CHECK_MS) return token;
      const current = await prisma.user
        .findUnique({ where: { id: token.sub }, select: { sessionVersion: true } })
        .catch(() => null);
      if (!current || current.sessionVersion !== (token.sv ?? 0)) return null;
      token.svAt = Date.now();
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
});
