"use client";

import { useEffect, useState } from "react";

/**
 * Adds keyboard navigation across asset cards on the review page.
 * - j / ↓ : focus next asset
 * - k / ↑ : focus previous asset
 * - ? : show help overlay
 *
 * Asset cards are detected by the [data-asset-card] attribute.
 */
export function ReviewKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function isTyping(): boolean {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return false;
      const tag = a.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        a.isContentEditable
      );
    }

    function focusByIndex(idx: number) {
      const cards = document.querySelectorAll<HTMLElement>("[data-asset-card]");
      if (!cards.length) return;
      const clamped = Math.max(0, Math.min(cards.length - 1, idx));
      const target = cards[clamped];
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.outline = "3px solid #6366f1";
      setTimeout(() => {
        target.style.outline = "";
      }, 800);
    }

    function currentIndex(): number {
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-asset-card]"));
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function onKey(e: KeyboardEvent) {
      if (isTyping()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        focusByIndex(currentIndex() + 1);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        focusByIndex(currentIndex() - 1);
      } else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowHelp((v) => !v);
      } else if (e.key === "Escape") {
        setShowHelp(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!showHelp) {
    return (
      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-30 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 shadow hover:border-slate-500"
        title="Keyboard shortcuts"
      >
        ⌨ ?
      </button>
    );
  }

  return (
    <div
      onClick={() => setShowHelp(false)}
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="text-base font-semibold">Keyboard shortcuts</div>
        <ul className="mt-4 space-y-2 text-sm">
          <Row k="j  /  ↓" v="Next item" />
          <Row k="k  /  ↑" v="Previous item" />
          <Row k="?" v="Toggle this help" />
          <Row k="Esc" v="Close dialogs" />
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Tip: click anywhere on an image to drop a pinned comment at that exact pixel.
        </p>
        <button
          type="button"
          onClick={() => setShowHelp(false)}
          className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <kbd className="rounded border border-slate-300 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700">
        {k}
      </kbd>
      <span className="text-slate-600">{v}</span>
    </li>
  );
}
