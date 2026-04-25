"use client";

import { useState, useTransition, useRef, type DragEvent } from "react";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
}

interface PendingFile {
  id: string;
  file: File;
  label: string;
  groupKey: string;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
}

export function UploadAssetForm({ projectId }: Props) {
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [pending, start] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function addFiles(list: FileList | File[]) {
    const arr = Array.from(list).map<PendingFile>((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      label: prettyLabel(f.name),
      groupKey: slugify(prettyLabel(f.name)),
      status: "queued",
    }));
    setFiles((prev) => [...prev, ...arr]);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function update(id: string, patch: Partial<PendingFile>) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function remove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function uploadOne(p: PendingFile): Promise<void> {
    update(p.id, { status: "uploading", error: undefined });
    try {
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filename: p.file.name,
          contentType: p.file.type || "application/octet-stream",
        }),
      });
      if (!presignRes.ok) throw new Error("Could not get upload URL");
      const { uploadUrl, uploadToken, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${uploadToken}`,
          "x-upsert": "true",
          "content-type": p.file.type || "application/octet-stream",
        },
        body: p.file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      const createRes = await fetch("/api/assets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId,
          groupKey: p.groupKey.trim() || slugify(p.label),
          label: p.label.trim() || p.file.name,
          fileUrl: publicUrl,
          mimeType: p.file.type || "application/octet-stream",
          fileSizeBytes: p.file.size,
        }),
      });
      if (!createRes.ok) throw new Error("Could not save asset");
      update(p.id, { status: "done" });
    } catch (e) {
      update(p.id, {
        status: "error",
        error: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  function uploadAll() {
    start(async () => {
      const queued = files.filter(
        (f) => f.status === "queued" || f.status === "error",
      );
      for (const f of queued) {
        // eslint-disable-next-line no-await-in-loop
        await uploadOne(f);
      }
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "done"));
        router.refresh();
      }, 600);
    });
  }

  const queuedCount = files.filter(
    (f) => f.status === "queued" || f.status === "error",
  ).length;

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <label
        htmlFor="upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragActive
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        <span className="text-2xl">⬆</span>
        <span className="mt-2 text-sm font-medium text-slate-900">
          Drop files here or click to browse
        </span>
        <span className="mt-1 text-xs text-slate-500">
          PNG, JPG, GIF, WebP, PDF · up to 25 MB each · multiple OK
        </span>
        <input
          ref={inputRef}
          id="upload-input"
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {files.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-2 p-3">
              <span className="text-lg">
                {p.status === "done"
                  ? "✓"
                  : p.status === "error"
                  ? "✗"
                  : p.status === "uploading"
                  ? "↻"
                  : "📄"}
              </span>
              <input
                value={p.label}
                onChange={(e) => update(p.id, { label: e.target.value })}
                placeholder="Label"
                className="min-w-0 flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
                disabled={p.status === "uploading" || p.status === "done"}
              />
              <input
                value={p.groupKey}
                onChange={(e) =>
                  update(p.id, { groupKey: slugify(e.target.value) })
                }
                placeholder="group-key"
                title="Files sharing the same group are versioned together (v1, v2…)"
                className="w-32 rounded-md border border-slate-200 px-2 py-1 text-xs font-mono text-slate-600"
                disabled={p.status === "uploading" || p.status === "done"}
              />
              <span className="text-xs text-slate-400">
                {(p.file.size / 1024).toFixed(0)} KB
              </span>
              {p.status === "error" && (
                <span className="text-xs text-red-600">{p.error}</span>
              )}
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="text-xs text-slate-400 hover:text-red-600"
                disabled={p.status === "uploading"}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Tip: same <code>group-key</code> = a new version of an existing asset.
          </span>
          <button
            type="button"
            onClick={uploadAll}
            disabled={pending || queuedCount === 0}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {pending
              ? "Uploading…"
              : queuedCount === 1
              ? "Upload 1 file"
              : `Upload ${queuedCount} files`}
          </button>
        </div>
      )}
    </div>
  );
}

function prettyLabel(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 80);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}
