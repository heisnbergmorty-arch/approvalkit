"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAsset } from "./actions";

export function DeleteAssetButton({
  assetId,
  projectId,
  label,
}: {
  assetId: string;
  projectId: string;
  label: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function onClick() {
    if (
      !confirm(
        `Delete "${label}"? This also removes its comments and approval history. Cannot be undone.`,
      )
    )
      return;
    start(async () => {
      await deleteAsset(assetId, projectId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-slate-400 hover:text-red-600 disabled:opacity-50"
      title="Delete this asset"
    >
      {pending ? "…" : "🗑"}
    </button>
  );
}
