"use client";

import { useEffect, useState } from "react";

export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="absolute right-2 top-2 z-10 rounded-md bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur transition hover:bg-slate-900/80"
        title="View full size"
      >
        🔍 Zoom
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
          >
            Close · Esc
          </button>
        </div>
      )}
    </>
  );
}
