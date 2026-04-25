"use client";

import { useState } from "react";

const PRESETS = [
  "#6366f1", // indigo
  "#4f46e5", // indigo-600
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#0f172a", // slate-900
];

interface Props {
  name: string;
  defaultValue: string;
}

export function BrandColorPicker({ name, defaultValue }: Props) {
  const [color, setColor] = useState(defaultValue || "#6366f1");
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Brand color</label>
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full ring-1 transition ${
              c.toLowerCase() === color.toLowerCase()
                ? "ring-2 ring-offset-2 ring-slate-900"
                : "ring-slate-200 hover:ring-slate-400"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Use ${c}`}
            title={c}
          />
        ))}
        <label className="ml-1 inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-2 text-xs text-slate-600 hover:border-slate-400">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-4 w-4 cursor-pointer"
          />
          Custom
        </label>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Used everywhere your clients look — buttons, pin badges, accents.{" "}
        <span className="font-mono">{color.toUpperCase()}</span>
      </p>
      <input type="hidden" name={name} value={color} />
    </div>
  );
}
