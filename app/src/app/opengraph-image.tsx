/**
 * Open Graph image for the marketing site.
 *
 * Edge runtime — generates a 1200×630 PNG at request time so we can
 * tweak copy without re-uploading images.
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ApprovalKit — Get design approvals in 1 day, not 1 week.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#a5b4fc", fontSize: 28, fontWeight: 700 }}>
          ▰ ApprovalKit
        </div>
        <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, marginTop: 32 }}>
          Get design approvals
          <br />
          in <span style={{ color: "#a5b4fc" }}>1 day</span>, not 1 week.
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#cbd5e1" }}>
          Branded review portal for design agencies. One click. No logins.
        </div>
      </div>
    ),
    { ...size },
  );
}
