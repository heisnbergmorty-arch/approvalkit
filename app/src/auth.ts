import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/client";
import { users, accounts, sessions, verificationTokens, paidUsers } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

const PAYMENT_GATING_ENABLED = process.env.PAYMENT_GATING_ENABLED !== "false";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM,
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login/not-paid",
  },
  session: { strategy: "database" },
  callbacks: {
    /**
     * Block magic-link delivery for emails that haven't paid via Gumroad.
     * Admin emails (env: ADMIN_EMAILS, comma-separated) bypass the check.
     * Set PAYMENT_GATING_ENABLED=false in env to disable (e.g. for self-hosters).
     */
    async signIn({ user }) {
      if (!PAYMENT_GATING_ENABLED) return true;
      const email = user?.email?.trim().toLowerCase();
      if (!email) return false;
      if (ADMIN_EMAILS.includes(email)) return true;

      const paid = await db.query.paidUsers.findFirst({
        where: and(eq(paidUsers.email, email), isNull(paidUsers.refundedAt)),
      });
      // Returning a string redirects to that URL (with ?error=...).
      return paid ? true : "/login/not-paid";
    },
  },
});
