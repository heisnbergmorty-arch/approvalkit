"use client";

import { useState, useTransition } from "react";
import { archiveProject, unarchiveProject, deleteProject } from "./actions";

export function ProjectActions({ projectId, status }: { projectId: string; status: string }) {
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  function onArchive() {
    start(() => (status === "archived" ? unarchiveProject(projectId) : archiveProject(projectId)));
  }

  function onDelete() {
    if (!confirm("Permanently delete this project, all assets, and all comments? This cannot be undone.")) return;
    start(() => deleteProject(projectId));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-slate-500"
        disabled={pending}
      >
        ⋯ Actions
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <button
            onClick={onArchive}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
          >
            {status === "archived" ? "Unarchive" : "Archive"}
          </button>
          <button
            onClick={onDelete}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete project
          </button>
        </div>
      )}
    </div>
  );
}
