"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectMeta } from "./actions";

interface Props {
  projectId: string;
  name: string;
  clientName: string;
  clientEmail: string;
  description: string | null;
}

export function EditableProjectHeader(props: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.name);
  const [clientName, setClientName] = useState(props.clientName);
  const [clientEmail, setClientEmail] = useState(props.clientEmail);
  const [description, setDescription] = useState(props.description ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function save() {
    setError(null);
    start(async () => {
      const r = await updateProjectMeta(props.projectId, {
        name,
        clientName,
        clientEmail,
        description,
      });
      if (r.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setError(r.error ?? "Could not save");
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{props.name}</h1>
        <p className="text-sm text-slate-600">
          {props.clientName} · {props.clientEmail}
        </p>
        {props.description && (
          <p className="mt-2 max-w-prose text-sm text-slate-600">{props.description}</p>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 self-start text-xs text-slate-400 hover:text-brand-600"
        >
          ✎ Edit project details
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Client name</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Client email</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Description (your notes — not shown to client)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={2000}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setName(props.name);
            setClientName(props.clientName);
            setClientEmail(props.clientEmail);
            setDescription(props.description ?? "");
            setEditing(false);
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
