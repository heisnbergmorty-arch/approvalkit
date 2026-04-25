"use client";

import { useState, useTransition } from "react";
import { updateAssetNote } from "./actions";

interface Props {
  assetId: string;
  projectId: string;
  defaultNote: string | null;
}

export function AssetNote({ assetId, projectId, defaultNote }: Props) {
  const [note, setNote] = useState(defaultNote ?? "");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      await updateAssetNote(assetId, projectId, note);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="block w-full text-left text-xs text-slate-400 hover:text-brand-600"
        title="Internal note — never shown to clients"
      >
        {note ? (
          <span className="italic text-slate-500">📝 {note}</span>
        ) : (
          <span>+ Add private note</span>
        )}
        {saved && <span className="ml-2 text-emerald-600">✓ saved</span>}
      </button>
    );
  }

  return (
    <div className="mt-1 flex items-start gap-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
        rows={2}
        autoFocus
        placeholder="Internal note — only your team sees this"
        className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs"
      />
      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="rounded-md bg-brand-500 px-2 py-1 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
      >
        {pending ? "…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => {
          setNote(defaultNote ?? "");
          setEditing(false);
        }}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-500"
      >
        Cancel
      </button>
    </div>
  );
}
