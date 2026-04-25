"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleCommentResolved } from "./actions";

export function ResolveToggle({
  commentId,
  projectId,
  resolved,
}: {
  commentId: string;
  projectId: string;
  resolved: boolean;
}) {
  const [optimistic, setOptimistic] = useState(resolved);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = !optimistic;
    setOptimistic(next);
    start(async () => {
      try {
        await toggleCommentResolved(commentId, projectId, next);
        router.refresh();
      } catch {
        setOptimistic(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
        optimistic
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "border border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-700"
      }`}
      title={optimistic ? "Click to mark unresolved" : "Mark this comment as resolved"}
    >
      {optimistic ? "✓ resolved" : "mark resolved"}
    </button>
  );
}
