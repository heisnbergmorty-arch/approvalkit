import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://approvalkit-topaz.vercel.app"),
  title: {
    default: "ApprovalKit — Get design approvals in 1 day, not 1 week",
    template: "%s | ApprovalKit",
  },
  description:
    "Hosted client-review portal for design agencies and freelancers. Branded approval pages, pixel-anchored comments, lifetime access for $149.",
  keywords: [
    "design approval software",
    "client review portal",
    "design feedback tool",
    "Filestage alternative",
    "Cage.app alternative",
    "design agency tools",
    "freelance designer feedback",
  ],
  openGraph: {
    title: "ApprovalKit — Get design approvals in 1 day, not 1 week",
    description:
      "Send your clients a branded review link. They approve in one click — or pin a comment to the exact pixel. $149 lifetime, no subscription.",
    type: "website",
    siteName: "ApprovalKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApprovalKit — Get design approvals in 1 day, not 1 week",
    description:
      "Branded client-review portal for design agencies. One click approvals, pixel-anchored comments. $149 lifetime.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ApprovalKit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Hosted client-review portal for design agencies and freelancers. Branded approval pages with pixel-anchored comments.",
  offers: {
    "@type": "Offer",
    price: "149",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://heisnberg4.gumroad.com/l/tneacr",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
