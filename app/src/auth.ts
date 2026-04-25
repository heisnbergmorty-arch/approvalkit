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
      // Always log the magic-link URL to server logs so the operator can grab it
      // from Vercel logs when Resend is in sandbox mode (only delivers to the
      // Resend account email) or for any other delivery failure. The default
      // sendVerificationRequest still runs after this via super-call pattern below.
      async sendVerificationRequest({ identifier, url, provider, request, expires, theme, token }) {
        // eslint-disable-next-line no-console
        console.log(`[auth] magic-link for ${identifier}: ${url}`);
        // Re-implement Resend's default delivery so we don't lose normal email send.
        const apiKey = (provider as { apiKey?: string }).apiKey;
        const from = (provider as { from?: string }).from;
        if (!apiKey || !from) return;
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from,
              to: identifier,
              subject: `Sign in to ApprovalKit`,
              text: `Sign in to ApprovalKit\n\n${url}\n\nThis link expires in 24 hours.`,
              html: `<p>Sign in to <strong>ApprovalKit</strong></p><p><a href="${url}">${url}</a></p><p>This link expires in 24 hours.</p>`,
            }),
          });
          if (!res.ok) {
            // eslint-disable-next-line no-console
            console.warn(`[auth] resend send failed: ${res.status} ${await res.text()}`);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`[auth] resend send error:`, err);
        }
        // Reference unused destructured params to satisfy lint without changing behavior
        void request; void expires; void theme; void token;
      },
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
      // eslint-disable-next-line no-console
      console.log(`[auth] signIn check: email=${email} admin_count=${ADMIN_EMAILS.length} admin_match=${email ? ADMIN_EMAILS.includes(email) : false}`);
      if (!email) return false;
      if (ADMIN_EMAILS.includes(email)) return true;

      const paid = await db.query.paidUsers.findFirst({
        where: and(eq(paidUsers.email, email), isNull(paidUsers.refundedAt)),
      });
      // eslint-disable-next-line no-console
      console.log(`[auth] paid lookup for ${email}: ${paid ? "FOUND" : "NOT FOUND"}`);
      // Returning a string redirects to that URL (with ?error=...).
      return paid ? true : "/login/not-paid";
    },
  },
});
