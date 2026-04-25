import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApprovalKit — Get design approvals in 1 day, not 1 week",
  description: "Branded review portal for design agencies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
