import { describe, it, expect } from "vitest";
import { reviewLinkEmail, approvedEmail, commentEmail } from "@/lib/email";

describe("email templates", () => {
  it("review link email contains the URL and client name", () => {
    const html = reviewLinkEmail({
      agencyName: "Acme",
      brandColor: "#123456",
      clientName: "Sarah",
      projectName: "Logo project",
      reviewUrl: "https://app.example/review/abc123",
    });
    expect(html).toContain("Sarah");
    expect(html).toContain("https://app.example/review/abc123");
    expect(html).toContain("#123456");
  });

  it("approved email has subject + green checkmark", () => {
    const tpl = approvedEmail({
      agencyContactEmail: "owner@a.com",
      brandColor: "#000",
      approverName: "Bob",
      assetLabel: "Logo v2",
      projectName: "Acme Brand",
      dashboardUrl: "https://app/dash",
    });
    expect(tpl.subject).toContain("Bob");
    expect(tpl.subject).toContain("Logo v2");
    expect(tpl.html).toContain("Approved");
  });

  it("comment email escapes HTML in body", () => {
    const tpl = commentEmail({
      brandColor: "#000",
      authorName: "Bob",
      assetLabel: "X",
      projectName: "P",
      body: "<script>alert('xss')</script>",
      dashboardUrl: "https://x",
    });
    expect(tpl.html).not.toContain("<script>");
    expect(tpl.html).toContain("&lt;script&gt;");
  });
});
