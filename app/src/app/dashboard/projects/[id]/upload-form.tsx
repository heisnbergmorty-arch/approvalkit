"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function UploadAssetForm({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file || !label.trim()) {
      setError("File and label are required.");
      return;
    }

    start(async () => {
      try {
        // 1. Get presigned URL
        const presignRes = await fetch("/api/uploads/presign", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
        });
        if (!presignRes.ok) throw new Error("Could not get upload URL");
        const { uploadUrl, uploadToken, publicUrl } = await presignRes.json();

        // 2. Upload directly to Supabase Storage
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${uploadToken}`,
            "x-upsert": "true",
            "content-type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!putRes.ok) throw new Error("Upload failed");

        // 3. Register the asset in our DB
        const createRes = await fetch("/api/assets", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            projectId,
            groupKey: groupKey.trim() || slugify(label),
            label: label.trim(),
            fileUrl: publicUrl,
            mimeType: file.type || "application/octet-stream",
            fileSizeBytes: file.size,
          }),
        });
        if (!createRes.ok) throw new Error("Could not save asset");

        setFile(null); setLabel(""); setGroupKey("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text" value={label} onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. Concept B — Hand-drawn)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="text" value={groupKey} onChange={(e) => setGroupKey(e.target.value)}
          placeholder="Group (e.g. logo-concepts) — optional, for versions"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-2 file:text-white hover:file:bg-brand-600"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={pending}
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}
