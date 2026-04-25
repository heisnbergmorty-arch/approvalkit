/**
 * Standalone interactive demo. Does NOT read from the DB — uses in-memory
 * state so prospects can click Approve, pin comments, switch versions, and
 * actually feel the product without affecting other visitors.
 */
import DemoClient from "./demo-client";

export const metadata = {
  title: "Live demo — see what your clients see | ApprovalKit",
  description:
    "Interactive demo of ApprovalKit. Click Approve, pin a comment, switch between v1/v2 — exactly what your design clients experience.",
};

export default function DemoPage() {
  return <DemoClient />;
}
