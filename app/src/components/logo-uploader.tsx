"use client";

import { useState, useRef } from "react";

interface Props {
  name: string; // form field name (logoUrl)
  defaultUrl: string;
  brandColor: string;
  agencyInitial: string;
}

export function LogoUploader({ name, defaultUrl, brandColor, agencyInitial }: Props) {
  const [url, setUrl] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2 MB.");
      return;
    }
    setUploading(true);
    try {
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filename: `logo-${file.name}`,
          contentType: file.type,
        }),
      });
      if (!presignRes.ok) throw new Error("Could not get upload URL");
      const { uploadUrl, uploadToken, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${uploadToken}`,
          "x-upsert": "true",
          "content-type": file.type,
        },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      setUrl(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Logo</label>
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-slate-200"
          style={{ backgroundColor: url ? "#f8fafc" : brandColor }}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Logo preview" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xl font-bold text-white">{agencyInitial}</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : url ? "Replace" : "Upload logo"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:border-slate-500"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            PNG, JPG, SVG or WebP. Up to 2&nbsp;MB. Square works best (~256×256).
          </p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
