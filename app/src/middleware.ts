import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Custom-domain routing.
 *
 * Agencies can point e.g. `review.theirstudio.com` at this app. We look up
 * the agency by its `customDomain` column and rewrite to /portal/<agencySlug>
 * so the page can render with their branding.
 *
 * For the default (no custom domain) flow we just pass through.
 */
const APP_HOSTS = new Set(
  (process.env.APP_HOSTS ?? "localhost:3000,approvalkit.com,app.approvalkit.com")
    .split(",")
    .map((h) => h.trim().toLowerCase()),
);

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  const url = req.nextUrl;

  // Always allow API + auth routes regardless of host
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/check-email")
  ) {
    return NextResponse.next();
  }

  // Default app hosts pass through
  if (APP_HOSTS.has(host) || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // Custom domain → rewrite root to /portal/<host>
  // The /portal/[host] page resolves the agency by customDomain.
  if (url.pathname === "/" || url.pathname === "") {
    const rewritten = new URL(`/portal/${host}`, req.url);
    return NextResponse.rewrite(rewritten);
  }

  // Anything else on a custom domain (e.g. /review/abc) is fine — review
  // pages are public and identified purely by reviewSlug.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
