/**
 * ApprovalKit Cloud — hosted-version waitlist endpoint.
 *
 * Captures emails of agencies who don't want to self-host.
 * No DB persistence yet (v0); just forwards to your inbox via Resend.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
  agencySize: z.enum(["solo", "2-5", "6-20", "20+"]).optional(),
  source: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  let data;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const notify = process.env.WAITLIST_NOTIFY_TO;
  if (notify) {
    await sendEmail({
      to: notify,
      subject: `[Waitlist] ${data.email}${data.agencySize ? ` (${data.agencySize})` : ""}`,
      html: `
        <p>New ApprovalKit Cloud waitlist signup.</p>
        <ul>
          <li>Email: ${data.email}</li>
          <li>Agency size: ${data.agencySize ?? "not provided"}</li>
          <li>Source: ${data.source ?? "direct"}</li>
        </ul>
      `,
    });
  } else {
    console.log("[waitlist]", data);
  }

  return NextResponse.json({ ok: true });
}
